---
phase: 3
seq: 1
target: corporate-site
issue: 32
depends_on: [P2_01_corporate-site_sections_migration.md]
---

# Storybook カタログ規約への追従 (D1 / D2 / D3 / 突合②)

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

1. `P2_01` が完了し、`components/sections/<section>/` 構成になっていることを確認する
2. 現在のブランチが `feature/32` であることを確認する

### ステップ 1: autodocs のグローバル適用を確認する

`apps/corporate-site/.storybook/preview.ts` と `packages/ui/.storybook/preview.ts` は既に `tags: ["autodocs"]` を持ち、個別 story 側に `tags:` 指定は無い (D3 の決定内容を既に満たしている)。

1. 上記 2 ファイルの `tags: ["autodocs"]` が残っていることを確認する (変更不要)
2. 満たしていれば何も変更せず次のステップへ進む。仮に欠けていた場合のみ追加する

### ステップ 2: title 階層をディレクトリと 1:1 にする

各 story の `title` を下表に合わせる。

| story ファイルの位置                                   | title                                       |
| ------------------------------------------------------ | ------------------------------------------- |
| `sections/hero/Hero.stories.ts`                        | `Sections/Hero/Hero`                        |
| `sections/business/BusinessSection.stories.ts`         | `Sections/Business/BusinessSection`         |
| `sections/business/BusinessFeatureRow.stories.ts`      | `Sections/Business/BusinessFeatureRow`      |
| `sections/company/CompanySection.stories.ts`           | `Sections/Company/CompanySection`           |
| `sections/consultation/ConsultationSection.stories.ts` | `Sections/Consultation/ConsultationSection` |
| `sections/products-category/*.stories.ts`              | `Sections/ProductsCategory/<Component>`     |
| `sections/products-detail/*.stories.ts`                | `Sections/ProductsDetail/<Component>`       |
| `sections/contact/ContactSection.stories.ts`           | `Sections/Contact/ContactSection`           |
| `common/<Component>.stories.ts`                        | `Common/<Component>`                        |

`<Section>` 部は section ディレクトリ名 (kebab-case) を **PascalCase 化** したものとする (`products-category` → `ProductsCategory`、`products-detail` → `ProductsDetail`)。他の変換 (スペース区切り等) は使わない。

`packages/ui` 側の story は `UI/<Component>` に揃える (対象は下記「packages/ui 側の対象」の全列挙)。

### ステップ 3: バリエーション網羅を補完する

対象はすべて本 prompt 内で列挙する (探索不要)。

**corporate-site 側の全 component の分類** (P2 移行後のパス。この一覧が完全であり、ここに無いものは対象外):

| 分類                                   | component                                                                                                                                                                                                                                                                            | story の扱い                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| section assembly (代表 story のみ)     | `sections/hero/Hero`、`sections/business/BusinessSection`、`sections/company/CompanySection`、`sections/consultation/ConsultationSection`、`sections/products-category/ProductsCategorySection`、`sections/products-detail/ProductsDetailSection`、`sections/contact/ContactSection` | 既存の代表 story を維持 (網羅不要。title 修正のみ)                |
| presentation (variant + edge 必須)     | `sections/business/BusinessFeatureRow`、`common/SectionHeading`、`common/ContactCtaLink`、`common/SiteFooter`                                                                                                                                                                        | 下表の variant 全列挙 + edge state                                |
| presentation (variant なし。edge 必須) | `sections/products-category/FeaturedCategoryCarousel`、`sections/products-category/FeaturedCategoryCard`、`sections/products-detail/ProductsHero`、`sections/products-detail/ProductsSidebarNav`、`sections/products-detail/ProductsCategoryAccordionList`、`common/SiteHeader`      | edge state story (長文 / 空データ / 最小構成のうち意味を持つもの) |
| story 対象外                           | `common/BaseLayout` (layout であり presentation ではない)                                                                                                                                                                                                                            | 作らない                                                          |

**variant を持つ presentation component は次の 4 つ**:

