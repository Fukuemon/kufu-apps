# config shared presets

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止して確認する
- 参照 path を外れて広く探索しない
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する

## 作業ステップ

1. spec の該当節を確認する
2. prompt 内に埋め込まれた前提と仕様を確認する
3. 対象 path を読む
4. `packages/config` を実装する
5. 検証する

## 実装コンテキスト

- Spec: `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
- 対象 path:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/packages/config/`
- 参照ファイル:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/package.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/apps/lp-site/`

## 前提条件

- ## spec から抜粋した前提:
- `packages/config` は TypeScript、lint、test などの共有設定
- `@kufu/config` は用途別 subpath export を正とする
- 初期 export 対象は `tsconfig/base`、`tsconfig/react`、`tsconfig/astro`、`oxlint/base`、`vitest/base`
- `oxfmt`、`knip`、`dependency-cruiser`、`playwright` は root 管理のため export 対象に含めない
- `packages/config` 自身も `typecheck` script を持つ
- ## 実装前に満たしている依存条件:
- P1 root workspace foundation が完了している
- P2 `apps/lp-site` の package 名が決まっている

## 不明点ハンドリング

- config file の拡張子は spec の初期案を優先する
- app から実際に consumption する内容が薄くても、subpath export の contract を先に固定する
- 矛盾や未確定事項を見つけたら停止して確認する

## タスク境界

### 実装する範囲

- `packages/config/package.json` の最小 manifest 作成
- `packages/config/package.json`
- `tsconfig/base.json`、`tsconfig/react.json`、`tsconfig/astro.json`
- `oxlint/base.json`
- `vitest/base.ts`
- `exports` と `typecheck` script

### 実装しない範囲

- `oxfmt` 設定 export
- knip / dependency-cruiser / Playwright 設定 export
- Storybook / tsdown 用 export

## 設計仕様

- package 名は `@kufu/config`
- export は用途別 subpath を明示し、単一 entrypoint へ寄せない
- `tsconfig/react` は React + Vite app、`tsconfig/astro` は Astro app、`tsconfig/base` は共通土台
- `typecheck` は `tsc --noEmit`
- 各 app / package は `@kufu/config` を正規入口として共有設定を参照する

## インストールコマンド

対象 directory と最小 `package.json` を先に作り、workspace へ認識させてから依存を追加する。少なくとも package 名は `@kufu/config`、`private` は `true` ではなく publish 可能な shared config package として扱える形を検討し、`name` と `version` を持たせる。

```sh
mkdir -p packages/config
pnpm --filter @kufu/config add -D typescript oxlint vitest
```

## テスト観点

- `package.json` の `exports` が spec どおりに定義されている
- `apps/lp-site` が `tsconfig/astro` を参照できる
- 将来の React app が `tsconfig/react` を参照できる前提が保たれている
- `pnpm --filter @kufu/config typecheck` が通る

## 検証コマンド

```sh
pnpm --filter @kufu/config typecheck
pnpm typecheck
```

## 完了条件

- [ ] `@kufu/config` が workspace package として追加されている
- [ ] `packages/config/package.json` の最小 manifest が存在する
- [ ] spec で定義した subpath export が揃っている
- [ ] root `typecheck` から `packages/config` を検証できる
- [ ] root 管理ツールを export に混ぜていない
