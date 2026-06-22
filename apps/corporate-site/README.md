# corporate-site

`apps/corporate-site` is the Astro consumer app for the shared `@kufu/ui` design foundation.

## Design Foundation

This app consumes shared styles, design tokens, and fonts from `@kufu/ui`.

```css
@import "@kufu/ui/styles.css";
```

Import the stylesheet from `src/styles/globals.css` and keep Astro-local markup and UI composition in `apps/corporate-site`.

## Components

Component design rules are defined in [../../context/component-design.md](../../context/component-design.md).

- Route entries live in `src/pages/`.
- Feature components live in `src/components/features/<feature>/`, where `<feature>` is a content domain (`business`, `products`, `contact`, `services`) — not the app name. Cross-feature site components live in `src/components/common/`.
- Presentation components use `<Component>.astro` (no `Presentation` suffix) and are the primary app-local Storybook target.
- Data/logic belongs in the content layer (`src/content/<feature>.ts`, or an Astro Content Collection for homogeneous entry sets); a `<Feature>Section.astro` assembles content into presentation. Both are added when the page body is implemented.

Root Storybook entry:

```bash
pnpm storybook:corporate
```
