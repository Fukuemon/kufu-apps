---
phase: 6
seq: 1
target: corporate-site
issue: 32
depends_on: [P2_01_corporate-site_sections_migration.md]
---

# section 境界の検査スクリプト追加と quality gate 配線 (D10 / D14 / 突合⑥⑦)

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止

### 実装アンチパターンの回避 (必守)

- スコープ厳守: spec / 本 prompt に明記された機能のみ実装する。未要求の機能追加・
  先回りの抽象化・無関係なリファクタ・暗黙の互換維持をしない。
- 既存規約への整合: 命名・エラー処理・ログ・テスト・API 連携方式は、対象コードベースの
  既存パターンに合わせる。新方式を持ち込む場合は理由を述べて確認を取る。
- 観測可能な契約の保持: UI 文言・イベント名・戻り値・エラーメッセージ・ログ形式・API を
  要求なく変更しない。変更が必要なら理由と影響を明記する。
- 推測の排除: 要件・業務ルール・API 仕様が不明なら停止して確認する。それらしいが
  誤った実装 (存在しない API 呼び出し / 非互換な引数) を避け、import と API の実在を確認する。
- fallback の最小化: `??` / `||` / 既定引数 / 多段 fallback / 暗黙のエラー握り潰しは
  「任意データ」に限定する。必須データの欠落は隠さず明示的に失敗させる。
- 過剰実装の排除: 単純な条件分岐を strategy / handler map に置換しない。
  要求も計測もない caching / memoization を入れない。
- dead code を残さない: 到達不能コード・未使用の変数 / 関数 / import / export・
  変更後に不要化した型定義を削除する。
- 判断の記録: 非自明な設計判断は理由 (or spec / ADR へのリンク) を残す。

## 作業ステップ (この順序で実行する)

### ステップ 0: 前提確認

1. `P2_01` が完了し、`components/sections/<section>/index.ts` 構成になっていることを確認する
2. 現在のブランチが `feature/32` であることを確認する

### ステップ 1: 境界検査スクリプトを追加する

`apps/corporate-site/scripts/check-section-boundary.mjs` を新規作成する。既存の `apps/corporate-site/scripts/check-token-usage.mjs` と同方式 (ripgrep を `spawnSync` で呼び、違反があれば stderr 出力 + exit 1) にする。

検出する違反は 2 種類:

1. **pages から section 内部への直接 import**: `src/pages/*.astro` が `components/sections/<section>/` 配下の `index.ts` 以外を import している
2. **section 間 import**: `components/sections/<A>/` 配下のファイルが `components/sections/<B>/` (A ≠ B) を import している

許可する参照 (違反にしない):

- pages → `sections/<section>` の `index.ts` 経由 (ディレクトリ指定の import を含む)
- 同一 section 内の相対 import (story ファイルからの参照を含む)
- 任意のファイル → `components/common/` / `content/` / `@kufu/ui` / `astro:content` 等

### ステップ 2: テストで検査ロジックを確認する

1. 意図的に違反を作った状態 (例: pages から section 内部ファイルを直接 import) でスクリプトが exit 1 になることを確認する
2. 正しい構成では exit 0 になることを確認する
3. 確認後、意図的な違反は元に戻す

### ステップ 3: quality gate に配線する (D14)

1. `apps/corporate-site/package.json` の `lint` script を次の形にする:
   `oxlint --type-aware --config .oxlintrc.json astro.config.mjs vitest.config.ts && node scripts/check-token-usage.mjs && node scripts/check-section-boundary.mjs`
2. `token:check` script は個別実行用に残す
3. リポジトリルートの `lefthook.yml` の `pre-commit` に `pnpm lint` を実行する command を追加する
4. `pnpm lint` と実際の commit で両方が走ることを確認する

### ステップ 4: dependency-cruiser の旧 app 名を修正する (突合⑦)

