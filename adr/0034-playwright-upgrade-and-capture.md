# ADR-0034: Playwright を 1.64.1 に上げ、録画と字幕でエビデンスを撮る

## Status

提案

## Context

- ルートの `@playwright/test` と、`packages/ui` の `playwright` は、1.59.1 に固定している。lockfile にある Playwright は、この 1 つのバージョンだけである。E2E、route の VRT、story の VRT の 4 つの CI の job は、同じバージョンの Playwright の公式の image で動く。ローカルの route の VRT は、入っている `@playwright/test` のバージョンから image を決める。
- VRT の baseline は、CI で撮った画像を基準にする。許す差分は 0 から始め、差分が出たら CI を失敗させる。
  - ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)
  - ADR-0018: [story の側の VRT を Storybook の公式のテストの基盤に載せ、baseline をリポジトリで管理する](0018-story-vrt-on-storybook-test-integrations.md)
- 画面の変更の確認は、スクリーンショットを手で撮って pull request に貼っている。
- agent-harness のパッケージ capture のスキル playwright-capture は、Playwright の録画に字幕を重ねてエビデンスを撮る。撮影の設定と字幕の関数の 2 つのファイルを、利用者のリポジトリに写して使う。
  - 録画に字幕と操作の枠を重ねる機能を使うので、Playwright は 1.64 以上が要る。
  - 撮影の設定は E2E の設定を読み込み、`-c` で渡したときだけ録画する。撮るアプリの URL は、E2E の設定の `baseURL` で決まる。改修前のアプリを撮るときは、環境変数 `BASE_URL` で上書きする。
- buddy は、`@playwright/test` を 1.64.1 に固定している。
  - 出典: [buddy の packages/e2e/package.json](https://github.com/Fukuemon/buddy/blob/c53390a6e64f4ef39d468dedd529425ae4aca0e5/packages/e2e/package.json)
- 構成とツールチェーンの要求は、Astro と Storybook を上げる。デザインシステムの要求は、見た目を変えないタスクを、VRT に差分が無いことで確認する。どちらも baseline に関わる。
- agent-harness は private のリポジトリで、このリポジトリは public である。
- E2E は、workspace の package にする。
  - ADR-0033: [E2E をルートの e2e/ に置いたまま、workspace の package にする](0033-e2e-workspace-at-root.md)

## Decision

### 1. Playwright を 1.64.1 に上げる

- `@playwright/test` と、`packages/ui` の `playwright` を、1.64.1 に固定する。CI の 4 つの job の image も、同じ pull request で 1.64.1 にする。
  - 上げた後の lockfile に、Playwright のバージョンが 1 つだけあることを確認する。corporate-site の story の VRT は、依存を通して同じ Playwright を使う。
- 上げる pull request は、ほかの変更を含めない。差分が出たときに、ブラウザのバージョンの差だと分かるようにするためである。
- 上げた pull request で、route と story の VRT を、今の baseline と比べて CI で流す。
  - 差分が無ければ、baseline を変えない。
  - 差分が出たら、運営者が差分を見て、baseline を撮り直すかを決める。許す差分は緩めない。
- 上げる時点は、Storybook を上げるタスクの後にする。デザインシステムの要求の、見た目を変えないタスクと同時に進めない。

### 2. 撮影の設定と字幕の関数を、E2E の workspace に写す

- 撮影の設定は `e2e/playwright.capture.config.ts` に、字幕の関数は `e2e/tests/fixtures/caption.ts` に写す。
- 撮影の出力（`e2e/evidence/`）は、Git で追跡しない。
- E2E の設定の `baseURL` は、環境変数 `BASE_URL` で上書きできるようにする。`BASE_URL` を渡したときは、app を起動しない。
  - 今の `E2E_BASE_URL` は、`BASE_URL` に改める。向ける先を渡す名前を 1 つにするためである。
- 録画を mp4 にまとめるスクリプトは、スキルのディレクトリのものを使い、写さない。ffmpeg が要る。

### 3. 字幕を付ける spec を限る

- 字幕を付けるのは、検証のシナリオの spec と、pull request の動作確認の spec だけにする。
- 回帰の E2E の spec には、字幕を付けない。録画が要るときは、書き換えずに撮影の設定で流す。

## 承認の条件

- private の agent-harness の 2 つのファイルを、public のこのリポジトリに写してコミットすることを、運営者が認める。
- 上げた pull request の CI で、route と story の VRT の結果を確認する。

## Verification

2026-11-11 に、develop の b6b3fe4 を build して preview で配信し、Playwright 1.64.1（Chromium 156）で確認した。macOS の手元の結果で、CI の Linux では確認していない。

- `smoke.spec.ts` の 5 件が通った。
- 撮影の設定で `smoke.spec.ts` を書き換えずに流すと、5 件が通り、テストごとに録画ができた。
- 字幕の関数を使う spec を 3 本書いて撮ると、mp4（H.264、1600x900）と判定の静止画ができた。
  - JavaScript を無効にしたテストでも、字幕が出た。
  - viewport を 390x900 にしたテストでも、字幕が出た。
  - 同じ spec を、撮影の設定を付けずに流すと、E2E として 3 件が通った。
- route と story の VRT の差分は、確認していない。baseline が CI の Linux の画像のためである。
- 1.65.0 での動きは、確認していない。

## Considered Options

| 選択肢                                                | 強み                                                                                             | 弱み                                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **採用:** 1.64.1 に上げ、撮影の設定と字幕の関数を写す | buddy と同じバージョンで、手元で動きを確認した。E2E の spec から、録画と字幕のエビデンスを撮れる | VRT に差分が出るかは未確認で、出たら baseline を撮り直す。写したファイルの更新は、手で取り込む                  |
| 最新の 1.65.0 に上げる                                | 新しいバージョンになる                                                                           | 手元で確認していない。buddy とバージョンが違う                                                                  |
| E2E だけ 1.64.1 にし、VRT は 1.59.1 のままにする      | VRT の baseline に差分が出ない                                                                   | ブラウザと CI の image が 2 つのバージョンになる。route の VRT は E2E と同じ workspace にあり、依存を分けにくい |
| 上げずに、スクリーンショットを手で貼り続ける          | 何も変えない                                                                                     | 操作の流れを録画で見せられない。確認の手順が人によって違う                                                      |
| 上げずに、ブラウザを操作する別のツールで録画する      | Playwright を上げずに済む                                                                        | E2E の spec と別に、撮る手順を持つ。字幕と判定の静止画を、同じ形で残せない                                      |

## Consequences

### Positive

- 検証のシナリオと pull request の動作確認を、同じ仕組みで撮れる。
- 字幕つきの spec は、撮影の設定を付けなければ E2E として動く。撮るためだけのコードを持たない。
- Playwright のバージョンが、buddy と同じになる。

### Negative

- Chromium のバージョンが変わる。route と story の baseline を、撮り直すことがある。
- 録画には ffmpeg が要る。開発の準備に足す。
- 撮影の設定と字幕の関数を、このリポジトリに写して持つ。
