# ADR-0017: play テストと E2E の責務を分け、Page Object と locator の規約を定める

## 状態

承認

## 決定日

2026-08-16

## 背景

- Storybook の story に `play` 関数が 1 つも無く、UI の確認が見た目に留まっていた。
- root 管理の Playwright E2E (`e2e/corporate-site/smoke.spec.ts`) はセレクタと操作手順がテストに直書きされており、テストが増えたときの保守性が読めなかった。
- interaction テストを Storybook の play と E2E のどちらに寄せるか、E2E がどこまでカバーするかの基準が無かった。
- 実測 (2026-08-16 時点)
  - E2E: 1 ファイル / 5 テスト。セレクタ内訳は `getByTestId` 24 / `getByText` 6 / `locator()` 5 / `getByRole` 3 で、`data-testid` 依存が支配的。`data-testid` の定義は 20 箇所。
  - React island: **0 件** (`client:*` の使用箇所なし)。[ADR-0008](0008-astro-react-island-policy.md) の「island は必要最小限」に沿った状態。
  - `apps/corporate-site/src/components/sections/contact/ContactSection.astro` に `<form>` 要素は無く、`data-testid="contact-form-slot"` の枠に「※ こちらはデザイン確認用のフォーム枠です」と注記された入力欄と `type="button"` の送信ボタンがある。

## 決定

- **play テストの対象は `packages/ui` に限定する。** corporate-site に React island が存在しないため、island 向けの対象基準は島が生まれる時点 (問い合わせフォームの実装) で決める。Astro の静的コンポーネントは E2E でカバーする。
- **E2E に page 単位の Page Object を導入する。** セレクタと操作を Page Object に集約し、テスト本体はシナリオのみを書く。現規模は 3 route に対応する 3 クラス程度に収まる。
- **locator は用途で使い分ける。** セクションやページ領域の特定には `data-testid`、その内部の操作対象 (ボタン / リンク / 入力欄) には `getByRole` を優先する。この規約は Page Object の内部にも適用する。
- **E2E が担うジャーニーは、route をまたぐ到達性**とする。単一コンポーネント内で閉じる操作は play が担う。現時点で定義するジャーニーは次の 3 本で、問い合わせフォームの送信は実体が無いため島の実装時に追加する。
  - **回遊**: `/` → `/products` → カテゴリ検索 (URL に検索条件が保持される) → `/contact` までの到達
  - **ナビゲーション**: ヘッダー / フッターのリンクとモバイルナビの開閉から各 route へ到達できる
  - **JS 無効時**: JavaScript を無効にしても 3 route の主要コンテンツが表示され、問い合わせ先 (電話 / メール) に到達できる

## 代替案

### 1. locator を `getByRole` 優先へ全面的に寄せる

#### Pros

- Playwright の公式推奨に沿い、アクセシビリティ属性の崩れも検出できる。

#### Cons

- 既存 24 箇所の書き換えが発生する。セクションやページ領域の特定は role では一意に決まらず、かえって不安定になる。

### 2. `data-testid` を正式規約にする

#### Pros

- 書き換えが不要で、現状の資産をそのまま活かせる。

#### Cons

- アクセシビリティ属性の崩れを検出できない。

### 3. Page Object を導入せず locator 規約だけ先行させる

#### Pros

- 現規模 (5 テスト) に対して過剰な抽象化を避けられる。

#### Cons

- ジャーニー網羅でテストを増やす際、型のない状態で書き始めることになり、後から一括で書き換える手戻りが大きい。

### 4. play テストの island 向け基準も先に決める

#### Pros

- 将来像が一度に揃う。

#### Cons

- 対象が存在しないものへの基準は机上になり、島の実装時に作り直す公算が高い。

## 影響

### 良い影響

- テストの置き場と責務が決まり、実装 issue と AI エージェントが規約に従って書ける。
- セレクタが Page Object に集約されるため、UI 変更時の修正箇所が限定される。

### 悪い影響 / トレードオフ

- 現規模に対して Page Object はやや過剰であり、テストが増えるまでは利点が見えにくい。
- play の対象が `packages/ui` に限られるため、Astro 側の interaction は E2E に依存する。

## 実装・運用への反映

- 対象 app / package: `packages/ui`、`apps/corporate-site`、`e2e`
- spec 更新要否: 要。E2E を追加する spec ではジャーニーとの対応を書く
- AI 向け設定更新要否: 不要 (規約は `context/testing.md` に反映済み)

## 関連ドキュメント

- `context/testing.md`: テスト責務の分担 / locator と Page Object の規約
- `design/features/corporate-site/DesignDoc_corporate-site.md`: テスト観点
- [ADR-0008](0008-astro-react-island-policy.md): React island を必要最小限にする方針
- issue: #33 (決定経緯)
