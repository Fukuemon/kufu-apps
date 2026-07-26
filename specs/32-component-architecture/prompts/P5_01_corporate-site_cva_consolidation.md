---
phase: 5
seq: 1
target: corporate-site
issue: 32
depends_on:
  [P2_01_corporate-site_sections_migration.md, P4_01_ui_styles_layering.md]
---

# cva 集約と components.css 受け皿の削減 (D4 / D7 / D15)

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

1. `P2_01` が完了し、`components/sections/<section>/` 構成になっていることを確認する
2. `P4_01` が完了し、`src/styles/` がレイヤ分割済みであることを確認する
3. 現在のブランチが `feature/32` であることを確認する

### ステップ 1: @kufu/ui から cva を再輸出する (D15)

1. `packages/ui/src/lib/index.ts` に `class-variance-authority` の再輸出を追加する (既存の `export * from "./utils.js";` と並べる)
2. corporate-site には `class-variance-authority` を直接追加しない (`@kufu/ui/lib` 経由で使う)
3. `pnpm --filter @kufu/ui typecheck` と `pnpm depcruise` を実行し、未宣言依存にならないことを確認する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ 2: variant を持つ component を cva 化する

対象は **視覚 variant / 状態分岐を持つ component のみ**。variant のない固定 class の component は Tailwind utility 直書きのまま残す。

対象 component と variant 軸は次のとおり (探索不要。これ以外は対象外):

| component (P2 移行後のパス)                  | variant 軸 (Props)                 |
| -------------------------------------------- | ---------------------------------- |
| `common/SectionHeading.astro`                | `align?: "start" \| "center"`      |
| `common/ContactCtaLink.astro`                | `size?: "sm" \| "hero" \| "lg"`    |
| `sections/business/BusinessFeatureRow.astro` | `mediaPosition: "left" \| "right"` |

1. 上表の 3 component で `@kufu/ui/lib` の `cva` を使い variants を定義し、frontmatter の条件付き class 組み立てを置換する
2. `common/BaseLayout.astro` / `SiteHeader.astro` / `SiteFooter.astro` / `sections/products-category/FeaturedCategoryCard.astro` / `sections/products-detail/ProductsDetailSection.astro` / `sections/company/CompanySection.astro` の条件分岐は、視覚 variant ではなく表示有無・データ有無の分岐のため **cva 化しない** (D4 の「variant を持つ component のみ」)
3. `components.css` にある当該 component 由来のクラスセレクタを、cva の variant または Tailwind utility へ移す
4. 移し終えたクラスセレクタを `components.css` から削除する
5. component 単位で `## 検証コマンド` を実行し、表示が変わらないことを確認する
6. diff レビューを回し、指摘を対応してから次の component へ

### ステップ 3: ハードコード基準を適用する (D7)

cva 化の過程で見つかった次のものを是正する。**cva 化の対象外 component には手を入れない** (スコープ厳守)。

1. component 内に直書きされた文言・リスト → content 層へ移す
2. 2 箇所以上に現れる繰り返し値 (数値 / URL / 閾値) → 定数化する (content 由来なら content 層、表示ロジック由来なら section 内 constants)
3. 生の色値・arbitrary value → セマンティックトークンの utility へ置換する
4. `aria-label` / `alt` / sr-only 等の機能的文言と単一箇所の一時値はそのまま (許容)

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. `components.css` に残ったクラスセレクタがあれば、なぜ残したかを spec の `## 上位資料からの変更点` に記録するかコメントで理由を残す
3. `pnpm e2e` で DOM 構造とテキストが変更前と等価であることを確認する
4. 見た目の等価性を確認する (E2E は視覚回帰を検出しないため):
   - `SectionHeading` / `BusinessFeatureRow` は `pnpm --filter @kufu/corporate-site storybook` で既存 story の各 variant を cva 化前後で目視比較する
   - `ContactCtaLink` は story を持たないため、`pnpm --filter @kufu/corporate-site dev` で `/` (hero / sm)、`/products` (hero / lg) を開き、CTA リンクの見た目を目視比較する
