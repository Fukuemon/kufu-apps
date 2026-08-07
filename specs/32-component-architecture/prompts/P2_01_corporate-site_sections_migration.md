---
phase: 2
seq: 1
target: corporate-site
issue: 32
depends_on: [P1_01_corporate-site_remove_unused_components.md]
---

# features → sections 移行と index.ts 公開面の新設 (D8 / D9 / D13)

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

1. `P1_01` が完了し、`ServicePillar` / `ContactInfoRow` が削除済みであることを確認する
2. 現在のブランチが `feature/32` であることを確認する

### ステップ 1: ディレクトリを移動する

`git mv` で下表のとおり移動する (履歴を保つため `git mv` を使う)。`components/common/` は移動しない。

| 移動元 (`apps/corporate-site/src/components/features/`)                                                                                                                                            | 移動先 (`apps/corporate-site/src/components/sections/`) |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `hero/Hero.astro` (+ `.stories.ts`)                                                                                                                                                                | `hero/`                                                 |
| `business/BusinessSection.astro` (+ story), `business/BusinessFeatureRow.astro` (+ story)                                                                                                          | `business/`                                             |
| `company/CompanySection.astro` (+ story)                                                                                                                                                           | `company/`                                              |
| `consultation/ConsultationSection.astro` (+ story)                                                                                                                                                 | `consultation/`                                         |
| `products/ProductsCategorySection.astro` (+ story), `products/FeaturedCategoryCarousel.astro` (+ story), `products/FeaturedCategoryCard.astro` (+ story)                                           | `products-category/`                                    |
| `products/ProductsDetailSection.astro` (+ story), `products/ProductsHero.astro` (+ story), `products/ProductsSidebarNav.astro` (+ story), `products/ProductsCategoryAccordionList.astro` (+ story) | `products-detail/`                                      |
| `contact/ContactSection.astro` (+ story)                                                                                                                                                           | `contact/`                                              |

移動後、`components/features/` ディレクトリは空になるので削除する。

### ステップ 2: 各 section に index.ts を新設する

7 つの section それぞれに `index.ts` を作り、**Section component (公開面) のみ**を再輸出する。

| section             | 再輸出する component            |
| ------------------- | ------------------------------- |
| `hero`              | `Hero.astro`                    |
| `business`          | `BusinessSection.astro`         |
| `company`           | `CompanySection.astro`          |
| `consultation`      | `ConsultationSection.astro`     |
| `products-category` | `ProductsCategorySection.astro` |
| `products-detail`   | `ProductsDetailSection.astro`   |
| `contact`           | `ContactSection.astro`          |

内部 component (`BusinessFeatureRow` / `FeaturedCategoryCard` / `FeaturedCategoryCarousel` / `ProductsHero` / `ProductsSidebarNav` / `ProductsCategoryAccordionList`) は再輸出しない。

**export / import の形式**(P6 の検査スクリプト仕様と噛み合うため、下記で固定する):

```ts
// apps/corporate-site/src/components/sections/hero/index.ts
export { default as Hero } from "./Hero.astro";
```

```astro
---
// apps/corporate-site/src/pages/index.astro — ディレクトリ指定で index.ts を解決させる
import { Hero } from "../components/sections/hero";
---
```

名前付き export とし、pages 側は**ディレクトリ指定**で import する。`.../hero/index` / `.../hero/index.ts` のような明示 index import は書かない (P6 の検査スクリプトはディレクトリ指定のみを正とし、明示 index import も**違反として検出する** — 形式を 1 つに固定して検査を単純に保つため)。

### ステップ 3: import 経路を追従させる

1. `pages/index.astro` / `pages/products.astro` / `pages/contact.astro` の import を、各 section の `index.ts` 経由に書き換える
2. section 内部 component 同士の相対 import (`ProductsDetailSection` → `ProductsHero` 等) は移動先の相対パスに追従させる
3. `common/` への import (`SectionHeading` / `ContactCtaLink`) はパスの深さが変わらないためそのまま
4. 各 story ファイルの component import パスを追従させる
5. `## 検証コマンド` を実行する
6. diff レビューを回し、指摘を対応してから次へ

