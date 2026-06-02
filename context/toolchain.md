# Toolchain

> 最終更新: 2026-05-31

Kufu Monorepo で採用する標準 toolchain。採否の根拠は [adr/](../adr/) を参照する。

## 標準スタック

| 区分                         | ツール                 | 備考                                         |
| ---------------------------- | ---------------------- | -------------------------------------------- |
| Package manager              | pnpm workspace         |                                              |
| Task runner                  | Turborepo              | root script から `turbo run` で束ねる        |
| コーポレートサイト framework | Astro                  | Phase 1 主対象                               |
| CMS app candidate            | Hono + Inertia + React | 将来候補 (Phase 2 以降, ADR/spec で採否)     |
| Bundler                      | Rolldown               | 採用候補として先行固定                       |
| Language                     | TypeScript             |                                              |
| Linter                       | oxlint                 |                                              |
| Formatter                    | oxfmt                  | config をほぼ持たず root script を正本にする |
| Unit test                    | Vitest                 |                                              |
| UI catalog                   | Storybook              | `packages/ui` の入口                         |
| E2E                          | Playwright             | root 管理 ([testing.md](testing.md))         |
| Dead code detection          | knip                   | root 管理 ([engineering.md](engineering.md)) |
| Dependency analysis          | dependency-cruiser     | root 管理 ([engineering.md](engineering.md)) |
| Library build                | tsdown                 |                                              |

## 先行固定の方針

- **Rolldown**: 採用候補として先に固定し、将来 `apps/cms` を実装する場合の build 構成で採否を確認する。
- **React Compiler**: React app 導入時の標準として先に固定し、`packages/ui` と将来の `apps/cms` 実装時に適用する。React Compiler 非対応ライブラリ・実装の扱いは [DesignDoc_cms.md](../design/features/cms/DesignDoc_cms.md)。
- **knip / dependency-cruiser**: issue #3 で実導入し、root script から実行できる状態まで整える。

## Scaffold Policy

app の初期 scaffold は公式 `create` command を優先する ([ADR-0002](../adr/0002-monorepo-scaffold-create-command-policy.md))。

- `apps/corporate-site`: `pnpm create astro@latest apps/corporate-site`
- React app: `pnpm create vite ... --template react-ts`
- 生成後に package 名 / root scripts / typecheck / E2E / shared config など monorepo の contract へ寄せる。
- `Vite+` は Phase 1 では導入せず、専用 issue / spec で再検討する。
