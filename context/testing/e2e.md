---
type: context
title: E2E のテスト
description: E2E のテストのツールでの書き方、testid の名前、lint の規則に渡す値と規則の更新の手順、流すコマンドと環境、テストデータ、待つ時間の決め方
status: draft
---

# E2E のテスト

## Test Tool

- テストのツールは Playwright（`@playwright/test`）である。バージョンは `e2e/package.json` にある。
- E2E のテストのディレクトリは、`context/project.yml` の `e2e.dir`（`e2e`）にある。テストのコードは `e2e/tests/` の層に置く。
  - ADR-0028: [E2E のテストのコードを層に分けて書き、ページ単位の Page Object をやめる](../../docs/adr/0028-e2e-test-code-layers.md)
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
- モバイルの幅は、390 × 900 にする。route の VRT の mobile と同じ幅である。
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

- テストの書き方の規則は、`e2e/lint/e2e-authoring-rule.mjs` にある。スキル setup-e2e-lint の規則を、変えずに写したものである。ESLint は入れず、oxlint の JS プラグインとして流す。
  - ADR-0029: [テストの書き方の規則を、ESLint を入れずに oxlint の JS プラグインで流す](../../docs/adr/0029-oxlint-js-plugin-for-e2e-authoring-rule.md)
- 規則は `e2e/lint/plugin.mjs` で JS プラグインにし、ルートの `vite.config.ts` の `lint.jsPlugins` で読む。`lint.overrides` で、`e2e/tests/` の下のファイルにだけ掛ける。
- `e2e/` のファイルには、ほかのファイルと同じ oxlint の組み込みの規則（`correctness` と型を使う規則）も掛かる。
- 規則に渡す値は、次のとおり。

| 値                                | 渡すもの                     |
| --------------------------------- | ---------------------------- |
| テストのディレクトリ              | `tests`                      |
| 固定の待ちを許すファイル          | `tests/fixtures/caption.ts`  |
| 待つ時間の名前を置くファイル      | `tests/fixtures/timeouts.ts` |
| 画面 ID の形                      | 渡さない。下の注を参照       |
| 本物の backend につなぐ spec の形 | 渡さない。backend がない     |

- 画面 ID の形を渡さないのは、規則が画面 ID を探すのが `widgets/` の下だけで、`widgets/` がないためである。画面仕様書の画面 ID（`site-home`、`product-list`、`contact-info`）は、testid の接頭辞（`home`、`products`、`contact`）と違う語で、テストのコードに書かない。`widgets/` を足すときに、渡すかを決める。
- 表のパスは `e2e/` からの相対パスで書いた。`vite.config.ts` は、`import.meta.dirname` から絶対パスにして渡す。相対パスで渡すと、`vp check` を流すディレクトリによって規則が `tests/` を見なくなり、違反があっても通る。
- 規則は、ルートの `pnpm check` か、`e2e/` の `pnpm check`（`vp check`）で流す。
  - `e2e/` で `vp lint` を直接流すと、`options.typeAware is only supported in the root config` で設定の読み込みが止まる。`vp check` は止まらない。
- route の VRT のファイル（`e2e/corporate-site/`）は、規則の対象の外にある。
- `e2e/lint/e2e-authoring-rule.mjs` は、配布元と `diff` で比べるため、`vite.config.ts` の `fmt.ignorePatterns` で整形の対象から外している。

### 規則の新しいバージョンを取り込むとき

配布元のテストは ESLint の RuleTester で書かれている。import の 3 行を替えて、oxlint の RuleTester で流す。

