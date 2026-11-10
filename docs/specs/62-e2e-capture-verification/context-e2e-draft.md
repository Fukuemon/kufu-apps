# context/testing/e2e.md を埋める案

`context/testing/e2e.md` の本文の案。[index.md](index.md) の Decisions に合わせた中身である。  
実装のタスクが、動かして確認してから `context/testing/e2e.md` に書き、案内のコメントを消す。frontmatter の `status` は、最後のタスクで `stable` にする。

## Test Tool

- テストのツールは Playwright（`@playwright/test`）である。バージョンは `e2e/package.json` にある。
- E2E のテストのディレクトリは、`context/project.yml` の `e2e.dir`（`e2e`）にある。テストのコードは `e2e/tests/` の層に置く。
- テストのコードの書き方は、スキル write-e2e-test に従う。スキルの語は、Playwright の次の API に当たる。

| スキルの語                               | Playwright の API                                 |
| ---------------------------------------- | ------------------------------------------------- |
| 確認（自動で待つ assertion）             | locator か page を渡した `expect`                 |
| testid で要素を拾う                      | `page.getByTestId`。属性は `data-testid`          |
| 通信の差し替え                           | `page.route`                                      |
| 新しいタブの受け取り                     | `context.waitForEvent('page')`                    |
| ページを読み込むたびに実行するスクリプト | `page.addInitScript`                              |
| 時計の差し替えと時刻の固定               | `page.clock.install` と `page.clock.setFixedTime` |

- 準備の project とログインの状態のファイルは持たない。corporate-site にログインがないためである。
- JavaScript を無効にするテストは、`test.use({ javaScriptEnabled: false })` を付けたまとまりに書く。
- モバイルの幅のテストは、`test.use({ viewport: { width: 390, height: 900 } })` を付けたまとまりに書く。route の VRT の mobile と同じ幅である。
- 画面の中の移動は、リンクを押して作る。到達を確認するジャーニーでは、`page.goto` で先の route を直接開かない。

## Test IDs

- testid は、小文字の英語と `-` で書く。先頭は、ページ（`home`、`products`、`contact`）か、共通のコンポーネント（`site`、`company`）の名前である。
  - 今ある testid には、種類の語を挟むものと、挟まないものがある。今ある testid は改名しない。
    - 挟むもの: `home-section-hero`、`home-link-contact`、`site-nav-products`
    - 挟まないもの: `site-header`、`contact-form-slot`、`products-category-list`
  - 新しく付けるときは、領域に `section`、導線のリンクに `link`、ナビの項目に `nav` を挟む。
- 同じ要素が並ぶものは、末尾に ID を付ける。例: `products-category-<カテゴリの id>`
- testid を付けるのは、セクションとページの領域と、ヘッダーとフッターで文言が重なる操作の対象である。
- ほかの操作の対象（ボタン、リンク、入力欄）は、testid を付けず、role と名前で拾う。拾う関数は `e2e/tests/selectors/` に置く。
- `ContactCtaLink` は、渡した `data-testid` をリンクの要素に付ける。

## Lint Rule Options

- テストの書き方の規則は、`e2e/lint/e2e-authoring-rule.mjs` にある。スキル setup-e2e-lint の規則を写したものである。ESLint は入れず、oxlint の JS プラグインとして流す（ADR-0032）。
- 設定は `e2e/.oxlintrc.json` の `jsPlugins` と、規則の options にある。渡す値は次のとおり。

| 値                                | 渡すもの                       |
| --------------------------------- | ------------------------------ |
| テストのディレクトリ              | `tests`                        |
| 固定の待ちを許すファイル          | `tests/fixtures/caption.ts`    |
| 待つ時間の名前を置くファイル      | `tests/fixtures/timeouts.ts`   |
| 画面 ID の形                      | 渡さない。画面 ID の体系がない |
| 本物の backend につなぐ spec の形 | 渡さない。backend がない       |

- options は `e2e/` からの相対パスなので、規則は `e2e/` で流したときだけ `tests/` を見る。ルートから `e2e/.oxlintrc.json` を渡して oxlint を直接流すと、違反があっても通る。`pnpm lint` か `pnpm --filter @kufu/e2e lint` で流す。
- 構成とツールチェーンの要求の `vp check` のタスクで、設定をルートの `vite.config.ts` の `lint.overrides` に移し、options を `import.meta.dirname` から絶対パスで渡す。この節は、そのタスクで書き直す。
- 規則の新しいバージョンを取り込むときは、配布元のテストを oxlint の RuleTester で流す。
- route の VRT のファイル（`e2e/corporate-site/`）は、規則の対象の外にある。

## Running Tests

- E2E は、ルートの `pnpm e2e` で流す。`@kufu/e2e` の `e2e` の script を呼び、Playwright の project `e2e` を流す。
- Playwright の project は 2 つある。
  - `e2e`: `tests/` の下の `.e2e.ts`。回帰の spec（`tests/specs/`）と、検証のシナリオの spec（`tests/verification/`）を流す。
  - `route-vrt`: route の VRT。`pnpm vrt:route` で流す（[テスト](../../../context/testing.md#vrt)）。
- 向ける先は、corporate-site を `build` して `preview` で配信した `http://127.0.0.1:4321` である。Playwright が、`e2e:serve` の script で起動する。
  - `e2e:serve` は、`preview` に `--ignore-lock` を付けて前面で動かす。付けないと、コーディングエージェントの中で流したときに、Playwright の `webServer` が「exited early」で失敗する（[技術スタック](../../../context/tech-stack.md#upgrade-checks)）。
  - 環境変数 `BASE_URL` を渡すと、その URL に向け、app を起動しない。
  - `E2E_TARGET` と `E2E_PORT` は、起動する app と port を変える。
- worker の数は、Playwright のデフォルトのままにする。spec が共有する状態（ログイン、テストデータ）がないためである。
- 書き方の規則は `pnpm lint` で、型のチェックは `pnpm typecheck` で流す。E2E だけを見るときは、`pnpm --filter @kufu/e2e lint` と `pnpm --filter @kufu/e2e typecheck` を使う。構成とツールチェーンの要求の実装の後は、`pnpm check` に替わる。
- CI は、`e2e` の job で `pnpm e2e` を流す。
- 通信を差し替える spec は、まだない。問い合わせフォームの E2E を足すときに、[テスト](../../../context/testing.md#mocking-and-test-data) の取り決めで書く。
- エビデンスを撮る撮影の設定は、`e2e/playwright.capture.config.ts` にある（[エビデンス](../../../context/testing/evidence.md)）。

## Test Data and Login

- テストデータとログインは持たない。画面に出る内容は、リポジトリのデータから build のときに決まる。
- 掲載の内容（カテゴリの数、メーカーの名前、電話番号）を確認する spec は、内容を変える pull request で一緒に直す。

## Timeouts

- テストの全体と確認の時間は、`e2e/playwright.config.ts` に置く。spec には書かない。
- 個別の待つ時間が要るときは、`e2e/tests/fixtures/timeouts.ts` に名前を付けて置く。
- 値を変えるときは、複数の CI の実行のログから、通ったテストごとの所要時間を集めて決める。CI は、所要時間を `e2e` の job のログに出す。
- 失敗したときの trace は、CI の artifact の `e2e-artifacts` に残る。
