# Kufu のデザインシステムのコンポーネントとパターン

この文書は、[Kufu のデザインシステム](../DESIGN.md)の一部である。コンポーネントとパターンの使い方の規則を持つ。props と振る舞いは、コードとカタログを参照先にする。

## コンポーネント

コンポーネントは `packages/ui/src/base/<名前>/` に置き、ネイティブの HTML の要素と `clsx` で書く（[ADR-0028](../../../docs/adr/0028-ui-components-native-elements.md)）。  
見た目は `variant`、`size`、`tone`、`layout` の props で変え、コンポーネントは `className` を受け取らない。今の props で表せない見た目が要るときは、コンポーネントに変種を足す。置く位置と余白は、呼び出す側が包む要素で決める。

Astro のページでは、コンポーネントを `client:*` なしで静的に描く。island にする条件は [ADR-0038](../../../docs/adr/0038-corporate-site-island-policy.md) にある。

### Button

- 使う場面: 送信のように、その場で操作を起こすとき。`type` のデフォルトは `button` なので、フォームを送るボタンには `type="submit"` を渡す
- 使わない場面: ページを移る導線。`LinkButton` を使う。`a` の要素になり、新しいタブで開く、URL をコピーするといったブラウザの操作が働く
- 変種
  - `variant`: `default`（塗り。hover で面を `action-strong-hover` の暗い色にする）、`cta`（問い合わせへの導線の塗り。hover で面を変えない）
  - `size`: `default`（高さ 48px、角丸 8px）、`cta-sm`（最小の高さ 44px）、`cta-md`（48px）、`cta-lg`（52px）、`cta-hero`（54px）。`cta-` の 4 つは角丸 4px で、`cta-md` を除き hover で全体を薄くする
  - `cta-` の大きさは、置く場所で選ぶ。`cta-sm` はヘッダー、`cta-hero` はページの最初の画面、`cta-lg` は section の中の導線、`cta-md` はフォームの送信のボタンに使う
- 状態: デフォルト、hover、押下、フォーカス、無効
- 内容の制約
  - ラベルは折り返さない。狭い画面の幅に収まる長さにする
  - 無効のボタンは、見た目を薄くするだけで、押せない理由を示さない。理由の示し方は決めていない。今の画面に、無効のボタンは無い
  - 塗りのボタンを 1 つの画面に並べる数は、原則 `PRIMARY-ACTION-ONE` に従う
- キーボード: ブラウザの `button` の操作（Tab でフォーカスし、Enter と Space で押す）
- 良い例: 問い合わせのフォームの送信に、`variant="cta"` と `size="cta-md"` の `Button` を置く
- 悪い例: `Button` の `onClick` でページを移る。リンクとして働かない

### LinkButton

- 使う場面: ページを移る導線を、ボタンの見た目で出すとき。corporate-site では、問い合わせへの導線（`ContactCtaLink`）が使う
- 使わない場面: その場で操作を起こすとき。`Button` を使う
- 変種: `variant` と `size` は `Button` と同じ。`cta-` の大きさの選び方も同じ
- 状態: デフォルト、hover、押下、フォーカス、無効。無効のときは `aria-disabled` を付け、タブの順から外す
- 内容の制約: ラベルは折り返さない。狭い画面の幅に収まる長さにする。矢印のような飾りの印を中に置くときは、`aria-hidden` で支援技術から隠す
- キーボード: ブラウザの `a` の操作（Tab でフォーカスし、Enter で移る）
- 良い例: ヘッダーの問い合わせへの導線に、`size="cta-sm"` の `LinkButton` を置く
- 悪い例: `href` を渡さずに、`onClick` だけで操作を起こす

### Tag

- 使う場面: 事業の分類や、入力の項目の必須と任意のように、短い語を印として添えるとき
- 使わない場面: 押せる要素。`Tag` は `span` で、操作を持たない。押せるものは `Button` か `LinkButton` にする
- 変種
  - `size`: `default`（高さ 30px）、`sm`（入力の項目の見出しの横に置く小さな印）
  - `tone`: `default`（主の色の塗り）、`required`（主の色を薄くした面と主の色の文字）、`optional`（補足の色を薄くした面と補足の色の文字）。`required` と `optional` は等幅の書体で出す
  - `required` と `optional` は、入力の項目の必須と任意の印に使う。`FormField` の中の欄では、`FormField` が `size="sm"` の印を出すので、自分で置かない
