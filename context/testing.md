---
type: context
title: テスト
description: unit test、play、E2E、VRT の責務と置き場、VRT の撮影の環境、E2E の環境変数、API の置き換え方、story と E2E の層と locator の規約、変更ごとに足すテスト
status: draft
governs:
  - e2e/
  - scripts/vrt-story.mjs
  - scripts/vrt-container.mjs
  - packages/ui/.storybook/
  - apps/corporate-site/.storybook/
verified_commit: 81f85da2744f320f44040307f1ec854f705f7c79
---

# テスト

feature ごとのテストの観点は、各 feature の Design Doc の Verification の節が持つ。  
corporate-site で E2E が担うジャーニーは [コーポレートサイトの Design Doc](../apps/corporate-site/DesignDoc.md#e2e-が担うジャーニー) にある。

## Test Types and Guarantees

テストの種類ごとに、置き場と保証することは次のとおり。

| 種類      | 置き場                                             | 保証すること                                               |
| --------- | -------------------------------------------------- | ---------------------------------------------------------- |
| unit test | 各 app と package（Vitest）                        | ロジック、共有の UI                                        |
| play      | 各コンポーネントの story（Storybook）              | 1 つのコンポーネントの中で閉じる操作                       |
| E2E       | `e2e/tests/`（`@kufu/e2e`、Playwright）            | 公開の前の検証、route をまたいだ到達、回帰                 |
| VRT       | story は Storybook、route は `e2e/corporate-site/` | 見た目の回帰。要素があるかではなく、見た目の差分を検出する |

- `packages/ui` の共有の UI は、Storybook か unit test で確認できる状態にする。

play テストの対象は `packages/ui` に限る。  
Astro の静的なコンポーネントは E2E で確認する。  
ADR-0031: [E2E のテストのコードを層に分けて書き、ページ単位の Page Object をやめる](../docs/adr/0031-e2e-test-code-layers.md)

- React の island の play テストの対象の基準は未定。最初の island を足すときに決める。

E2E は、route をまたいだ到達を見る。  
1 つのコンポーネントの中で閉じる操作は、play が受け持つ。

### VRT

VRT は、story と route の 2 系統で撮る。  
ADR-0015: [VRT の方針](../docs/adr/0015-visual-regression-testing-policy.md)  
ADR-0018: [Storybook の test の仕組みの上の story の VRT](../docs/adr/0018-story-vrt-on-storybook-test-integrations.md)

| 系統  | 撮る対象                                        | 撮る手段                         | baseline の置き場 | コマンド         |
| ----- | ----------------------------------------------- | -------------------------------- | ----------------- | ---------------- |
| story | Storybook の story（fixture は除く）            | `storycap-testrun` と `reg-cli`  | リポジトリ（Git） | `pnpm vrt:story` |
| route | 3 つの route を desktop と mobile の 2 つの幅で | Playwright の `toHaveScreenshot` | リポジトリ（Git） | `pnpm vrt:route` |

- 許す差分は 0（完全一致）から始める。flake が起きたら、測った差分を上回る最小の値まで緩める。
- 差分が出たら CI を失敗させる。
  - 環境の違いによる恒常的な差分には、閾値を上げず、失敗を無視もせず、原因の要素をマスクし、撮る環境を固定して対処する。
- baseline の正は、CI（amd64）で撮った画像にする。
  - ローカルとはフォントの描画が違い、撮る環境を固定しないと恒常的な差分が出る。ローカルの実行は撮影の確認に使う。
- route は Playwright の公式の container で撮る。
  - Playwright の baseline はファイル名に platform を含み、ホスト（macOS）で撮った画像は CI では使われない。
  - `pnpm vrt:route` を通さない実行は skip される。
- story は container を使わず、CI だけで撮る。撮影が Vite の bundle を伴い、エミュレーションの下の container の実行と両立しないため。
  - ADR-0018: [Storybook の test の仕組みの上の story の VRT](../docs/adr/0018-story-vrt-on-storybook-test-integrations.md)
- VRT を外部のサービスの応答に依存させない。外部の埋め込みと画像はリクエストごと止め、残る枠はマスクする。

手順とコマンドの詳細は、[README.md](../README.md#visual-regression-testing-vrt) の VRT の節にある。

## Runtime Requirements

`pnpm e2e` は、`e2e/playwright.config.ts` を正とし、`e2e/tests/` の下の spec を読む。

- 環境変数は `E2E_TARGET`、`E2E_PORT`、`E2E_BASE_URL` の 3 つにする。
- `E2E_TARGET` のデフォルトは `corporate-site` にする。
- 各 app の preview の port は、衝突を避けるためこの取り決めで固定する。`corporate-site` は 4321、`cms` は 4173 にする。
- 対象の app は `build`、`preview`、`e2e:serve` の 3 つの script を持つ。`e2e/playwright.config.ts` は `e2e:serve` だけを呼ぶ。
  - `apps/corporate-site` の `e2e:serve` は、`build` の後に `preview` を起動する。
  - app 固有の preview のコマンドをルートに書かず、workspace の script の取り決めでつなぐ。
- 新しい app を E2E の対象にするときは、3 つの script を実装し、`e2e/playwright.config.ts` の対象に足す。

## Mocking and Test Data

Cloudflare Pages Functions か Workers を伴う feature は、ローカルの E2E の実行環境と Cloudflare の実行環境の違いを前提に、確認する範囲を分ける。

- Playwright の E2E は、導線、表示、client の分岐を確認する。
  - 外部への送信と実際のメールの送信を避けるため、同一オリジンの API は route の intercept で fixture にする。
  - fixture は、feature の Design Doc の API とエラーの契約に従い、成功、validation のエラー、セキュリティのエラー、rate limit、外部への送信の失敗などの主な分岐を固定する。
- Workers の validation、セキュリティ、error code の対応づけは、Vitest の unit test で確認する。
- Cloudflare Pages Functions と、実際の secret と外部のサービスの結線は、preview deployment で手で smoke test をする。
  - CI の E2E を Cloudflare の実行環境に依存させない。
- story は固定の props と fixture で状態の差を表す。本番の secret、実際の送信、外部の API の呼び出しを伴う story を作らない。

## Required Tests

- `packages/ui` に共有のコンポーネントを足すときは、story を必須にする。
  - default の story を必須にし、variant と状態があれば同じ catalog に story を足す。
  - アプリ固有のコンポーネントとページの単位のサンプルを、`packages/ui` の Storybook に載せない。
- app の Storybook は、section の presentation のコンポーネントのレビューに使う。
  - story のファイルは `<Component>.stories.*` にする。
- presentation のコンポーネントには、次の 2 つの story を必須にする。
  - 見た目の variant（cva の variants か、markup の分岐による variant）のすべての組み合わせを args で並べる story
  - edge state（長い文、空のデータ、最小の構成）の story
- section assembly の story は、ページの文脈で確認するために catalog に入れてよい。
  - fixture は story の中に限り、代表のケースだけでよい。variant を網羅する主な対象は presentation である。
- すべての story に autodocs を適用する。`.storybook/preview` の `tags: ['autodocs']` で掛け、例外は story の側で `!autodocs` を指定する。
- 公開の判断には、deploy の成功だけでなく、preview での導線の確認を含める。条件は [operations.md](operations.md#deployment-conditions) にある。
- `apps/cms` を足すときの採用判断のテストの観点は [CMS の Design Doc](../docs/design/features/cms/DesignDoc.md) にある。

### E2E の層と locator

- E2E のテストのコードは、`e2e/tests/` の `specs/`、`selectors/`、`fixtures/` の層に分け、Page Object のクラスを作らない。
- testid を持たない要素の指し方は、ページを引数に取る関数で `selectors/` に置く。確認と手順は spec に書く。
- locator は用途で使い分ける。
  - セクションとページのような領域の特定には、`data-testid` を使う。spec に直接書いてよい。
  - ボタン、リンク、入力欄のような操作の対象には、`getByRole` を優先する。
- 層、testid の名前、書き方の規則の詳細は [E2E のテスト](testing/e2e.md) にある。
