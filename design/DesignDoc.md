# Kufu Monorepo Design Docs

本 Design Doc は Kufu Monorepo の **全体像 (system landscape)** を扱う。Goal / モジュール責務 / 横断方針を示し、詳細は feature doc と context library へ委譲する。

## Latest Updated At

- 2026-05-31

## Related PRD

- [PRD.md](../PRD.md)

## Related ADRs

| ADR                                                                    | 決定                                                        | 関連ドキュメント                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [ADR-0001](../adr/0001-terraform-infra-repository-boundary.md)         | Cloudflare の Terraform は別 repo (`kufu-infra`) で管理する | [context/infrastructure.md](../context/infrastructure.md)                                    |
| [ADR-0002](../adr/0002-monorepo-scaffold-create-command-policy.md)     | app scaffold は公式 create command を優先する               | [context/toolchain.md](../context/toolchain.md)                                              |
| [ADR-0003](../adr/0003-phase1-corporate-site-only-and-cms-deferred.md) | Phase 1 は `apps/corporate-site` のみ。`apps/cms` は後続    | [features/corporate-site.md](features/corporate-site.md), [features/cms.md](features/cms.md) |

## Repository References

- app repo: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- infra repo: `$(ghq root)/github.com/Fukuemon/kufu-infra`

## Goal

Kufu のコーポレートサイトを Astro で高いパフォーマンスと保守性を保って構築する。
将来的に CMS アプリ、管理画面、業務効率化系のツールなどを構築することを視野に入れ、共通の設定やデザインの基盤を整えておく。

## Non Goals

- 初期フェーズで CMS/API、認証、管理画面、業務ツールを実装すること。
- Astro で完結できるコーポレートサイト機能を React へ寄せること。
- `packages/ui` を将来未確定の用途まで見越して過剰に抽象化すること。

## Background

### 前提用語

- コーポレートサイト: Kufu のマーケティングサイト。
- Island: Astro ページ上で必要箇所だけクライアント実行される UI。
- app: `apps/*` 配下の実行単位。
- package: `packages/*` 配下の共有 UI、設定、ライブラリ。
- spec: issue / 機能単位で、要求、設計、テスト観点を整理する作業文書。
- feature doc: feature 単位の設計 (How) を残す永続文書 ([features/](features/))。
- context: 技術スタック規約・codebase architecture・運用契約を集約する永続ナレッジ層 ([context/](../context/))。
- ADR: 長期参照する意思決定ログ。

### 背景

Kufu Monorepo は、Phase 1 でコーポレートサイトを作ることを主目的とする。コーポレートサイトは表示速度、情報の分かりやすさ、公開前検証が重要であり、不要な React 化やクライアント JavaScript の増加を避ける必要がある。一方で、将来は React ベースの CMS アプリや管理画面、CMS/API 連携が必要になる可能性がある。初期から app / package の責務と AI 向けルールを定義しておくことで、将来拡張時もコーポレートサイトの性能と monorepo の一貫性を守れる。

### 設計上の前提

- Phase 1 の主対象は `apps/corporate-site` である。
- `apps/cms` はコーポレートサイト掲載投稿を管理する将来 app 候補として定義し、Phase 1 では実装せず設計だけを後続 issue / spec に送る。
- UI の共通化は、Phase 1 で `packages/ui` skeleton を置き、本格運用は複数 consumer が出た時点で進める。
- TypeScript、lint、format、test 設定は `packages/config` に寄せる。
- pnpm workspace と Turborepo を使い、app / package 単位でタスクを実行する。
- CMS/API は初期スコープ外で、必要時に ADR と spec を作成して採否を決める。

## Overview

Kufu Monorepo は、`apps`、`packages`、root 管理の `e2e`、`docs workflow` の 4 つの領域で構成する。

```mermaid
flowchart LR
    VISITOR["Visitor"]
    Corporate["apps/corporate-site (Astro)"]
    CMS["apps/cms (future app)"]
    UI["packages/ui (shared UI skeleton)"]
    CONFIG["packages/config"]
    E2E["e2e/ + playwright.config.ts"]
    DOCS["PRD / Design Docs / specs / ADR"]

    VISITOR --> Corporate
    CMS --> UI
    Corporate --> CONFIG
    CMS --> CONFIG
    UI --> CONFIG
    E2E --> Corporate
    DOCS --> Corporate
    DOCS --> CMS
    DOCS --> UI
    DOCS --> CONFIG
```

