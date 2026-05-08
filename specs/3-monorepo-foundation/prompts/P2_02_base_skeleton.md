# base skeleton

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止して確認する
- 参照 path を外れて広く探索しない
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する

## 作業ステップ

1. spec の該当節を確認する
2. prompt 内に埋め込まれた前提と仕様を確認する
3. `Vite` の scaffold を非対話で再現できる条件を固定する
4. 対象 path を読む
5. `apps/base` skeleton を実装する
6. 検証する

## 実装コンテキスト

- Spec: `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
- 対象 path:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/apps/base/`
- 参照ファイル:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/package.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/turbo.json`

## 前提条件

- ## spec から抜粋した前提:
- `apps/base` は React + Vite app shell の骨組み、最小 dev/build 導線、将来拡張の入口
- `Rolldown` は repository の採用方針として `apps/base` の骨組み設定へ反映する
- `React Compiler` は repository 標準方針として明文化し、`apps/base` に実効設定を入れる
- 業務要件、router / query / form / Zustand の本格導入は後続 spec に送る
- `typecheck` は `tsc --noEmit` を標準とする
- E2E を追加する場合は `preview` / `e2e:serve` を備える
- ## 実装前に満たしている依存条件:
- P1 root workspace foundation が完了している

## 不明点ハンドリング

- Vite と Rolldown の設定方法が複数ある場合は、Phase 1 で最も薄い構成を選ぶ
- React Compiler は repository 方針に沿って有効化するが、Phase 1 では複雑な library 検証まで広げない
- 矛盾や未確定事項を見つけたら停止して確認する

## タスク境界

### 実装する範囲

- `apps/base` の `package.json`
- React + Vite の最小 app shell
- `dev`、`build`、`preview`、`typecheck`、`e2e:serve` script
- Rolldown / React Compiler 方針を skeleton に反映した最小設定

### 実装しない範囲

- TanStack Router、TanStack Query、React Hook Form、Zustand の導入
- 業務 UI やドメイン実装
- E2E シナリオの本体

## 設計仕様

- package 名は `@kufu/base`
- `typecheck` は `tsc --noEmit`
- `preview` は build artifact をローカル配信できる構成にする
- `e2e:serve` は `preview` の alias でもよいが、必ず定義する
- React app 標準の将来方針は維持するが、Phase 1 では route / data / form 実装まで入れない
- 初期生成は公式 scaffold を使い、生成後に monorepo の package 名と script 契約へ合わせる
- 生成後は少なくとも package 名を `@kufu/base` に揃え、root `dev:base` / `build` / `typecheck` / `e2e` から呼べる script 構成へ寄せる

## インストールコマンド

```sh
pnpm create vite apps/base --template react-ts -- --no-git --install
```

## テスト観点

- `pnpm --filter @kufu/base dev` が起動可能である
- `pnpm --filter @kufu/base build` が通る
- `pnpm --filter @kufu/base typecheck` が `tsc --noEmit` で通る
- `pnpm --filter @kufu/base e2e:serve` で preview 起動できる
- root `dev:base` と `build` から呼び出せる

## 検証コマンド

```sh
pnpm --filter @kufu/base dev
pnpm --filter @kufu/base build
pnpm --filter @kufu/base typecheck
pnpm --filter @kufu/base e2e:serve
pnpm dev:base
```

## 完了条件

- [ ] `apps/base` が workspace package として追加されている
- [ ] React + Vite app shell の最小構成が存在する
- [ ] `dev`、`build`、`preview`、`typecheck`、`e2e:serve` が定義されている
- [ ] Rolldown / React Compiler の採用方針が skeleton 設定に反映されている
- [ ] 公式 scaffold の生成物が monorepo contract に合わせて整理されている
- [ ] `package.json` の package 名が `@kufu/base` へ調整されている
