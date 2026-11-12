# ADR-0034: Playwright を 1.64.1 に上げる

## Status

承認

## Context

- ルートの `@playwright/test` と、`packages/ui` の `playwright` は、1.59.1 に固定している。lockfile にある Playwright は、この 1 つのバージョンだけである。
- E2E、route の VRT、story の VRT の 4 つの CI の job は、同じバージョンの Playwright の公式の image で動く。ローカルの route の VRT は、入っている `@playwright/test` のバージョンから image を決める。
- VRT の baseline は、CI で撮った画像を基準にする。許す差分は 0 から始め、差分が出たら CI を失敗させる。
  - ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)
- agent-harness のパッケージ capture の撮影の仕組みは、録画に字幕と操作の枠を重ねる機能を使う。Playwright は 1.64 以上が要る。
- buddy は、`@playwright/test` を 1.64.1 に固定している。
  - 出典: [buddy の packages/e2e/package.json](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/packages/e2e/package.json)
- 構成とツールチェーンの要求は、Astro と Storybook を上げる。デザインシステムの要求は、見た目を変えないタスクを VRT に差分が無いことで確認し、見た目を変えるタスクで baseline を撮り直す。どちらも baseline に関わる。

## Decision

- `@playwright/test` と、`packages/ui` の `playwright` を、1.64.1 に固定する。CI の 4 つの job の image も、同じ pull request で 1.64.1 にする。
  - 上げた後の lockfile に、Playwright のバージョンが 1 つだけあることを確認する。corporate-site の story の VRT は、依存を通して同じ Playwright を使う。
- 上げる pull request は、ほかの変更を含めない。差分が出たときに、ブラウザのバージョンの差だと分かるようにするためである。
- 上げた pull request で、route と story の VRT を、今の baseline と比べて CI で流す。
  - 差分が無ければ、baseline を変えない。
  - 差分が出たら、運営者が差分を見て、baseline を撮り直すかを決める。許す差分は緩めない。
- 上げる時点は、Storybook を上げるタスクの後にする。デザインシステムの要求の、baseline に関わるタスクの pull request と同時に開かない。

## Verification

2026-11-11 に、develop の b6b3fe4 を build して preview で配信し、Playwright 1.64.1（Chromium 156）で確認した。macOS の手元の結果で、CI の Linux では確認していない。

- `smoke.spec.ts` の 5 件が通った。
- route と story の VRT の差分は、確認していない。baseline が CI の Linux の画像のためである。
- `packages/ui` の Storybook のテスト（`@vitest/browser-playwright`）が 1.64.1 で動くかは、確認していない。
- 1.65.0 での動きは、確認していない。

## Considered Options

| 選択肢                                           | 強み                                                                    | 弱み                                                                                                            |
| ------------------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **採用:** 1.64.1 に上げる                        | buddy と同じバージョンで、手元で E2E が通った。撮影の仕組みを入れられる | VRT に差分が出るかは未確認で、出たら baseline を撮り直す                                                        |
| 最新の 1.65.0 に上げる                           | 新しいバージョンになる                                                  | 手元で確認していない。buddy とバージョンが違う                                                                  |
| E2E だけ 1.64.1 にし、VRT は 1.59.1 のままにする | VRT の baseline に差分が出ない                                          | ブラウザと CI の image が 2 つのバージョンになる。route の VRT は E2E と同じ workspace にあり、依存を分けにくい |
| 上げない                                         | 何も変えない                                                            | 撮影の仕組みを入れられない                                                                                      |

## Consequences

### Positive

- 録画と字幕でエビデンスを撮る仕組みを、入れられるようになる。
- Playwright のバージョンが、buddy と同じになる。

### Negative

- Chromium のバージョンが変わる。route と story の baseline を、撮り直すことがある。
- baseline に関わるほかのタスクと、順を合わせる。
