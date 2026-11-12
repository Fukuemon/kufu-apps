# @kufu/ui

Shared UI package for Kufu Monorepo.

## Source of Truth

- Component design rules: [../../context/codebase.md](../../context/codebase.md#app-の中の層)
- Storybook review contract: [../../context/testing.md](../../context/testing.md#required-tests)
- Design system rules: [DESIGN.md](DESIGN.md) and [design/](design/) (tokens, components, catalog)
- Design tokens: `src/tokens/primitive.css`, `src/tokens/semantic.css` (runtime CSS variables)
- Tailwind theme mapping: `src/tokens/theme.css` (`@theme inline`)
- Storybook stylesheet entry: `.storybook/preview.css` (not exported; package exports are `.`, `./theme.css`, `./fonts.css`)

## Storybook

Root entry:

```bash
pnpm storybook:ui
```

Package entry:

```bash
pnpm --filter @kufu/ui storybook
```

Build check:

```bash
pnpm --filter @kufu/ui storybook:build
```

## Adding Components

- Add shared component source under `src/base/<Name>/` (component, stories, MDX).
- Export public shared components from `src/base/index.ts`.
- Write components with React and native HTML elements; compose classes with `clsx`. Components do not accept `className`.
- Add the component section to [design/components.md](design/components.md) in the same change.
- Add a default Storybook story for every shared component.
- Add variant / error / disabled / empty stories when the component supports those states.
- Keep app-specific components out of `packages/ui`; place them in the app feature directory and app-local Storybook.

## Review Checklist

- The component is reused across multiple apps / features, or is part of the approved initial shared catalog.
- Styling uses `@kufu/ui` semantic tokens; no raw hex or arbitrary token fork.
- The story renders without production secrets, real network sends, or app-specific runtime state.
- The component remains SSR safe for Astro static rendering when it is display-only.
