# Kufu のデザインシステムのトークン

この文書は、[Kufu のデザインシステム](../DESIGN.md)の一部である。

<!-- 冒頭の 1 文に、この文書がデザインシステムの文書（DESIGN.md）の一部で、セマンティックトークン、文字、レイアウトの使い方の規則を持つことを書き、DESIGN.md へリンクする。値は書かず、DESIGN.md の「知りたいことごとの参照先」の表が指すコードを参照先にする。元にしたデザインシステムの指針から外れる規則は、その規則の隣に、指針が求めることと外れる理由を書く -->

## 色

画面のコードでは、テーマ変数のユーティリティ（`bg-surface`、`text-text-secondary` など）で書く。`packages/ui` の外の CSS で色を書くときは、セマンティックトークンの変数（`var(--kufu-color-primary)`）で書く。名前と、どのプリミティブトークンを指すかは `packages/ui/src/tokens/semantic.css` にある。

| 種類       | セマンティックトークン                 | ユーティリティの名前   | 使う場面                                                                                     |
| ---------- | -------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| 面         | `surface-canvas`                       | `surface-canvas`       | 画面の背景。暗い面（`.surface-inverse`）の中では暗い面の背景                                 |
| 面         | `surface`                              | `surface`              | カード、パネル、入力欄の面                                                                   |
| 面         | `surface-subtle`                       | `surface-subtle`       | 副の面。副のボタン、強調しない帯、hover の面                                                 |
| 面         | `surface-subtle-hover`                 | `surface-subtle-hover` | 副のボタンにマウスを乗せたときの面                                                           |
| 面         | `surface-media`                        | `surface-media`        | 写真と図を置く枠の、画像が読み込まれる前の面                                                 |
| 面         | `overlay-panel`                        | `overlay-panel`        | 写真の上に置く、文字を載せるパネル                                                           |
| 面         | `overlay-photo`                        | `overlay-photo`        | 写真の上に重ねる色。`bg-overlay-photo` は background-color と background-image の 2 枚で塗る |
| 文字       | `text`                                 | `text`                 | 本文と見出し。暗い面の中では白                                                               |
| 文字       | `text-secondary`                       | `text-secondary`       | 補足の文字                                                                                   |
| 文字       | `text-inverse`                         | `text-inverse`         | `primary` と `action-strong` の面の上の文字、写真の上の文字                                  |
| 文字       | `text-inverse-secondary`               | なし（CSS の変数だけ） | 暗い面の上のリンクの文字                                                                     |
| 文字       | `text-ghost`                           | `text-ghost`           | ウォーターマークの数字。読ませる文字には使わない                                             |
| 文字       | `text-secondary-tint`                  | `text-secondary-tint`  | 任意の印の面                                                                                 |
| 枠         | `border`                               | `divider`              | 飾りの区切りの線。入力欄と押せるものの枠には使わない                                         |
| 枠         | `border-field`                         | `field`                | 入力欄と押せるものの枠。区切りの線には使わない                                               |
| 操作       | `primary`                              | `primary`              | 主のボタンの面、リンクの文字、選んだ状態                                                     |
| 操作       | `primary-soft`                         | `primary-soft`         | 暗い面の上の、主の色の文字                                                                   |
| 操作       | `primary-tint`                         | `primary-tint`         | 必須の印の面                                                                                 |
| 操作       | `action-strong`、`action-strong-hover` | なし（CSS の変数だけ） | 明るい面に置く、暗い色のリンクのボタンの面と、マウスを乗せたときの面                         |
| フォーカス | `focus-outline`                        | `focus-outline`        | フォーカスの表示の黒の outline。`focus-ring` が使う。明るい面で見分けられる                  |
| フォーカス | `focus-halo`                           | `focus-halo`           | フォーカスの表示の Yellow-300 の影。`focus-ring` が使う。暗い面で見分けられる                |
| 状態       | `danger`                               | `danger`               | エラーの文字、枠、印                                                                         |

- 枠の 2 つは、ユーティリティの名前を `divider` と `field` にしている。テーマ変数をセマンティックトークンと同じ名前にすると、`border` が 2 回並ぶユーティリティの名前になるためである。
- 次の 10 個は、corporate-site の演出の線、影、色の付いた面で、CSS の変数だけで使う。値は `:root` で決まるので、暗い面の中で使っても暗い面の値にならない。
  - 方眼の線: `grid-line`、`grid-line-subtle`、`media-grid-line`、`media-ruler`
  - 影: `shadow-media`、`shadow-floating`
  - 主の色を薄くしたもの: `primary-glow`、`primary-hairline`、`primary-connector`
  - そのほか: `scrollbar-thumb`（スクロールできる一覧のつまみ）
