# Corporate Site Component Map

> `design/features/corporate-site/index.pen` の page section / subcomponent 名と、実装 component 名の対応表。デザイン正本は `index.pen`、component 配置・命名の横断正本は `context/component-design.md`。

## Page Sections

page section は page 文脈を保持し、初期 app-local Storybook の対象にはしない。実装では Container / Presentation に分ける。

| `.pen` section            | 実装 Container                  | 実装 Presentation                           | 配置                                                                                  |
| ------------------------- | ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `Hero`                    | `Hero.astro`                    | `HeroPresentation.astro`                    | `apps/corporate-site/src/components/features/corporate-site/Hero/`                    |
| `BusinessSection`         | `BusinessSection.astro`         | `BusinessSectionPresentation.astro`         | `apps/corporate-site/src/components/features/corporate-site/BusinessSection/`         |
| `ProductsCategorySection` | `ProductsCategorySection.astro` | `ProductsCategorySectionPresentation.astro` | `apps/corporate-site/src/components/features/corporate-site/ProductsCategorySection/` |
| `ContactSection`          | `ContactSection.astro`          | `ContactSectionPresentation.astro`          | `apps/corporate-site/src/components/features/corporate-site/ContactSection/`          |

## GenericComponents

`GenericComponents` は `packages/ui` の初期 shared catalog 対象とする。business wording や page 文脈を持たせない。

| `.pen` component | 実装 component   | Storybook 階層            |
| ---------------- | ---------------- | ------------------------- |
| `Button`         | `Button`         | `Primitives/Button`       |
| `LinkButton`     | `LinkButton`     | `Primitives/Button`       |
| `Tag`            | `Tag`            | `Primitives/Tag`          |
| `SectionHeading` | `SectionHeading` | `Patterns/SectionHeading` |
| `Card`           | `Card`           | `Primitives/Card`         |
| `Separator`      | `Separator`      | `Primitives/Separator`    |
| `FormField`      | `FormField`      | `Patterns/FormField`      |
| `Input`          | `Input`          | `Patterns/FormField`      |
| `Select`         | `Select`         | `Patterns/FormField`      |
| `Textarea`       | `Textarea`       | `Patterns/FormField`      |
| `DefinitionRow`  | `DefinitionRow`  | `Patterns/DefinitionRow`  |

## CorporateSiteComponents

初期 app-local Storybook 対象は Presentation component のみとする。

| `.pen` component               | 実装 Container             | 実装 Presentation                      | Storybook 階層                                    |
| ------------------------------ | -------------------------- | -------------------------------------- | ------------------------------------------------- |
| `ServicePillar`                | `ServicePillar.astro`      | `ServicePillarPresentation.astro`      | `CorporateSite/ServicePillar`                     |
| `BusinessFeatureRowMediaRight` | `BusinessFeatureRow.astro` | `BusinessFeatureRowPresentation.astro` | `CorporateSite/BusinessFeatureRow` (`MediaRight`) |
| `BusinessFeatureRowMediaLeft`  | `BusinessFeatureRow.astro` | `BusinessFeatureRowPresentation.astro` | `CorporateSite/BusinessFeatureRow` (`MediaLeft`)  |
| `ContactInfoRow`               | `ContactInfoRow.astro`     | `ContactInfoRowPresentation.astro`     | `CorporateSite/ContactInfoRow`                    |

## Notes

- `.pen` と実装 component が 1:1 にならない場合は、この表に分割・統合理由を追記する。
- `Select` などインタラクティブ primitive を corporate-site 本体で使う場合は、ADR-0008 に従って island 化を明示する。
