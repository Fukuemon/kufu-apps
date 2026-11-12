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
- ADR-0012 がデザインの基準を「実装と Storybook」と定めているので、Storybook の story が見た目の回帰を確認する対象として最も自然である。
  - ADR-0012: [デザインの基準を実装（コードと Storybook）にし、Pencil を廃止する](0012-design-source-of-truth-implementation.md)
- 決定のときの数は次のとおり。
  - story は `packages/ui` が 47、`apps/corporate-site` が 34 の計 81。`*.stories.*` のファイルの数 29 とは別に数える。
  - route は `/`、`/products`、`/contact` の 3 つ。
- **storycap は Storybook 10 に追いついていない。**
  - peer dependency は `^7 || ^8` で、最後の公開は 2024-09、内部は puppeteer-core 9（2021）である。
  - addon を登録できず simple mode に固定されるので、**story ごとの設定（`parameters.screenshot`）が使えない**。
  - Storybook の内部の API（`__STORYBOOK_PREVIEW__.storyStoreValue`）に依存しており、Storybook を上げると、エラーを出さずに動かなくなる。
- **baseline の量は、外部のストレージを要さない。**
  story の側は 81 枚で 2.94MB だった。
  すでにリポジトリの Git で管理している route の側の baseline は 6 枚で 5.60MB あり、story の側の方が小さい。
- **reg-suit の baseline の解決が不安定である。**
  `reg-keygen-git-hash-plugin` は、コミットのグラフのヒューリスティックで分岐点を決める。
  使い捨てのブランチを作って消しただけで、解決先が `718bdd93` から `12cdee1` へ変わった。
  比較が成り立たないまま**全 81 枚が `new` 扱いになり、チェックが緑になった**。
  差分が 0 の場合と区別できない。
- storycap には後継の `storycap-testrun` がある。
  Storybook 9 と 10 の公式のテストの基盤（`@storybook/test-runner`、`@storybook/addon-vitest`）に載る形で保守されている。

## Decision

- VRT を、unit test、play、E2E と並ぶ**独立したテストの種類**として位置づける。
- 撮る手段は、**2 系統を併用する**。
  - **route の側**は、Playwright の `toHaveScreenshot` で撮る。
    - 対象は 3 つの route を desktop と mobile の 2 つの viewport で撮った 6 枚にする。
- route の側はリポジトリ（Git で管理）に置く。
- **story の側の撮影を `storycap-testrun` へ移す。**
  Storybook ごとに載せ方を変える。
  - `packages/ui`（React Vite）は、`@storybook/addon-vitest` と `@storycap-testrun/browser` に載せる。
  - `apps/corporate-site`（Astro）は、`@storybook/test-runner` と `@storycap-testrun/node` に載せる。
  - Astro の Storybook の framework はコミュニティ製で、addon-vitest が求める Vite の公式の renderer に含まれないため、1 つに揃えられない。
  - 対象は 81 の story にする。fixture の story は対象にしない。
  - 撮る viewport はデフォルトの 1 種類にする。
  - Storybook は `@kufu/ui` と `@kufu/corporate-site` の 2 つのインスタンスがあるので、それぞれで撮り、比べる対象にまとめる。
- **baseline をリポジトリの Git で管理し、比較を `reg-cli` で行う。**
  外部のストレージと reg-suit のキーの解決を使わない。
  route の側と、保管の方式が揃う。
- **story の側の撮影と判定を、CI だけで行う。**
  baseline の基準は CI（ubuntu-latest、amd64）で撮った画像にし、撮り直しは `workflow_dispatch` から行う。
  - ADR-0016: [CI とローカルのフックの分担](0016-ci-local-hook-responsibility.md)
- **許す差分は 0（完全一致）を初期値にする。**
  flake が測られたら、測った値を上回る最小の値まで緩める。
- **差分が出たら、CI を失敗させる。**
  - ADR-0016: [CI とローカルのフックの分担](0016-ci-local-hook-responsibility.md)
- 環境の違いによる恒常的な差分には、閾値を上げることでも失敗にしないことでもなく、**原因の要素をマスクし、撮る環境を固定する**ことで最初に対処する。
  閾値を緩めることと required checks から外すことは、その後の手段にする。
  required checks から外すかは、利用者が判断する。

## Considered Options

### 2 系統と許す差分

