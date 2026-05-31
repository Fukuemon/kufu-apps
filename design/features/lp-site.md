# Feature 設計: LP サイト (apps/lp-site)

> 最終更新: 2026-05-31 / Status: 設計済 (Phase 1 skeleton)

Phase 1 の主対象。Astro による LP を高いパフォーマンスと保守性で公開する。全体像は [design/DesignDoc.md](../DesignDoc.md)、横断規約は [context/](../../context/) を参照する。

## メタ

| 項目           | 値                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 関連 PRD 要求  | [PRD.md](../../PRD.md) 「LP 要求」「Phase 1 スコープ」                                                                                         |
| 関連 DesignDoc | [DesignDoc.md](../DesignDoc.md) Goal / モジュール責務                                                                                          |
| 関連 context   | [architecture.md](../../context/architecture.md), [testing.md](../../context/testing.md), [infrastructure.md](../../context/infrastructure.md) |
| 関連 ADR       | [ADR-0002](../../adr/0002-monorepo-scaffold-create-command-policy.md), [ADR-0003](../../adr/0003-phase1-lp-only-and-cms-deferred.md)           |
| 関連 spec      | [specs/3-monorepo-foundation/](../../specs/3-monorepo-foundation/)                                                                             |
| 対象モジュール | `lp-site`                                                                                                                                      |

## 背景・要件解釈

- LP は表示速度、情報の分かりやすさ、公開前検証が重要。不要な React 化やクライアント JavaScript の増加を避ける。
- Phase 1 では `apps/lp-site` を Astro LP として成立させ、`packages/ui` skeleton と共有設定の入口を用意する。

## スコープ

### やること

- `apps/lp-site` を Astro LP として構築する。
- LP の主要ページと問い合わせ導線を E2E で検証できる状態にする。
- LP 内で閉じる UI を colocation で配置する。

### やらないこと

- Astro で完結できる LP 機能の React 化。
- CMS 化 (コンテンツ管理は Phase 2 以降、[cms.md](cms.md))。

## 設計

### 設計方針

- LP は Astro の `.astro` コンポーネントを基本にする。
- React island はフォーム、動的 UI、外部 widget など必要な箇所に限定する。
- LP の画像、フォント、スクリプトは性能予算を意識して管理する。
- 第一原則は feature / colocation とし、app や feature 内で閉じる UI はローカルに置く。
- 共通 UI は利用箇所が複数 app / feature にまたがる時点で `packages/ui` へ移す ([architecture.md](../../context/architecture.md))。
- Phase 1 では `packages/ui` の skeleton を置くが、LP 内で閉じる UI は引き続き `apps/lp-site` に置く。
- E2E は LP の表示、主要導線、問い合わせ導線を優先し、実行入口は root `playwright.config.ts` と `e2e/` 配下に置く ([testing.md](../../context/testing.md))。

### データ / コンテンツモデル

- LP の静的コンテンツは、初期段階では `apps/lp-site` 内に配置する。
- CMS 化するまでは、コンテンツ更新の責務とレビュー観点を spec に残す。
- 画像や動画などの assets は LP の性能予算を考慮して配置、圧縮、読み込み方式を決める。
- 公開 asset は Cloudflare CDN 配信を前提に、キャッシュ戦略と更新単位を意識して配置する ([infrastructure.md](../../context/infrastructure.md))。

## 主要ユースケース

### 1. LP ページを追加する

1. `apps/lp-site` に Astro ページまたは section component を追加する。
2. 静的な表示で足りる場合は `.astro` に閉じる。
3. 動的 UI が必要な場合だけ React island を使う。
4. 複数 app / feature をまたぐ再利用が明確な UI だけを `packages/ui` へ移す。
5. Playwright で主要導線を確認する。

### 2. 共通 UI を追加する

1. 第一原則は feature / colocation とし、複数 app または feature をまたぐ再利用が明確な UI だけを `packages/ui` に追加する。
2. shadcn/ui ベースの実装は app 配下で重複定義しない。
3. Storybook は `packages/ui` skeleton の入口として置き、利用状態確認の本格運用は後続で整える。
4. LP 側で使う場合は、不要な client directive が増えないか確認する。

## テスト観点

- `apps/lp-site` が build できること。
- Cloudflare Pages preview deployment で主要ページが表示できること。
- LP の主要ページと問い合わせ導線が Playwright で確認できること。
- Astro ページに不要な React island や client directive が増えていないこと。

## 上位資料からの変更点

| 対象資料  | 変更種別 | 内容                                                  |
| --------- | -------- | ----------------------------------------------------- |
| PRD       | 継承     | 「LP 要求」「Phase 1 スコープ」を実現方針へ落とし込み |
| DesignDoc | 継承     | Goal / モジュール責務 (`apps/lp-site`) を具体化       |
