# Command Matrix

root `package.json` の script 契約 (現行)。

## Contents

- Development
- Build
- Quality (lint / format / typecheck)
- Test
- Analysis
- Dependency management

## Development

| Command              | 用途                       | 備考                            |
| -------------------- | -------------------------- | ------------------------------- |
| `pnpm dev`           | 全 app を並列起動          | `turbo run dev --parallel`      |
| `pnpm dev:corporate` | コーポレートサイトのみ起動 | `--filter=@kufu/corporate-site` |

## Build

| Command      | 用途                                          |
| ------------ | --------------------------------------------- |
| `pnpm build` | 全 app / package をビルド (`turbo run build`) |

特定 app だけビルド:

```sh
pnpm --filter @kufu/corporate-site build
```

## Quality

| Command             | 用途                                                |
| ------------------- | --------------------------------------------------- |
| `pnpm lint`         | oxlint (turbo run lint)                             |
| `pnpm typecheck`    | TypeScript 型検査 (turbo run typecheck)             |
| `pnpm format`       | oxfmt で `--write` (破壊的)                         |
| `pnpm format:check` | oxfmt で `--check` (非破壊) — CI / レビュー前に使う |

## Test

| Command     | 用途                                     |
| ----------- | ---------------------------------------- |
| `pnpm test` | Vitest (turbo run test)                  |
| `pnpm e2e`  | Playwright (root `playwright.config.ts`) |

E2E の env は `references/e2e-runtime.md` を参照。

## Analysis

| Command          | 用途                                                         |
| ---------------- | ------------------------------------------------------------ |
| `pnpm knip`      | dead code / 未使用 export 検出                               |
| `pnpm depcruise` | 依存関係境界検査 (循環、未宣言、devDep 流入、app 間直接依存) |

`lefthook` の `pre-commit` で自動実行される。

## Dependency management

```sh
pnpm --filter @kufu/<module> add <package>
pnpm --filter @kufu/<module> add -D <package>
```

root に直接追加してはいけない (toolchain / repo-wide devDep を除く)。
