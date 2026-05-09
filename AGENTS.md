# Kufu Platform Agent Operating Contract

## Repository Reference Rules

- 本プロジェクトは `ghq` を利用してリポジトリを管理する
- リポジトリの path を記載する場合は `$(ghq root)/<repository-path>/...` の形式を優先する
- Kufu 関連のアプリケーション repo は `$(ghq root)/github.com/Fukuemon/kufu-apps` に配置する
- Kufu 関連の infra repo は `$(ghq root)/github.com/Fukuemon/kufu-infra` に配置する
- 兄弟リポジトリの path 定義は本ルールを正本とし、spec / ADR / skill では必要箇所のみ参照する

## Repository Map

```sh
$(ghq root)/github.com/Fukuemon/
├── kufu-apps/
└── kufu-infra/
```

## Repository Overview

本リポジトリは、Kufuのプロダクト群（LP・CMS候補・共通基盤）を管理する pnpm monorepo である。

- LP（マーケティングサイト）
- CMS候補（将来の投稿管理アプリ）
- 共通UI・設定・テスト基盤

を単一リポジトリで管理する。

### Repository Structure

```bash
<repo-root>/
├── apps/
│   ├── lp-site/     # Astro LP
│   └── cms/         # 将来の投稿管理アプリ候補（Phase 1 では未実装）
├── packages/
│   ├── ui/          # 共通UI（shadcn/uiベース）
│   └── config/      # 共通設定（lint / tsconfig 等）
├── e2e/             # Playwright E2Eテスト
├── package.json
├── pnpm-workspace.yaml
└── playwright.config.ts
```

### Module Responsibilities

| モジュール | 用途                             | 技術                      |
| ---------- | -------------------------------- | ------------------------- |
| cms        | LP掲載投稿の管理アプリ候補       | Hono + Inertia + React    |
| lp-site    | LP・マーケティングサイト         | Astro                     |
| ui         | 共通UIコンポーネント             | React + shadcn/ui         |
| config     | 共通設定                         | TypeScript / lint config  |
| e2e        | E2Eテスト                        | Playwright                |

## Architecture Policy

- Monorepo は pnpm workspace で構成する
- Package by Feature・colocation を基本とし、Feature 単位で責務を分離する
- フロントエンド主導で設計し、Backend は必要になった時点で分離する
- React Compiler を利用する
- React Compiler に対応していないライブラリを利用する場合は必ず調査し、必要なら `'use no memo'` ディレクティブを追加する
  - 参考: https://kakehashi-dev.hatenablog.com/entry/2026/03/24/090000
- 型安全を重視し、TypeScript First で実装する
- URL を状態管理の一部として扱い、Router 中心で設計する
- AI フレンドリーな構造を保つため、ドキュメント、命名、責務分離、明文化、ガードレールを優先する

## Frontend Architecture Rules

### React / CMS（future）

- UIライブラリは React を標準とする
- UIは @kufu/ui を必ず経由する
- 直接shadcn/uiを各アプリで重複定義しない
- shadcn registry 由来の共有コンポーネントは `packages/ui` に追加する
- React app は `@kufu/ui` の shared component を利用し、app 固有の見た目差分は wrapper / composition で吸収する
- state管理は局所化（過度なグローバル状態を避ける）
- ルーティングは TanStack Router を標準とする
- データフェッチは TanStack Query を標準とする
- axios 等は標準では利用しない
- フォーム管理は React Hook Form を標準とする
- client state が必要な場合は Zustand を局所的に使う
- URLで表現できる状態は Router 側へ寄せる
- React Compiler を利用する前提で実装する
- React Compiler 非対応ライブラリや実装パターンを使う場合は一次情報を確認し、必要なら `'use no memo'` を追加する

### Astro（lp-site）

- LP フレームワークは Astro を標準とする
- 原則 .astro コンポーネントを使用する
- Reactコンポーネントは 必要な箇所のみ island として利用
- `apps/lp-site` は `@kufu/ui` の React component を標準では利用せず、styles / design token / font などの design foundation を利用する
- LP 固有 UI は `apps/lp-site` 配下に置き、Astro で解決できるものを不要に React 化しない

例：

```css
@import "@kufu/ui/styles.css";
```

- 不要なクライアントJSを増やさない

## UI Design System Rules

### 基本方針

- shadcn/ui をベースにする
- 第一原則は Feature / colocation とする
- app や Feature 内で閉じる UI はローカルに置く
- `packages/ui` には複数 app / Feature をまたぐ再利用が明確になった UI 基盤だけを集約する
- `packages/ui` は React app 向け shadcn component の正規置き場であり、あわせて全 app が参照する design token / font / theme / shared stylesheet を持つ
- Astro app は `@kufu/ui/styles.css` などの design foundation を利用し、shadcn registry component の consumer にはしない
- 各アプリでの直接利用は禁止

### ディレクトリ構造

```sh
packages/ui/
├── components/
│   ├── button.tsx
│   ├── dialog.tsx
│   └── form.tsx
├── lib/
│   └── utils.ts
```

### 禁止事項

- apps配下で shadcn/ui を直接 init すること
- Astro app に shadcn registry component の追加先を分散させること
- Feature / colocation を崩してまで UI を早期に共通化すること
- デザインの分岐（統一感を壊す変更）

