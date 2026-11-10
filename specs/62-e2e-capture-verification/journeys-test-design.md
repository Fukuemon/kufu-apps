# corporate-site の 3 ジャーニーの処理の流れとテスト設計

[issue 7](https://github.com/Fukuemon/kufu-apps/issues/7) の実装に渡す、テストの観点とケース。  
書式は、スキル design-test-cases のテンプレートに合わせた。ケースは、条件と期待結果の表にまとめた。

## 対象範囲

### 対象

- 3 つの route（`/`、`/products`、`/contact`）をまたぐ到達
- 取扱製品の検索の条件が URL に残ること
- モバイルの幅でのナビゲーションの開閉
- JavaScript が無効のときの、主な内容と問い合わせ先の表示

### 対象外

- 問い合わせフォームの送信。フォームの実体がない。
- カテゴリの開閉、カルーセルのような、1 つのコンポーネントの中で閉じる操作。play か、別の issue で扱う。
- 見た目の差分。VRT が受け持つ。
- アクセシビリティの自動の確認。E2E で扱うかは、[index.md](index.md) の Open Points にある。

## 根拠

行番号は、b6b3fe4 のもの。

| 種別       | 参照先                                                                                            | 確認した内容                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 要求       | issue 7、`e2e/README.md` の「E2E が担うジャーニー」                                               | 3 本のジャーニーの手順                                                                                  |
| 実装       | `apps/corporate-site/src/components/common/SiteHeader.astro:14-37`                                | ナビの項目は、トップ、事業内容（`/#business`）、取扱製品（`/products`）、会社情報（`/#company`）の 4 つ |
| 実装       | `apps/corporate-site/src/components/common/SiteHeader.astro:108`                                  | ナビの中に、`/contact` への「お問い合わせ」がある                                                       |
| 実装       | `apps/corporate-site/src/components/common/SiteHeader.astro:117-153`                              | 開閉のボタン、ナビの中のリンク、Escape のキーで、開閉の状態が変わる                                     |
| 実装       | `apps/corporate-site/src/components/common/SiteFooter.astro:18`、`:51-66`                         | リンクを持つフッターは `full` だけである。`compact` はリンクを持たない                                  |
| 実装       | `apps/corporate-site/src/pages/index.astro:13`、`products.astro:9`、`contact.astro:9`             | `full` のフッターは `/` だけが使う                                                                      |
| 実装       | `apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro:198-233` | 検索の語を `q` のパラメータに書き、読み込みのときと履歴の移動のときに、URL から入力欄へ戻す             |
| 実装       | `apps/corporate-site/src/components/sections/contact/ContactSection.astro:31`、`:41`              | 電話とメールは、`tel:` と `mailto:` のリンクである                                                      |
| 既存テスト | `e2e/corporate-site/smoke.spec.ts`                                                                | 表示、ヘッダーと CTA からの到達、モバイルのナビを開いて `/products` へ、検索と URL、JS 無効時の主な領域 |

## 処理の流れ

```text
/（index.astro）
├── SiteHeader                                   全 route で同じ
│   ├── ナビの項目 4 つ + お問い合わせ           :14-37, :108
│   └── 開閉の script（モバイルの幅だけで使う）  :117-153
├── Hero の CTA → /contact                       home-link-contact
├── ProductsCategorySection の CTA → /products   home-link-products
└── SiteFooter（full）
    ├── リンク 4 つ（/#business、/products、/#company、/contact）
    └── tel: と mailto: のリンク
/products（products.astro）
├── ProductsHero の CTA → /contact               products-link-contact
├── 検索欄 → applyFilter → URL の q を書き換える（replaceState）
└── SiteFooter（compact）                        リンクなし
/contact（contact.astro）
├── 問い合わせ先（tel:、FAX の文字、mailto:）
├── フォームの枠（送信しない）
└── SiteFooter（compact）                        リンクなし
```

### フッターのリンクは / だけにある

`/products` と `/contact` のフッターは、リンクを持たない。  
ジャーニーの「フッターのリンクから各 route へ到達する」は、`/` のフッターで確認する。

### 検索の条件は、履歴を増やさずに URL に書く

入力のたびに、今の履歴の項目を書き換える。  
検索した後に「戻る」を押すと、検索の前の条件ではなく、前のページへ戻る。

### JavaScript が無効のとき、ナビの開閉と検索は動かない

モバイルの幅でナビを開く操作と、検索は、script で動く。  
JavaScript が無効のときに確認するのは、静的な HTML に出る内容と、リンクの行き先である。

## テスト観点

| 名前                     | 観点                                             | 対応する分岐と仕様                   | 検出する不具合                                       | 扱い   |
| ------------------------ | ------------------------------------------------ | ------------------------------------ | ---------------------------------------------------- | ------ |
| 回遊の導線               | 回遊の導線が、`/` から `/contact` までつながる   | Hero と section の CTA、ProductsHero | CTA のリンクの行き先の誤り、CTA の消失               | 必須   |
| 検索の条件の保持         | 検索の条件が URL に残り、読み直しても戻る        | 検索の script                        | `q` を書かない、読み込みのときに入力欄へ戻さない     | 必須   |
| 検索の解除               | 検索を空にすると、URL から条件が消える           | 検索の script の、空のときの分岐     | 空の `q` が URL に残る                               | 必須   |
| ヘッダーからの到達       | ヘッダーのリンクから、各 route へ到達する        | ナビの項目                           | リンクの行き先の誤り                                 | 必須   |
| フッターからの到達       | `/` のフッターのリンクから、各 route へ到達する  | `full` のフッター                    | リンクの行き先の誤り、フッターの種類の誤り           | 必須   |
| モバイルのナビの開閉     | モバイルの幅で、ナビを開閉できる                 | 開閉の script                        | 開閉の状態が属性に出ない、閉じない                   | 必須   |
| モバイルのナビからの到達 | モバイルの幅で、開いたナビから各 route へ着く    | 開閉の script と、ナビの項目         | 開いたナビのリンクを押せない                         | 必須   |
| JS 無効の表示            | JS が無効でも、3 つの route の主な領域が出る     | 静的な HTML                          | 内容の表示が script に依存する                       | 必須   |
| JS 無効の問い合わせ先    | JS が無効でも、電話とメールのリンクがある        | 問い合わせ先                         | 問い合わせ先が script で描かれる、リンクの形が崩れる | 必須   |
| JS 無効のヘッダー        | JS が無効でも、ヘッダーのリンクで route を移れる | ナビの項目                           | デスクトップの幅のナビが script に依存する           | 任意   |
| 現在地の印               | 現在の route のナビの項目に、現在地の印が付く    | `aria-current`                       | 現在地の印の付け間違い                               | 任意   |
| Escape で閉じる          | Escape のキーで、ナビが閉じる                    | 開閉の script                        | キーの操作で閉じない                                 | 対象外 |
| 検索の絞り込み           | 検索の結果の件数の文と、絞り込みの中身           | `applyFilter`                        | 絞り込みの誤り                                       | 対象外 |

- 「Escape で閉じる」と「検索の絞り込み」は、1 つのコンポーネントの中で閉じる操作なので、ジャーニーでは扱わない。「検索の絞り込み」の件数の文は、今の smoke が 1 件だけ確認している。組み替えるときに、検索の spec に残す。
- 「JS 無効のヘッダー」と「現在地の印」は、3 本のジャーニーの定義にない。入れるかは、実装のときに運営者に尋ねる。

## テストケース

| ケース | 観点                     | 条件                                                                                           | 期待結果                                                                               | 優先度 |
| ------ | ------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------ |
| C1     | 回遊の導線               | `/` で、取扱製品への CTA を押したとき                                                          | `/products` が開き、取扱製品の一覧の領域が出る                                         | 高     |
| C2     | 回遊の導線               | `/products` で、問い合わせへの CTA を押したとき                                                | `/contact` が開き、問い合わせ先の領域が出る                                            | 高     |
| C3     | 検索の条件の保持         | `/products` で、検索欄にメーカーの名前を入れたとき                                             | URL に `q` が付き、読み直した後も、検索欄に同じ語が入っている                          | 高     |
| C4     | 検索の解除               | 検索した後に、検索欄を空にしたとき                                                             | URL が `/products` に戻る                                                              | 中     |
| C5     | ヘッダーからの到達       | デスクトップの幅で、ヘッダーの「取扱製品」と「お問い合わせ」を順に押したとき                   | それぞれ `/products` と `/contact` が開く                                              | 高     |
| C6     | フッターからの到達       | `/` のフッターで、「取扱製品」と「お問い合わせ・お見積り」を押したとき                         | それぞれ `/products` と `/contact` が開く                                              | 高     |
| C7     | モバイルのナビの開閉     | モバイルの幅で、開閉のボタンを押し、もう一度押したとき                                         | 1 回目で開いた状態になり、2 回目で閉じた状態に戻る                                     | 高     |
| C8     | モバイルのナビからの到達 | モバイルの幅でナビを開き、「取扱製品」を押したとき。もう一度開き、「お問い合わせ」を押したとき | それぞれ `/products` と `/contact` が開き、開いた先でナビは閉じている                  | 高     |
| C9     | JS 無効の表示            | JavaScript が無効の場合、3 つの route を順に開いたとき                                         | それぞれの主な領域（事業内容、取扱製品、会社情報、取扱製品の一覧、問い合わせ先）が出る | 高     |
| C10    | JS 無効の問い合わせ先    | JavaScript が無効の場合、`/contact` を開いたとき                                               | 電話のリンクの行き先が `tel:` で、メールのリンクの行き先が `mailto:` である            | 高     |

- 「起きないこと」を確認するケースはない。C7 の「閉じた状態に戻る」は、開いた状態を確認した後に確認する。
- C1 から C4 は、1 本の回遊の spec に、手順の順に書く。複数の route をまたぐ手順は、spec に書く。
- C10 のリンクの行き先は、要素の属性を確認に渡して確認する。値を読んでから比べない。

## 既存テストとの対応

| ケース | 既存のテスト（`smoke.spec.ts`）                   | 対応の方針                                              |
| ------ | ------------------------------------------------- | ------------------------------------------------------- |
| C1、C2 | `navigates through header footer and LP CTAs`     | 拡張。`/products` から `/contact` への CTA を足す       |
| C3、C4 | `persists product search in the URL`              | 既存で保証。回遊の spec に組み替える                    |
| C5     | `navigates through header footer and LP CTAs`     | 既存で保証                                              |
| C6     | 同上（フッターは「取扱製品」だけ）                | 拡張。`/contact` へのリンクを足す                       |
| C7     | `toggles mobile navigation`（開くだけ）           | 拡張。閉じる操作を足す                                  |
| C8     | `toggles mobile navigation`（`/products` だけ）   | 拡張。`/contact` を足す                                 |
| C9     | `without JavaScript › keeps core content visible` | 既存で保証                                              |
| C10    | なし                                              | 新規。今は、JS が有効のときだけ、リンクの表示を見ている |

- `renders main routes and content` は、ジャーニーではなく、route ごとの表示の確認である。表示の spec として残す。

## 未決事項

- 「JS 無効のヘッダー」と「現在地の印」を入れるか。
- C6 で、`/#business` と `/#company`（同じページの中の位置）への到達を確認するか。ジャーニーの定義は「各 route へ」で、ページの中の位置は route ではない。

## 実装への引き渡し

- テストの置き場: `e2e/tests/specs/<機能>/<振る舞い>.e2e.ts`。分け方の案は [index.md](index.md) の Design にある。
- 指し方: `e2e/tests/selectors/`。今の Page Object の、role、文言、CSS のセレクタでの指し方を移す。
- 実行のコマンド: `pnpm e2e`