### ステップ 4: README の構成記述を追従させる

`apps/corporate-site/README.md` の component 配置に関する記述を、新構成 (`src/components/sections/<section>/` + `index.ts` 公開面、`common/` はフラット) に合わせて更新する。

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. `pnpm e2e` で `/` `/products` `/contact` の DOM 構造とテキストが再編前と等価であることを確認 (本 phase は import 経路の変更のみで見た目に影響しない)
3. 変更をコミットする (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D8 / D9 / D13 / 実装分割 P2)
- 参照する path:
  - `apps/corporate-site/src/components/` (features / common)
  - `apps/corporate-site/src/pages/` (index / products / contact)
  - `apps/corporate-site/README.md`
- 規約の正本: `context/component-design.md` (ディレクトリ構成節)
- section とページ対応の正本: `design/features/corporate-site/DesignDoc_corporate-site.md` の「section 構成 (実装の配置)」節

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_corporate-site_remove_unused_components.md`
- 完了後に着手可能になる後続 prompt: `P3_01_corporate-site_storybook_catalog.md` / `P4_01_ui_styles_layering.md` (両者は並列実行可)
- 必要な repo 状態: 未使用 component が削除済みであること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 変更する repo 領域

`apps/corporate-site/src/components/`、`apps/corporate-site/src/pages/`、`apps/corporate-site/README.md`

### 実装する範囲

- `features/` → `sections/` のディレクトリ移動 (上表のとおり)
- 各 section の `index.ts` 新設
- pages / 内部 component / story の import 経路の追従
- `apps/corporate-site/README.md` の構成記述の追従

### 実装しない範囲

- component の**リネーム** (ファイル名・component 名は変えない。BCD 基準の見直しは本 issue のスコープ外)
- `common/` の移動・ディレクトリ化 (D13 によりフラットのまま維持)
- Storybook の `title` 変更 (P3 の責務)
- styles の分割・cva 化 (P4 / P5 の責務)
- 境界検査スクリプトの追加 (P6 の責務)

## 設計仕様

spec の D8 / D9 / D13 より抜粋:

> **D8: sections は 1 階層のフラット構成にする**。`components/sections/<section>/` とし、route 層は設けない。ドメインのまとまりはディレクトリ名の接頭辞 (`products-*`) で表す。
>
> **D9: section 内部はフラット + index.ts**。`sections/<section>/` 直下に `index.ts` (公開面。Section component のみ再輸出) + Section component + 内部 component + story をフラットに並べる。`internal/` サブディレクトリは作らない。階層は常に 1 段なので「section の起点は必ず `sections/<section>/index.ts`」という単一規約になる。
>
> **D13: `common/` はフラット配置を正とする**。`common/` は公開面を絞る対象ではないため `index.ts` は置かない。

依存方向 (D10、検査は P6 で実装):

> `pages → sections (index.ts) → common → @kufu/ui` の一方向。pages から section 内部への直接 import は禁止、section 間 import は index 経由でも禁止。同 section 内 (story 含む) の直接参照は自由。

## テスト観点

- 再編後に build / typecheck / test / Storybook build が通るか
- `/` `/products` `/contact` の表示が再編前と等価か (既存 E2E)
- pages からの import がすべて `index.ts` 経由になっているか
- section 間の import が発生していないか (移動前後で cross-section 参照はゼロのはず)

## 検証コマンド

- `pnpm --filter @kufu/corporate-site typecheck`
- `pnpm --filter @kufu/corporate-site build`
- `pnpm --filter @kufu/corporate-site test`
- `pnpm --filter @kufu/corporate-site storybook:build`
- `pnpm e2e`
- `pnpm format:check`
- `pnpm knip && pnpm depcruise`

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] 7 section すべてに `index.ts` があり、Section component のみを再輸出している
- [ ] pages の import がすべて `index.ts` 経由になっている
- [ ] `components/features/` ディレクトリが存在しない
- [ ] `common/` を移動していない
- [ ] `apps/corporate-site/README.md` の構成記述を更新した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
