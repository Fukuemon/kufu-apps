# Kufu のデザインシステムのトークン

この文書は、[Kufu のデザインシステム](../DESIGN.md)の一部である。セマンティックトークン、文字、レイアウトの使い方の規則を持つ。値は、DESIGN.md の「知りたいことごとの参照先」の表が指すコードを参照先にする。層の分け方の判断は [ADR-0018](../../../docs/adr/0018-design-tokens-three-layers.md) にある。

## 色

画面のコードでは、テーマ変数のユーティリティ（`bg-surface`、`text-text-secondary` など）で書く。`packages/ui` の外の CSS で色を書くときは、セマンティックトークンの変数（`var(--kufu-color-primary)`）で書く。名前と、どのプリミティブトークンを指すかは `packages/ui/src/tokens/semantic.css` にある。

| 種類       | セマンティックトークン                 | ユーティリティの名前     | 使う場面                                                                                                                                                                                      |
| ---------- | -------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 面         | `surface-canvas`                       | `surface-canvas`         | 画面の背景。暗い面（`.surface-inverse`）の中では暗い面の背景                                                                                                                                  |
| 面         | `surface`                              | `surface`                | カード、パネル、入力欄の面                                                                                                                                                                    |
| 面         | `surface-subtle`                       | `surface-subtle`         | 副の面。副のボタン、強調しない帯、hover の面                                                                                                                                                  |
| 面         | `surface-subtle-hover`                 | `surface-subtle-hover`   | 副のボタンにマウスを乗せたときの面                                                                                                                                                            |
| 面         | `surface-media`                        | `surface-media`          | 写真と図を置く枠の、画像が読み込まれる前の面                                                                                                                                                  |
| 面         | `overlay-panel`                        | `overlay-panel`          | 写真の上に置く、文字を載せるパネル                                                                                                                                                            |
| 面         | `overlay-photo`                        | `overlay-photo`          | 写真の上に重ねる色。`bg-overlay-photo` は background-color と background-image の 2 枚で塗る                                                                                                  |
| 文字       | `text`                                 | `text`                   | 本文と見出し。暗い面の中では白                                                                                                                                                                |
| 文字       | `text-secondary`                       | `text-secondary`         | 補足の文字                                                                                                                                                                                    |
| 文字       | `text-inverse`                         | `text-inverse`           | `primary` と `action-strong` の面の上の文字、写真の上の文字                                                                                                                                   |
| 文字       | `text-inverse-secondary`               | `text-inverse-secondary` | 暗い面の上のリンクと補足の文字。`text-secondary` より明るく、暗い面で目立たせたい補足に使う                                                                                                   |
| 文字       | `text-ghost`                           | `text-ghost`             | ウォーターマークの数字。読ませる文字には使わない                                                                                                                                              |
| 文字       | `text-secondary-tint`                  | `text-secondary-tint`    | 任意の印の面                                                                                                                                                                                  |
| 枠         | `border`                               | `divider`                | 飾りの区切りの線。入力欄と押せるものの枠には使わない                                                                                                                                          |
| 枠         | `border-field`                         | `field`                  | 入力欄と押せるものの枠。区切りの線と、面の色には使わない。マウスを乗せた入力欄の枠は `text`                                                                                                   |
| 操作       | `primary`                              | `primary`                | 主のボタンの面、hover のリンクの文字、選んだ状態                                                                                                                                              |
| 操作       | `primary-soft`                         | `primary-soft`           | 暗い面の上の、主の色の文字                                                                                                                                                                    |
| 操作       | `primary-tint`                         | `primary-tint`           | 必須の印の面                                                                                                                                                                                  |
| 操作       | `action-strong`、`action-strong-hover` | `action-strong-hover`    | 明るい面に置く、暗い色のリンクのボタンの面と、マウスを乗せたときの面。`action-strong-hover` は `Button` と `LinkButton` の `default` の hover の面にも使う。`action-strong` は CSS の変数だけ |
| フォーカス | `focus-outline`                        | `focus-outline`          | フォーカスの表示の黒の outline。`focus-ring` が使う。明るい面で見分けられる                                                                                                                   |
| フォーカス | `focus-halo`                           | `focus-halo`             | フォーカスの表示の Yellow-300 の影。`focus-ring` が使う。暗い面で見分けられる                                                                                                                 |
| 状態       | `danger`                               | `danger`                 | エラーの文字、枠、印                                                                                                                                                                          |