- 状態: デフォルト
- 内容の制約: 中の文字は折り返さず、はみ出た分は見えなくなる。短い語にする。必須と任意の印は、色だけで示さず、「必須」「任意」の文字を入れる
- 良い例: `FormField` を使わない欄の見出しの横に、`<Tag size="sm" tone="required">必須</Tag>` を置く
- 悪い例: 文を `Tag` に入れる。折り返さないので、狭い画面で切れる

### DefinitionRow

- 使う場面: 会社概要のように、見出しと値の組を縦に並べるとき。`dl` の要素の中に置く。`DefinitionRow` は、見出しを `dt`、値を `dd` で出す
- 使わない場面: `dl` の外。`dt` と `dd` が `dl` の中に無いと、支援技術が説明のリストとして読まない
- 変種: `layout` の `default`（見出しの列 12rem。行の下に線）、`compact`（見出しの列 6.5rem、等幅の小さな見出し。行の上に線）
  - 見出しと値は、狭い画面で縦に並び、`default` は `sm` から、`compact` は `md` から横に並ぶ
  - 線は、`default` が行の下、`compact` が行の上に出る。`compact` は最後の行の下に線が出ないので、要るときは包む要素に下の線を付ける
- 状態: デフォルト
- 内容の制約: 見出しは、列の幅（12rem か 6.5rem）に収まる短い語にする
- 良い例: 会社概要の「基本情報」を、`dl` の中の `layout="compact"` の行で並べる
- 悪い例: 見出しと値の組でない文を、行に見せるために `DefinitionRow` に入れる

### Divider

