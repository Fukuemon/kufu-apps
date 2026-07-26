# Corporate Site Component Map

> `design/features/corporate-site/index.pen` の page section / subcomponent 名と、実装 component 名の対応表。デザイン正本は `index.pen`、component 配置・命名の横断正本は `context/component-design.md`。
> 配置は `components/sections/<section>/` の 1 階層フラット構成を正本とする (#32 — [ADR-0011](../../../adr/0011-corporate-site-sections-architecture.md))。各 section の公開面は `index.ts` 再輸出のみ。section 名はドメインで付け、ページ対応は本表で表す (ディレクトリ構造には持たせない)。

## Sections

section assembly は page 文脈を保持する。実装では content 層 (`content/<feature>.ts` または Content Collection) → section assembly (`<Feature>Section.astro`) → presentation に分ける。Section story は「ページ文脈での確認入口」として代表ケースのみカタログに載せる。

| section             | 公開面 (`index.ts` が再輸出)    | 内部 component (presentation)                                                           | 使用ページ  |
| ------------------- | ------------------------------- | --------------------------------------------------------------------------------------- | ----------- |
| `hero`              | `Hero.astro`                    | —                                                                                       | `/`         |
| `business`          | `BusinessSection.astro`         | `BusinessFeatureRow.astro`                                                              | `/`         |
| `company`           | `CompanySection.astro`          | —                                                                                       | `/`         |
| `consultation`      | `ConsultationSection.astro`     | —                                                                                       | `/`         |
| `products-category` | `ProductsCategorySection.astro` | `FeaturedCategoryCarousel.astro`, `FeaturedCategoryCard.astro`                          | `/`         |
| `products-detail`   | `ProductsDetailSection.astro`   | `ProductsHero.astro`, `ProductsSidebarNav.astro`, `ProductsCategoryAccordionList.astro` | `/products` |
| `contact`           | `ContactSection.astro`          | —                                                                                       | `/contact`  |

複数 section / ページで使う site component (`BaseLayout` / `SiteHeader` / `SiteFooter` / `SectionHeading` / `ContactCtaLink`) は `components/common/` に置く (sections には入れない)。

> `products-category` は products ドメインのデータ (`productCategories` / `categoryMakers` collection) を扱うが、掲載先は `/` である。ドメインと掲載ページが一致しないため、ディレクトリはドメインで、ページ対応は本表で表す。

## GenericComponents

`GenericComponents` は `packages/ui` の初期 shared catalog 対象とする。business wording や page 文脈を持たせない。Storybook title は `UI/<Component>` (ディレクトリと 1:1)。

| `.pen` component | 実装 component  | Storybook 階層     |
| ---------------- | --------------- | ------------------ |
| `Button`         | `Button`        | `UI/Button`        |
| `LinkButton`     | `LinkButton`    | `UI/LinkButton`    |
| `Tag`            | `Tag`           | `UI/Tag`           |
| `Separator`      | `Separator`     | `UI/Separator`     |
| `FormField`      | `FormField`     | `UI/FormField`     |
| `Input`          | `Input`         | `UI/Input`         |
| `Select`         | `Select`        | `UI/Select`        |
| `Textarea`       | `Textarea`      | `UI/Textarea`      |
| `DefinitionRow`  | `DefinitionRow` | `UI/DefinitionRow` |

## CorporateSiteComponents

app-local Storybook の variant 網羅対象は presentation component (`<Component>.astro`、`Presentation` suffix なし)。component とその story は section dir 直下 (横断 component は `common/` 直下) にフラットに並べる。Storybook title はディレクトリと 1:1 (`Sections/<Section>/<Component>` / `Common/<Component>`)。

| `.pen` component               | 実装 presentation            | 配置 (sections 再編後)                                           | Storybook 階層                                        |
| ------------------------------ | ---------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| `SectionHeading`               | `SectionHeading.astro`       | `apps/corporate-site/src/components/common/`                     | `Common/SectionHeading`                               |
| `FeaturedCategoryCard`         | `FeaturedCategoryCard.astro` | `apps/corporate-site/src/components/sections/products-category/` | `Sections/ProductsCategory/FeaturedCategoryCard`      |
| `BusinessFeatureRowMediaRight` | `BusinessFeatureRow.astro`   | `apps/corporate-site/src/components/sections/business/`          | `Sections/Business/BusinessFeatureRow` (`MediaRight`) |
| `BusinessFeatureRowMediaLeft`  | `BusinessFeatureRow.astro`   | `apps/corporate-site/src/components/sections/business/`          | `Sections/Business/BusinessFeatureRow` (`MediaLeft`)  |
| `ServicePillar`                | (削除予定)                   | —                                                                | —                                                     |
| `ContactInfoRow`               | (削除予定)                   | —                                                                | —                                                     |

> `ServicePillar` / `ContactInfoRow` は #6 の catalog 整備で作られたが #10 の本実装で使われず、story からのみ参照される状態になっている。#32 で削除する (判断根拠: [ADR-0011](../../../adr/0011-corporate-site-sections-architecture.md) の「未使用 component の扱い」)。`.pen` 側に対応要素が残るため、再実装が必要になった時点でこの表に復帰させる。

## Content (data layer)

content / static data は presentation に直書きせず content 層へ寄せる ([component-design.md](../../../context/component-design.md) の「Content 層の選び分け」)。

| データ              | 種別               | content 層方式                    | 使用 component                             |
| ------------------- | ------------------ | --------------------------------- | ------------------------------------------ |
| Hero コピー         | singleton          | plain `content/hero.ts`           | `Hero`                                     |
| Services            | 少数・固定         | plain `content/services.ts`       | `Hero`                                     |
| Business feature 群 | 少数・bespoke      | plain `content/business.ts`       | `BusinessSection`                          |
| Company 情報        | 少数・固定         | plain `content/company.ts`        | `CompanySection`, `SiteFooter`             |
| Consultation        | 少数・固定         | plain `content/consultation.ts`   | `ConsultationSection`                      |
| Contact info        | 少数・固定         | plain `content/contact.ts`        | `SiteFooter`                               |
| Product groups      | 少数・固定         | plain `content/product-groups.ts` | `ProductsDetailSection`                    |
| `ProductCategory`   | 同形エントリの集合 | Astro Content Collection          | `ProductsCategorySection` ほか products 系 |
| `CategoryMakers`    | 同形エントリの集合 | Astro Content Collection          | `ProductsCategorySection` ほか products 系 |

## Notes

- 表中の「配置 (sections 再編後)」は本 doc を正本とする構成であり、実ファイルの移動は #32 のスコープ内で実施する (移行手順: 段階的移動 + typecheck / build による検証)。
- `.pen` と実装 component が 1:1 にならない場合は、この表に分割・統合理由を追記する。
- `BusinessFeatureRowMediaRight` / `MediaLeft` は単一の `BusinessFeatureRow.astro` の story variant (`MediaRight` / `MediaLeft`) として表現する。
- `Select` などインタラクティブ primitive を corporate-site 本体で使う場合は、ADR-0008 に従って island 化を明示する。