- DADS から外れる点: 主の色（teal）と寒色のグレーは、DADS の階調の値でない。DADS は、キーカラーを同じ色相の階調から選ぶことを求める。Kufu の色を変えないために外れる。コントラストは、DADS の階調の指針に頼らず、`check-contrast.mjs` の組で確認する。色を足すときは、チェックの組も足す（[ADR-0025](../../../docs/adr/0025-kufu-identity-japanese-labels.md)）。
- DADS から外れる点: `text-ghost` のウォーターマークの数字は、面とのコントラストが低い。DADS は、文字を 4.5:1 以上にすることを求める。読ませる文字でない面の飾りで、支援技術から隠すため、外れる。
- 明るい面の section は、`surface-canvas`、`surface`、`surface-subtle` のどれかを面にする。section の面を替えて、まとまりの区切りとリズムを作る。フッターと、強い CTA の帯は、暗い面にする（「テーマ」）。暗い面の上の、主の色の文字は `primary-soft` で書く。
- 使っていない名前を残さない。名前を足すのは、使うコンポーネントか画面を足すときにする。誤りの面の色（`danger-surface`）は、使うコンポーネントが無いので置いていない。
- `danger` は、DADS のエラーの色のうち Error-2（Red-900）に当てている。DADS の実装例は、入力欄の誤りの枠に Error-1（Red-800）を使う。Error-1（Red-800）は、`surface-canvas` の上で 4.33、`surface-subtle` の上で 3.99 で、文字の 4.5:1 に届かない。
- 枠の 2 つは、ユーティリティの名前を `divider` と `field` にしている。テーマ変数をセマンティックトークンと同じ名前にすると、`border` が 2 回並ぶユーティリティの名前になるためである。
- 次の 5 個は、corporate-site の演出の線、影、色の付いた面で、CSS の変数だけで使う。値は `:root` で決まるので、暗い面の中で使っても暗い面の値にならない。
  - 影: `shadow-media`、`shadow-floating`
  - 主の色を薄くしたもの: `primary-hairline`、`primary-connector`
  - そのほか: `scrollbar-thumb`（スクロールできる一覧のつまみ）

## フォーカス

操作できる要素には、`focus-ring` のユーティリティだけを付ける（`FOCUS-ONE`）。`theme.css` にあり、`:focus-visible` のときに、次の 2 重の表示を出す。

| 部分       | 値                                           | トークン        | 見分けられる面                            |
| ---------- | -------------------------------------------- | --------------- | ----------------------------------------- |
| outline    | 黒、太さ 4px、要素から 2px 離す              | `focus-outline` | 明るい面（`surface` の上で 21:1）         |
| 影（ring） | Yellow-300、太さ 2px。outline との間を埋める | `focus-halo`    | 暗い面（`surface-canvas` の上で 12.45:1） |

- 色と太さは DADS のボタンのフォーカスの表示と同じで、DADS が変えないとする要件である。コンポーネントごとに変えない。
- 表示は要素の外へ 6px 広がる（outline 4px と離す 2px）。祖先の `overflow` と画面の端で切れないかは、要素を置くときに確認する。
- 暗い面の中では、黒の outline は `surface-canvas` に 1.18:1 で見分けられず、黄の影が表示を担う。明るい面では、黄の影は `surface` に 1.43:1 で見分けにくく、黒の outline が担う。このため、コントラストのチェックの組は、明るい面を `focus-outline`、暗い面を `focus-halo` にしている。
- `focus-outline` と `focus-halo` は、`focus-ring` のほかに使わない。フォーカスの変種で入力欄の枠の色を替える、`ring` を足すといった書き方は `FOCUS-ONE` のチェックが止める。
- 入力欄の誤りの状態は、枠の色（`aria-invalid:border-danger`）だけで示し、`ring` を足さない。`ring` は `box-shadow` で描くので、`focus-ring` の黄の影と重なる。

