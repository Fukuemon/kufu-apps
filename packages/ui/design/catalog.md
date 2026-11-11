# Kufu のデザインシステムのカタログ

この文書は、[Kufu のデザインシステム](../DESIGN.md)の一部である。Storybook のカタログのページの組み方と、載せてよいものの規則を持つ。構成と公開先の判断は [ADR-0029](../../../docs/adr/0029-storybook-catalog.md) にある。

## カタログのページ

カタログの本体は `packages/ui` の Storybook である。corporate-site の Storybook は画面のカタログで、本体の Storybook の composition で同じサイドバーに並べる。

| ページ         | 書くこと                                                                                                             | 配置先                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| はじめに       | 原則の ID と、アクセシビリティの基準の項目の一覧                                                                     | `packages/ui/src/docs/<名前>.mdx`                                                                      |
| トークン       | 色、文字、余白と角丸                                                                                                 | `packages/ui/src/tokens/<名前>.mdx`                                                                    |
| コンポーネント | コンポーネントごとの変種と状態の例。使う場面、使わない場面、キーボードの操作は、コンポーネントの文書の節の名前で指す | `packages/ui/src/base/<名前>/`、`packages/ui/src/case/<名前>/`                                         |
| パターン       | コンポーネントを組み合わせた形。組み合わせの規則ができたときに足す                                                   | `packages/ui/src/patterns/`                                                                            |
| 画面           | corporate-site の section と、app の共通のコンポーネント                                                             | `apps/corporate-site/src/components/sections/<section>/`、`apps/corporate-site/src/components/common/` |

- ページの並びは、`packages/ui/.storybook/preview.ts` の `storySort` が決める。画面のカタログは composition の ref で、本体の story の後に並ぶ。
- コンポーネントの状態の例には、コンポーネントの文書のそのコンポーネントの節に並べた状態を、全て story にする。
- MDX と story に、デザインシステムの文書の規則の本文を写さない。原則の ID と、規則を持つ文書の節の名前で指す。
  - 写した文は、規則を直すたびに合わせ直すことになり、合わせ忘れると 2 つの規則が食い違う。
- `packages/ui` の story は、Vitest のブラウザのテストとして動き、a11y のアドオンの違反でテストが失敗する（`.storybook/preview.ts` の `a11y.test`）。画面のカタログの story は、a11y のアドオンのテストに載らない。

## 題の決め方

題（story の title）は、ファイルの配置先から機械的に決め、story を作るときに分類を判断しない。

| 配置先                                                                   | 題                                                                                                    |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `packages/ui/src/docs/<名前>.mdx`                                        | `はじめに/<名前>`                                                                                     |
| `packages/ui/src/tokens/<名前>.mdx`                                      | `トークン/<名前>`                                                                                     |
| `packages/ui/src/base/<名前>/`                                           | `コンポーネント/Base/<名前>`                                                                          |
| `packages/ui/src/case/<名前>/`                                           | `コンポーネント/Case/<名前>`                                                                          |
| `packages/ui/src/patterns/<名前>.*`                                      | `パターン/<名前>`                                                                                     |
| `apps/corporate-site/src/components/sections/<section>/<名前>.stories.*` | `Sections/<Section>/<名前>`。`<Section>` は、ディレクトリの名前（kebab-case）を PascalCase にしたもの |
| `apps/corporate-site/src/components/common/<名前>.stories.*`             | `Common/<名前>`                                                                                       |

- 画面のカタログの題は、story の VRT の baseline のファイル名を変えないため、`画面/` を前に付けない。サイドバーでは、composition の ref の名前（画面）の下に並ぶ。
- story の VRT の baseline のファイル名は、story の id から決まる。日本語の題の id は日本語のまま残り、ファイル名は NFC の UTF-8 になる（例: `コンポーネント-base-button--default.png`）。

## カタログに載せてよいもの

カタログは GitHub Pages に公開し、誰でも開ける。story と MDX には、コンポーネント、公開のサイトと同じ掲載の内容、ダミーの値だけを載せる。

- 人の名前と組織の名前は、ダミーの値にする。実際の画面やデータベースからコピーしない。
- API を呼ぶ例を作らない。データは例の中か、ダミーのデータのファイルから渡す。
- カタログの原稿に、URL、ホスト名、シークレットを書かない。
  - この規則は story と MDX だけに当てはまる。デザインシステムの文書と画面仕様書からカタログへのリンクは、`context/project.yml` の `design_system.catalog_url` で書く。