- 使う場面: 内容の区切りを、線で示すとき。`hr` の要素で、支援技術にも区切りとして伝わる
- 使わない場面: 飾りだけの線と、カードや欄の枠。区切りの意味を持たない線は、`border-divider` か `bg-divider` のユーティリティで書き、`bg-divider` の要素は `aria-hidden` で隠す
- 変種: `orientation` の `horizontal`、`vertical`。`vertical` は、横に並べた要素の間に、親の高さの線を引く
- 状態: デフォルト
- 余白で区切るときとの使い分けは、[DESIGN.md](../DESIGN.md#決まっていない選択) の「決まっていない選択」にある

### FormField

入力欄（`TextInput`、`Select`、`Textarea`）に、見出し、補足の文、誤りの文、必須と任意の印を添える。欄は `FormField` の中に置く。`FormField` は React の context で欄に値を渡すので、欄は同じ React の木の中に置く。

- 使う場面
  - 見出しを持つ入力欄を置くとき
  - 必須か任意かは、色だけで示さず、必ず印の文字で示す。問い合わせフォームのように、必須の欄と任意の欄が並ぶときは、全ての欄に印を付ける
  - 補足の文（`description`）は、入力の形式や例のように、欄を埋める前に読めばよい内容を書く。誤りの文（`error`）は、直す内容を書く
- 使わない場面
  - 素の `input`、`select`、`textarea` を中に置くとき。`FormField` が関連付けの属性を渡すのは、`TextInput`、`Select`、`Textarea` だけである
  - 1 つの `FormField` に、2 つ以上の欄を置くとき。見出しと `id` は、1 つの欄に結び付く
- 変種
  - `required`: 見出しの横に「必須」の印（`Tag` の `tone="required"`）を出し、欄に `required` を付ける
  - `optional`: 見出しの横に「任意」の印（`Tag` の `tone="optional"`）を出す。`required` と同時に渡したときは `required` を使う
- 状態: デフォルト、エラー
- 内容の制約
  - 誤りの文は、欄ごとに 1 つにする。誤りの文には色のほかに文字で内容を書き、「エラー」の 1 語だけにしない
  - `error` を渡すと、欄に `aria-invalid` を付け、誤りの文を `aria-describedby` で欄に結ぶ。誤りの文に `role="alert"` は付けない（[DESIGN.md](../DESIGN.md) の「入力の誤りの伝え方」）
  - `description` を渡すと、補足の文を `aria-describedby` で欄に結ぶ。両方あるときは、補足、誤りの順に読み上げる
  - 補足も誤りも無いとき、欄に `aria-describedby` を付けない
  - 欄に自分で `id`、`aria-describedby`、`aria-invalid`、`required` を渡したときは、渡した値を先にする。`aria-describedby` は `FormField` の値を後ろに足す
  - `htmlFor` は省略できる。省略すると、`FormField` が決めた `id` を見出しと欄に付ける
  - 見出し、欄、補足の文、誤りの文の間は 8px（`gap-2`）である（原則 `SPACING-SCALE`）
- 良い例: 誤りの文に「メールアドレスの形式で入力してください」のように、直す内容を書く
- 悪い例: 誤りの文を出さずに、欄の枠の色だけを替える

### TextInput と Textarea

- 使う場面: 1 行の入力は `TextInput`、複数行の入力は `Textarea` にする
- 使わない場面: 決まった選択肢から選ぶ入力。`Select` を使う
- 変種: なし
- 状態: デフォルト、hover（枠を `text` の色にする。無効と誤りの欄では変えない）、フォーカス、無効、エラー（`aria-invalid`）
- 内容の制約
  - 誤りの状態の色は、誤りの文と合わせて使う。単独で誤りの状態にするときは、近くに誤りの文を置き、`aria-describedby` で結ぶ。`FormField` の中では、`FormField` が `aria-invalid`、`aria-describedby`、`required` を付ける
  - `FormField` の外に置くときは、`label` の要素か `aria-label` で、欄に名前を付ける。名前の無い欄は、カタログのアクセシビリティの自動チェックが違反にする
- キーボード: ブラウザの `input` と `textarea` の操作。`Textarea` の中の Enter は改行になる
- 良い例: 見出しを `FormField` の `label` に、入力の例を `description` に書く
- 悪い例: `FormField` の外の欄に、`label` も `aria-label` も付けない
- DADS から外れる点: 入力欄の見た目の 3 つが、DADS の HTML の実装例と違う。`Select` も同じである
  - 誤りの枠の色: DADS の実装例は Error-1（Red-800）で、Kufu は Red-900 にする。枠と誤りの文に同じ `danger` を使い、Red-800 は `surface-canvas` の上の文字で 4.5:1 に届かないためである（[トークンの文書](tokens.md#色)の「色」）。枠の太さは、DADS の実装例と同じ 1px である
  - hover の枠: DADS の実装例は、ふつうの欄を黒に、誤りの欄を Red-1000 にする。Kufu は、ふつうの欄を文字の色（`text`）にし、誤りの欄では変えない。枠を Kufu のグレーの文字の色にそろえ、赤のトークンを `danger` の 1 つだけにしているためである
  - 無効の欄: DADS の実装例は、枠を薄いグレー（gray-300）にする。Kufu は、枠の色を変えずに全体を薄くし、`TextInput` と `Textarea` は面を `surface-subtle` にする。枠の `border-field` が 3:1 のために濃いグレーなので、無効の欄は面の色で示している
  - 出典: [DADS の HTML の実装例の input-text.css](https://github.com/digital-go-jp/design-system-example-components-html/blob/caa50d731cf515cfa5eae0093121f11ac5299235/src/components/input-text/input-text.css#L11-L53)

### Select

- 使う場面: 決まった選択肢から 1 つを選ぶとき。`FormField` の中では、`TextInput` と同じく `FormField` が関連付けの属性を付ける
- 使わない場面: 複数を選ぶ入力。`Select` は `multiple` を受け取らない
- 変種: なし
- 状態: デフォルト、hover（枠を `text` の色にする。無効と誤りの欄では変えない）、フォーカス、無効、エラー（`aria-invalid`）。値が空の選択肢を選んでいる間は、文字を補足の色で出す
- 内容の制約: 必須の `Select` は、先頭に値が空の選択肢（「選択してください」のような文）を置く。値が空のままだと、ブラウザは必須の欄が未入力と判定する
- キーボード: ブラウザの `select` の操作。選択肢の一覧の開き方と見た目は、ブラウザと OS ごとに違う
- 良い例: 必須の `Select` の先頭に、`<option value="">選択してください</option>` を置く
- 悪い例: 先頭の選択肢に値を持たせ、選んでいないのに最初の選択肢が送られる

## パターン

パターンは、まだ無い。コンポーネントの組み合わせの規則ができたときに、目的、並べる領域、狭い画面と広い画面での並び方を、パターンごとの節に書く。1 つの画面だけの並びは書かない。