| 選択肢                                                                                                                                                                    | 強み                                                                                                                                                        | 弱み                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **採用:** story の側を `storycap-testrun` と `reg-cli` で、route の側を Playwright の `toHaveScreenshot` で撮る 2 系統を併用し、許す差分を 0 にして差分で CI を失敗させる | デザインの基準（Storybook）と確認する対象が一致する。ページ全体の崩れも story 単位の崩れも検出できる                                                        | 実行の仕組みと baseline が 2 系統になり、保守する対象が増える。許す差分 0 は、環境の差が出たときに初めの対応の手間が大きい                                                     |
| Playwright の `toHaveScreenshot` だけで統一する                                                                                                                           | 実行の仕組みと baseline が 1 系統に収まり、保守の手間が小さい。外部のストレージが要らず、baseline を Git で管理するので差分が pull request のレビューに載る | story 単位の撮影を素直に書けず、ADR-0012 が定めるデザインの基準（Storybook）をそのまま対象にできない。ページを story にして 1 系統へ寄せる案は、実装の手間と二重の管理が生じる |
| reg-suit と storycap だけで統一する                                                                                                                                       | story 単位で最も広く網羅できる                                                                                                                              | storycap は story しか撮れず、ページ全体のレイアウトの合成や `globals.css` による崩れを捉えられない                                                                            |
| 許す差分に、最初から小さい閾値（差分のピクセルの比 0.1% など）を置く                                                                                                      | 導入した直後の flake への対応の手間が下がる                                                                                                                 | 撮る環境を固定している前提では、小さな崩れを見逃す副作用の方が大きい                                                                                                           |
| VRT のジョブを required status checks から外して運用する                                                                                                                  | 導入した直後のノイズで開発が止まらない                                                                                                                      | 赤を放っておく習慣がつくと VRT が使われなくなり、許す差分 0 という決定が実質的に意味を失う                                                                                     |

### story の側の撮る手段と baseline の置き場

| 選択肢                                                                                    | 強み                                                                                                     | 弱み                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **採用:** 撮影を `storycap-testrun` に移し、baseline を Git で管理して `reg-cli` で比べる | Storybook の公式のテストの基盤に載り、Storybook の更新に追いつける。外部のストレージと資格情報が要らない | リポジトリが大きくなる。撮影の基盤が Storybook ごとに 2 つになる。テストランナーが 2 種類になる                                                                                                                                                        |
| storycap のまま保つ                                                                       | 変更が要らない                                                                                           | Storybook 10 で simple mode に固定され、story ごとの設定が使えない。避けるには撮影のスクリプトに story の名前を直接書く必要があり、story の名前を変えると知らせずに対象から外れる。Storybook を上げると内部の API への依存で動かなくなり、打つ手がない |
| baseline を Cloudflare R2 に置く                                                          | リポジトリが大きくならない。差分のレポートを URL で共有できる                                            | reg-suit のキーの解決の不安定さは、置き場を変えても残る。別に `reg-simple-keygen-plugin` などで対処する必要がある。story の側の VRT を CI で動かすのが #47 の完了を待つ                                                                                |
| story の側も Playwright の `toHaveScreenshot` へ寄せて 1 系統にする                       | 撮影が要素の bounding box に一致し、余白が出ない。撮影が最も速い（81 枚で 49 秒）                        | Storybook の `index.json` を読んで story を列挙する独自のコードを抱える。Storybook の公式の基盤から外れる。高さ 0 の story（空のカルーセル）を撮れない                                                                                                 |
| `reg-actions`（GitHub Actions の artifact）を使う                                         | 外部のストレージもリポジトリが大きくなることも避けられる。pull request のコメントに差分の画像が出る      | CI 専用で、ローカルで比べられない。artifact の保持の期間を過ぎると baseline が消える                                                                                                                                                                   |

## Consequences

### Positive

- `components.css` を colocation で移す作業を、差分が 0 であることを完了の条件にして安全に進められる。
- コンテンツの改修（文言の差し替えなど）でも、意図しないレイアウトの崩れを検出できる。
- デザインの基準（Storybook）と、確認する対象が一致する。
- Storybook の公式のテストの基盤に載るので、Storybook の更新に追いつける。
- story ごとの設定を story のファイルの側に置ける。
  撮影のスクリプトが story の名前を知らなくてよい。
- 外部のストレージと資格情報が要らなくなり、**story の側の VRT が #47 に依存しなくなる**。
- 撮影が速くなった。storycap では 171 秒、`storycap-testrun` では 25 秒だった。

### Negative

- 実行の仕組みと baseline が 2 系統になり、保守する対象が増える。
- 許す差分 0 は、環境の差が出たときに初めの対応の手間が大きい。
- リポジトリが約 3MB 増える。
  story を足すたびに増え、PNG は差分の圧縮が働かない。
  - 撮り直すたびに、古い baseline が履歴に残る。
    測ったところ、PNG の blob は 212 個、17.8MB に達し、`.git` は 54MB だった。
  - 保管の方式を見直す論点は #47 で扱う。
- 撮影の基盤が、Storybook ごとに 2 つになる。
  Astro が addon-vitest に対応するまで解消しない。
- `@storybook/test-runner` は Jest を持ち込む。
  このリポジトリの単体テストは Vitest なので、テストランナーが 2 種類になる。
- ローカルでは CI と描画が違うので、差分が出る。
  差分の確認は CI を待つことになる。
