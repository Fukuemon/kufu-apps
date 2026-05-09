# e2e runtime contract

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止して確認する
- 参照 path を外れて広く探索しない
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する

## 作業ステップ

1. spec の該当節を確認する
2. prompt 内に埋め込まれた前提と仕様を確認する
3. 対象 path を読む
4. root Playwright と app 側起動 contract を接続する
5. 検証する

## 実装コンテキスト

- Spec: `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
- 対象 path:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/playwright.config.ts`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/e2e/`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/apps/lp-site/`
- 参照ファイル:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/package.json`

## 前提条件

- ## spec から抜粋した前提:
- `pnpm e2e` は root `playwright.config.ts` から実行する repository task
- root Playwright 設定は `webServer` を使う前提
- app 側 E2E 対象 workspace は `build`、`preview`、`e2e:serve` を持てる構成に揃える
- root 側標準 env は `E2E_TARGET`、`E2E_BASE_URL`、`E2E_PORT`
- 初期案の port は `lp-site=4321`、`cms=4173`
- test 配置は `e2e/<target>/` を基本とする
- issue #3 時点では test 本数よりも起動契約の成立を優先する
- ## 実装前に満たしている依存条件:
- P1 root workspace foundation が完了している
- P2 `apps/lp-site` が `preview` を持っている

## 不明点ハンドリング

- test 本体が薄くてもよい。最低限の smoke か placeholder suite で contract 検証を優先する
- `lp-site` を既定 target にする。`cms` は将来切替可能であれば十分
- 矛盾や未確定事項を見つけたら停止して確認する

## タスク境界

### 実装する範囲

- root `playwright.config.ts` の `webServer` / `baseURL` / env contract
- `e2e/lp-site/` を中心とした最小 suite 構成
- `pnpm e2e` で既定 target が起動できる wiring
- `apps/lp-site` の `e2e:serve` を利用して起動できる接続確認

### 実装しない範囲

- 詳細な user flow シナリオ
- Cloudflare preview deployment を使った外部環境テスト
- `apps/cms` の本格 E2E

## 設計仕様

- `E2E_TARGET` の既定値は `lp-site`
- `E2E_PORT` と `E2E_BASE_URL` は root で解決する
- `webServer.command` は target app の `e2e:serve` を呼ぶ
- `e2e/<target>/` 配下に app 別 suite を増設できる構造にする
- Phase 1 は起動 contract が壊れていないことを優先し、シナリオ密度は求めない
- `P2` で `apps/lp-site` の `e2e:serve` が定義されている前提で接続し、root 側で app 固有の preview コマンドを直書きしない

## インストールコマンド

```sh
pnpm add -D @playwright/test
```

## テスト観点

- `pnpm e2e` が既定 target で起動できる
- `E2E_TARGET=cms` のような将来切替に備えた分岐構造がある
- `webServer` と `baseURL` が app script contract に依存しているだけで、app 固有ロジックを root に埋め込んでいない

## 検証コマンド

```sh
pnpm e2e
E2E_TARGET=lp-site pnpm e2e
```

## 完了条件

- [ ] root Playwright 設定が env contract と `webServer` を使っている
- [ ] `e2e/lp-site/` の最小 suite が存在する
- [ ] 既定 target として `lp-site` を実行できる
- [ ] app 追加時に `e2e/<target>/` と `e2e:serve` の追加で拡張できる