- プリミティブトークンの名前のユーティリティ（`text-kufu-gray-200` など）は、テーマ変数に無いので CSS にならない。corporate-site のフッターなどに残るものは、親の色で描かれている。

## フォーカス

操作できる要素には、`focus-ring` のユーティリティだけを付ける（`FOCUS-ONE`）。`theme.css` にあり、`:focus-visible` のときに、次の 2 重の表示を出す。

| 部分       | 値                                           | トークン        | 見分けられる面                            |
| ---------- | -------------------------------------------- | --------------- | ----------------------------------------- |
| outline    | 黒、太さ 4px、要素から 2px 離す              | `focus-outline` | 明るい面（`surface` の上で 21:1）         |
| 影（ring） | Yellow-300、太さ 2px。outline との間を埋める | `focus-halo`    | 暗い面（`surface-canvas` の上で 12.45:1） |

- 色と太さは DADS のボタンのフォーカスの表示と同じで、DADS が変えないとする要件である。コンポーネントごとに変えない。
- 表示は要素の外へ 6px 広がる（outline 4px と離す 2px）。祖先の `overflow` と画面の端で切れないかは、要素を置くときに確認する。
- 暗い面の中では、黒の outline は `surface-canvas` に 1.18:1 で見分けられず、黄の影が表示を担う。明るい面では、黄の影は `surface` に 1.43:1 で見分けにくく、黒の outline が担う。このため、コントラストのチェックの組は、明るい面を `focus-outline`、暗い面を `focus-halo` にしている。
- `focus-outline` と `focus-halo` は、`focus-ring` のほかに使わない。入力欄の枠の色を替える、`ring` を足すといった書き方は `FOCUS-ONE` のチェックが止める。エラーの状態の `aria-invalid:ring-*` は止めない（#81）。

## テーマ

ダークモードは持たない。暗い面は、section の要素に `.surface-inverse` を付けて、その中の `surface-canvas`、`text`、`text-secondary`、`border` の参照先を替える。参照先は `packages/ui/src/tokens/surface-inverse.css` にある。

| テーマ   | 切り替える条件                     | コントラストのチェック                                                                                                                                                              |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 通常の面 | なし                               | `node scripts/check-contrast.mjs`                                                                                                                                                   |
| 暗い面   | 要素に `.surface-inverse` を付ける | `node scripts/check-contrast.mjs --root .surface-inverse ./packages/ui/src/tokens/primitive.css ./packages/ui/src/tokens/semantic.css ./packages/ui/src/tokens/surface-inverse.css` |

- 暗い面の条件では、暗い面に載る組だけを確認する。暗い面の中には白の面がなく、主の色の文字は `primary-soft` で書くためである。組は `scripts/check-contrast.mjs` の定数にある。

### コントラストのチェックから外している組

| 組                                                                                                                                          | 条件     | 比         | 外す理由                                                                                                               | 戻す時期                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `border-field` と `surface`、`surface-canvas`                                                                                               | 通常の面 | 1.53、1.44 | 入力欄の枠が `gray-300` のままで、3:1 に届かない                                                                       | 枠を `gray-600` に替えるとき（#81）                    |
| `text-secondary` と `surface`、`surface-subtle`                                                                                             | 暗い面   | 3.69、3.20 | 暗い面の `text-secondary` は `gray-500` で、明るい面に載せると 4.5:1 に届かない。今の暗い面の中に明るい面はない        | `gray-500` の文字を暗い面だけで使うよう直すとき（#81） |
| `danger` の組                                                                                                                               | 通常の面 | 未確認     | 値が `oklch()` で、チェックのスクリプトが色に解決できない                                                              | DADS の赤の 16 進の値に替えるとき（#81）               |
| `color-mix()` の式を持つ組（`overlay-panel`、`overlay-photo`、`text-ghost`、`surface-subtle-hover`、`primary-tint`、`text-secondary-tint`） | 通常の面 | 未確認     | チェックのスクリプトが `color-mix()` を色に解決できない。`text-ghost` は、ウォーターマークの数字で読ませる文字ではない | 未定                                                   |

## 文字

<!-- 文字のユーティリティごとに、元にしたデザインシステムのスタイルの名前と、使う場面を書く -->

