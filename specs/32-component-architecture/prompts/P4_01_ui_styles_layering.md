---
phase: 4
seq: 1
target: ui
issue: 32
depends_on: []
---

# @source の theme.css 移動 / motion トークン追加 / styles レイヤ分割 (D5 / D6 / 突合③④)

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

現在のブランチが `feature/32` であることを確認する。本 prompt は P2 と並列実行できる (変更ファイルが衝突しない)。

### ステップ 1: @source を theme.css へ移す (突合④)

1. `packages/ui/src/styles/theme.css` に `@source "../components";` を追加する (theme.css 自身からの相対パスで `packages/ui/src/components` を指す)
2. `apps/corporate-site/src/styles/globals.css` の `@source` 2 行を削除する。`packages/ui/src/lib` 向けの 1 行は移送せず削除する (`lib/utils.ts` は `cn` のみで class 文字列を持たないため)
3. `pnpm --filter @kufu/corporate-site build` を実行し、`@kufu/ui` の component が使う Tailwind class が出力 CSS に含まれることを確認する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ 2: motion トークンを追加する (D5)

1. `packages/ui/src/styles/tokens.css` に duration / easing の motion トークンを追加する。命名は既存トークンの規約 (primitive は `--kufu-<用途>-<段階>`、semantic は役割名) に合わせる
2. 追加したトークンを Tailwind utility として使う必要がある場合のみ、`theme.css` に `@theme inline` 写像を追加する
3. 値は現行 `globals.css` の `@keyframes` / transition 実装で使われている実績値から採る (新しい値を発明しない)

### ステップ 3: src/styles/ をレイヤ分割する (D6)

`apps/corporate-site/src/styles/` を次の構成にする:

| ファイル         | 内容                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `globals.css`    | entry。`@import "tailwindcss"` + `@kufu/ui/tokens.css` + `@kufu/ui/theme.css` + 下記 4 ファイルの `@import` のみ |
| `base.css`       | `@layer base`: `:root` のカスタムプロパティと document-level の base スタイル                                    |
| `components.css` | `@layer components`: 既存の生 CSS (クラスセレクタ群) の移行受け皿                                                |
| `animations.css` | `@keyframes` 定義 (site 固有演出)                                                                                |
| `utilities.css`  | `@utility` 拡張                                                                                                  |

現行 `globals.css` (799 行) の内容を、上記の分類に従って機械的に振り分ける。**この段階では CSS の中身を書き換えない** (cva 化・削減は P5 の責務)。

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. build 出力の CSS サイズが分割前と比べて増えていないことを確認する
3. `pnpm e2e` で表示が分割前と等価であることを確認
4. 変更をコミットする (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D5 / D6 / 突合③④ / 実装分割 P4)
- 参照する path:
  - `packages/ui/src/styles/` (tokens.css / theme.css / fonts.css / globals.css)
  - `apps/corporate-site/src/styles/globals.css`
  - `apps/corporate-site/src/components/common/BaseLayout.astro` (fonts の読み込み経路。変更しない)
- 規約の正本: `context/component-design.md` (スタイリング節)、`adr/0007-design-token-architecture.md` (2026-07-25 更新節)

## 前提条件

- 完了しているべき phase / 依存 prompt: なし (P2 と並列実行可)
- 完了後に着手可能になる後続 prompt: `P5_01_corporate-site_cva_consolidation.md`
- 必要な repo 状態: なし

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `packages/ui/src/styles/theme.css` への `@source` 追加
- `apps/corporate-site/src/styles/globals.css` からの `@source` 2 行削除
- `packages/ui/src/styles/tokens.css` への motion トークン追加
- `apps/corporate-site/src/styles/` の 5 ファイル構成への分割

### 実装しない範囲

- **CSS の中身の書き換え** (クラスセレクタの cva 化・削減は P5 の責務。本 prompt は移動のみ)
- fonts の読み込み経路の変更 (`BaseLayout.astro` の `?url` 参照は現行維持 — 突合③)
- `@kufu/ui` の component 実装の変更
- トークン体系そのものの再設計 (ADR-0007 の 2 層構造は維持)

## 設計仕様

spec の D5 / D6 / 突合③④ より抜粋:

> **D5: motion トークンは `@kufu/ui`、keyframes は app-local**。duration / easing の motion トークンは `@kufu/ui/tokens.css` に定義する (「トークンは常に ui」の既存昇格境界と整合)。site 固有演出の keyframes は app-local (`src/styles/animations.css`) に置き、複数 app での再利用が明確になったら `@kufu/ui` へ昇格する。
>
> **D6: src/styles/ は 4 ファイル + 移行受け皿**。`globals.css` = entry (@import のみ。現行の `@source` 2 行のうち `packages/ui/src/components` 分を `@kufu/ui/theme.css` へ移動。`packages/ui/src/lib` 分は `utils.ts` (cn のみ) で class 文字列を持たないため移送せず削除する)、`base.css` (@layer base)、`components.css` (@layer components: 既存生 CSS の受け皿)、`animations.css` (@keyframes)、`utilities.css` (@utility 拡張)。tokens 層は既存どおり `@kufu/ui/tokens.css` の import で賄う。fonts は現行の `BaseLayout.astro` の `?url` 参照経路を維持する。
>
> **突合④**: `@source` のパスは記述ファイル基準の相対解決のため theme.css 側で ui 自身の src を指せば全 consumer が自動で ui の class を生成できる。

## テスト観点

- 分割後に build / Storybook build が通るか
- 出力 CSS が分割前と比べて増えていないか (build 結果のサイズ比較)
- `@kufu/ui` の component が使う class が出力に含まれるか (`@source` 移動の検証)
- 表示が分割前と等価か (既存 E2E)

## 検証コマンド

- `pnpm --filter @kufu/corporate-site build`
- `pnpm --filter @kufu/corporate-site typecheck`
- `pnpm --filter @kufu/corporate-site storybook:build`
- `pnpm --filter @kufu/ui build`
- `pnpm e2e`

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] `theme.css` に `@source "../components"` があり、app entry から `@source` が消えている
- [ ] motion トークンが `tokens.css` に追加されている
- [ ] `src/styles/` が 5 ファイル構成になり、`globals.css` は `@import` のみになっている
- [ ] CSS の中身を書き換えていない (移動のみ)
- [ ] 出力 CSS のサイズが分割前から増えていない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
