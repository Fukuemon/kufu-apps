---
root: true
targets:
  - "*"
globs:
  - "**/*"
---

# Kufu Platform Agent Operating Contract

## Repository Overview

本リポジトリは、Kufuのプロダクト群（LP・業務効率化ツール）を管理する pnpm monorepo である。

- LP（マーケティングサイト）
- 業務ツール（Reactベース）
- 共通UI・設定・テスト基盤

を単一リポジトリで管理する。

### Repository Structure

```bash
<repo-root>/
├── apps/
│   ├── base/        # React + Vite 業務アプリ
│   └── lp-site/     # Astro LP
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
| base       | 業務効率化ツール（メインアプリ） | React + Vite + TypeScript |
| lp-site    | LP・マーケティングサイト         | Astro                     |
| ui         | 共通UIコンポーネント             | React + shadcn/ui         |
| config     | 共通設定                         | TypeScript / lint config  |
| e2e        | E2Eテスト                        | Playwright                |

## Frontend Architecture Rules

### React（base）

- UIは @kufu/ui を必ず経由する
- 直接shadcn/uiを各アプリで重複定義しない
- state管理は局所化（過度なグローバル状態を避ける）

### Astro（lp-site）

- 原則 .astro コンポーネントを使用する
- Reactコンポーネントは 必要な箇所のみ island として利用

例：

```astro
<Button client:load />
```

- 不要なクライアントJSを増やさない

## UI Design System Rules

### 基本方針

- shadcn/ui をベースにする
- packages/ui に集約する
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
- UIの重複実装
- デザインの分岐（統一感を壊す変更）

## Toolchain Rules

### Package Manager

- pnpm workspace を利用する
- 依存追加は必ず --filter を使う

例：

```sh
pnpm --filter @kufu/base add <package>
```

### Build Tools

- React: Vite
- LP: Astro

### Lint / Format

- lint: oxc（oxlint）
- format: oxc（oxfmt）

```sh
pnpm lint
pnpm format
```

### Test

- unit: Vitest
- e2e: Playwright

### Storybook

- UIコンポーネントは Storybook で管理
- packages/ui にのみ配置

### Development Workflow

#### 起動

```bash
pnpm dev
```

##### 個別

```bash
pnpm dev:base
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
- @kufu/base
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

## Forbidden Patterns

- 各アプリでのUIの独自実装
- stateのグローバル乱用
- 不必要なReact化（Astroで解決できるものはAstroで）
- 共通化されていないユーティリティ関数

## Future Extension Strategy

将来的に以下を追加可能：

- apps/admin
- apps/internal-tool
- packages/api-client
- packages/auth

## Output Format Rules

コード調査結果は以下形式で記載：

```sh
- {説明}
  - `<path>:<line-range>`
```

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
