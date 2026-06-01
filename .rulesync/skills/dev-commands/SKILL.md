---
name: dev-commands
description: Resolves the correct pnpm / turbo command for a Kufu Monorepo task (dev, build, lint, format, typecheck, test, e2e, knip, depcruise) and decides whether to scope it with --filter. Use when the user asks how to run, build, test, or analyze something in this monorepo, or asks for a command cheat sheet.
targets:
  - "*"
---

# Dev Commands

Kufu Monorepo の **root script からタスクを正しく呼び出す** ための入口。新しいコマンドを発明するのではなく、`package.json` の script 契約に沿って実行する。

## いつ使うか

- 開発サーバ / build / test / lint / format / e2e / 解析 を実行したい
- 特定 app / package だけにスコープして実行したい
- pre-commit や CI の前にローカル検証を回したい

## 先に読むもの

- `references/command-matrix.md` — 全 root script と用途
- `references/filter-scope.md` — `--filter` の使い分けと workspace selector
- `references/e2e-runtime.md` — `pnpm e2e` の env contract (`E2E_TARGET` / `E2E_PORT` / `E2E_BASE_URL`)

## 入力

- 何をしたいか (dev / build / test / lint / format / e2e / knip / depcruise)
- 対象 (全体 / 特定 app / 特定 package)

## 実行フロー

1. **意図の特定**:
   - 開発起動 → `dev` 系
   - 公開物の生成 → `build`
   - コード検査 → `lint` / `typecheck` / `format(:check)`
   - 動作確認 → `test` (unit) / `e2e` (Playwright)
   - 健全性検査 → `knip` (dead code) / `depcruise` (依存境界)
2. **対象スコープの決定** (`references/filter-scope.md`):
   - 全体 → root script をそのまま実行
   - 単一 app / package → `pnpm --filter @kufu/<name> <task>`
3. **E2E は env contract に従う** (`references/e2e-runtime.md`):
   - 既定: `E2E_TARGET=corporate-site`、`E2E_PORT=4321`
   - 対象切替時は `E2E_TARGET` と必要なら `E2E_PORT` / `E2E_BASE_URL` を上書き
4. **依存追加** は必ず `--filter` を使う:
   ```sh
   pnpm --filter @kufu/<module> add <package>
   ```
5. **pre-commit ゲート** (`pnpm depcruise` と `pnpm knip`) は `lefthook` 経由で自動実行される。手動で先に流したい時は root から直接実行する。

## 停止条件

- 対象 app / package 名が `@kufu/*` の workspace に存在しない (typo を疑う)
- `package.json` の script に存在しないコマンドを実行しようとしている
- `pnpm e2e` を起動するが `E2E_TARGET` の対象 app に `e2e:serve` script がない
- `--filter` 指定が必要なのに root に直接依存を追加しようとしている
- `format` を `--write` 系で流そうとしているが、コミット境界・レビュー前の段階で破壊的になる懸念がある (まず `format:check` を提案)
