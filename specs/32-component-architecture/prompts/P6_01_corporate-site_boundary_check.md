---
phase: 6
seq: 1
target: corporate-site
issue: 32
depends_on:
  [
    P2_01_corporate-site_sections_migration.md,
    P3_01_corporate-site_storybook_catalog.md,
    P5_01_corporate-site_cva_consolidation.md,
  ]
---

# section 境界の検査スクリプト追加と quality gate 配線・統合検証 (D10 / D14 / 突合⑥⑦)

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止
- 副作用操作は issue の status ラベル更新と `Refs #32` 付き commit のみ承認済み。push / PR 作成は都度確認する

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

1. `P2_01` / `P3_01` / `P5_01` が完了していることを確認する (`components/sections/<section>/index.ts` 構成、story 追従、cva 化。本 prompt は最終 phase であり、末尾で全 phase の統合検証を行う)
2. 現在のブランチが `feature/32` であることを確認する

### ステップ 1: 境界検査スクリプトを追加する

`apps/corporate-site/scripts/check-section-boundary.mjs` を新規作成する。既存の `apps/corporate-site/scripts/check-token-usage.mjs` と同方式 (ripgrep を `spawnSync` で呼び、違反があれば stderr 出力 + exit 1) を基本とするが、検査ロジックは fixture テスト (ステップ 2) から呼べるよう **検査関数を export する** 形で書く。

**検査の構文契約** (この範囲を対象とし、これ以外は検出対象外と明記する):

- 対象拡張子: `src/` 配下の `.astro` / `.ts` / `.tsx` / `.js` / `.jsx` / `.mjs` (story の `.stories.ts` を含む。現状 `.tsx` 等は存在しないが、将来の React island 追加時に検査から漏れないよう最初から含める)
- 対象構文: 静的 import (`import ... from "..."` — 複数行 import を含む) と動的 import (`import("...")`)。`export ... from "..."` の再輸出も import として扱う
- パス解決: 相対パスとパッケージ import のみ (corporate-site に path alias は無い。alias が導入されたら本スクリプトの前提が崩れるため、その時点で拡張する)

検出する違反は **4 方向** (D10 の依存方向 `pages → sections (index.ts) → common → @kufu/ui` の全域を検査する):

1. **pages から section 内部への直接 import**: `src/pages/*.astro` が `components/sections/<section>/` 配下の個別ファイルを import している (ディレクトリ指定以外はすべて違反。`.../hero/index` / `.../hero/index.ts` の明示 index import も P2 で固定した形式に反するため違反とする)
2. **section 間 import**: `components/sections/<A>/` 配下のファイルが `components/sections/<B>/` (A ≠ B) を import している (index 経由も違反)
3. **common → sections の逆依存**: `components/common/` 配下のファイルが `components/sections/` 配下を import している
4. **index.ts の公開面違反**: `sections/<section>/index.ts` が Section component 以外のファイルを再輸出している (公開面は Section component 1 つのみ — D9)。正当な公開面は次の対応表で判定する (P2 と同一の表。探索不要):

   | section             | 公開面 (唯一の再輸出)           |
   | ------------------- | ------------------------------- |
   | `hero`              | `Hero.astro`                    |
   | `business`          | `BusinessSection.astro`         |
   | `company`           | `CompanySection.astro`          |
   | `consultation`      | `ConsultationSection.astro`     |
   | `products-category` | `ProductsCategorySection.astro` |
   | `products-detail`   | `ProductsDetailSection.astro`   |
   | `contact`           | `ContactSection.astro`          |

許可する参照 (違反にしない):

- pages → `sections/<section>` の **ディレクトリ指定** import
- 同一 section 内の相対 import (story ファイルからの参照を含む)
- 任意のファイル → `components/common/` / `content/` / `@kufu/ui` / `astro:content` 等 (common 自身から sections への参照を除く)

### ステップ 2: fixture ベースの自動テストを追加する

`apps/corporate-site/scripts/check-section-boundary.test.ts` を新規作成する。既存の `vitest.config.ts` の include は `src/**/*.test.{ts,tsx}` のみで `scripts/` 配下を拾わないため、**include に `scripts/**/\*.test.ts` を追加する** (変更領域に含める)。手動で違反を作って戻す一時確認ではなく、**リポジトリに残る回帰テスト\*\*とする (業務ルール 4: 機械検査できる規約は drift しない — 検査スクリプト自体も対象):