## Toolchain Rules

### Package Manager

- pnpm workspace を利用する
- 依存追加は必ず --filter を使う

例：

```sh
pnpm --filter @kufu/<module> add <package>
```

### Build Tools

- React: Vite
- LP: Astro
- Bundler: Rolldown
- Task runner: Turborepo

### Lint / Format

- lint: oxc（oxlint）
- format: oxc（oxfmt）
- typecheck: TypeScript

```sh
pnpm lint
pnpm format
```

### Test

- unit: Vitest
- UI: Storybook
- e2e: Playwright

### Storybook

- UIコンポーネントは Storybook で管理
- packages/ui にのみ配置

### Analysis / Maintenance

- dead code detection: knip
- dependency analysis: dependency-cruiser

### Library Development

- package build: tsdown

### Development Workflow

#### 起動

```bash
pnpm dev
```

##### 個別

```bash
pnpm dev:lp
```

#### ビルド

```bash
pnpm build
```

##### テスト

```bash
pnpm test
pnpm e2e
```

## Infrastructure Rules

- Phase 1 の公開基盤は Cloudflare を標準とする
- `apps/lp-site` は Cloudflare Pages への deploy を第一候補とし、Astro の静的生成を前提に設計する
- LP は build artifact 配信を前提とし、Node.js 常駐サーバを初期前提にしない
- 将来 `apps/cms` や追加 app を公開する場合も、まずは Cloudflare Pages または Cloudflare Workers で閉じる構成を優先する
- API や BFF が必要になった場合だけ Cloudflare Workers を検討し、専用サーバや VM を安易に前提化しない
- 画像、フォント、動画などの公開 asset は Cloudflare CDN 配信を前提に最適化する
- DNS、TLS、キャッシュ、圧縮は Cloudflare の標準機能を優先し、app 側で重複実装しない

### Environment Strategy

- local では Cloudflare 依存を前提にせず、`pnpm dev` / `pnpm dev:lp` で完結する構成を優先する
- preview は Cloudflare Pages preview deployment を標準とし、PR / branch ごとの実ページ確認に使う
- production は Cloudflare Pages production deployment を正本とする
- preview URL を使った導線確認を、LP 変更時の標準レビュー手順に含める

### Secrets / Runtime Boundary

- secret、token、API key を client bundle に含めない
- 環境変数は build-time に閉じるものと runtime で扱うものを区別して設計する
- Cloudflare の secret 管理に置くべき値は repo に保存しない
- フォーム送信や外部 API 連携で秘匿情報が絡む場合は、ブラウザから直接第三者 API を叩く構成を標準にしない
- bot 対策や abuse 対策が必要な場合は Cloudflare Turnstile など edge 側サービスを候補に含める

## AI Configuration Workflow

- AI 関連の設定を更新する際は、必ず `.rulesync/` 配下を正本として更新する
- `AGENTS.md`、`CLAUDE.md`、`.codex/`、`.claude/`、`.cursor/` を直接の正本として編集しない
- `.rulesync/` 更新後は次のコマンドで各プロバイダー向け設定へ同期する

```sh
npx rulesync@latest generate
```

- 生成後は `git diff` で `.rulesync/` と生成先の差分が意図どおりであることを確認する
- `npx rulesync@latest generate` が失敗した場合は、生成先を手作業で合わせず、失敗理由を解消して再実行する

## Git Workflow Guardrails

- main は保護ブランチ
- 作業は必ず feature ブランチで行う

```bash
feature/<issue-number>
```

例：

feature/1
feature/2

## Naming Conventions

### パッケージ名

```bash
@kufu/<module>
```

例：

```bash
- @kufu/lp-site
- @kufu/ui
```

### コンポーネント

- PascalCase

```bash
Button.tsx
UserCard.tsx
```

## Performance Rules

- LPはパフォーマンス最優先
- 不要なJSを読み込まない
- AstroのSSR/静的生成を最大活用
- Cloudflare CDN / Pages を前提に、静的配信で解決できるものを app server 問題に持ち込まない

## Forbidden Patterns

- 各アプリでのUIの独自実装
- stateのグローバル乱用
- 不必要なReact化（Astroで解決できるものはAstroで）
- 共通化されていないユーティリティ関数

## Future Extension Strategy

将来的に以下を追加可能：

- apps/cms
- apps/admin
- apps/internal-tool
- packages/api-client
- packages/auth
- Hono API
- Inertia + React

CMS / API 連携は初期スコープ外とし、必要になった時点で spec と ADR を作成して採否を決める。

## Output Format Rules

コード調査結果は以下形式で記載：

```sh
- {説明}
  - `<path>:<line-range>`
```

- リポジトリ path を文書に記載する場合は、可能な限り `$(ghq root)/<repository-path>/...` を使う

## Philosophy

このリポジトリは以下を重視する：

- シンプルさ
- 再利用性
- パフォーマンス
- 一貫性

## Decision Priority

迷った場合は以下の優先順位で判断：

1. パフォーマンス（特にLP）
2. 一貫性（UI / 構造）
3. 開発体験
4. 将来拡張性
