# Toolchain

> 最終更新: 2026-08-16

Kufu Monorepo で採用する標準 toolchain。採否の根拠は [adr/](../adr/) を参照する。

## 標準スタック

| 区分                         | ツール                 | 備考                                                                                                                   |
| ---------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Package manager              | pnpm workspace         |                                                                                                                        |
| Task runner                  | Turborepo              | root script から `turbo run` で束ねる                                                                                  |
| コーポレートサイト framework | Astro                  | 現行の主対象                                                                                                           |
| CMS app candidate            | Hono + Inertia + React | 未実装。候補のみ (採否は ADR / spec)                                                                                   |
| Bundler                      | Rolldown               | 採用候補として先行固定                                                                                                 |
| Language                     | TypeScript             |                                                                                                                        |
| Linter                       | oxlint                 | TS を含む workspace は `oxlint-tsgolint` の type-aware 実行を使う。eslint は oxlint で不足が確認された場合のみ段階併用 |
| Formatter                    | oxfmt                  | config をほぼ持たず root script を正本にする。prettier は入れない                                                      |
| Unit test                    | Vitest                 |                                                                                                                        |
| UI catalog                   | Storybook              | `packages/ui` と app-local Presentation component の review 入口                                                       |
| E2E                          | Playwright             | root 管理                                                                                                              |
| Dead code detection          | knip                   | root 管理                                                                                                              |
| Dependency analysis          | dependency-cruiser     | root 管理                                                                                                              |
| Library build                | tsdown                 |                                                                                                                        |

## 先行固定の方針

- **Rolldown**: 採用候補として先に固定し、`apps/cms` を実装する場合の build 構成で採否を確認する。
- **React Compiler**: React app 導入時の標準として先に固定し、`packages/ui` と将来の `apps/cms` 実装時に適用する。React Compiler 非対応ライブラリ・実装の扱いは [DesignDoc_cms.md](../design/features/cms/DesignDoc_cms.md)。
- **knip / dependency-cruiser**: 実導入済みで、root script から実行できる。

## Scaffold Policy

app の初期 scaffold は公式 `create` command を優先する。

- 根拠: [ADR-0002](../adr/0002-monorepo-scaffold-create-command-policy.md) — scaffold に公式 create command を使うと定めた決定

- `apps/corporate-site`: `pnpm create astro@latest apps/corporate-site`
- React app: `pnpm create vite ... --template react-ts`
- 生成後に package 名 / root scripts / typecheck / E2E / shared config など monorepo の contract へ寄せる。
- `Vite+` は導入せず、専用 issue / spec で再検討する。

## 依存の固定 (pnpm overrides)

- **vite `^7`**: Astro 6 が Vite 7 前提のため root の `pnpm.overrides` で固定している (app / package 側の `vite ^8` 宣言より優先される)。vite 8 が混ざると dev サーバーの plugin context が壊れる。Astro が Vite 8 対応した時点で外す。
- **Node バージョン差に注意**: `.ts` の設定ファイル (`packages/config/vitest/base.ts` 等) の import は type stripping が既定有効な Node 23.6+ でのみ素で通る。CI の Node は 24 以上にする (22.12 では `ERR_UNKNOWN_FILE_EXTENSION`)。

## 参照

- [ADR-0002](../adr/0002-monorepo-scaffold-create-command-policy.md): app scaffold に公式 create command を使う決定
- [adr/](../adr/): 技術選定の決定記録
- [engineering.md](engineering.md): root task boundary と quality gate
- [testing.md](testing.md): テスト層の分担と E2E 実行契約
- [DesignDoc_cms.md](../design/features/cms/DesignDoc_cms.md): cms が使う React 系スタックの暫定候補