| component (P2 移行後のパス)                  | variant 軸 (Props)                 | 現在の story                               |
| -------------------------------------------- | ---------------------------------- | ------------------------------------------ |
| `common/SectionHeading.astro`                | `align?: "start" \| "center"`      | あり                                       |
| `common/ContactCtaLink.astro`                | `size?: "sm" \| "hero" \| "lg"`    | **なし → 新設する**                        |
| `common/SiteFooter.astro`                    | `variant?: "full" \| "compact"`    | あり (Compact / Full を網羅済み。追加不要) |
| `sections/business/BusinessFeatureRow.astro` | `mediaPosition: "left" \| "right"` | あり (MediaRight / MediaLeft)              |

**variant 網羅の対象外とする Props** (視覚 variant ではないため、全組み合わせ story を作らない):

- `SectionHeading.astro` の `level?: 1 | 2 | 3`: 見出しタグ (h1/h2/h3) を切り替える意味論的な指定で、見た目の variant ではない
- `BusinessFeatureRow.astro` の `imageLoading?: "eager" | "lazy"`: 画像の読み込み方の指定で、描画結果は変わらない

1. 上表の 4 component に、variant の全組み合わせを args で列挙した story を用意する (`ContactCtaLink` は story ファイル自体を新設する。`SiteFooter` は既に網羅済みのため title 修正のみ)
2. 分類表の presentation 10 component (variant あり 4 + variant なし 6) すべてに edge state の story を追加する (長文 / 空データ / 最小構成のうち、その component で意味を持つもの)。variant なしの 6 component は edge state のみでよい
3. `BaseLayout.astro` は layout であり presentation component ではないため story を作らない

Section story は「ページ文脈での確認入口」として代表ケースのみでよい (網羅対象外)。fixture は story 内に閉じ、本番 content / secret / 外部 API call を持ち込まない。

### ステップ 4: packages/ui 側のカタログを揃える

**packages/ui 側の対象** (この一覧が完全であり、探索不要。`packages/ui/src/components/` 直下):

| component ファイル   | 現在の story                | 作業                                                                   |
| -------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `button.tsx`         | あり (`button.stories.tsx`) | title を `UI/Button` に確認・是正し、cva variants の全組み合わせを補完 |
| `definition-row.tsx` | あり                        | 同上 (`UI/DefinitionRow`)                                              |
| `form-field.tsx`     | あり                        | 同上 (`UI/FormField`)                                                  |
| `separator.tsx`      | あり                        | 同上 (`UI/Separator`)                                                  |
| `tag.tsx`            | あり                        | 同上 (`UI/Tag`)                                                        |
| `badge.tsx`          | **なし → 新設**             | default + cva variants 全列挙 + edge state                             |
| `input.tsx`          | **なし → 新設**             | 同上                                                                   |
| `label.tsx`          | **なし → 新設**             | 同上                                                                   |
| `link-button.tsx`    | **なし → 新設**             | 同上                                                                   |
| `select.tsx`         | **なし → 新設**             | 同上                                                                   |
| `textarea.tsx`       | **なし → 新設**             | 同上                                                                   |

- variant 軸は各 component ファイル内の cva 定義 (または Props の視覚 variant) から**読み取って**全列挙する (上記ファイル以外を探索しない)。variant を持たないものは default + edge state のみでよい
- 既存 story の 5 component にも edge state story (長文 / 空データ / 最小構成のうち意味を持つもの) が無ければ追加する (D2 は app-local / packages/ui の両カタログに適用する)
- 規約の根拠: `context/component-design.md`「packages/ui」節の「shared component は default story を必須にする」+ カタログ共通規約 (D2)。story 新設は component 実装の変更を伴わない (再編ではないため「packages/ui 側 component の再編はしない」のスコープ境界に抵触しない)

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. Storybook のサイドバー階層がディレクトリ構造と 1:1 になっていることを目視確認する
3. 変更をコミットする (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D1 / D2 / D3 / 突合② / 実装分割 P3)
- 参照する path:
  - `apps/corporate-site/.storybook/`
  - `apps/corporate-site/src/components/` (sections / common の story)
  - `packages/ui/.storybook/` と `packages/ui/src/components/` の story
