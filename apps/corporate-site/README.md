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
- Feature components live in `src/components/features/corporate-site/`.
- Container components use `<ComponentName>.astro`.
- Presentation components use `<ComponentName>Presentation.astro` and are the primary app-local Storybook target.

Root Storybook entry:

```bash
pnpm storybook:corporate
```
