# ADR-0033: E2E をルートの e2e/ に置いたまま、workspace の package にする

## Status

提案

## Context

- E2E と route の VRT は、ルートの `e2e/` にある。Playwright の設定、TypeScript の設定、`@playwright/test` の依存は、リポジトリのルートが持つ。`e2e/` は workspace の package ではない。
- route の VRT の baseline は、`e2e/corporate-site/route-vrt.spec.ts-snapshots/` にある。
  - Playwright は、baseline の置き場をテストのファイルの場所から決める。
  - baseline のファイル名には、Playwright の project の名前が入る。今の設定は project を持たないので、名前は入っていない。
  - ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)
- ルートの Playwright の設定は、環境変数 `E2E_TARGET` で `e2e/<target>/` を切り替える。対象は `corporate-site` の 1 つだけである。
- buddy は、E2E を `packages/e2e` に置く。構成とツールチェーンの要求の ADR-0024 は、`e2e/` をルートに残し、置き場は E2E のテストの設計で決めるとしている。
  - 出典: [ADR-0024](https://github.com/Fukuemon/kufu-apps/blob/48380362a729fe2d5090af0fa25649d6a95adf75/adr/0024-documents-under-docs.md)
- 同じ要求の ADR-0025 は、workspace が自分に要る script だけを持ち、ルートが `pnpm -r` で束ねると決めた。`pnpm typecheck` は、ルートの `tsc` と `pnpm -r typecheck` を実行する。`pnpm test` は、ブラウザのない CI の job で流れる。
  - 出典: [ADR-0025](https://github.com/Fukuemon/kufu-apps/blob/48380362a729fe2d5090af0fa25649d6a95adf75/adr/0025-vite-plus-toolchain.md)
- ルートの `tsc` が確認するのは、`playwright.config.ts` と `e2e/` の下のファイルだけである。
- このリポジトリの `packages/` は、app が import する共有のものを置く場所である。E2E は、どの app からも import されない。
- テストの書き方の規則は、ESLint を流すディレクトリから見たテストのディレクトリだけを見る。ほかのディレクトリから流すと、違反があっても報告しない。

## Decision

- `e2e/` を、workspace の package `@kufu/e2e` にする。`pnpm-workspace.yaml` に `e2e` を足す。
- Playwright の設定、撮影の設定、ESLint の設定、TypeScript の設定、E2E の依存を、`e2e/` に置く。ルートの `playwright.config.ts` は削除する。
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
  - `route-vrt`: `corporate-site/route-vrt.spec.ts` を流す。baseline のファイル名に project の名前が入らないよう、baseline のパスの形を設定で渡す。baseline の 6 枚は、改名も撮り直しもしない。
- `@kufu/e2e` は、`e2e`、`vrt:route:run`、`check`、`typecheck` の script を持つ。`test` の script は持たない。
  - ルートの `pnpm test` は、ブラウザのない job で workspace の `test` を流す。E2E が入ると、その job が失敗する。
  - ルートの `pnpm e2e` と `pnpm vrt:route` は、名前を変えずに、この workspace の script を呼ぶ。
- 型のチェックは、`@kufu/e2e` の `typecheck` に移す。ルートの `tsc` は、対象がなくなるので外す。
  - ADR-0025 の「`pnpm typecheck` は、ルートの `tsc` と `pnpm -r typecheck` を実行する」のうち、ルートの `tsc` をやめることになる。
- buddy と同じ `packages/e2e` にはしない。
  - `packages/` の意味（app が import する共有のもの）を変えない。
  - route の VRT の baseline、CI の artifact のパス、文書のパスを変えずに済む。

## 承認の条件

- workspace にする pull request の CI で、route の VRT が、baseline を撮り直さずに通る。
- ルートの `tsc` を外すことを、ADR-0025 の決定を変えるものとして、運営者が認める。

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
- 型のチェックが、workspace の `typecheck` にそろう。
- route の VRT の baseline と、CI の baseline の artifact のパスが変わらない。

### Negative

- ルートの `@playwright/test`、`playwright.config.ts`、`tsconfig.json` を参照する箇所を、移すときに直す。`scripts/vrt-container.mjs`、knip、dependency-cruiser、CI の設定である。
- `e2e/` の下に、層のディレクトリ（`tests/`）と、VRT のディレクトリ（`corporate-site/`）が並ぶ。
- E2E の置き場が、buddy と違う。
- route の VRT の project に、baseline のパスの形の設定が 1 つ増える。
