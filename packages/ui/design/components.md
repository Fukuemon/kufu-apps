# Kufu のデザインシステムのコンポーネントとパターン

この文書は、[Kufu のデザインシステム](../DESIGN.md)の一部である。コンポーネントとパターンの使い方の規則を持つ。props と振る舞いは、コードとカタログを参照先にする。

## コンポーネント

コンポーネントは `packages/ui/src/components/` に置き、ネイティブの HTML の要素と `clsx` で書く（[ADR-0028](../../../docs/adr/0028-ui-components-native-elements.md)）。  
見た目は `variant`、`size`、`tone`、`layout` の props で変え、コンポーネントは `className` を受け取らない。今の props で表せない見た目が要るときは、コンポーネントに変種を足す。置く位置と余白は、呼び出す側が包む要素で決める。

<!-- 使う場面、使わない場面、内容の制約は、デザインシステムの文書を埋めるタスクで書く。ここには、今のコードにある変種と状態だけを書いている -->

### Button

- 変種
  - `variant`: `default`（塗り。hover で面を薄くする）、`cta`（問い合わせへの導線の塗り。hover で面を変えない）
  - `size`: `default`（高さ 48px、角丸 8px）、`cta-sm`（最小の高さ 40px）、`cta-md`（48px）、`cta-lg`（52px）、`cta-hero`（54px）。`cta-` の 4 つは角丸 4px で、`cta-md` を除き hover で全体を薄くする
- 状態: デフォルト、hover、押下、フォーカス、無効
- キーボード: ブラウザの `button` の操作（Tab でフォーカスし、Enter と Space で押す）

### LinkButton

- 変種: `variant` と `size` は `Button` と同じ
- 状態: デフォルト、hover、押下、フォーカス、無効。無効のときは `aria-disabled` を付け、タブの順から外す
- キーボード: ブラウザの `a` の操作（Tab でフォーカスし、Enter で移る）

### Badge と Tag

`Tag` は `Badge` を包み、見た目は同じである。

- 変種
  - `size`: `default`（高さ 30px）、`sm`（入力の項目の見出しの横に置く小さな印）
  - `tone`: `default`（主の色の塗り）、`required`（主の色を薄くした面と主の色の文字）、`optional`（補足の色を薄くした面と補足の色の文字）。`required` と `optional` は等幅の書体で出す
- 状態: デフォルト

### DefinitionRow

- 変種: `layout` の `default`（見出しの列 12rem）、`compact`（見出しの列 6.5rem、等幅の小さな見出し）
- 状態: デフォルト

### Separator

- 変種: `orientation` の `horizontal`、`vertical`
- 状態: デフォルト

### FormField と Label

- 変種: なし
- 状態: デフォルト、エラー（誤りの文を `role="alert"` で出す）

### Input と Textarea

- 変種: なし
- 状態: デフォルト、フォーカス、無効、エラー（`aria-invalid`）

### Select

- 変種: なし
- 状態: デフォルト、フォーカス、無効、エラー（`aria-invalid`）。値が空の選択肢を選んでいる間は、文字を補足の色で出す
- キーボード: ブラウザの `select` の操作。選択肢の一覧の開き方と見た目は、ブラウザと OS ごとに違う

## パターン

<!-- コンポーネントの組み合わせごとに、目的、並べる領域、狭い画面と広い画面での並び方を書く。1 つの画面だけの並びは書かない -->

### <パターンの名前>

- 目的:
- 領域と、使うコンポーネント:
- 狭い画面:
- 広い画面:
