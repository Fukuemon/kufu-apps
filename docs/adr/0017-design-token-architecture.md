# ADR-0017: デザイントークンを primitive と shadcn の語彙の 2 層に分け、tokens、fonts、theme、全量の entry で配る

## Status

[ADR-0027](0027-design-tokens-three-layers.md) に置換

## Context

- `design/features/corporate-site/index.pen` が実質のトークンの源になり、トークンの基準であるべき `packages/ui` の stylesheet と値が食い違っていた。
  - アクセントは `#006B6B` と `#0f766e` で、背景は寒色と暖色で食い違い、Noto 系のフォントは登録されていなかった。
  - design-workflow の一方向の原則（`packages/ui` から Pencil へ）に反し、基準が 2 つある状態だった。
- `.pen` の変数名は比喩（`paper`、`ink`、`photo-tone` など）で、用途が読み取れなかった。
- CSS の側でも、独自の `--kufu-color-*` と shadcn の semantic の変数（`--primary` など）が整理されないまま並んでいた。
- corporate-site の本体の実装と Storybook の前提として、トークンの体系を先に固定する必要があった。
- corporate-site の component は scoped な `<style>` と `var(--token)` で書かれ、Tailwind を使う `packages/ui`（shadcn）と記法が分かれていた。
- Tailwind v4 は、node_modules と `.gitignore` の対象を走査しない。
  workspace の package の component の class を生成するには、その package のソースを `@source` で指す必要がある。
- `.pen` は後に廃止した。
  トークンの基準は `packages/ui` の実装だけになり、デザインのツールへの同期は要らない。
  ADR-0012: [デザインの基準を実装にし、Pencil を廃止する](0012-design-source-of-truth-implementation.md)

## Decision

### 1. トークンを 2 層に分ける

トークンを primitive の層と semantic の層に分ける。

- primitive の層は `--kufu-<hue>-<scale>`（例: `--kufu-teal-600`、`--kufu-gray-50`）で、値を持つ唯一の層にする。
- semantic の層は shadcn の語彙の役割名（`--background`、`--foreground`、`--primary` など）で、primitive を参照するだけにする。
- `.pen` の比喩の名前は廃止する。

### 2. shadcn の semantic の変数の値を上書きする

既存の shadcn の semantic の変数の値を kufu の primitive への参照に置き換え、トークンのセットを 1 系統にまとめる。  
shadcn の語彙にない用途は、役割で名付けた semantic の変数（`--photo-overlay`、`--card-overlay`、`--ghost-foreground`、`--primary-soft`）を新しく作る。  
この上書きが安全な理由と制約は次のとおり。

- **変数名は shadcn の契約である。**
  - コンポーネントは `bg-primary` などの class で `var(--primary)` を参照し、名前だけを見て値の中身には関わらない。
  - **値を primitive へ向け替えるのは shadcn の公式のテーマの仕組みそのもので、安全である。**
  - **名前を変えたり消したりすると契約を破り、コンポーネントが動かなくなる。**
- **使っていない shadcn の変数も名前を消さない。**
  - `--chart-*`、`--sidebar-*`、`--destructive`、`--accent` の系統は、corporate-site で使っていない。
  - 該当のコンポーネント（アラート、チャート、ドロップダウンなど）を入れたときに名前がないと、そのコンポーネントが動かなくなる。
  - デフォルト値のまま残し、kufu のパレットへの割り当ては該当のコンポーネントを入れるときに行う。
- **`-foreground` の対を揃える。**
  - shadcn は面（`--primary`）とその上の文字（`--primary-foreground`）を対で使う。
  - 面だけを変えてコントラストが崩れないよう、必ず対で割り当てる。
- **足した独自の semantic の変数（`--primary-soft` など）を `bg-*` などの utility で使うには、`@theme inline` への写像を足す必要がある。**
  - 生の CSS で `var()` を直接書くなら要らない。
  - utility は実際に要る分だけ足す。

### 3. ダークの面は inverse のスコープで表す

`.dark` のテーマを使わず、semantic の変数を上書きするラッパーの class（案: `.surface-inverse`）で、section ごとのダークの面を表す。  
class の中で `--background`、`--foreground` などを上書きする。  
**そのスコープの中の shadcn のコンポーネントも、カスケードで自動的にダークの面の見た目に変わる。**  
この仕組みは `.dark` と同じで、名前を保って値だけを差し替える設計の利点である。

### 4. 用途ごとの entry で配る

CSS を次の entry に分けて配る。

- `@kufu/ui/tokens.css`: runtime の CSS 変数の実体だけを持つ。値の基準はこのファイルだけにする。
- `@kufu/ui/fonts.css`: fontsource の font-face を持つ。
- `@kufu/ui/theme.css`: token から Tailwind の utility への `@theme inline` の写像だけを持つ。
- `@kufu/ui/styles.css`: 全量の entry（`globals.css`）。tokens、fonts、Tailwind の theme、shadcn の層を含む。

