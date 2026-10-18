# ADR-0018: story の側の VRT を Storybook の公式のテストの基盤に載せ、baseline をリポジトリで管理する

## Status

承認

## Context

ADR-0015 は、story の側の VRT を storycap と reg-suit で組み、baseline を S3 互換のストレージに置くと決めた。  
実装の途中で測った結果、その前提が 2 つとも成り立たなかった。  
ADR-0015: [VRT を story と route の 2 系統で導入する](0015-visual-regression-testing-policy.md)

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

- **story の側の撮影を `storycap-testrun` へ移す。**
  Storybook ごとに載せ方を変える。
  - `packages/ui`（React Vite）は、`@storybook/addon-vitest` と `@storycap-testrun/browser` に載せる。
  - `apps/corporate-site`（Astro）は、`@storybook/test-runner` と `@storycap-testrun/node` に載せる。
  - Astro の Storybook の framework はコミュニティ製で、addon-vitest が求める Vite の公式の renderer に含まれないため、1 つに揃えられない。
- **baseline をリポジトリの Git で管理し、比較を `reg-cli` で行う。**
  外部のストレージと reg-suit のキーの解決を使わない。
  route の側と、保管の方式が揃う。
  - この判断は ADR-0022 で置き換えた。
  - ADR-0022: [VRT baseline を Cloudflare R2 へ移す](0022-vrt-baseline-on-r2.md)
- **story の側の撮影と判定を、CI だけで行う。**
  baseline の基準は CI（ubuntu-latest、amd64）で撮った画像にし、撮り直しは `workflow_dispatch` から行う。
  - ADR-0016: [CI とローカルのフックの分担](0016-ci-local-hook-responsibility.md)
- 許す差分を 0（完全一致）から始める方針は、ADR-0015 から変えない。

## Considered Options

| 選択肢                                                                                    | 強み                                                                                                     | 弱み                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **採用:** 撮影を `storycap-testrun` に移し、baseline を Git で管理して `reg-cli` で比べる | Storybook の公式のテストの基盤に載り、Storybook の更新に追いつける。外部のストレージと資格情報が要らない | リポジトリが大きくなる。撮影の基盤が Storybook ごとに 2 つになる。テストランナーが 2 種類になる                                                                                                                                                        |
| storycap のまま保つ                                                                       | 変更が要らない                                                                                           | Storybook 10 で simple mode に固定され、story ごとの設定が使えない。避けるには撮影のスクリプトに story の名前を直接書く必要があり、story の名前を変えると知らせずに対象から外れる。Storybook を上げると内部の API への依存で動かなくなり、打つ手がない |
| baseline を Cloudflare R2 に置く（ADR-0015 の構成を #47 の完了後に実行する）              | リポジトリが大きくならない。差分のレポートを URL で共有できる                                            | reg-suit のキーの解決の不安定さは、置き場を変えても残る。別に `reg-simple-keygen-plugin` などで対処する必要がある。story の側の VRT を CI で動かすのが #47 の完了を待つ                                                                                |
| story の側も Playwright の `toHaveScreenshot` へ寄せて 1 系統にする                       | 撮影が要素の bounding box に一致し、余白が出ない。撮影が最も速い（81 枚で 49 秒）                        | Storybook の `index.json` を読んで story を列挙する独自のコードを抱える。Storybook の公式の基盤から外れる。高さ 0 の story（空のカルーセル）を撮れない                                                                                                 |
| `reg-actions`（GitHub Actions の artifact）を使う                                         | 外部のストレージもリポジトリが大きくなることも避けられる。pull request のコメントに差分の画像が出る      | CI 専用で、ローカルで比べられない。artifact の保持の期間を過ぎると baseline が消える                                                                                                                                                                   |

## Consequences

### Positive

- Storybook の公式のテストの基盤に載るので、Storybook の更新に追いつける。
- story ごとの設定を story のファイルの側に置ける。
  撮影のスクリプトが story の名前を知らなくてよい。
- 外部のストレージと資格情報が要らなくなり、**story の側の VRT が #47 に依存しなくなる**。
- 撮影が速くなった。storycap では 171 秒、`storycap-testrun` では 25 秒だった。

### Negative

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