- 規約の正本: `context/component-design.md` (Storybook 対象節)
- section とページ対応: `design/features/corporate-site/DesignDoc_corporate-site.md` の「section 構成 (実装の配置)」節

## 前提条件

- 完了しているべき phase / 依存 prompt: `P2_01_corporate-site_sections_migration.md`
- 完了後に着手可能になる後続 prompt: `P5_01_corporate-site_cva_consolidation.md` の前提の 1 つ (P5 は P2 / P3 / P4 完了後)
- 必要な repo 状態: sections 構成への移行が完了していること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 変更する repo 領域

`apps/corporate-site/src/components/` と `packages/ui/src/components/` の story ファイル (preview 設定は確認のみ)。frontmatter の `target` は命名規則上 1 つしか書けないため `corporate-site` としているが、`packages/ui` 側の story も変更対象である (spec の実装分割表では P3 を `corporate-site` + `ui` としている)

### 実装する範囲

- autodocs のグローバル適用の確認 (既に設定済みのため通常は変更不要)
- 全 story の title 階層の是正 (corporate-site + packages/ui)
- 上表 4 component の variant 全列挙 story の追加 (`ContactCtaLink` は story 新設)
- presentation component への edge state story の追加 (対象は分類表の presentation 10 component = variant あり 4 + variant なし 6)
- packages/ui の story 補完 (既存 5 story の variant 網羅 + 不足 6 component の story 新設)

### 実装しない範囲

- Storybook play 関数による interaction テスト (#33 testing-strategy の責務)
- component 実装の変更 (props 追加 / variant 追加は行わない。既存 variant を story で列挙するだけ)
- `BaseLayout.astro` の story 作成 (layout であり presentation component ではない)
- MDX 概要ページの新規作成 (D3 により必須としない)
- cva 化 (P5 の責務)

## 設計仕様

spec の D1〜D3 / 突合② より抜粋:

> **D1: Storybook title はディレクトリと 1:1 対応**。app-local は `Sections/<Section>/<Component>` と `Common/<Component>`、packages/ui は `UI/<Component>`。title はファイルの物理配置から機械的に決まる。
>
> **D2: バリエーションは variant 全列挙 + edge 必須**。cva variants の全組み合わせを args で列挙する story を必須にする。edge state (長文 / 空データ / 最小構成) の story を必須にする。網羅の単位は presentation component。Section story は fixture 差し替えの代表ケースのみでよい。
>
> **D3: autodocs は preview グローバル + opt-out**。`.storybook/preview` の `tags: ['autodocs']` で全 story に適用し、例外は story 側で `!autodocs`。MDX 概要ページは必須にしない。
>
> **突合②: section assembly の story を公認**。Section story を「ページ文脈での確認入口」としてカタログに含める。条件: fixture は story 内に限定し、本番 content / secret / 外部 API call を story に持ち込まない。

## テスト観点

- Storybook build が通るか
- 全 story に autodocs が適用され、docs ページが生成されるか
- title 階層がディレクトリ構造と 1:1 か

## 検証コマンド

- `pnpm --filter @kufu/corporate-site storybook:build`
- `pnpm --filter @kufu/ui storybook:build`
- `pnpm --filter @kufu/corporate-site typecheck`
- `pnpm format:check`

## 完了条件

- [ ] 全ステップを順序通りに実行した
- [ ] 両 Storybook の preview で autodocs がグローバル適用されていることを確認した (既存設定の追認。変更不要)
- [ ] 全 story の title がディレクトリ構造と 1:1 になっている (kebab-case → PascalCase 変換規則に従う)
- [ ] 上表 4 component に variant 全列挙 story がある (`ContactCtaLink` の story を新設した)
- [ ] 分類表の presentation component 10 件すべてに edge state story がある
- [ ] packages/ui の 11 component すべてに story があり、cva variants が全列挙されている
- [ ] Section story の fixture が story 内に閉じている
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
