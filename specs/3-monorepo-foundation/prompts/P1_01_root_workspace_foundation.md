# root workspace foundation

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止して確認する
- 参照 path を外れて広く探索しない
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する

## 作業ステップ

1. spec の該当節を確認する
2. prompt 内に埋め込まれた前提と仕様を確認する
3. root `package.json` と `pnpm-workspace.yaml` の初期化方針を決める
4. 対象 path を読む
5. root workspace 基盤を実装する
6. 検証する

## 実装コンテキスト

- Spec: `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
- 対象 path:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/package.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/pnpm-workspace.yaml`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/turbo.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/tsconfig.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/playwright.config.ts`
- 参照ファイル:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/PRD.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/design/DesignDoc.md`

## 前提条件

- ## spec から抜粋した前提:
- root に monorepo として必要な workspace 設定、task runner 設定、主要 scripts を定義する
- root scripts は workspace task を `turbo run` で束ね、root 管理ツールは直実行に分ける
- root public scripts は `dev`、`dev:lp`、`build`、`lint`、`format`、`format:check`、`typecheck`、`test`、`e2e`、`knip`、`depcruise`
- `format` は `oxfmt . --write`、`format:check` は `oxfmt . --check`
- `pnpm typecheck` は root から `turbo run typecheck` で束ねる
- `pnpm e2e` は root `playwright.config.ts` から実行する repository task とする
- ## 実装前に満たしている依存条件:
- なし。この prompt が最初の実装単位である

## 不明点ハンドリング

- `packageManager`、Node.js version、pnpm version が未定義なら repo 既存方針に合わせる。根拠がなければ停止して確認する
- `turbo.json` の pipeline 記法や cache 対象が曖昧でも、Phase 1 は最小導線を優先し過剰最適化しない
- 矛盾や未確定事項を見つけたら停止して確認する

## タスク境界

### 実装する範囲

- root `package.json` の最小 manifest を作成し、pnpm workspace の起点を作る
- root `package.json` の workspace scripts と root devDependencies の定義
- `pnpm-workspace.yaml` に `apps/*` と `packages/*` を含める
- `turbo.json` に `dev`、`build`、`lint`、`typecheck`、`test` を束ねる最小設定を入れる
- root `tsconfig` 入口を追加し、workspace が共有 preset に接続できる前提を作る
- `playwright.config.ts` の雛形を追加し、後続 prompt が E2E wiring を載せられるようにする

### 実装しない範囲

- `apps/lp-site`、`packages/ui`、`packages/config` の中身の実装
- E2E の詳細シナリオ
- knip / dependency-cruiser の詳細設定
- Cloudflare / Terraform / deploy 設定

## 設計仕様

- package manager は pnpm workspace、task runner は Turborepo
- root の `package.json` と `pnpm-workspace.yaml` を先に成立させ、その後に root devDependencies と task runner を追加する
- root `package.json` には少なくとも `name`、`private`、`packageManager`、`scripts` を持たせる
- root scripts の責務は「集約」であり、app / package 個別実装の詳細を持ち込みすぎない
- `dev` は `turbo run dev --parallel`
- `dev:lp` は `turbo run dev --filter=@kufu/lp-site`
- `build`、`lint`、`typecheck`、`test` は `turbo run`
- `format`、`format:check`、`e2e`、`knip`、`depcruise` は root 直実行
- `playwright.config.ts` は `E2E_TARGET`、`E2E_PORT`、`E2E_BASE_URL` を将来扱える構造にするが、この prompt では接続先実装を固定しない

## インストールコマンド

root workspace の初期化を先に行い、その後に root devDependencies を追加する。`pnpm init` の対話に依存せず、最終的に次のような root `package.json` を満たすこと。

```json
{
  "name": "kufu-apps",
  "private": true,
  "packageManager": "pnpm@<version>"
}
```

```sh
pnpm init
```

`pnpm-workspace.yaml` は手動で作成し、少なくとも次を含める。

```yaml
packages:
  - apps/*
  - packages/*
```

```sh
pnpm add -D turbo typescript oxlint oxlint-tsgolint oxfmt @playwright/test vitest @types/node
```

## テスト観点

- root scripts が過不足なく定義されている
- `pnpm-workspace.yaml` が `apps/*` / `packages/*` を解決できる
- `turbo.json` が将来の workspace script 集約に耐える最小構造になっている
- root `playwright.config.ts` が TypeScript として解釈可能である
- `apps/cms` が未実装でも root contract が壊れない

## 検証コマンド

```sh
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
```

## 完了条件

- [ ] root `package.json` が存在し、pnpm workspace の起点になっている
- [ ] root `package.json` に `name`、`private`、`packageManager` が定義されている
- [ ] root `package.json` に required scripts が定義されている
- [ ] `pnpm-workspace.yaml` と `turbo.json` が追加されている
- [ ] root `playwright.config.ts` の雛形が存在する
- [ ] 後続 prompt が app / package を接続できる最小 root contract が整っている