文字の大きさは、下の文字のスタイルのユーティリティで書く。1 つのユーティリティが、文字の大きさと行高を持つ。Tailwind のデフォルトの文字の大きさは、`theme.css` で消してある。

- 名前の数字は、DADS の文字の大きさの段（px）である。見出しの大きさを画面の幅で替えるときは、`text-heading-32 md:text-heading-36 lg:text-heading-45` のように、ブレークポイントごとに段の名前を替える。画面の幅で滑らかに変わる大きさ（`clamp()`）は使わない。
- 書体と太さは、文字のスタイルに含めない。`font-serif`、`font-mono`、`font-semibold` などと組み合わせる。
- 同じ要素に `leading-*` を書くと、文字のスタイルの行高より `leading-*` が優先される。
- `packages/ui` の外の CSS で書くときは、`var(--kufu-text-<名前>-font-size)` と `var(--kufu-text-<名前>-line-height)` で書く。

| ユーティリティ                                                                                | 元のスタイル                      | 使う場面                                                                                                             |
| --------------------------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `text-display-57`、`text-display-48`                                                          | DADS の 57px と 48px、行高 140%   | ページの最初の見出し（`h1`）の、広い画面の段                                                                         |
| `text-heading-45`、`text-heading-36`                                                          | DADS の 45px と 36px、行高 140%   | section の見出しの広い画面の段と、`h1` の狭い画面の段                                                                |
| `text-heading-32`、`text-heading-28`、`text-heading-26`、`text-heading-24`、`text-heading-22` | DADS の 32px から 22px、行高 150% | section の見出しの狭い画面の段と、小見出し                                                                           |
| `text-heading-20`                                                                             | DADS の 20px、行高 150%           | カードと一覧の項目の見出し                                                                                           |
| `text-heading-17`、`text-heading-16`                                                          | DADS の 17px と 16px、行高 160%   | 小さいカードの見出しと、ブランド名                                                                                   |
| `text-body`                                                                                   | DADS の 16px、行高 170%           | 本文とリード                                                                                                         |
| `text-body-dense`                                                                             | DADS の 16px、行高 130%           | 入力欄の値と、行の詰まった一覧                                                                                       |
| `text-label`                                                                                  | DADS の 16px、行高 100%           | ボタン、リンク、フォームの見出し、ナビゲーションのような操作の文字                                                   |
| `text-caption`                                                                                | DADS の 14px、行高 170%           | 補足、誤りの文、件数、連絡先の補足                                                                                   |
| `text-eyebrow`                                                                                | Kufu の 12px、行高 140%           | 見出しに添える mono の欧文と数字の短いラベルと、番号のラベル。文、操作の文字、和文の補足には使わない（下の外れる点） |
| `text-watermark-140`、`text-watermark-120`                                                    | Kufu の 140px と 120px、行高 100% | ウォーターマークの数字。読ませる文字ではない                                                                         |

- DADS から外れる点: `text-eyebrow` の 12px。DADS は 14 CSS px 未満を原則として認めない。見出しに添える欧文と数字の短いラベルで、同じ内容を見出しが伝えるため、12px の 1 つのスタイルだけを置く（[ADR-0030](../../../docs/adr/0030-keep-kufu-identity.md)）。12px が `eyebrow` のほかに使われていないかは、チェックでは見分けられないので、レビューで見る。
- DADS から外れる点: `text-watermark-*` は、DADS の段に無い大きさである。面の飾りで、支援技術から隠す。

## レイアウト、角丸、影、動き

<!-- 余白の段、本文の幅、ブレークポイント、角丸、影、動きの時間と緩急のユーティリティと使う場面を書く。元のデザインシステムがトークンを持たないものは、使うスタイルの仕組みの既定の段を書く。動きは、テーマ変数で止められない時間の値の段と、動きを減らす設定で止める場所（テーマ変数のファイル）も書く -->

| 種類 | ユーティリティ                           | 使う場面                                                                                   |
| ---- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| 角丸 | `rounded-4`                              | 4px。DADS の角丸。corporate-site のボタン、入力欄、主なパネル（`var(--radius-4)`）         |
| 角丸 | `rounded-8`                              | 8px。DADS の角丸                                                                           |
| 角丸 | `rounded-lg`、`rounded-md`               | `packages/ui` のコンポーネントが使う段。`rounded-lg` は 4px、`rounded-md` は 4px の 0.8 倍 |
| 動き | `--kufu-motion-*`、`--kufu-ease*` の変数 | 時間と緩急。`packages/ui/src/tokens/primitive.css` にある                                  |
