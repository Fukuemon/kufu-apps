# ADR-0029: packages/ui の Storybook をカタログの本体にし、corporate-site の Storybook を画面のカタログとして並べて公開する

## Status

承認

## Context

デザインシステムのカタログの組み方と、公開する場所を決める必要がある。

- Storybook は、`packages/ui`（React の Vite）と `apps/corporate-site`（`@storybook-astro/framework`）に 1 つずつある。2 つを build して、gh-pages のブランチへ push している。
- corporate-site の section は、Astro のコンポーネントである。Astro の Storybook の framework はコミュニティ製で、`@storybook/addon-vitest` が求める renderer に含まれない。
  - ADR-0014: [corporate-site の component を section 単位のフラットな構成にし、公開面を index.ts と独自のチェックで固定する](0014-corporate-site-sections-architecture.md)
  - ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)
- story の title は、`packages/ui` が `UI/<Component>`、app が `Sections/<Section>/<Component>` か `Common/<Component>` である。story の VRT の baseline のファイル名は、story の id から決まる。
- 運営者は、buddy の `packages/ui` と同じ形の Storybook で、トークンとコンポーネントを確認したい。
- buddy の `packages/ui` の Storybook は、a11y、docs、vitest のアドオンと、hover の見た目を出すアドオンを使い、ページを「はじめに、トークン、コンポーネント、パターン、画面」の順に並べる。story は Vitest のブラウザのテストとして動かし、a11y のアドオンの違反をテストの失敗にする。
  - 出典: [buddy の packages/ui/design/catalog.md](https://github.com/Fukuemon/buddy/blob/83472b52b3e4e7ecb7c450b4c5bc21fa2025098b/packages/ui/design/catalog.md)
- fukuemon.dev は、カタログを `design.fukuemon.dev` の Worker に出し、誰でも開けるようにしている。
  - 出典: [fukuemon.dev の ADR-0021](https://github.com/Fukuemon/fukuemon.dev/blob/c3c29d6a00b6db29074c5375b91c61e40167fcc4/adr/0021-ui-components-and-catalog.md)
- このリポジトリは public である。story と文書は、誰でも読める。
- 配信の基盤（app ごとの Worker とサブドメイン）は、基盤の要求が決める。まだ決まっていない。
- corporate-site の story の VRT は、`CompanySection` の 1 枚を、並列の実行で撮れないために対象から外している。

## Decision

### 1. packages/ui の Storybook を、カタログの本体にする

- 設定は、buddy の `packages/ui/.storybook` と同じ形にする。a11y、docs、vitest のアドオンと、hover の見た目を出すアドオン（`storybook-addon-pseudo-states`）を使う。
- ページは、はじめに、トークン、コンポーネント、パターンの順に並べる。
  - はじめに: 原則の ID と、アクセシビリティの基準の項目の一覧
  - トークン: 色、文字、余白と角丸
  - コンポーネント: Base と Case。コンポーネントごとに、変種と状態の例
  - パターン: コンポーネントを組み合わせた形。最初は置かず、組み合わせの規則ができたときに足す
- story の title は、ファイルの配置先から機械的に決める。対応の表は、デザインシステムの文書のカタログの文書に置く。
- story は、Vitest のブラウザのテストとして動かし、a11y のアドオンの違反をテストの失敗にする。

### 2. corporate-site の Storybook は、画面のカタログとして残す

- section と app の共通のコンポーネントの story は、今の Storybook のまま残す。section を React に書き直さない。
- story の title（`Sections/<Section>/<Component>`、`Common/<Component>`）は変えない。baseline のファイル名が変わらない。
- カタログの本体から、画面のカタログを開けるようにする。Storybook の composition で 1 つのサイドバーに並べる。composition が公開先で動かないときは、「はじめに」のページからリンクする。

### 3. カタログを、誰でも開ける場所に公開する

- カタログには、コンポーネント、公開のサイトと同じ掲載の内容、ダミーの値だけを載せる。API を呼ぶ story を作らない。
- 基盤の要求が配信の形を決めるまでは、今の GitHub Pages への公開を続ける。pull request ごとのプレビューも続ける。
  - GitHub Pages の設定が有効で、カタログが開けることを、カタログを組むタスクで確認する。
- 基盤が決まったら、カタログを、サイトとは別の Worker に静的なアセットとして出し、ドメインを `design.<ドメイン>` にする。ドメインと Terraform の置き場は、基盤の要求の決定に従う。
- 公開先の URL は、`context/project.yml` の `design_system.catalog_url` に書く。

### 4. story の VRT は、今の載せ方を続ける

- `packages/ui` は、`@storybook/addon-vitest` と `@storycap-testrun/browser` で撮る。
- corporate-site は、`@storybook/test-runner` と `@storycap-testrun/node` で撮る。
- `packages/ui` の story は、title とコンポーネントの置き場が変わるので、baseline を撮り直す。
- `CompanySection` の 1 枚は、Storybook のバージョンを上げた後に再現を確認する。残っていれば、その story だけを並列でない実行で撮る。

## Considered Options

| 選択肢                                                                                                    | 強み                                                                                         | 弱み                                                                                                          |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **採用:** `packages/ui` の Storybook を本体にし、corporate-site の Storybook を画面のカタログとして並べる | section を書き直さない。buddy と同じ形でトークンとコンポーネントを確認できる                 | Storybook が 2 つのままで、設定とテストの載せ方が 2 通り残る。composition が公開先で動くかは未確認である      |
| section を React に書き直し、Storybook を 1 つにする                                                      | Storybook、テスト、a11y の確認が 1 通りになる。コミュニティ製の framework への依存がなくなる | 18 個の Astro のコンポーネントを書き直す。ADR-0014 を変える。画面の構成を変えない、という要求の範囲から外れる |
| corporate-site の Storybook をやめ、画面は route の VRT と E2E で確認する                                 | Storybook が 1 つになる                                                                      | section を状態ごとに開ける場所がなくなる。section ごとの story の VRT がなくなる                              |
| カタログを Cloudflare Access で開ける人を絞って公開する                                                   | 作りかけの見た目を外に見せない                                                               | リポジトリが public なので、隠せるのは組み立てた結果だけである。設定が増える                                  |
| カタログを公開せず、CI で build だけを確認する                                                            | 公開の仕組みが要らない                                                                       | レビューする人が、手元で Storybook を起動することになる。要求の受け入れ条件を満たさない                       |

## Consequences

### Positive

- トークンとコンポーネントを、buddy と同じページの並びで確認できる。
- `packages/ui` のコンポーネントの a11y の違反が、テストで見つかる。
- section の story と baseline を、変えずに使い続けられる。

### Negative

- Astro の Storybook は、a11y のアドオンのテストに載らない。section のアクセシビリティは、E2E のテストの設計で扱う。
- `packages/ui` の story の baseline を、title の変更に合わせて撮り直す。
- 基盤が決まると、公開先の URL が変わる。
- `@storybook-astro/framework` が、Astro と Storybook の新しいバージョンで動くかを、バージョンを上げるたびに確認する。
