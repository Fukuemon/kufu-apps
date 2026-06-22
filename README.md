# Kufu Monorepo

Kufu Monorepo は、Kufu のコーポレートサイト、将来の CMS / 業務アプリ、共通 UI / 設定 / テスト基盤を pnpm workspace で管理するリポジトリです。

Phase 1 では Astro によるコーポレートサイト構築を最優先にします。CMS/API、管理画面、内部業務ツールは初期スコープ外で、必要になった時点で spec / ADR により採否を判断します。

## ドキュメント

迷ったら次の順に確認します。

| 層             | 文書                                       | 役割                                                |
| -------------- | ------------------------------------------ | --------------------------------------------------- |
| Why / What     | [PRD.md](PRD.md)                           | 誰のどの課題を、なぜ・何で解決するか                |
| How: 全体像    | [design/DesignDoc.md](design/DesignDoc.md) | 全体像 / モジュール責務 / 横断方針                  |
| How: feature   | [design/features/](design/features/)       | feature 単位の設計                                  |
| How: 技術規約  | [context/](context/)                       | 技術スタック規約 / codebase architecture / 運用契約 |
| Decision       | [adr/](adr/)                               | 長期参照する意思決定                                |
| Issue 作業文書 | [specs/](specs/)                           | Issue / 機能単位の要求・設計・テスト観点            |

AI エージェント向けの操作契約は [AGENTS.md](AGENTS.md) を参照します。`AGENTS.md` / `CLAUDE.md` / `.codex/` / `.claude/` / `.cursor/` は生成物で、変更する場合は `.rulesync/` を正本として更新します。

## リポジトリ構成

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

## Requirements

- Node.js `>=22.12.0`
- pnpm `10.27.0`

依存関係をインストールします。

```sh
pnpm install
```

## コマンド

| やりたいこと             | コマンド               |
| ------------------------ | ---------------------- |
| 全 app を起動            | `pnpm dev`             |
| コーポレートサイトを起動 | `pnpm dev:corporate`   |
| ビルド                   | `pnpm build`           |
| 静的検査                 | `pnpm lint`            |
| 型チェック               | `pnpm typecheck`       |
| 単体テスト               | `pnpm test`            |
| E2E                      | `pnpm e2e`             |
| 整形                     | `pnpm format`          |
| 整形確認                 | `pnpm format:check`    |
| Storybook Pages 生成     | `pnpm storybook:pages` |
| 未使用コード / 依存検査  | `pnpm knip`            |
| 依存境界検査             | `pnpm depcruise`       |

コーポレートサイトの開発サーバーは `http://127.0.0.1:4321` で起動します。

`pnpm storybook:pages` は `packages/ui` と `apps/corporate-site` の Storybook を build し、GitHub Pages 用 artifact を `.storybook-pages/` にまとめます。PR では `pr-preview/pr-<number>/` へ preview deploy し、`develop` への push 後は Pages root へ deploy されます。

## パッケージ境界

- `apps/corporate-site` は Astro のページ、ルーティング、コンテンツ構成、必要最小限の island を担います。
- `packages/ui` は共通のデザイン基盤、つまり token、font、stylesheet entry、再利用が明確な UI を担います。
- `packages/config` は TypeScript、lint、test の共有設定を担います。
- `e2e` はルート管理の Playwright テストを担います。

再利用すべき UI の app 内重複、app 間の直接依存、コーポレートサイトでの不要な React island、実装コードでの token 値の直書きは避けます。

## Workflow

1. [ドキュメント](#ドキュメント) の順に正本を確認します。
2. feature 作業では `specs/<issue-number>-<slug>/` に Issue 単位の spec を作成または更新します。
3. Issue を越えて残る判断は feature doc、`context/`、`adr/` へ反映します。
4. PR を作成または更新する前に、対象範囲に応じた品質検査を実行します。

コマンドの対象範囲判断と E2E 実行時の詳細は [context/engineering.md](context/engineering.md) と [context/testing.md](context/testing.md) を参照します。