5. 変更をコミットする (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D4 / D7 / D15 / 突合① / 実装分割 P5)
- 参照する path:
  - `packages/ui/src/lib/index.ts`
  - `apps/corporate-site/src/components/sections/` と `common/`
  - `apps/corporate-site/src/styles/components.css`
  - `apps/corporate-site/src/content/`
- 規約の正本: `context/component-design.md` (スタイリング節 / ハードコード基準節)

## 前提条件

- 完了しているべき phase / 依存 prompt: `P4_01_ui_styles_layering.md`
- 完了後に着手可能になる後続 prompt: なし
- 必要な repo 状態: `src/styles/` のレイヤ分割が完了していること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 変更する repo 領域

`packages/ui/src/lib/` (cva 再輸出) と `apps/corporate-site/src/` (component / styles / content)

### 実装する範囲

- `@kufu/ui/lib` からの cva 再輸出
- variant / 状態分岐を持つ component の cva 化
- cva 化した component 由来のクラスセレクタの `components.css` からの削除
- cva 化の過程で見つかったハードコードの是正 (D7)

### 実装しない範囲

- variant を持たない component の cva 化 (D4 により対象外)
- component の props / 表示結果の変更 (見た目は変えない)
- corporate-site への `class-variance-authority` の直接追加 (D15 により `@kufu/ui` 経由)
- `components.css` の全消去 (移せないものは残してよい。削除は目標であり必須ではない)
- 新しい variant の追加

## 設計仕様

spec の D4 / D7 / D15 / 突合① より抜粋:

> **D4: cva は variant を持つ component のみに適用**。視覚 variant / 状態分岐を持つ component は `.astro` frontmatter で cva により variants を定義し、条件付き class 組み立ての分岐を置換する (shadcn/ui パターンと整合)。variant のない固定 class の component は Tailwind utility 直書きのまま。globals.css の生 CSS のうち component 由来のスタイルは、cva / utility として component 側へ移行する。
>
> **D7: ハードコード基準は 3 区分 + 機能的文言は許容**。① 文言・リストは content 層へ ② 繰り返し値 (数値 / URL / 閾値) は定数化 ③ スタイル値はセマンティックトークン参照のみ。許容する直書き: aria-label / alt / sr-only 等の機能的文言と、単一箇所でのみ使う一時値。ただし同じ値が 2 箇所以上に現れたら定数化する。
>
> **D15: cva は `@kufu/ui/lib` から再輸出して使う**。`packages/ui/src/lib/` は既に `cn` を提供しており、同じ入口に cva を再輸出する。corporate-site に `class-variance-authority` を直接追加しない。

## テスト観点

- cva 化後に build / typecheck / Storybook build が通るか
- DOM 構造とテキストが変更前と等価か (既存 E2E)
- 見た目が等価か: `SectionHeading` / `BusinessFeatureRow` は story、`ContactCtaLink` は実ページ (`/` と `/products` の CTA) で目視確認する
- `components.css` から削除したクラスが他所で参照されていないか (build で検出)
- トークンガード (`token:check`) が通るか (raw hex / 色の arbitrary value を持ち込んでいないか)
- 未宣言依存が発生していないか (depcruise)

## 検証コマンド

- `pnpm --filter @kufu/corporate-site typecheck`
- `pnpm --filter @kufu/corporate-site build`
- `pnpm --filter @kufu/corporate-site test`
- `pnpm --filter @kufu/corporate-site storybook:build`
- `pnpm --filter @kufu/corporate-site token:check`
- `pnpm depcruise`
- `pnpm format:check`
- `pnpm e2e`

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] `@kufu/ui/lib` から cva が再輸出されている
- [ ] corporate-site の package.json に `class-variance-authority` を追加していない
- [ ] 上表 3 component が cva 化され、対応するクラスセレクタが `components.css` から消えている
- [ ] 対象外と明記した component に cva を持ち込んでいない
- [ ] DOM 構造とテキストが変更前と等価である (E2E パス)
- [ ] `SectionHeading` / `BusinessFeatureRow` の見た目を story で、`ContactCtaLink` の見た目を実ページで目視確認した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
