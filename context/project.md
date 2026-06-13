# Project Profile

> 最終更新: 2026-06-14

Kufu Monorepo 固有の値 (リポジトリ / 命名 / コマンド / 対象ドメイン / トラッカー / 正本パス) を集約する **唯一の正本**。`.rulesync/rules/CLAUDE.md` と `spec-*` / `dev-commands` 等の skill は、固有値をハードコードせず本ファイルを読む。

## Repository Map

- リポジトリ管理: `ghq`
- app repo: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- infra repo: `$(ghq root)/github.com/Fukuemon/kufu-infra` (Terraform は別 repo 管理。根拠: [ADR-0001](../adr/0001-terraform-infra-repository-boundary.md))

```text
$(ghq root)/github.com/Fukuemon/
├── kufu-apps/
└── kufu-infra/
```

```text
<repo-root>/
├── apps/
│   └── corporate-site/ # Astro corporate site (Phase 1 の主対象)
├── packages/
│   ├── ui/             # 共通 UI (shadcn/ui ベース、skeleton)
│   └── config/         # 共通設定 (tsconfig / lint 等)
├── design/
│   ├── DesignDoc.md    # 全体像 (landscape)
│   └── features/       # feature 単位の設計
├── context/            # 技術規約 / codebase architecture / 運用契約
├── e2e/                # Playwright (root 管理)
└── playwright.config.ts
```

詳細責務 / Phase 2 以降の予定は [Design Doc](../design/DesignDoc.md) のモジュール責務テーブルを正本とする。

## Naming Conventions

- パッケージ名: `@kufu/<module>` (例: `@kufu/corporate-site`, `@kufu/ui`)
- コンポーネント: PascalCase (例: `Button.tsx`, `UserCard.tsx`)
- ブランチ: `feature/<issue-number>` (例: `feature/21`)

## Quick Commands

| やりたいこと              | コマンド                                     |
| ------------------------- | -------------------------------------------- |
| 開発起動 (全 app)         | `pnpm dev`                                   |
| コーポレートサイトのみ    | `pnpm dev:corporate`                         |
| ビルド                    | `pnpm build`                                 |
| Lint / typecheck          | `pnpm lint` / `pnpm typecheck`               |
| Format (確認)             | `pnpm format:check`                          |
| Unit test                 | `pnpm test`                                  |
| E2E (既定 corporate-site) | `pnpm e2e`                                   |
| 健全性検査                | `pnpm knip` / `pnpm depcruise`               |
| 依存追加                  | `pnpm --filter @kufu/<module> add <package>` |

## 対象ドメイン (spec「実装対象」テーブル用)

`corporate-site`, `cms`, `ui`, `config`, `e2e`, `future-api`, `core`

## Label Policy

Issue / PR のラベル体系の **唯一の正本**。`workflow-git` skill はラベル付与時に本節を読む。命名は **名前空間付き** (`<axis>:<value>`) とし、軸ごとに色を揃える。

### 軸とラベル

| 軸         | ラベル                                                                                                                      | 付与ルール                                                     | 色        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------- |
| `type:*`   | `type:feature` / `type:bug` / `type:research` / `type:task` / `type:chore`                                                  | **必須・1 件**。issue の種類 (issue-format と一致)             | `#1d76db` |
| `phase:*`  | `phase:design` / `phase:implementation`                                                                                     | SDD ライフサイクル。設計 issue は `phase:design`               | `#5319e7` |
| `domain:*` | `domain:corporate-site` / `domain:cms` / `domain:ui` / `domain:config` / `domain:e2e` / `domain:future-api` / `domain:core` | **1 件以上**。上記「対象ドメイン」に対応。横断は `domain:core` | `#0e8a16` |
| (flag)     | `epic`                                                                                                                      | 複数 phase / spec にまたがる大きい要件 (親)                    | `#fbca04` |

### 付与の最低ライン

- すべての issue に `type:*` を 1 件付ける。
- 実装対象が定まる issue には該当する `domain:*` を付ける。
- SDD の設計フェーズ issue には `phase:design`、実装フェーズには `phase:implementation` を付ける。
- 1 つの要件が複数 phase / spec に展開される親 issue には `epic` を付ける。

## Issue Tracker

- Tracker: GitHub
- CLI: `gh`
- Repo: `Fukuemon/kufu-apps`
- Branch pattern: `feature/<issue-id>`

## Source of Truth (正本ドキュメントのパス契約)

`spec-*` skill が参照するパス。`Spec Workflow Contract` はこの表を読む。

- PRD: `PRD.md`
- Design Doc (landscape): `design/DesignDoc.md`
- feature doc dir: `design/features/<feature>/`
- feature doc: `design/features/<feature>/DesignDoc_<feature>.md`
- feature reference (任意): `design/features/<feature>/reference/`
- context library: `context/<topic>.md`
- ADR: `adr/`
- spec dir: `specs/<issue-id>-<slug>/`
- spec body: `specs/<issue-id>-<slug>/index.md`
- spec prompts: `specs/<issue-id>-<slug>/prompts/`
- spec requirements (任意): `specs/<issue-id>-<slug>/requirements.md`
- spec review report (任意): `specs/<issue-id>-<slug>/review.md`

## Templates

- PRD: `templates/prd/template.md`
- Design Doc: `templates/design-doc/template.md`
- context: `templates/context/<topic>.md`
- spec core: `templates/specs/template.md`
- spec appendices: `templates/specs/appendices/<topic>.md`
- feature doc: `templates/features/template.md`
- requirements: `templates/requirements/template.md`
- adr: `templates/adr/template.md`

## Project-Specific Workflows

- デザイン制作 (ワイヤー → UI → 実装) は [design-workflow.md](design-workflow.md) を正本とする。
- Phase A0 の Claude Design 依頼文作成は `design-prompt` skill を使う。
- SDD workflow と直交する Git / GitHub 操作は `workflow-git` skill を使う。

## Decision Priority

迷ったら次の優先度で判断する:

1. **パフォーマンス** (特にコーポレートサイト — Astro 静的生成と最小 island を優先)
2. **一貫性** (UI / 構造 / 命名 — app 配下で独自実装しない)
3. **開発体験**
4. **将来拡張性**

技術選定の根拠は [Design Doc](../design/DesignDoc.md) と [ADR](../adr/)。

## Project-Specific Forbidden Patterns

- 各 app での UI 独自実装 (shadcn/ui の直接 init 含む)
- state のグローバル乱用 (URL で表現できる状態は Router へ寄せる)
- 不必要な React 化 (Astro で解決できるものを React island にしない)
- 共通化されていないユーティリティ関数の散在
- 実装コードでのデザイントークン直書き (raw hex / arbitrary value 等)。`@kufu/ui` / `globals.css` のセマンティックトークンを参照する (トークン正本ガード: [design-workflow.md](design-workflow.md) §6)
