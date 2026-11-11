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
| 枠         | `border`                               | `divider`              | 飾りの区切りの線。入力欄と押せるものの枠には使わない                                         |
| 枠         | `border-field`                         | `field`                | 入力欄と押せるものの枠。区切りの線には使わない                                               |
| 操作       | `primary`                              | `primary`              | 主のボタンの面、リンクの文字、選んだ状態                                                     |
| 操作       | `primary-soft`                         | `primary-soft`         | 暗い面の上の、主の色の文字                                                                   |
| 操作       | `action-strong`、`action-strong-hover` | なし（CSS の変数だけ） | 明るい面に置く、暗い色のリンクのボタンの面と、マウスを乗せたときの面                         |
| フォーカス | `focus-outline`                        | `focus-outline`        | フォーカスの表示の枠と outline                                                               |
| フォーカス | `focus-halo`                           | `focus-halo`           | フォーカスの表示の ring                                                                      |
| 状態       | `danger`                               | `danger`               | エラーの文字、枠、印                                                                         |

- 枠の 2 つは、ユーティリティの名前を `divider` と `field` にしている。テーマ変数をセマンティックトークンと同じ名前にすると、`border` が 2 回並ぶユーティリティの名前になるためである。
- 次の 12 個は、corporate-site の演出の線、影、色の付いた面で、CSS の変数だけで使う。値は `:root` で決まるので、暗い面の中で使っても暗い面の値にならない。
  - 方眼の線: `grid-line`、`grid-line-subtle`、`media-grid-line`、`media-ruler`
  - 影: `shadow-media`、`shadow-floating`
  - 主の色を薄くしたもの: `primary-glow`、`primary-hairline`、`primary-connector`、`primary-tint`
  - そのほか: `text-secondary-tint`（任意の印の面）、`scrollbar-thumb`（スクロールできる一覧のつまみ）
- プリミティブトークンの名前のユーティリティ（`text-kufu-gray-200` など）は、テーマ変数に無いので CSS にならない。corporate-site のフッターなどに残るものは、親の色で描かれている。

## テーマ

ダークモードは持たない。暗い面は、section の要素に `.surface-inverse` を付けて、その中の `surface-canvas`、`text`、`text-secondary`、`border` の参照先を替える。参照先は `packages/ui/src/tokens/surface-inverse.css` にある。

| テーマ   | 切り替える条件                     | コントラストのチェック                                                                                                                                                              |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 通常の面 | なし                               | `node scripts/check-contrast.mjs`                                                                                                                                                   |
| 暗い面   | 要素に `.surface-inverse` を付ける | `node scripts/check-contrast.mjs --root .surface-inverse ./packages/ui/src/tokens/primitive.css ./packages/ui/src/tokens/semantic.css ./packages/ui/src/tokens/surface-inverse.css` |

- 暗い面の条件では、暗い面に載る組だけを確認する。暗い面の中には白の面がなく、主の色の文字は `primary-soft` で書くためである。組は `scripts/check-contrast.mjs` の定数にある。

### コントラストのチェックから外している組

| 組                                                                                                   | 条件     | 比         | 外す理由                                                                                                               | 戻す時期                                               |
| ---------------------------------------------------------------------------------------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `border-field` と `surface`、`surface-canvas`                                                        | 通常の面 | 1.53、1.44 | 入力欄の枠が `gray-300` のままで、3:1 に届かない                                                                       | 枠を `gray-600` に替えるとき（#81）                    |
| `text-secondary` と `surface`、`surface-subtle`                                                      | 暗い面   | 3.69、3.20 | 暗い面の `text-secondary` は `gray-500` で、明るい面に載せると 4.5:1 に届かない。今の暗い面の中に明るい面はない        | `gray-500` の文字を暗い面だけで使うよう直すとき（#81） |
| `focus-outline` と `surface-canvas`                                                                  | 暗い面   | 2.80       | フォーカスの表示が `teal-600` で、暗い面（`gray-950`）の上で 3:1 に届かない。フッターのリンクのフォーカスの表示に出る  | DADS の黄と黒の 2 重の表示に替えるとき（#80）          |
| `danger` の組                                                                                        | 通常の面 | 未確認     | 値が `oklch()` で、チェックのスクリプトが色に解決できない                                                              | DADS の赤の 16 進の値に替えるとき（#81）               |
| `color-mix()` の式を持つ組（`overlay-panel`、`overlay-photo`、`text-ghost`、`surface-subtle-hover`） | 通常の面 | 未確認     | チェックのスクリプトが `color-mix()` を色に解決できない。`text-ghost` は、ウォーターマークの数字で読ませる文字ではない | 未定                                                   |

## 文字

<!-- 文字のユーティリティごとに、元にしたデザインシステムのスタイルの名前と、使う場面を書く -->

| ユーティリティ | 元のスタイル | 使う場面 |
| -------------- | ------------ | -------- |

## レイアウト、角丸、影、動き

<!-- 余白の段、本文の幅、ブレークポイント、角丸、影、動きの時間と緩急のユーティリティと使う場面を書く。元のデザインシステムがトークンを持たないものは、使うスタイルの仕組みの既定の段を書く。動きは、テーマ変数で止められない時間の値の段と、動きを減らす設定で止める場所（テーマ変数のファイル）も書く -->

| 種類 | ユーティリティ                           | 使う場面                                                                                   |
| ---- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| 角丸 | `rounded-4`                              | 4px。DADS の角丸。corporate-site のボタン、入力欄、主なパネル（`var(--radius-4)`）         |
| 角丸 | `rounded-8`                              | 8px。DADS の角丸                                                                           |
| 角丸 | `rounded-lg`、`rounded-md`               | `packages/ui` のコンポーネントが使う段。`rounded-lg` は 4px、`rounded-md` は 4px の 0.8 倍 |
| 動き | `--kufu-motion-*`、`--kufu-ease*` の変数 | 時間と緩急。`packages/ui/src/tokens/primitive.css` にある                                  |
