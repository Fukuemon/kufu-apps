# Feature 設計: コーポレートサイト (apps/corporate-site)

> 最終更新: 2026-05-31 / Status: 設計済 (Phase 1 skeleton)

Phase 1 の主対象。Astro によるコーポレートサイトを高いパフォーマンスと保守性で公開する。全体像は [design/DesignDoc.md](../../DesignDoc.md)、横断規約は [context/](../../../context/) を参照する。

## メタ

| 項目           | 値                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 関連 PRD 要求  | [PRD.md](../../../PRD.md) 「コーポレートサイト要求」「Phase 1 スコープ」                                                                                |
| 関連 DesignDoc | [DesignDoc.md](../../DesignDoc.md) Goal / モジュール責務                                                                                                |
| 関連 context   | [architecture.md](../../../context/architecture.md), [testing.md](../../../context/testing.md), [infrastructure.md](../../../context/infrastructure.md) |
| 関連 ADR       | [ADR-0002](../../../adr/0002-monorepo-scaffold-create-command-policy.md), [ADR-0003](../../../adr/0003-phase1-corporate-site-only-and-cms-deferred.md)  |
| 関連 spec      | [specs/3-monorepo-foundation/](../../../specs/3-monorepo-foundation/)                                                                                   |
| 対象モジュール | `corporate-site`                                                                                                                                        |

## 背景・要件解釈

- コーポレートサイトは表示速度、情報の分かりやすさ、公開前検証が重要。不要な React 化やクライアント JavaScript の増加を避ける。
- Phase 1 では `apps/corporate-site` を Astro コーポレートサイトとして成立させ、`packages/ui` skeleton と共有設定の入口を用意する。

## スコープ

### やること

- `apps/corporate-site` を Astro コーポレートサイトとして構築する。
- コーポレートサイトの主要ページと問い合わせ導線を E2E で検証できる状態にする。
- コーポレートサイト内で閉じる UI を colocation で配置する。

### やらないこと

- Astro で完結できるコーポレートサイト機能の React 化。
- CMS 化 (コンテンツ管理は Phase 2 以降、[cms.md](../cms/DesignDoc_cms.md))。

## 設計

### 設計方針

- コーポレートサイトは Astro の `.astro` コンポーネントを基本にする。
- React island はフォーム、動的 UI、外部 widget など必要な箇所に限定する。
- コーポレートサイトの画像、フォント、スクリプトは性能予算を意識して管理する。
- 第一原則は feature / colocation とし、app や feature 内で閉じる UI はローカルに置く。
- 共通 UI は利用箇所が複数 app / feature にまたがる時点で `packages/ui` へ移す ([architecture.md](../../../context/architecture.md))。
- Phase 1 では `packages/ui` の skeleton を置くが、コーポレートサイト内で閉じる UI は引き続き `apps/corporate-site` に置く。
- E2E はコーポレートサイトの表示、主要導線、問い合わせ導線を優先し、実行入口は root `playwright.config.ts` と `e2e/` 配下に置く ([testing.md](../../../context/testing.md))。

### データ / コンテンツモデル

- コーポレートサイトの静的コンテンツは、初期段階では `apps/corporate-site` 内に配置する。
- CMS 化するまでは、コンテンツ更新の責務とレビュー観点を spec に残す。
- 画像や動画などの assets はコーポレートサイトの性能予算を考慮して配置、圧縮、読み込み方式を決める。
- 公開 asset は Cloudflare CDN 配信を前提に、キャッシュ戦略と更新単位を意識して配置する ([infrastructure.md](../../../context/infrastructure.md))。

## 主要シナリオ / フロー

アクター視点の使用シナリオを示す。具体的な実装手順 (ページ配置・client directive 判断・`packages/ui` 昇格・E2E の書き方) は spec の User Flow / 実装分割へ委譲する。

- 訪問者は、コーポレートサイトで Kufu の事業内容・サービスを把握し、問い合わせ導線へ進む。
- 運用者は、コーポレートサイトのセクションや文言を更新し、公開前に主要導線を検証して公開する。

## テスト観点

- `apps/corporate-site` が build できること。
- Cloudflare Pages preview deployment で主要ページが表示できること。
- コーポレートサイトの主要ページと問い合わせ導線が Playwright で確認できること。
- Astro ページに不要な React island や client directive が増えていないこと。

## 上位資料からの変更点

| 対象資料  | 変更種別 | 内容                                                                 |
| --------- | -------- | -------------------------------------------------------------------- |
| PRD       | 継承     | 「コーポレートサイト要求」「Phase 1 スコープ」を実現方針へ落とし込み |
| DesignDoc | 継承     | Goal / モジュール責務 (`apps/corporate-site`) を具体化               |
