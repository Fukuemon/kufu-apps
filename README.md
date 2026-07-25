# Kufu Monorepo

Kufu のコーポレートサイト、Phase 2 以降の CMS / 業務アプリ、共通 UI / 設定 / テスト基盤を pnpm workspace で管理する monorepo。

Phase 1 は Astro によるコーポレートサイト構築を最優先とする。CMS/API、管理画面、内部業務ツールは初期スコープ外で、必要になった時点で spec / ADR により採否を判断する。

## Requirements

- Node.js `>=22.12.0`
- pnpm `10.27.0`

## Setup

```sh
pnpm install
```

## Commands

正本は [context/project.yml](context/project.yml) の Quick Commands。主要コマンドのみ抜粋:

| コマンド                       | 内容                     |
| ------------------------------ | ------------------------ |
| `pnpm dev:corporate`           | コーポレートサイトを起動 |
| `pnpm build`                   | ビルド                   |
| `pnpm lint` / `pnpm typecheck` | 静的検査 / 型チェック    |
| `pnpm test` / `pnpm e2e`       | 単体テスト / E2E         |

開発サーバーは `http://127.0.0.1:4321` で起動する。

`pnpm storybook:pages` は `packages/ui` と `apps/corporate-site` の Storybook を build し、GitHub Pages 用 artifact を `.storybook-pages/` に生成する。PR では `pr-preview/pr-<number>/` へ、`develop` への push 後は Pages root へ deploy される。

## Project Structure

```text
.
├── apps/
│   └── corporate-site/  # Astro コーポレートサイト
├── packages/
│   ├── ui/              # 共通 UI / デザイントークン / フォント
│   └── config/          # 共通 tsconfig / lint / test 設定
├── e2e/                 # ルート管理の Playwright テスト
├── design/              # 設計文書
├── context/             # 技術規約 / 運用契約
├── adr/                 # 意思決定記録
├── specs/               # Issue 単位の作業 spec
└── templates/           # spec / ADR / requirements テンプレート
```

### Package Boundaries

- `apps/corporate-site`: Astro のページ、ルーティング、コンテンツ構成、必要最小限の island
- `packages/ui`: 共通デザイン基盤 (token / font / stylesheet entry / 再利用が明確な UI)
- `packages/config`: TypeScript / lint / test の共有設定
- `e2e`: ルート管理の Playwright テスト

禁止: 再利用すべき UI の app 内重複、app 間の直接依存、コーポレートサイトでの不要な React island、実装コードでの token 値直書き。

## Documentation

確認順は上から。

| 層                       | 文書                                       | 役割                                                                      |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------------------- |
| Why / What / How: 全体像 | [design/DesignDoc.md](design/DesignDoc.md) | 誰のどの課題を、なぜ・何で解決するか / 全体像 / モジュール責務 / 横断方針 |
| How: feature             | [design/features/](design/features/)       | feature 単位の設計                                                        |
| How: 技術規約            | [context/](context/)                       | 技術スタック規約 / codebase architecture / 運用契約                       |
| Decision                 | [adr/](adr/)                               | 長期参照する意思決定                                                      |
| Issue 作業文書           | [specs/](specs/)                           | Issue / 機能単位の要求・設計・テスト観点                                  |

AI エージェント向けの操作契約は [AGENTS.md](AGENTS.md)。`AGENTS.md` / `CLAUDE.md` / `.codex/` / `.claude/` / `.cursor/` は生成物のため直接編集せず、`.rulesync/` を正本として更新する。

## Workflow

1. [Documentation](#documentation) の順に正本を確認する。
2. feature 作業では `specs/<issue-number>-<slug>/` に Issue 単位の spec を作成・更新する。
3. Issue を越えて残る判断は feature doc、`context/`、`adr/` へ反映する。
4. PR 作成・更新前に、対象範囲に応じた品質検査を実行する。

コマンドの対象範囲判断と E2E 実行の詳細は [context/engineering.md](context/engineering.md) / [context/testing.md](context/testing.md) を参照。