1. `scripts/__fixtures__/section-boundary/` に、違反ケース (上記 4 方向それぞれ) と正常ケース (許可する参照の各形) の最小 fixture ファイル群を置く
2. export した検査関数に fixture を食わせ、4 方向の違反がそれぞれ検出されること・正常ケースが通ることを assert する
3. `pnpm --filter @kufu/corporate-site test` でこのテストが実行されることを確認する (実行されない場合は include 設定を疑う)。`pnpm knip` が fixture を未使用ファイルとして検出する場合は、knip 設定に `__fixtures__` の除外を追加する (変更領域に含める)
4. 実構成 (`src/`) に対してスクリプト本体が exit 0 になることも確認する

### ステップ 3: quality gate に配線する (D14)

1. `apps/corporate-site/package.json` の `lint` script を次の形にする:
   `oxlint --type-aware --config .oxlintrc.json astro.config.mjs vitest.config.ts && node scripts/check-token-usage.mjs && node scripts/check-section-boundary.mjs`
2. `token:check` script は個別実行用に残す
3. リポジトリルートの `lefthook.yml` の `pre-commit` に `pnpm lint` を実行する command を追加する
4. `pnpm lint` と実際の commit で両方が走ることを確認する。root `pnpm lint` の初回 (キャッシュなし) と 2 回目 (turbo キャッシュあり) の所要時間を計測し、PR 説明に記録する (D14 の軽量性根拠の実測)

### ステップ 3.5: CI に lint workflow を追加する (D14)

`.github/workflows/lint.yml` を新規作成し、root `pnpm lint` を CI で実行する (pre-commit は `--no-verify` や hook 未導入環境で素通しになるため、必須 gate は CI が担う — D14 / ADR-0014 決定 5):

1. トリガーは `pull_request` と `push`。**`on:` にブランチ名を直書きしない** (repo 規約 / CLAUDE.md Forbidden Patterns)。push 側は `branches: ["**"]` で受け、**job 側の `if` で default branch への push のみに絞る** (`github.event_name == 'pull_request' || github.ref_name == github.event.repository.default_branch`)。こうしないと PR を開いたブランチへの push で pull_request と push の両イベントから二重実行される
2. job は既存 `.github/workflows/storybook-pages.yml` の setup (checkout / pnpm / node / install) を踏襲し、`pnpm lint` を実行する 1 job のみ
3. 本 branch の push で workflow が成功することを確認する

### ステップ 4: dependency-cruiser の旧 app 名を修正する (突合⑦)

`.dependency-cruiser.cjs` の `lp-site-no-cross-app-imports` ルールが旧 app 名 `apps/lp-site/` を指しているため、現行の `apps/corporate-site/` に修正する。ルール名も実態に合わせて改名する。

### ステップ最終: 統合検証と最終確認

本 prompt は最終 phase のため、P1〜P6 の全変更が揃った統合状態で受け入れ基準を一括検証する:

1. root で次をすべて実行し、全部パスすることを確認する: `pnpm build` / `pnpm typecheck` / `pnpm test` / `pnpm lint` / `pnpm format:check` / `pnpm knip && pnpm depcruise` / `pnpm --filter @kufu/corporate-site storybook:build` / `pnpm --filter @kufu/ui storybook:build` / `pnpm e2e`
2. 失敗したものがあれば、原因の phase に関わらずこの時点で修正してから完了とする (受け入れ基準「WHEN 実装が完了したとき、…がすべて成功する」の最終判定)
3. P4 / P5 の目視確認記録 (route × viewport / component × variant / reduced-motion) が commit message 本文または PR 説明に存在することを確認する。欠けていれば該当 phase の目視確認をやり直して記録してから完了とする
4. 変更をコミットし、pre-commit で lint が実際に走ることを確認する (commit message に `Refs #32` を含める)

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

- 完了しているべき phase / 依存 prompt: `P2_01` / `P3_01` / `P5_01` (P4 は P5 の依存に含まれるため推移的に完了している)
- 完了後に着手可能になる後続 prompt: なし (本 prompt が最終 phase。統合検証まで行う)
- 必要な repo 状態: sections 構成への移行が完了していること (移行前に検査を入れると全件違反になる)

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 変更する repo 領域

`apps/corporate-site/scripts/` (検査スクリプト・テスト・`__fixtures__/`)、`apps/corporate-site/package.json` / `vitest.config.ts` (include 追加のみ)、リポジトリルートの `lefthook.yml` / `.dependency-cruiser.cjs` / `.github/workflows/lint.yml` (新規) / knip 設定 (fixture 除外が必要な場合のみ)

### 実装する範囲

- `check-section-boundary.mjs` の新規作成 (4 方向の検査)
- fixture ベースの回帰テスト (`check-section-boundary.test.ts` + `__fixtures__/`)
- `apps/corporate-site/package.json` の `lint` script への合流
- `lefthook.yml` の pre-commit への `pnpm lint` 追加
- `.github/workflows/lint.yml` の新規作成 (root `pnpm lint` の CI gate — 2026-08-07 D14 追加決定)
- `.dependency-cruiser.cjs` の旧 app 名ルールの修正
- 全 phase 統合後の一括検証