React の app（将来の cms）は `styles.css` を import する。  
corporate-site は全量の `styles.css` を取り込まず、app の中に軽い Tailwind v4 の entry を置いて utility を使う。

- corporate-site の entry（`globals.css`）は、`tailwindcss`、`tokens.css`、`theme.css` を import する。
  - entry は import、source、variant、base の層だけを持ち、app に固有なのは document の単位の base だけにする。
- `fonts.css` は document の head から読み込み、フォントの配信を head の側で制御する。
- `styles.css` と corporate-site の entry は、どちらも `theme.css` を import し、写像を 1 か所にまとめる。
- Tailwind v4 は `@tailwindcss/vite` で適用し、PostCSS の config は使わない。

全量の entry を不採用にした理由は、tw-animate-css と shadcn の層を含む全量の entry が corporate-site の配信物に入ることである。  
軽い Tailwind の entry はこの層を含まない。  
Tailwind v4 は検出した utility だけを出力するので、静的な配信の CSS の量は限られる。

### 5. `@source` は `theme.css` に置く

`theme.css` が、自分の component のソースを `@source "../components"` で指す。  
app の entry は `@source` を持たず、`@import` だけにする。

- `theme.css` を import するすべての消費側（corporate-site と将来の cms）が、ui の class を自動で生成できる。
- app 自身の走査は Vite の plugin の module graph に任せ、手で指定しない。

### 6. 実績に基づいて最小限だけ定義する

- type scale、spacing、shadow、breakpoint は独自のトークンを作らず、Tailwind の標準を使う。
  - spacing は 4px のグリッドを使い、推奨のリズム（12、16、24、32、48、80）を文書にする。
- radius は shadcn の `--radius` の 1 つにし、基準の値を `0.25rem`（4px）にする。
  - app の側で同じ名前の変数を上書きしない。上書きすると、トークンの基準が分かれる。
  - Button の 8px、Tag の 4px のようなコンポーネントに固有の値は、`@kufu/ui` のコンポーネントの variant で持つ。
- motion の duration と easing は、`tokens.css` のトークンにする。
  - site に固有の演出の keyframes は app の中に置き、値だけをトークンで参照する。

## Considered Options

| 選択肢                                                                     | 強み                                                                                                     | 弱み                                                                                                                                                                      |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **採用:** primitive と shadcn の語彙の 2 層に分け、用途ごとの entry で配る | 名前から用途が読める。将来の cms が同じトークンを変換せずに使える。Astro の配信物に不要な CSS が入らない | `--kufu-color-*` などの旧トークンと TS の export を参照するコードの置き換えが要る                                                                                         |
| 比喩の名前を primitive の層として残し、semantic の層だけを新しく作る       | `.pen` の変更が最小で済む                                                                                | 分かりにくい名前が残り、命名の読みやすさの課題が解決しない                                                                                                                |
| shadcn の semantic の名前に全面的に揃える（1 層）                          | 変数の数が最も少ない                                                                                     | shadcn の語彙にない用途（写真のオーバーレイ、ダークの面の 6 変数）で場当たりの名前が増える。テーマを展開する基盤の primitive を失う                                       |
| 独自の `--kufu-*` の semantic の系統と shadcn の系統を並べる               | -                                                                                                        | corporate-site と React の app でトークンの系統が分かれ、基準が 2 つになる状態が再び起きうる                                                                              |
| 単一の `styles.css` での配信を続ける                                       | 開発者の体験が単純                                                                                       | Astro の側に React の app 向けの層（tw-animate-css など）が入り、性能の予算を圧迫しうる。[判断の優先順位](../design/DesignDoc.md#判断の優先順位)の 1 位である性能に反する |

## Consequences

### Positive

- トークンの名前から用途が読め、新しいトークンの名前を機械的に決められる。primitive はスケールで、semantic は役割で名付ける。
- 将来の cms（React と shadcn）が、同じトークンを変換せずに使える。
- Astro の配信物には、トークン、フォント、使った utility だけが入り、不要な CSS は入らない。
- `theme.css` を import するだけで、消費側が ui の class を生成できる。

### Negative

- 既存の `--kufu-color-*`、`--kufu-radius-*`、`--kufu-font-*` と TS の export（`./tokens`、`./theme`、`./fonts`）を参照するコードは、削除か置き換えが要る。
  - corporate-site の `--kufu-font-body` の参照は、同じ変更の中で置き換える。
- radius の基準を変えると、`--radius-*` の派生の値を使う共有の UI にも新しい値が適用される。
