# Corporate Site Component Map

> `design/features/corporate-site/index.pen` の page section / subcomponent 名と、実装 component 名の対応表。デザイン正本は `index.pen`、component 配置・命名の横断正本は `context/component-design.md`。

## Page Sections

page section は page 文脈を保持し、初期 app-local Storybook の対象にはしない。実装では content 層 (`content/<feature>.ts`) → section assembly (`<Feature>Section.astro`) → presentation に分ける。section assembly と content の実体は page body 実装段階で追加する。

| `.pen` section            | feature    | section assembly (page body 実装時) | 配置                                                    |
| ------------------------- | ---------- | ----------------------------------- | ------------------------------------------------------- |
| `Hero`                    | `hero`     | `Hero.astro`                        | `apps/corporate-site/src/components/features/hero/`     |
| `BusinessSection`         | `business` | `BusinessSection.astro`             | `apps/corporate-site/src/components/features/business/` |
| `ProductsCategorySection` | `products` | `ProductsCategorySection.astro`     | `apps/corporate-site/src/components/features/products/` |
| `ContactSection`          | `contact`  | `ContactSection.astro`              | `apps/corporate-site/src/components/features/contact/`  |

## GenericComponents

`GenericComponents` は `packages/ui` の初期 shared catalog 対象とする。business wording や page 文脈を持たせない。

| `.pen` component | 実装 component  | Storybook 階層           |
| ---------------- | --------------- | ------------------------ |
| `Button`         | `Button`        | `Primitives/Button`      |
| `LinkButton`     | `LinkButton`    | `Primitives/Button`      |
| `Tag`            | `Tag`           | `Primitives/Tag`         |
| `Separator`      | `Separator`     | `Primitives/Separator`   |
| `FormField`      | `FormField`     | `Patterns/FormField`     |
| `Input`          | `Input`         | `Patterns/FormField`     |
| `Select`         | `Select`        | `Patterns/FormField`     |
| `Textarea`       | `Textarea`      | `Patterns/FormField`     |
| `DefinitionRow`  | `DefinitionRow` | `Patterns/DefinitionRow` |

## CorporateSiteComponents

app-local Storybook 対象は presentation component (`<Component>.astro`、`Presentation` suffix なし) のみ。component とその story は `features/<feature>/` 直下 (横断 component は `common/<Component>/`) に並べる。

| `.pen` component               | 実装 presentation            | 配置 (実装済み)                                             | Storybook 階層                               |
| ------------------------------ | ---------------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| `SectionHeading`               | `SectionHeading.astro`       | `apps/corporate-site/src/components/common/SectionHeading/` | `Common/SectionHeading`                      |
| `FeaturedCategoryCard`         | `FeaturedCategoryCard.astro` | `apps/corporate-site/src/components/features/products/`     | `Products/FeaturedCategoryCard`              |
| `ServicePillar`                | `ServicePillar.astro`        | `apps/corporate-site/src/components/features/services/`     | `Services/ServicePillar`                     |
| `BusinessFeatureRowMediaRight` | `BusinessFeatureRow.astro`   | `apps/corporate-site/src/components/features/business/`     | `Business/BusinessFeatureRow` (`MediaRight`) |
| `BusinessFeatureRowMediaLeft`  | `BusinessFeatureRow.astro`   | `apps/corporate-site/src/components/features/business/`     | `Business/BusinessFeatureRow` (`MediaLeft`)  |
| `ContactInfoRow`               | `ContactInfoRow.astro`       | `apps/corporate-site/src/components/features/contact/`      | `Contact/ContactInfoRow`                     |

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

- `.pen` と実装 component が 1:1 にならない場合は、この表に分割・統合理由を追記する。
- `BusinessFeatureRowMediaRight` / `MediaLeft` は単一の `BusinessFeatureRow.astro` の story variant (`MediaRight` / `MediaLeft`) として表現する。
- `Select` などインタラクティブ primitive を corporate-site 本体で使う場合は、ADR-0008 に従って island 化を明示する。
