# ADR-0015: VRT（visual regression testing）を story と route の 2 系統で導入する

## Status

承認

## Context

- UI を変える作業を守るテストは、要素があることと文言を見る Playwright の smoke テストしかなかった。
  opacity やカスケードによる見た目の崩れを検出できない。
- ADR-0014 の styles の組み替えでは、出力の CSS のバイトの比較と目視で代えた。
  しかし、`apps/corporate-site/src/styles/components.css` を utility と cva へ colocation で移す残りの作業では、出力の CSS の形が必ず変わり、バイトの比較が使えない。
  見た目の回帰を検出する手段が、移す作業の前提になる。
  - ADR-0014: [corporate-site の component を section 単位のフラットな構成にする](0014-corporate-site-sections-architecture.md)
- ADR-0012 がデザインの基準を「実装と Storybook」と定めているので、Storybook の story が見た目の回帰を確かめる対象として最も自然である。
  - ADR-0012: [デザインの基準を実装（コードと Storybook）にし、Pencil を廃止する](0012-design-source-of-truth-implementation.md)
- 決定のときの数は次のとおり。
  - story は `packages/ui` が 47、`apps/corporate-site` が 34 の計 81。`*.stories.*` のファイルの数 29 とは別に数える。
  - route は `/`、`/products`、`/contact` の 3 つ。

## Decision

story の側の撮る手段（storycap と reg-suit）と baseline の置き場（S3 互換のストレージ）は、ADR-0018 が置き換えた。  
route の側の方針、対象、許す差分を 0 にすること、差分で CI を失敗させることは、この ADR の決定が有効である。  
ADR-0018: [story の側の VRT を Storybook の公式のテストの基盤に載せる](0018-story-vrt-on-storybook-test-integrations.md)

- VRT を、unit test、play、E2E と並ぶ**独立したテストの種類**として位置づける。
- 撮る手段は、**2 系統を併用する**。
  - **story の側**は、storycap で撮り、reg-suit で比べる。
    - 対象は 81 の story にする。fixture の story は対象にしない。
    - 撮る viewport は既定の 1 種類にする。
    - Storybook は `@kufu/ui` と `@kufu/corporate-site` の 2 つのインスタンスがあるので、それぞれで撮り、比べる対象にまとめる。
  - **route の側**は、Playwright の `toHaveScreenshot` で撮る。
    - 対象は 3 つの route を desktop と mobile の 2 つの viewport で撮った 6 枚にする。
- baseline の置き場は、系統ごとに分ける。
  route の側はリポジトリ（Git で管理）に、story の側は S3 互換のストレージに置く。
- **許す差分は 0（完全一致）を初期値にする。**
  flake が測られたら、測った値を上回る最小の値まで緩める。
- **差分が出たら、CI を失敗させる。**
  - ADR-0016: [CI とローカルのフックの分担](0016-ci-local-hook-responsibility.md)
- 環境の違いによる恒常的な差分には、閾値を上げることでも失敗にしないことでもなく、**原因の要素をマスクし、撮る環境を固定する**ことで最初に対処する。
  閾値を緩めることと required checks から外すことは、その後の手段にする。
  required checks から外すかは、利用者が判断する。

## Considered Options

| 選択肢                                                                                                                                                         | 強み                                                                                                                                                        | 弱み                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **採用:** story の側を storycap と reg-suit で、route の側を Playwright の `toHaveScreenshot` で撮る 2 系統を併用し、許す差分を 0 にして差分で CI を失敗させる | デザインの基準（Storybook）と確かめる対象が一致する。ページ全体の崩れも story 単位の崩れも検出できる                                                        | 実行の仕組みと baseline が 2 系統になり、保守する対象が増える。story の側は S3 互換のストレージを要する。許す差分 0 は、環境の差が出たときに初めの対応の手間が大きい           |
| Playwright の `toHaveScreenshot` だけで統一する                                                                                                                | 実行の仕組みと baseline が 1 系統に収まり、保守の手間が小さい。外部のストレージが要らず、baseline を Git で管理するので差分が pull request のレビューに載る | story 単位の撮影を素直に書けず、ADR-0012 が定めるデザインの基準（Storybook）をそのまま対象にできない。ページを story にして 1 系統へ寄せる案は、実装の手間と二重の管理が生じる |
| reg-suit と storycap だけで統一する                                                                                                                            | story 単位で最も広く網羅できる                                                                                                                              | storycap は story しか撮れず、ページ全体のレイアウトの合成や `globals.css` による崩れを捉えられない                                                                            |
| 許す差分に、最初から小さい閾値（差分のピクセルの比 0.1% など）を置く                                                                                           | 導入した直後の flake への対応の手間が下がる                                                                                                                 | 撮る環境を固定している前提では、小さな崩れを見逃す副作用の方が大きい                                                                                                           |
| VRT のジョブを required status checks から外して運用する                                                                                                       | 導入した直後のノイズで開発が止まらない                                                                                                                      | 赤を放っておく習慣がつくと VRT が使われなくなり、許す差分 0 という決定が実質的に意味を失う                                                                                     |

## Consequences

### Positive

- `components.css` を colocation で移す作業を、差分が 0 であることを完了の条件にして安全に進められる。
- コンテンツの改修（文言の差し替えなど）でも、意図しないレイアウトの崩れを検出できる。
- デザインの基準（Storybook）と、確かめる対象が一致する。

### Negative

- 実行の仕組みと baseline が 2 系統になり、保守する対象が増える。
- story の側は S3 互換のストレージを要し、運用する対象が増える。
- 許す差分 0 は、環境の差が出たときに初めの対応の手間が大きい。
