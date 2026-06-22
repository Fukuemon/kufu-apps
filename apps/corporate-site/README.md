# corporate-site

`apps/corporate-site` is the Astro consumer app for the shared `@kufu/ui` design foundation.

## Design Foundation

This app consumes design tokens and fonts from `@kufu/ui`, and runs its own lean
Tailwind v4 entry (it does NOT import the full `@kufu/ui/styles.css`, which carries
React/shadcn-only layers — see [ADR-0007](../../adr/0007-design-token-architecture.md)).

`src/styles/globals.css`:

```css
@import "tailwindcss";
@import "@kufu/ui/tokens.css"; /* token values (source of truth) */
@import "@kufu/ui/fonts.css";
@import "@kufu/ui/theme.css"; /* shared @theme: token -> utility mapping */
```

The `@theme` (token → utility) mapping lives once in `@kufu/ui/theme.css` and is
shared by `@kufu/ui/styles.css` and this app's entry. This app keeps a local CSS
entry so it can define document-level base styles without importing
React/shadcn-only layers. Tailwind's Vite plugin discovers Astro pages,
components, and Storybook stories through Vite's module graph; no app-local
`@source` directive is needed.

Tailwind v4 is applied with `@tailwindcss/vite` in `astro.config.mjs`.
`@storybook-astro/framework` auto-loads the Astro Vite plugin for Storybook;
there is no PostCSS config for Tailwind.
`vite.resolve.tsconfigPaths: true` is set because Vite 8 currently rejects the
resolver options that `@tailwindcss/vite` spreads unless that field is present.
Keep Astro-local markup and UI composition in `apps/corporate-site`.

## Components

Component design rules are defined in [../../context/component-design.md](../../context/component-design.md).

- Route entries live in `src/pages/`.
- Feature components live in `src/components/features/<feature>/`, where `<feature>` is a content domain (`business`, `products`, `contact`, `services`) — not the app name. Cross-feature site components live in `src/components/common/`.
- Presentation components use `<Component>.astro` (no `Presentation` suffix) and are the primary app-local Storybook target.
- Data/logic belongs in the content layer (`src/content/<feature>.ts`, or an Astro Content Collection for homogeneous entry sets); a `<Feature>Section.astro` assembles content into presentation. Both are added when the page body is implemented.
- Style components with Tailwind utilities backed by `@kufu/ui` tokens (`text-foreground`, `bg-secondary`, `font-mono`, …) — no raw hex / color arbitrary values. Avoid scoped `<style>` blocks.

Root Storybook entry:

```bash
pnpm storybook:corporate
```
