# Testing Conventions

> 最終更新: 2026-08-16

E2E runtime contract と unit test の横断規約。feature 固有のテスト観点は各 [design/features/](../design/features/) に置く。

## テスト責務の分担

| 種別      | 配置                                         | 主担当範囲                                         |
| --------- | -------------------------------------------- | -------------------------------------------------- |
| Unit test | 各 app / package (Vitest)                    | ロジック、shared UI、shared config の利用可能性    |
| play      | 各 component の story (Storybook)            | 単一コンポーネント内で閉じる interaction           |
| E2E       | root `e2e/` (Playwright)                     | 公開前検証、route をまたぐ到達性、回帰             |
| VRT       | story 側は Storybook、route 側は root `e2e/` | 視覚回帰。要素の存在ではなく見た目の差分を検出する |

- `packages/ui` の共有 UI は Storybook / unit test で確認できること。
- `packages/config` の共有設定を各 app / package が利用できること。

### play テスト

- 対象は **`packages/ui`** に限る。Astro の静的コンポーネントは E2E でカバーする ([ADR-0017](../adr/0017-ui-test-structure-policy.md))。
- React island 向けの対象基準は、島が生まれる時点で決める (現在 `client:*` の使用箇所は無い)。

### E2E が担うジャーニー

**route をまたぐ到達性**を見る。単一コンポーネント内で閉じる操作は play が担う。

| ジャーニー     | 内容                                                                              |
| -------------- | --------------------------------------------------------------------------------- |
| 回遊           | `/` → `/products` → カテゴリ検索 (URL に検索条件が保持される) → `/contact` の到達 |
| ナビゲーション | ヘッダー / フッターのリンクとモバイルナビの開閉から各 route へ到達できる          |
| JS 無効時      | JS を無効にしても 3 route の主要コンテンツが表示され、問い合わせ先へ到達できる    |

問い合わせフォームの送信ジャーニーは、フォームの実体が実装された時点で追加する。

### Page Object と locator の規約

- E2E は **page 単位の Page Object** にセレクタと操作を集約し、テスト本体はシナリオのみを書く。
- locator は用途で使い分ける。この規約は Page Object の内部にも適用する。
  - **領域の特定** (セクション / ページ): `data-testid`
  - **操作対象** (ボタン / リンク / 入力欄): `getByRole` を優先する

### VRT (visual regression testing)

正本は [ADR-0015](../adr/0015-visual-regression-testing-policy.md)。

| 系統  | 撮影対象                                 | baseline の置き場     |
| ----- | ---------------------------------------- | --------------------- |
| story | Storybook の story (fixture は除く)      | S3 互換ストレージ     |
| route | 3 route × desktop / mobile の 2 viewport | リポジトリ (Git 管理) |

- **許容 diff は 0 (完全一致)** を初期値とし、flake が実測された場合にその実測値を上回る最小値まで緩める。
- **差分が出たら CI を失敗させる。** 環境差による恒常的な差分への一次対処は、閾値の引き上げでも非ブロッキング化でもなく、**原因要素のマスクと撮影環境の固定**とする。
- 撮影と判定は CI 環境に一本化する。ローカルと CI ではフォントのレンダリングが異なり、baseline を撮る環境を固定しなければ恒常的な差分が発生するため。

## E2E Runtime Contract

- `pnpm e2e` は root `playwright.config.ts` を正本とし、`e2e/<target>/` 配下の suite を読む。
- root 側の標準 env contract は `E2E_TARGET`、`E2E_PORT`、`E2E_BASE_URL` とする。
- `E2E_TARGET` の既定値は `corporate-site` とし、初期 port は `corporate-site=4321`、`cms=4173` を割り当てる。
- 対象 app は `build`、`preview`、`e2e:serve` を持ち、root Playwright は `e2e:serve` だけを呼び出す。
- 初期実装の `apps/corporate-site` は `e2e:serve` で `build` 後に `preview` を起動する。
- app 固有の preview command は root に直書きせず、workspace script contract で接続する。

```mermaid
flowchart TD
    Dev["Developer / CI<br/>pnpm e2e"] --> Root["root<br/>playwright.config.ts"]
    Root -->|"E2E_TARGET<br/>(既定: corporate-site)"| Selector{対象 app}
    Root -->|"E2E_PORT / E2E_BASE_URL<br/>を解決"| Selector
    Selector -->|corporate-site| Corporate["apps/corporate-site<br/>e2e:serve"]
    Selector -->|cms (Phase 2 以降)| CMS["apps/cms<br/>e2e:serve"]
    Corporate --> CorporateBuild["build → preview<br/>:4321"]
    CMS --> CMSBuild["build → preview<br/>:4173"]
    CorporateBuild --> Suite["e2e/&lt;target&gt;/<br/>Playwright suite"]
    CMSBuild --> Suite
    Suite --> Result["pass / fail"]
```

図の要点:

- root は `e2e:serve` 契約だけに依存し、app 固有 command を知らない。
- 新 app を E2E 対象にするには `build` / `preview` / `e2e:serve` を実装し、`E2E_TARGET` に追加するだけで足りる。
- port 衝突を避けるため、各 app の preview port は本 contract で固定する。

## API / Functions の検証境界

Cloudflare Pages Functions / Workers を伴う feature は、ローカル E2E runtime と Cloudflare runtime の差を前提に検証境界を分ける。

- Playwright E2E は導線・表示・client 分岐を検証する。外部送信や実メール送信を避けるため、同一オリジン API は route intercept で fixture 化する。
- Workers の validation / security / error code mapping は Vitest unit test で検証する。
- Cloudflare Pages Functions と実 secret / 外部サービスの結線は preview deployment で手動スモーク確認する。CI E2E は Cloudflare runtime に依存させない。
- E2E fixture は feature doc の API / error contract に従い、成功・validation error・security error・rate limit・外部送信失敗など主要分岐を固定する。

## 横断テスト方針

- 公開判定には deploy 成功だけでなく、preview での導線確認を含める ([infrastructure.md](infrastructure.md))。
- `apps/cms` 追加時の候補技術・採用判断ゲートのテスト観点は [DesignDoc_cms.md](../design/features/cms/DesignDoc_cms.md) を正本とする。
