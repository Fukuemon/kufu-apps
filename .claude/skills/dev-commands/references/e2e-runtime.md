# E2E Runtime

`pnpm e2e` の env contract と app 側 script contract。

## 既定値

| Env            | 既定                                   | 用途                              |
| -------------- | -------------------------------------- | --------------------------------- |
| `E2E_TARGET`   | `corporate-site`                       | 対象 app の workspace 名 (短縮形) |
| `E2E_PORT`     | `4321` (corporate-site) / `4173` (cms) | preview server の port            |
| `E2E_BASE_URL` | env から組み立て                       | テストが叩く URL                  |

## 実行例

```sh
# コーポレートサイト (既定)
pnpm e2e

# 将来 cms を追加した場合
E2E_TARGET=cms E2E_PORT=4173 pnpm e2e
```

## app 側 script 契約

E2E 対象 app は次を持つ:

- `build` — 静的成果物を生成
- `preview` — 生成物を配信
- `e2e:serve` — `build` → `preview` の順で起動するエントリ

root `playwright.config.ts` は app 固有の preview command を直書きせず、`e2e:serve` だけを呼ぶ。

## 配置

- テスト本体: `e2e/<target>/`
- root config: `playwright.config.ts`

## アンチパターン

- root config に app 固有の preview command を直書き → 対象切替で破綻
- workspace package 化した `e2e/` を作る → root 管理に反する
- `E2E_PORT` を変えずに新 app を追加 → port 衝突
