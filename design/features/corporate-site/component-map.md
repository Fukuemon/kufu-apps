# Corporate Site Component Map

> `design/features/corporate-site/index.pen` の page section / subcomponent 名と、実装 component 名の対応表。デザイン正本は `index.pen`、component 配置・命名の横断正本は `context/component-design.md`。
> 配置は `components/sections/<route>/<section>/` の route 層グルーピングを正本とする (#32 — [ADR-0011](../../../adr/0011-corporate-site-sections-architecture.md))。各 section の公開面は `index.ts` 再輸出のみ。

## Sections (route → section)

section assembly は page 文脈を保持する。実装では content 層 (`content/<feature>.ts`) → section assembly (`<Feature>Section.astro`) → presentation に分ける。Section story は「ページ文脈での確認入口」として代表ケースのみカタログに載せる。

| route      | section        | 公開面 (`index.ts` が再輸出)    | 内部 component (presentation)                                                                         |
| ---------- | -------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `home`     | `hero`         | `Hero.astro`                    | —                                                                                                     |
| `home`     | `business`     | `BusinessSection.astro`         | `BusinessFeatureRow.astro`                                                                            |
| `home`     | `services`     | (Section 実装時に追加)          | `ServicePillar.astro`                                                                                 |
| `home`     | `company`      | `CompanySection.astro`          | —                                                                                                     |
| `home`     | `consultation` | `ConsultationSection.astro`     | —                                                                                                     |
| `products` | `hero`         | `ProductsHero.astro`            | —                                                                                                     |
| `products` | `category`     | `ProductsCategorySection.astro` | `FeaturedCategoryCard.astro`, `FeaturedCategoryCarousel.astro`, `ProductsCategoryAccordionList.astro` |
| `products` | `detail`       | `ProductsDetailSection.astro`   | `ProductsSidebarNav.astro` (ページ内ナビは detail に同居)                                             |
| `contact`  | `contact`      | `ContactSection.astro`          | `ContactInfoRow.astro`                                                                                |

route 横断で使う site component (`BaseLayout` / `SiteHeader` / `SiteFooter` / `SectionHeading` / `ContactCtaLink`) は `components/common/` に置く (sections には入れない)。

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

app-local Storybook の variant 網羅対象は presentation component (`<Component>.astro`、`Presentation` suffix なし)。component とその story は section dir 直下 (横断 component は `common/<Component>/`) に並べる。Storybook title はディレクトリと 1:1 (`Sections/<Route>/<Section>/<Component>` / `Common/<Component>`)。

| `.pen` component               | 実装 presentation            | 配置 (sections 再編後)                                           | Storybook 階層                                             |
| ------------------------------ | ---------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| `SectionHeading`               | `SectionHeading.astro`       | `apps/corporate-site/src/components/common/SectionHeading/`      | `Common/SectionHeading`                                    |
| `FeaturedCategoryCard`         | `FeaturedCategoryCard.astro` | `apps/corporate-site/src/components/sections/products/category/` | `Sections/Products/Category/FeaturedCategoryCard`          |
| `ServicePillar`                | `ServicePillar.astro`        | `apps/corporate-site/src/components/sections/home/services/`     | `Sections/Home/Services/ServicePillar`                     |
| `BusinessFeatureRowMediaRight` | `BusinessFeatureRow.astro`   | `apps/corporate-site/src/components/sections/home/business/`     | `Sections/Home/Business/BusinessFeatureRow` (`MediaRight`) |
| `BusinessFeatureRowMediaLeft`  | `BusinessFeatureRow.astro`   | `apps/corporate-site/src/components/sections/home/business/`     | `Sections/Home/Business/BusinessFeatureRow` (`MediaLeft`)  |
| `ContactInfoRow`               | `ContactInfoRow.astro`       | `apps/corporate-site/src/components/sections/contact/contact/`   | `Sections/Contact/Contact/ContactInfoRow`                  |

## Content (data layer)

content / static data は presentation に直書きせず content 層へ寄せる。実体は page body 実装段階で追加する ([component-design.md](../../../context/component-design.md) の「Content 層の選び分け」)。

| `.pen` データ              | 種別               | content 層方式              |
| -------------------------- | ------------------ | --------------------------- |
| Hero コピー                | singleton          | plain `content/hero.ts`     |
| Business feature 群        | 少数・bespoke      | plain `content/business.ts` |
| Contact info rows          | 少数・固定         | plain `content/contact.ts`  |
| Services (`ServicePillar`) | 少数・固定         | plain `content/services.ts` |
| `ProductCategory`          | 同形エントリの集合 | Astro Content Collection    |
| `CategoryMakers`           | 同形エントリの集合 | Astro Content Collection    |

## Notes

- 表中の「配置 (sections 再編後)」は本 doc を正本とする目標構成であり、実ファイルの移動は #32 から派生する実施 issue で行う (移行手順: 段階的移動 + depcruise 検証)。
- `.pen` と実装 component が 1:1 にならない場合は、この表に分割・統合理由を追記する。
- `BusinessFeatureRowMediaRight` / `MediaLeft` は単一の `BusinessFeatureRow.astro` の story variant (`MediaRight` / `MediaLeft`) として表現する。
- `Select` などインタラクティブ primitive を corporate-site 本体で使う場合は、ADR-0008 に従って island 化を明示する。
