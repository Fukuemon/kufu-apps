# Kufu のデザインシステムのコンポーネントとパターン

この文書は、[Kufu のデザインシステム](../DESIGN.md)の一部である。コンポーネントとパターンの使い方の規則を持つ。props と振る舞いは、コードとカタログを参照先にする。

## コンポーネント

コンポーネントは `packages/ui/src/components/` に置き、ネイティブの HTML の要素と `clsx` で書く（[ADR-0028](../../../docs/adr/0028-ui-components-native-elements.md)）。  
見た目は `variant`、`size`、`tone`、`layout` の props で変え、コンポーネントは `className` を受け取らない。今の props で表せない見た目が要るときは、コンポーネントに変種を足す。置く位置と余白は、呼び出す側が包む要素で決める。

<!-- 使う場面、使わない場面、内容の制約は、デザインシステムの文書を埋めるタスクで書く。ここには、今のコードにある変種と状態だけを書いている -->

### Button

- 変種
  - `variant`: `default`（塗り。hover で面を薄くする）、`cta`（問い合わせへの導線の塗り。hover で面を変えない）
  - `size`: `default`（高さ 48px、角丸 8px）、`cta-sm`（最小の高さ 44px）、`cta-md`（48px）、`cta-lg`（52px）、`cta-hero`（54px）。`cta-` の 4 つは角丸 4px で、`cta-md` を除き hover で全体を薄くする
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

入力欄（`Input`、`Select`、`Textarea`）に、見出し、補足の文、誤りの文、必須と任意の印を添える。欄は `FormField` の中に置く。`FormField` は React の context で欄に値を渡すので、欄は同じ React の木の中に置く。

- 変種
  - `required`: 見出しの横に「必須」の印（`Tag` の `tone="required"`）を出し、欄に `required` を付ける
  - `optional`: 見出しの横に「任意」の印（`Tag` の `tone="optional"`）を出す。`required` と同時に渡したときは `required` を使う
- 状態: デフォルト、エラー
- 使う場面
  - 必須か任意かは、色だけで示さず、必ず印の文字で示す。問い合わせフォームのように、必須の欄と任意の欄が並ぶときは、全ての欄に印を付ける
  - 補足の文（`description`）は、入力の形式や例のように、欄を埋める前に読めばよい内容を書く。誤りの文（`error`）は、直す内容を書く
- 内容の制約
  - 誤りの文は、欄ごとに 1 つにする。誤りの文には色のほかに文字で内容を書き、「エラー」の 1 語だけにしない
  - `error` を渡すと、欄に `aria-invalid` を付け、誤りの文を `aria-describedby` で欄に結ぶ。誤りの文に `role="alert"` は付けない（[DESIGN.md](../DESIGN.md) の「入力の誤りの伝え方」）
  - `description` を渡すと、補足の文を `aria-describedby` で欄に結ぶ。両方あるときは、補足、誤りの順に読み上げる
  - 補足も誤りも無いとき、欄に `aria-describedby` を付けない
  - 欄に自分で `id`、`aria-describedby`、`aria-invalid`、`required` を渡したときは、渡した値を先にする。`aria-describedby` は `FormField` の値を後ろに足す
  - `htmlFor` は省略できる。省略すると、`FormField` が決めた `id` を見出しと欄に付ける

### Input と Textarea

- 変種: なし
- 状態: デフォルト、hover（枠を `text` の色にする。無効と誤りの欄では変えない）、フォーカス、無効、エラー（`aria-invalid`）
- 使う場面: 1 行の入力は `Input`、複数行の入力は `Textarea` にする
- 内容の制約: 誤りの状態の色は、誤りの文と合わせて使う。単独で誤りの状態にするときは、近くに誤りの文を置き、`aria-describedby` で結ぶ。`FormField` の中では、`FormField` が `aria-invalid`、`aria-describedby`、`required` を付ける

### Select

- 変種: なし
- 状態: デフォルト、hover（枠を `text` の色にする。無効と誤りの欄では変えない）、フォーカス、無効、エラー（`aria-invalid`）。値が空の選択肢を選んでいる間は、文字を補足の色で出す
- 使う場面: 決まった選択肢から 1 つを選ぶとき。`FormField` の中では、`Input` と同じく `FormField` が関連付けの属性を付ける
- 内容の制約: 必須の `Select` は、先頭に値が空の選択肢（「選択してください」のような文）を置く。値が空のままだと、ブラウザは必須の欄が未入力と判定する
- キーボード: ブラウザの `select` の操作。選択肢の一覧の開き方と見た目は、ブラウザと OS ごとに違う

## パターン

<!-- コンポーネントの組み合わせごとに、目的、並べる領域、狭い画面と広い画面での並び方を書く。1 つの画面だけの並びは書かない -->

### <パターンの名前>

- 目的:
- 領域と、使うコンポーネント:
- 狭い画面:
- 広い画面:
