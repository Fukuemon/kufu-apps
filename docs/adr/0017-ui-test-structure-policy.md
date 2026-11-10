# ADR-0017: play テストと E2E の役割を分け、Page Object と locator の規約を定める

## Status

[ADR-0031](0031-e2e-test-code-layers.md) に置換

## Context

- Storybook の story に `play` 関数が 1 つもなく、UI の確認が見た目にとどまっていた。
- ルートで管理する Playwright の E2E（`e2e/corporate-site/smoke.spec.ts`）は、セレクタと操作の手順をテストに直接書いていた。
  テストが増えたときに保守できるかが読めなかった。
- interaction のテストを Storybook の play と E2E のどちらに寄せるか、E2E がどこまでを受け持つかの基準がなかった。
- 決定のときの状態は次のとおり。
  - E2E は 1 ファイルで 5 テスト。
    セレクタの内訳は `getByTestId` が 24、`getByText` が 6、`locator()` が 5、`getByRole` が 3 で、`data-testid` への依存が大半を占める。
    `data-testid` を定義した箇所は 20 ある。
  - React の island は **0 件**で、`client:*` を使った箇所はない。
    island を必要な最小限にする方針に沿っている。
    - ADR-0008: [shadcn は静的な描画を既定にし、island はインタラクションに限る](0008-astro-react-island-policy.md)
  - `apps/corporate-site/src/components/sections/contact/ContactSection.astro` に `<form>` の要素はない。
    `data-testid="contact-form-slot"` の枠に、デザインの確認用のフォームの枠であると注記した入力欄と、`type="button"` の送信のボタンがある。

## Decision

- **play テストの対象は `packages/ui` に限る。**
  corporate-site に React の island がないので、island の対象の基準は、island ができるとき（問い合わせフォームの実装）に決める。
  Astro の静的なコンポーネントは E2E で確認する。
- **E2E に、ページ単位の Page Object を入れる。**
  セレクタと操作を Page Object に集め、テストの本体にはシナリオだけを書く。
  今の規模では、3 つの route に対応する 3 つほどのクラスに収まる。
- **locator は用途で使い分ける。**
  セクションやページの領域の特定には `data-testid` を、その中の操作の対象（ボタン、リンク、入力欄）には `getByRole` を優先する。
  この規約は Page Object の中にも適用する。
- **E2E が受け持つジャーニーは、route をまたいだ到達にする。**
  1 つのコンポーネントの中で閉じる操作は、play が受け持つ。
  今のところ定めるジャーニーは次の 3 本で、問い合わせフォームの送信は実体がないので、island を実装するときに足す。
  - **回遊**: `/` から `/products`、カテゴリの検索（URL に検索の条件が残る）を経て、`/contact` に到達できる。
  - **ナビゲーション**: ヘッダーとフッターのリンクと、モバイルのナビの開閉から、各 route へ到達できる。
  - **JS 無効時**: JavaScript を無効にしても 3 つの route の主なコンテンツが表示され、問い合わせ先（電話、メール）に到達できる。

## Considered Options

| 選択肢                                                                                                    | 強み                                                                                               | 弱み                                                                                                                   |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **採用:** play を `packages/ui` に限り、E2E にページ単位の Page Object を入れ、locator を用途で使い分ける | テストの置き場と役割が決まる。セレクタが Page Object に集まり、UI を変えたときに直す箇所が限られる | 今の規模には Page Object がやや過剰。Astro の側の interaction は E2E に頼る                                            |
| locator を `getByRole` の優先へ全面的に寄せる                                                             | Playwright の公式の推奨に沿い、アクセシビリティの属性の崩れも検出できる                            | 既存の 24 箇所を書き換える必要がある。セクションやページの領域は role では一意に決まらず、かえって不安定になる         |
| `data-testid` を正式な規約にする                                                                          | 書き換えが要らず、今の資産をそのまま活かせる                                                       | アクセシビリティの属性の崩れを検出できない                                                                             |
| Page Object を入れず、locator の規約だけを先に決める                                                      | 今の規模（5 テスト）に対して過剰な抽象化を避けられる                                               | ジャーニーを網羅するためにテストを増やすとき、型のない状態で書き始めることになり、後でまとめて書き換える手戻りが大きい |
| island の play テストの基準も先に決める                                                                   | 将来の形が一度に揃う                                                                               | 対象がないものへの基準は机上の話になり、island を実装するときに作り直す見込みが高い                                    |

## Consequences

### Positive

- テストの置き場と役割が決まり、実装の issue と AI エージェントが規約に従って書ける。
- セレクタが Page Object に集まるので、UI を変えたときに直す箇所が限られる。

### Negative

- 今の規模に対して Page Object はやや過剰で、テストが増えるまでは利点が見えにくい。
- play の対象が `packages/ui` に限られるので、Astro の側の interaction は E2E に頼る。
