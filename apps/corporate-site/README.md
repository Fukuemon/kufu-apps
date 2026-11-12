# corporate-site

`apps/corporate-site` is the Astro consumer app for the shared `@kufu/ui` design foundation.

## Design Foundation

This app consumes design tokens, fonts, and shared components from `@kufu/ui`, and runs its own
Tailwind v4 entry. Design system rules (tokens, components, brand identity) are in
[packages/ui/DESIGN.md](../../packages/ui/DESIGN.md).

`src/styles/` is split by role; `globals.css` is an import-only entry:

```css
@import "tailwindcss";
@import "@kufu/ui/theme.css"; /* tokens + shared @theme: token -> utility mapping */
@import "./base.css"; /* :root custom props + element-level base styles */
@import "./components.css"; /* class selectors (being migrated to utilities) */
@import "./animations.css"; /* site-specific @keyframes */
```

Fonts are loaded via `?url` preload in `BaseLayout.astro` (not imported here).
Motion timing uses the tokens from `@kufu/ui` (`--kufu-motion-*` / `--kufu-ease*`);
do not hard-code durations/easings.

The `@theme` (token → utility) mapping lives once in `@kufu/ui/theme.css`.
This app keeps a local CSS entry so it can define document-level base styles.
Tailwind's Vite plugin discovers Astro pages,
components, and Storybook stories through Vite's module graph; no app-local
`@source` directive is needed — `@kufu/ui/theme.css` points `@source` at its own
component sources so every consumer generates the classes `@kufu/ui` uses.

Tailwind v4 is applied with `@tailwindcss/vite` in `astro.config.mjs`.
`@storybook-astro/framework` auto-loads the Astro Vite plugin for Storybook;
there is no PostCSS config for Tailwind.
`vite.resolve.tsconfigPaths: true` is set because Vite 8 currently rejects the
resolver options that `@tailwindcss/vite` spreads unless that field is present.
Keep Astro-local markup and UI composition in `apps/corporate-site`.

## Components

Component design rules are defined in [../../context/codebase.md](../../context/codebase.md#app-の中の層) and [../../context/conventions.md](../../context/conventions.md#naming). The site design is in [DesignDoc.md](DesignDoc.md).

- Route entries live in `src/pages/`.
- Section components live in `src/components/sections/<section>/` (one flat level; `<section>` is a domain name such as `business`, `products-category`, `products-detail`, `contact`). Each section exposes only its Section component through `index.ts`; pages import via the directory path (`../components/sections/hero`). Cross-section site components live flat in `src/components/common/`.
- Presentation components use `<Component>.astro` (no `Presentation` suffix) and are the primary app-local Storybook target.
- Data/logic belongs in the content layer (`src/content/<feature>.ts`, or an Astro Content Collection for homogeneous entry sets); a `<Feature>Section.astro` assembles content into presentation. Both are added when the page body is implemented.
- Style components with Tailwind utilities backed by `@kufu/ui` tokens (`text-text`, `bg-surface-subtle`, `font-mono`, …) — no raw hex / color arbitrary values. Avoid scoped `<style>` blocks.

Root Storybook entry:

```bash
pnpm storybook:corporate
```