## テーマ

ダークモードは持たない。暗い面は、section の要素に `.surface-inverse` を付けて、その中の `surface-canvas`、`text`、`text-secondary`、`border` の参照先を替える。参照先は `packages/ui/src/tokens/surface-inverse.css` にある。

| テーマ   | 切り替える条件                     | コントラストのチェック                                                                                                                                                              |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 通常の面 | なし                               | `node scripts/check-contrast.mjs`                                                                                                                                                   |
| 暗い面   | 要素に `.surface-inverse` を付ける | `node scripts/check-contrast.mjs --root .surface-inverse ./packages/ui/src/tokens/primitive.css ./packages/ui/src/tokens/semantic.css ./packages/ui/src/tokens/surface-inverse.css` |

- 暗い面の中に、明るい面（`surface`、`surface-subtle`）を置かない。暗い面の `text-secondary` は `gray-500` で、明るい面の上では 4.5:1 に届かないためである。
- 暗い面の条件では、暗い面に載る組だけを確認する。暗い面の中に明るい面を置かず、主の色の文字は `primary-soft` で書くためである。組は `scripts/check-contrast.mjs` の定数にある。

### コントラストのチェックから外している組

| 組                                                                                                                                          | 条件     | 比         | 外す理由                                                                                                                      | 戻す時期                       |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `text-secondary` と `surface`、`surface-subtle`                                                                                             | 暗い面   | 3.69、3.20 | 暗い面の中に明るい面を置かない（「テーマ」）。暗い面の `text-secondary` は `gray-500` で、明るい面に載せると 4.5:1 に届かない | 暗い面の中に明るい面を置くとき |
| `color-mix()` の式を持つ組（`overlay-panel`、`overlay-photo`、`text-ghost`、`surface-subtle-hover`、`primary-tint`、`text-secondary-tint`） | 通常の面 | 未確認     | チェックのスクリプトが `color-mix()` を色に解決できない。`text-ghost` は、ウォーターマークの数字で読ませる文字ではない        | 未定                           |

## 文字

### 書体

書体は、次の 3 つのユーティリティで書く。読み込みは `@kufu/ui/fonts.css` が持つ。

| ユーティリティ | 書体                                    | 使う場面                                                                         |
| -------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| `font-serif`   | Noto Serif JP。見出しは 600 の太さ      | 見出し、経営理念、ブランド名                                                     |
| `font-sans`    | Noto Sans JP                            | 本文、リード、UI の文字、見出しの上の和文のラベル                                |
| `font-mono`    | Geist Mono。letter-spacing を広めにする | 番号、値の種類のラベル（Tel、Fax、E-mail）、連絡先の値。和文を含む文には使わない |

