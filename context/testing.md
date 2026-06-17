# Testing Conventions

> 最終更新: 2026-06-17

E2E runtime contract と unit test の横断規約。feature 固有のテスト観点は各 [design/features/](../design/features/) に置く。

## テスト責務の分担

| 種別      | 配置                      | 主担当範囲                                      |
| --------- | ------------------------- | ----------------------------------------------- |
| Unit test | 各 app / package (Vitest) | ロジック、shared UI、shared config の利用可能性 |
| E2E       | root `e2e/` (Playwright)  | 公開前検証、主要導線、回帰                      |

- `packages/ui` の共有 UI は Storybook / unit test で確認できること。
- `packages/config` の共有設定を各 app / package が利用できること。

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
    Selector -->|cms (将来)| CMS["apps/cms<br/>e2e:serve"]
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
- `apps/cms` 追加時は TanStack Router / TanStack Query / React Hook Form / Zustand / React Compiler 前提が守られることを確認する。
- CMS/API を導入する場合は、ADR と spec が先に作成されていること。
