# ADR-0022: corporate-site は @kufu/ui のコンポーネントを静的に描画して使い、client:\* の island は操作が要るものに限る

## Status

承認

## Context

`apps/corporate-site` で、React のコンポーネントをどう使い、どこから `client:*`（React の island）にするかを決める必要がある。

- `apps/corporate-site` は、Astro の静的な生成（`output: "static"`）だけで作る。`astro.config.mjs` の integrations に `@astrojs/react` がある。
- Astro は React のコンポーネントもビルドのときに静的な HTML へ描画し、`client:*` を付けない限りクライアントの JavaScript を配らない。性能のコストが生じるのは、`client:*` を付けて island にし、React のランタイムを配ってハイドレーションするときだけである。
- `packages/ui` のコンポーネントは、React とネイティブの HTML の要素で書く。shadcn と Base UI は、依存から外した。表示だけのコンポーネントは `client:*` なしで静的に描き、ネイティブの要素で足りない操作の UI は、そのコンポーネントだけライブラリを比べて決め、入れたコンポーネントを island にする。
  - ADR-0028: [packages/ui のコンポーネントを、ネイティブの要素と clsx で書いた Base と Case にし、shadcn と Base UI を外す](0028-ui-components-native-elements.md)
- island の方針を決めた ADR-0008 は、決定の 1、3、5 が、shadcn のコンポーネントと Radix の primitive を名指ししている。どちらも、今の `packages/ui` には無い。
- ADR-0008 の決定の 6 は、Design Doc のガードレール「Unnecessary Client JS Count」を指している。この指標は、今は [PRD](../PRD.md#success-metrics) の悪化させない指標「不要なクライアントの JavaScript の数」にあり、Design Doc には無い。数値の上限は無く、pull request のレビューで見つけた件数で数える。
- `apps/corporate-site/src` に `client:*` は 0 件で、React のコンポーネントのファイル（`.tsx`）も無い。`@kufu/ui` のコンポーネントは、3 つの `.astro`（`ContactCtaLink.astro`、`CompanySection.astro`、`ContactSection.astro`）が `client:*` なしで使う。
- 操作の UI は、`.astro` と素の script で作っている。モバイルのナビの開閉（`SiteHeader.astro`）、カルーセル（`FeaturedCategoryCarousel.astro`）、商品の一覧の検索と開閉（`ProductsDetailSection.astro`）である。
- 問い合わせフォームは、全体を 1 つの React の island にし、ディレクティブを `client:visible` にする設計である。
  - 出典: [問い合わせフォームの Design Doc](../design/features/contact-form/DesignDoc.md)

## Decision

1. **表示だけの UI は、`@kufu/ui` のコンポーネントを静的に描画して直接使う。**
   - `Button`、`LinkButton`、`Tag`、`DefinitionRow`、`Divider` のように、クライアントの状態を持たない UI は、`@kufu/ui` のコンポーネントを `.astro` の中で **`client:*` なしで**使う。
   - ビルドのときに HTML になり、JavaScript は配らない。
   - `.astro` 版を別に作らず、コンポーネントの定義を `@kufu/ui` の 1 か所に保ち、二重の実装を避ける。
2. **`@astrojs/react` は入れてよい。**
   - integration を入れること自体には、ランタイムのコストがない。island がなければ JavaScript は配られない。
   - 最初の island が要る前でも、静的な描画のために入れてよい。
3. **`client:*` の island は、本当に操作が要るものに限る。**
   - island にするのは、問い合わせフォームと、ネイティブの要素で足りない操作の UI のためにライブラリを入れたコンポーネントだけにする。
   - **素の script で足りる開閉のトグルは island にしない。** モバイルのナビの開閉は island にせず、全ページに共通の header に React のランタイムを載せない。
4. **island のデフォルトのディレクティブは遅延の系統にする。**
   - `client:visible` か `client:idle` をデフォルトにする。
   - `client:load` は、above-the-fold で即時の操作が要る箇所だけで使う。
5. **ライブラリを入れた操作のコンポーネントを、`client:*` なしで静的に描画しない。**
   - 静的に描画すると、見た目だけが出て動かない。必ず island にする。
6. **`client:*` の総数を予算として管理する。**
   - [PRD](../PRD.md#success-metrics) の悪化させない指標「不要なクライアントの JavaScript の数」で監視し、増えたときは island にした妥当性をレビューする。

この決定は、ADR-0008 を置き換える。

## Considered Options

| 選択肢                                                                                                            | 強み                                                                                                               | 弱み                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** 表示だけの UI は `@kufu/ui` のコンポーネントを静的に描画し、`client:*` の island は操作が要るものに限る | 表示だけの UI が JavaScript なしで `@kufu/ui` を再利用でき、二重の実装が起きない。性能のコストが island に限られる | `@astrojs/react` の依存とビルドのときの React の SSR が加わる。ライブラリを入れた操作のコンポーネントを静的に描画する誤りが起こりうる       |
| `.astro` で `@kufu/ui` のコンポーネントを作り直す（React を一切使わない）                                         | クライアントの JavaScript がない点は同じ                                                                           | `@kufu/ui` のコンポーネントと `.astro` 版の二重の実装が生まれ、`@kufu/ui` とずれる                                                          |
| すべてを React の island（`client:load`）で作る                                                                   | 開発者の体験が単純                                                                                                 | 表示だけの UI にまで React のランタイムを配り、性能の予算を圧迫する。corporate-site の主な価値である高速な静的配信に反する                  |
| `@astrojs/react` を入れず、Astro だけで完結させる                                                                 | 一見、性能の面で安全                                                                                               | `@kufu/ui` のコンポーネントを corporate-site で再利用できず、二重の実装を強いる。静的な描画にランタイムのコストがない以上、過剰な制約である |

## Consequences

### Positive

- 表示だけの UI が JavaScript なしのまま、`@kufu/ui` を 1 か所の定義として再利用でき、二重の実装が起きない。
- 性能のコストが `client:*` の island に限られ、予算の管理の対象がはっきりする。
- island の方針が、`packages/ui` に無いライブラリの名前に依らなくなる。ライブラリを入れ替えても、方針を書き直さずに済む。

### Negative

- `@astrojs/react` の依存と、ビルドのときの React の SSR が加わる。ランタイムのコストはないが、ビルドはわずかに増える。
- ライブラリを入れた操作のコンポーネントを静的に描画する誤りが起こりうる。Decision の 5 で防ぐ。
- island にする対象を、名前の一覧で示さなくなる。対象に当たるかは、ライブラリを入れるときの比較とレビューで判断する。
- `client:*` を乱用する余地があるため、指標での監視が前提になる。