- DADS から外れる点: 見出しが明朝である。DADS は Noto Sans JP を勧める。明朝の見出しが、Kufu の信頼感の表現の中心であるため、外れる。本文と UI の文字は Noto Sans JP にする（[ADR-0025](../../../docs/adr/0025-kufu-identity-japanese-labels.md)）。
- DADS から外れる点: ラベルが Geist Mono である。DADS は、等幅の書体に Noto Sans Mono を勧める。欧文と数字のラベルの字形が、工業的な印象を作っているため、外れる。
- 今のコードは、必須と任意の印（`Tag` の `required` と `optional`）と、`DefinitionRow` の `compact` の見出しを、和文でも `font-mono` で出している。和文のラベルの書体の扱いは、[DESIGN.md](../DESIGN.md#決まっていない選択) の「決まっていない選択」にある。

### 文字のスタイル

文字の大きさは、下の文字のスタイルのユーティリティで書く。1 つのユーティリティが、文字の大きさと行高を持つ。Tailwind のデフォルトの文字の大きさは、`theme.css` で消してある。

- 名前の数字は、DADS の文字の大きさの段（px）である。見出しの大きさを画面の幅で替えるときは、`text-heading-32 md:text-heading-36 lg:text-heading-45` のように、ブレークポイントごとに段の名前を替える。画面の幅で滑らかに変わる大きさ（`clamp()`）は使わない。
- 書体と太さは、文字のスタイルに含めない。`font-serif`、`font-mono`、`font-semibold` などと組み合わせる。
- 同じ要素に `leading-*` を書くと、文字のスタイルの行高より `leading-*` が優先される。
- `packages/ui` の外の CSS で書くときは、`var(--kufu-text-<名前>-font-size)` と `var(--kufu-text-<名前>-line-height)` で書く。
  - 文字のスタイルの大きさと行高は、`semantic.css` にこの名前で置き、`theme.css` のテーマ変数はこの変数を参照する。[ADR-0018](../../../docs/adr/0018-design-tokens-three-layers.md) の層の表は、テーマ変数の文字がプリミティブトークンを直に参照するとしている。`packages/ui` の外の CSS は、チェックによりプリミティブトークンの名前を書けないので、セマンティックトークンの層を挟んでいる。

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

- DADS から外れる点: `text-eyebrow` の 12px。DADS は 14 CSS px 未満を原則として認めない。見出しに添える欧文と数字の短いラベルで、同じ内容を見出しが伝えるため、12px の 1 つのスタイルだけを置く（[ADR-0024](../../../docs/adr/0024-keep-kufu-identity.md)）。12px が `eyebrow` のほかに使われていないかは、チェックでは見分けられないので、レビューで見る。
- DADS から外れる点: `text-watermark-*` は、DADS の段に無い大きさである。面の飾りで、支援技術から隠す。

## レイアウト、角丸、影、動き

| 種類             | ユーティリティ                                  | 使う場面                                                                                                                            |
| ---------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 余白             | Tailwind のデフォルトの段（1 段 4px）           | 余白のトークンは持たない。ブロックの間は、12、16、24、32、48、80px（`3`、`4`、`6`、`8`、`12`、`20`）の段を勧める                    |
| ブレークポイント | Tailwind のデフォルト（`sm`、`md`、`lg`、`xl`） | 640、768、1024、1280px。テーマ変数で上書きしていない                                                                                |
| 角丸             | `rounded-4`                                     | 4px。DADS の角丸。corporate-site のボタン、入力欄、主なパネル（`var(--radius-4)`）                                                  |
| 角丸             | `rounded-8`                                     | 8px。DADS の角丸                                                                                                                    |
| 角丸             | `rounded-lg`、`rounded-md`                      | `packages/ui` のコンポーネントが使う段。`rounded-lg` は 4px、`rounded-md` は 4px の 0.8 倍                                          |
| 影               | なし                                            | 影のユーティリティは置いていない。写真の枠と浮いたパネルの影は、CSS の変数（`shadow-media`、`shadow-floating`）だけで使う（「色」） |
| 動き             | `--kufu-motion-*`、`--kufu-ease*` の変数        | 時間と緩急。`packages/ui/src/tokens/primitive.css` にある。名前は、値の数でなく役割で付ける                                         |

- corporate-site の多くの section は、広い画面で、縦の padding を 80px（`md:py-20`）にする。横は 56px（`lg:px-14`）にし、コンテナの幅を 1440px（`max-w-360`）までにする。
- site だけで使う演出の keyframes は、app の `src/styles/animations.css` に置く。時間と緩急は、上の変数で書く。
- 動きを減らす設定のときの止め方は、`packages/ui/src/tokens/theme.css` の 1 か所にある（`MOTION-REDUCE`）。全ての要素のアニメーションを止め、遷移を透明度だけにし、滑らかなスクロールを止める。app の CSS に、この設定の条件を書かない。