### 実装しない範囲

- `hooks/` 配下の共有 hook の変更 (sdd-template から配布される汎用 hook のため)
- lint 以外の CI job の追加 (build / test / e2e の CI 化は本 issue のスコープ外)
- dependency-cruiser への `.astro` 解析の追加 (ツールが対応していない)
- eslint の導入 (D10 再決定により独自スクリプト方式を採用)
- AST ベースの検査への置き換え (ripgrep + 構文契約で足りる範囲に留める。alias 導入等で前提が崩れたら別 issue)
- component 実装の変更

## 設計仕様

spec の D10 / D14 / 突合⑥ より抜粋:

> **D10: 境界の定義は初回どおり、検査手段を独自スクリプトに変更**。依存方向を `pages → sections (index.ts) → common → @kufu/ui` の一方向に固定する。pages から section 内部ファイルへの直接 import を禁止 (index.ts 経由のみ許可)。section 間の import は index 経由でも禁止。同 section 内 (story 含む) の直接参照は自由。
>
> **検査手段**: dependency-cruiser は `.astro` を解析対象にしておらず (cruise 対象 82 modules に `.astro` はゼロ、`no-orphans` の除外にも `\.astro$` を含む)、oxlint も `.astro` 非対応のため corporate-site の lint は設定 2 ファイルしか見ていない。よって既存の `apps/corporate-site/scripts/check-token-usage.mjs` (28 行 / ripgrep で `.astro` を走査するガード) と同方式の検査スクリプトを追加する。
>
> **D14: 境界検査は corporate-site の `lint` script に合流させ、pre-commit と CI の両方から実行する** (2026-08-07 に CI 配線を追加決定)。turbo の `lint` task 経由で root `pnpm lint` から実行される。どの gate からも呼ばれていなかった既存の `token:check` も同時に配線される。あわせて `lefthook.yml` の `pre-commit` に `pnpm lint` を追加し、CI にも root `pnpm lint` を実行する workflow を追加する (pre-commit は `--no-verify` で素通しできるため、必須 gate は CI が担う)。`hooks/` 配下は共有 hook のため追加しない。`lefthook.yml` は消費 repo 側で管理するファイルなのでここに追加してよい。
>
> **D10 検査対象の 4 方向** (2026-08-07 明確化): ① pages → section 内部の直接 import ② section 間 import ③ common → sections の逆依存 ④ index.ts の公開面違反。

## テスト観点

- 検査スクリプトが 4 方向の違反 (pages → section 内部 / section 間 / common → sections / index.ts 公開面) を**検出できる**か (fixture テストで固定)
- 検査スクリプトが正しい構成で**通る**か (exit 0)
- fixture テストが `pnpm test` で回帰検査として実行されるか
- `pnpm lint` から検査が走るか
- pre-commit と CI workflow で lint が走るか
- `.dependency-cruiser.cjs` の app 間依存ルールが実 app 名で機能するか
- 統合状態で全受け入れ基準 (build / typecheck / test / lint / format / Storybook build / E2E / knip / depcruise) が通るか

## 検証コマンド

- `pnpm lint`
- `pnpm --filter @kufu/corporate-site lint`
- `pnpm --filter @kufu/corporate-site test` (fixture テストを含む)
- `pnpm depcruise`
- `pnpm knip`
- `pnpm format:check`
- 統合検証 (ステップ最終 1 の全コマンド)

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] `check-section-boundary.mjs` が 4 方向の違反 (pages → section 内部 / section 間 / common → sections / index.ts 公開面) をすべて検出する
- [ ] fixture ベースの回帰テストが `pnpm --filter @kufu/corporate-site test` で実行され、パスする
- [ ] 正しい構成では検査が exit 0 で通る
- [ ] `apps/corporate-site` の `lint` に検査 2 本が合流している
- [ ] `lefthook.yml` の pre-commit で `pnpm lint` が走る
- [ ] `.github/workflows/lint.yml` が追加され、`on:` にブランチ名を直書きせず、本 branch の push で成功している
- [ ] root `pnpm lint` の所要時間 (初回 / キャッシュあり) を計測し PR 説明に記録した
- [ ] `.dependency-cruiser.cjs` の app 名が `corporate-site` に修正されている
- [ ] `hooks/` 配下を変更していない
- [ ] 統合検証 (ステップ最終 1) の全コマンドがパスした
- [ ] P4 / P5 の目視確認記録の存在を確認した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