`.dependency-cruiser.cjs` の `lp-site-no-cross-app-imports` ルールが旧 app 名 `apps/lp-site/` を指しているため、現行の `apps/corporate-site/` に修正する。ルール名も実態に合わせて改名する。

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. 変更をコミットし、pre-commit で lint が実際に走ることを確認する (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D10 / D14 / 突合⑥⑦ / 実装分割 P6)
- 参照する path:
  - `apps/corporate-site/scripts/check-token-usage.mjs` (実装の下敷きにする既存スクリプト)
  - `apps/corporate-site/package.json` (lint script)
  - `lefthook.yml` (pre-commit)
  - `.dependency-cruiser.cjs` (旧 app 名ルール)
  - `apps/corporate-site/src/components/sections/` と `src/pages/` (検査対象)
- 規約の正本: `context/architecture.md` (App 内依存方向節)

## 前提条件

- 完了しているべき phase / 依存 prompt: `P2_01_corporate-site_sections_migration.md`
- 完了後に着手可能になる後続 prompt: なし
- 必要な repo 状態: sections 構成への移行が完了していること (移行前に検査を入れると全件違反になる)

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `check-section-boundary.mjs` の新規作成
- `apps/corporate-site/package.json` の `lint` script への合流
- `lefthook.yml` の pre-commit への `pnpm lint` 追加
- `.dependency-cruiser.cjs` の旧 app 名ルールの修正

### 実装しない範囲

- `hooks/` 配下の共有 hook の変更 (sdd-template から配布される汎用 hook のため)
- CI workflow の新規作成 (本 issue のスコープ外)
- dependency-cruiser への `.astro` 解析の追加 (ツールが対応していない)
- eslint の導入 (D10 再決定により独自スクリプト方式を採用)
- component 実装の変更

## 設計仕様

spec の D10 / D14 / 突合⑥ より抜粋:

> **D10: 境界の定義は初回どおり、検査手段を独自スクリプトに変更**。依存方向を `pages → sections (index.ts) → common → @kufu/ui` の一方向に固定する。pages から section 内部ファイルへの直接 import を禁止 (index.ts 経由のみ許可)。section 間の import は index 経由でも禁止。同 section 内 (story 含む) の直接参照は自由。
>
> **検査手段**: dependency-cruiser は `.astro` を解析対象にしておらず (cruise 対象 82 modules に `.astro` はゼロ、`no-orphans` の除外にも `\.astro$` を含む)、oxlint も `.astro` 非対応のため corporate-site の lint は設定 2 ファイルしか見ていない。よって既存の `apps/corporate-site/scripts/check-token-usage.mjs` (28 行 / ripgrep で `.astro` を走査するガード) と同方式の検査スクリプトを追加する。
>
> **D14: 境界検査は corporate-site の `lint` script に合流させる**。turbo の `lint` task 経由で root `pnpm lint` から実行される。どの gate からも呼ばれていなかった既存の `token:check` も同時に配線される。あわせて `lefthook.yml` の `pre-commit` に `pnpm lint` を追加する。`hooks/` 配下は共有 hook のため追加しない。`lefthook.yml` は消費 repo 側で管理するファイルなのでここに追加してよい。

## テスト観点

- 検査スクリプトが違反を**検出できる**か (pages → section 内部 / section 間 import の両方で exit 1)
- 検査スクリプトが正しい構成で**通る**か (exit 0)
- `pnpm lint` から検査が走るか
- pre-commit で lint が走るか
- `.dependency-cruiser.cjs` の app 間依存ルールが実 app 名で機能するか

## 検証コマンド

- `pnpm lint`
- `pnpm --filter @kufu/corporate-site lint`
- `pnpm depcruise`
- `pnpm knip`

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] `check-section-boundary.mjs` が pages → section 内部 import と section 間 import の両方を検出する
- [ ] 正しい構成では検査が exit 0 で通る
- [ ] `apps/corporate-site` の `lint` に検査 2 本が合流している
- [ ] `lefthook.yml` の pre-commit で `pnpm lint` が走る
- [ ] `.dependency-cruiser.cjs` の app 名が `corporate-site` に修正されている
- [ ] `hooks/` 配下を変更していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
