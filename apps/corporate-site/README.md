# corporate-site

`apps/corporate-site` is the Astro consumer app for the shared `@kufu/ui` design foundation.

## Design Foundation

This app consumes design tokens and fonts from `@kufu/ui`, and runs its own lean
Tailwind v4 entry (it does NOT import the full `@kufu/ui/styles.css`, which carries
React/shadcn-only layers — see [ADR-0007](../../docs/adr/0007-design-token-architecture.md)).

`src/styles/` is split by role; `globals.css` is an import-only entry:

```css
@import "tailwindcss";
@import "@kufu/ui/tokens.css"; /* token values (source of truth) */
@import "@kufu/ui/theme.css"; /* shared @theme: token -> utility mapping */
@import "./base.css"; /* :root custom props + element-level base styles */
@import "./components.css"; /* class selectors (being migrated to cva/utilities) */
@import "./animations.css"; /* site-specific @keyframes */
```

Fonts are loaded via `?url` preload in `BaseLayout.astro` (not imported here).
Motion timing uses the semantic tokens from `@kufu/ui/tokens.css`
(`--kufu-motion-*` / `--kufu-ease*`); do not hard-code durations/easings.

The `@theme` (token → utility) mapping lives once in `@kufu/ui/theme.css` and is
shared by `@kufu/ui/styles.css` and this app's entry. This app keeps a local CSS
entry so it can define document-level base styles without importing
React/shadcn-only layers. Tailwind's Vite plugin discovers Astro pages,
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
- Style components with Tailwind utilities backed by `@kufu/ui` tokens (`text-foreground`, `bg-secondary`, `font-mono`, …) — no raw hex / color arbitrary values. Avoid scoped `<style>` blocks.

Root Storybook entry:

```bash
pnpm storybook:corporate
```