1. `diff .claude/skills/setup-e2e-lint/references/e2e-authoring-rule.mjs e2e/lint/e2e-authoring-rule.mjs` で差分を見て、規則のファイルを写す。
2. 配布元のテストを `e2e/lint/` に写し、import の 3 行を替える。RuleTester は、ルートの依存の `vite-plus/lint/plugins-dev` から読む。

   ```sh
   cp .claude/skills/setup-e2e-lint/references/e2e-authoring-rule.test.mjs e2e/lint/
   perl -0pi -e "s/^import tsParser.*\n//m; s/from 'eslint'/from 'vite-plus\/lint\/plugins-dev'/; s/languageOptions: \{ parser: tsParser, ecmaVersion: 2022, sourceType: 'module' \}/eslintCompat: true, cwd: process.cwd(), languageOptions: { sourceType: 'module' }/" e2e/lint/e2e-authoring-rule.test.mjs
   ```

3. `e2e/` でテストを流し、`fail 0` を確認する。

   ```sh
   (cd e2e && node --test lint/e2e-authoring-rule.test.mjs)
   ```

4. 写したテストを `rm e2e/lint/e2e-authoring-rule.test.mjs` で消す。テストはコミットしない。
5. `e2e/tests/specs/` の下に、`page.locator(".row")` と `page.waitForTimeout(1000)` を書いた spec を一時的に置く。ルートの `pnpm check` と、`e2e/` の `pnpm check` の両方が、終了コード 1 で失敗することを確認してから消す。

## Running Tests

- E2E は、ルートの `pnpm e2e` で流す。`@kufu/e2e` の `e2e` の script を呼び、Playwright の project `e2e` を流す。
- Playwright の設定は `e2e/playwright.config.ts` にあり、project は 2 つある。
  - `e2e`: `tests/` の下の `.e2e.ts`。
  - `route-vrt`: route の VRT（`corporate-site/route-vrt.spec.ts`）。`pnpm vrt:route` で流す（[テスト](../testing.md#vrt)）。baseline のファイル名に project の名前を入れない形を、`snapshotPathTemplate` で渡す。
- 向ける先は、corporate-site を `build` して `preview` で配信した `http://127.0.0.1:4321` である。Playwright が、`e2e:serve` の script で起動する。
  - `e2e:serve` は、`preview` に `--ignore-lock` を付けて前面で動かす。付けないと、コーディングエージェントの中で流したときに、Playwright の `webServer` が「exited early」で失敗する（[技術スタック](../tech-stack.md#upgrade-checks)）。
  - 環境変数 `E2E_BASE_URL` を渡すと、その URL に向ける。
  - `E2E_TARGET` と `E2E_PORT` は、起動する app と port を変える。
- worker の数は、Playwright のデフォルトのままにする。spec が共有する状態（ログイン、テストデータ）がないためである。
- 書き方の規則は `pnpm check` で、型のチェックは `pnpm typecheck` で流す。E2E だけを見るときは、`pnpm --filter @kufu/e2e check` と `pnpm --filter @kufu/e2e typecheck` を使う。
- `@kufu/e2e` は `test` の script を持たない。ルートの `pnpm test` は、ブラウザのない CI の job で流れるためである。
- CI は、`e2e` の job で `pnpm e2e` を流す。
- 通信を差し替える spec は、まだない。問い合わせフォームの E2E を足すときに、[テスト](../testing.md#mocking-and-test-data) の取り決めで書く。

## Test Data and Login

- テストデータとログインは持たない。画面に出る内容は、リポジトリのデータから build のときに決まる。
- 掲載の内容（カテゴリの数、メーカーの名前、電話番号）を確認する spec は、内容を変える pull request で一緒に直す。

## Timeouts

- テストの全体の時間は、`e2e/playwright.config.ts` に置く。spec には書かない。
- 個別の待つ時間が要るときは、`e2e/tests/fixtures/timeouts.ts` に名前を付けて置く。
- 値を変えるときは、複数の CI の実行のログから、通ったテストごとの所要時間を集めて決める。Playwright の reporter は `list` で、CI の `e2e` の job のログにテストごとの所要時間を出す。
- 失敗したときの trace は、CI の artifact の `e2e-artifacts`（`e2e/test-results/`）に残る。
