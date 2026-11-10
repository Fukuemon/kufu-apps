# ADR-0033: E2E をルートの e2e/ に置いたまま、workspace の package にする

## Status

提案

## Context

- E2E と route の VRT は、ルートの `e2e/` にある。Playwright の設定、TypeScript の設定、`@playwright/test` の依存は、リポジトリのルートが持つ。`e2e/` は workspace の package ではない。
- route の VRT の baseline は、`e2e/corporate-site/route-vrt.spec.ts-snapshots/` にある。Playwright は、baseline の置き場をテストのファイルの場所から決める。
  - ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)
- ルートの Playwright の設定は、環境変数 `E2E_TARGET` で `e2e/<target>/` を切り替える。対象は `corporate-site` の 1 つだけである。
- buddy は、E2E を `packages/e2e` に置く。構成とツールチェーンの要求の ADR-0024 は、`e2e/` をルートに残し、置き場は E2E のテストの設計で決めるとしている。
  - 出典: [ADR-0024](https://github.com/Fukuemon/kufu-apps/blob/48380362a729fe2d5090af0fa25649d6a95adf75/adr/0024-documents-under-docs.md)
- 同じ要求の ADR-0025 は、workspace が自分に要る script だけを持ち、ルートが `pnpm -r` で束ねると決めた。
  - 出典: [ADR-0025](https://github.com/Fukuemon/kufu-apps/blob/48380362a729fe2d5090af0fa25649d6a95adf75/adr/0025-vite-plus-toolchain.md)
- このリポジトリの `packages/` は、app が import する共有のものを置く場所である。E2E は、どの app からも import されない。
- テストの書き方の規則は、ESLint を流すディレクトリから見たテストのディレクトリだけを見る。
  - ADR-0032: [E2E の workspace にだけ ESLint を入れ、テストの書き方の規則を掛ける](0032-eslint-for-e2e-authoring-rule.md)

## Decision

- `e2e/` を、workspace の package `@kufu/e2e` にする。`pnpm-workspace.yaml` に `e2e` を足す。
- Playwright の設定、撮影の設定、ESLint の設定、TypeScript の設定、E2E の依存を、`e2e/` に置く。ルートの `playwright.config.ts` と `tsconfig.json` は削除する。
- テストのコードは `e2e/tests/` の層に置く。route の VRT のファイルと baseline は、`e2e/corporate-site/` から動かさない。

  ```text
  e2e/
  ├── package.json                  # @kufu/e2e
  ├── playwright.config.ts
  ├── playwright.capture.config.ts  # エビデンスを撮るときの設定
  ├── eslint.config.mjs
  ├── eslint/                       # テストの書き方の規則
  ├── tsconfig.json
  ├── tests/
  │   ├── specs/<機能>/<振る舞い>.e2e.ts
  │   ├── verification/<要求の issue>/<アクター>-<観点>.e2e.ts
  │   ├── selectors/
  │   └── fixtures/
  └── corporate-site/               # route の VRT と baseline
  ```

- Playwright の project を 2 つに分ける。
  - `e2e`: `tests/` の下の `.e2e.ts` を流す。
  - `route-vrt`: `corporate-site/route-vrt.spec.ts` を流す。
- `@kufu/e2e` は、`test`、`check`、`typecheck` の script を持つ。ルートの `pnpm e2e` と `pnpm vrt:route` は、名前を変えずに、この workspace の script を呼ぶ。
- `E2E_TARGET` は、起動する app と port を選ぶ値として残す。テストのディレクトリは切り替えない。
  - 2 つ目の app を E2E の対象にするときに、spec の分け方を決める。
- buddy と同じ `packages/e2e` にはしない。
  - `packages/` の意味（app が import する共有のもの）を変えない。
  - route の VRT の baseline、CI の artifact のパス、文書のパスを変えずに済む。

## Considered Options

| 選択肢                                                        | 強み                                                                                                                 | 弱み                                                                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **採用:** ルートの `e2e/` のまま、workspace の package にする | 規則を流すディレクトリが決まる。`pnpm -r check` と `pnpm -r typecheck` に入る。route の VRT の baseline を動かさない | ルートの設定を `e2e/` に移し、参照するスクリプトと CI を直す。置き場が buddy と違う                         |
| buddy と同じ `packages/e2e` に移す                            | 置き場が buddy と同じになる                                                                                          | baseline、CI の artifact のパス、文書のパスがすべて変わる。`packages/` に、app が import しないものが入る   |
| ルートの `e2e/` のまま、workspace にしない                    | 設定の移動が少ない                                                                                                   | ESLint を流すディレクトリを、ルートの script で毎回指定する。誤ると違反を見逃す。E2E の依存がルートに増える |
| route の VRT も `e2e/tests/` の下に移す                       | テストのファイルが 1 つのディレクトリに集まる                                                                        | baseline の置き場が変わる。VRT のファイルに、E2E の書き方の規則が掛かる                                     |

## Consequences

### Positive

- E2E の依存と設定が、1 つのディレクトリに集まる。
- ルートの `tsc` の対象がなくなり、型のチェックが workspace の `typecheck` にそろう。
- route の VRT の baseline と、CI の baseline の artifact のパスが変わらない。

### Negative

- `scripts/vrt-container.mjs`、knip、dependency-cruiser、CI の設定が、ルートの `@playwright/test` と `playwright.config.ts` を参照している。移すときに直す。
- `e2e/` の下に、層のディレクトリ（`tests/`）と、VRT のディレクトリ（`corporate-site/`）が並ぶ。
- E2E の置き場が、buddy と違う。