## モジュール責務

| Module                | Responsibility                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `apps/corporate-site` | Astro によるコーポレートサイト。静的生成、コンテンツ構成、必要最小限の island を担う。                        |
| `apps/cms`            | コーポレートサイト掲載投稿を管理する将来 app。Phase 1 では実装せず、Phase 2 で app shell と責務を設計する。   |
| `packages/ui`         | 複数 app / feature で再利用が明確になった UI 基盤を置く。Phase 1 で skeleton を置き、共有需要に応じて育てる。 |
| `packages/config`     | TypeScript、oxlint、Vitest など共有価値の高い設定を集約する。                                                 |
| `e2e`                 | root 管理の Playwright による公開前検証と主要導線の回帰テストを担う。                                         |
| `specs`               | issue / 機能単位の要求、論点、設計、テスト観点を整理する。                                                    |
| `adr`                 | 長期参照する技術選定や責務境界の意思決定を残す。                                                              |

## Feature 設計

feature 単位の設計 (データ構造・画面・主要シナリオ / フロー) は [design/features/](features/) を正本とする。実装レベルの手順は spec へ委譲する。

| Feature            | 文書                                                     | Phase   |
| ------------------ | -------------------------------------------------------- | ------- |
| コーポレートサイト | [features/corporate-site.md](features/corporate-site.md) | Phase 1 |
| CMS / React アプリ | [features/cms.md](features/cms.md)                       | Phase 2 |

## Engineering Context

技術スタック規約・codebase architecture・運用契約は [context/](../context/) ライブラリを正本とする。

| トピック                                    | 文書                                                      |
| ------------------------------------------- | --------------------------------------------------------- |
| package / runtime / state boundary          | [context/architecture.md](../context/architecture.md)     |
| toolchain・build・scaffold policy           | [context/toolchain.md](../context/toolchain.md)           |
| root task / shared config / quality gate    | [context/engineering.md](../context/engineering.md)       |
| E2E runtime contract / unit test            | [context/testing.md](../context/testing.md)               |
| infra / deployment / environment / security | [context/infrastructure.md](../context/infrastructure.md) |

## Alternatives Considered

### コーポレートサイトも React SPA で作る

- 利点: React app と技術を統一しやすい。
- 欠点: コーポレートサイトに不要な JavaScript が増えやすく、性能と静的生成の利点を失う。
- 不採用理由: Phase 1 の主価値はコーポレートサイトの高速公開と保守性であり、Astro の方が適しているため。

### app ごとに UI を個別実装する

- 利点: 初期実装は速い。
- 欠点: デザインや挙動が分岐し、将来の修正コストが上がる。
- 不採用理由: monorepo の価値は再利用性と一貫性にあるため。

### 初期から CMS/API を作る

- 利点: コンテンツ更新の自由度が高い。
- 欠点: 初期のコーポレートサイト公開に対して複雑性が高く、運用や認証の設計も必要になる。
- 不採用理由: 現時点の主目的は Astro コーポレートサイトの構築であり、CMS は必要性が具体化してから判断するため。

## 設計上の重要ポイント

- コーポレートサイトの performance と SEO を最優先する。
- Astro で解決できるものを React island にしない。
- 初期インフラは Cloudflare の標準機能で閉じ、独自サーバ運用を前提にしない。
- Terraform は別 repo 管理とし、アプリ repo に本番基盤の apply 導線を持ち込まない。
- React アプリでは URL、server state、client state を分けて扱う。
- AI workflow は spec / ADR / package boundary を参照して、対象外の実装を避ける。
- CMS/API は「将来の選択肢」であり、初期の前提として実装しない。

## Open Questions

- コーポレートサイトの具体的なページ構成とコンテンツ更新フローをどこまで初期 spec に含めるか。
- `packages/ui` skeleton から本格共有 package へ移行する判断条件をどの時点で固定するか。
- CMS が必要になる判断基準をどの指標で固定するか。
- infra repo と app repo の変更をどの workflow で相互参照し、review 漏れを防ぐか。
- Cloudflare Pages の preview / production に紐づく domain, branch, secret の運用ルールをどの粒度で repo に明文化するか。
