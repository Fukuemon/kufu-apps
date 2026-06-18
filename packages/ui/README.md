# @kufu/ui

Shared UI package for Kufu Monorepo.

## Source of Truth

- Component design rules: [../../context/component-design.md](../../context/component-design.md)
- Storybook review contract: [../../context/engineering.md](../../context/engineering.md#storybook-review-contract)
- Design tokens: `src/styles/tokens.css`
- Full stylesheet entry: `src/styles/globals.css` (`@kufu/ui/styles.css`)

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

- Add shared component source under `src/components/`.
- Export public shared components from `src/components/index.ts`.
- Add a default Storybook story for every shared component.
- Add variant / error / disabled / empty stories when the component supports those states.
- Keep app-specific components out of `packages/ui`; place them in the app feature directory and app-local Storybook.

## Review Checklist

- The component is reused across multiple apps / features, or is part of the approved initial shared catalog.
- Styling uses `@kufu/ui` semantic tokens; no raw hex or arbitrary token fork.
- The story renders without production secrets, real network sends, or app-specific runtime state.
- The component remains SSR safe for Astro static rendering when it is display-only.
