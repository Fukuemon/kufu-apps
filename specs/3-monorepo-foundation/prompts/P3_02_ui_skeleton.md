# ui skeleton

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止して確認する
- 参照 path を外れて広く探索しない
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する

## 作業ステップ

1. spec の該当節を確認する
2. prompt 内に埋め込まれた前提と仕様を確認する
3. 対象 path を読む
4. `packages/ui` skeleton を実装する
5. 検証する

## 実装コンテキスト

- Spec: `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
- 対象 path:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/packages/ui/`
- 参照ファイル:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/package.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/packages/config/`

## 前提条件

- ## spec から抜粋した前提:
- `packages/ui` は共有 UI package の骨組み、public entrypoint、将来の Storybook 入口
- feature / colocation を第一原則とし、各 feature や app の文脈で閉じる UI はその feature 配下に置く
- `packages/ui` は shadcn/ui ベースの共有コンポーネント、design token、font、theme など、複数 feature / app をまたいで再利用が明確になった UI 基盤の置き場とする
- 初回 scaffold では過剰な UI 抽象化や先回りした共通化を避けつつ、共有 UI 基盤を後続で集約できる公開入口と最小構成を定義する
- `Storybook` と `tsdown` は骨組みの入口だけ整え、本格運用は後続 issue に送る
- `typecheck` は `tsc --noEmit` を標準とする
- `React Compiler` 方針は `packages/ui` の骨組みにも反映する
- ## 実装前に満たしている依存条件:
- P1 root workspace foundation が完了している
- P3 `packages/config` の shared preset が存在する

## 不明点ハンドリング

- 共有 UI コンポーネント本体は最小でよい。未使用コンポーネントを先回りして増やさない
- app / feature 内で閉じる UI を shared package へ無理に寄せない
- design token / font / theme は shared package に集約する前提だけ明確にし、初回 scaffold では最小の公開入口に留めてよい
- Storybook / tsdown は入口だけ整えればよく、本格設定まで広げない
- 矛盾や未確定事項を見つけたら停止して確認する

## タスク境界

### 実装する範囲

- `packages/ui/package.json` の最小 manifest 作成
- `packages/ui/package.json`
- public entrypoint
- React / TypeScript library としての最小構成
- shadcn/ui ベース部品、design token、font、theme を後続で集約できる directory / export の入口
- `typecheck` script
- 将来 Storybook / tsdown を追加できる入口

### 実装しない範囲

- shadcn/ui 本体の大量実装
- design token や font asset の本格拡充
- Storybook の本格運用
- UI カタログの充実

## 設計仕様

- package 名は `@kufu/ui`
- `@kufu/ui` は app 固有 UI ではなく、複数 feature / app をまたいで再利用が確定した UI 基盤の正規入口とする
- shadcn/ui ベース部品、design token、font、theme の公開責務は `@kufu/ui` に集約できるが、feature / colocation を崩してまで共通化しない
- 依存先は app ではなく共有 package と React 基盤に限る
- `typecheck` は `tsc --noEmit`
- React Compiler 前提を壊さない最小構成にする
- LP 固有 UI や feature ローカル UI はここへ寄せず、共有 UI 基盤の入口だけを用意する

## インストールコマンド

対象 directory と最小 `package.json` を先に作り、workspace へ認識させてから依存を追加する。少なくとも package 名は `@kufu/ui`、`name` と `version` を持つ manifest を先に用意する。

```sh
mkdir -p packages/ui
pnpm --filter @kufu/ui add react react-dom
pnpm --filter @kufu/ui add -D typescript tsdown storybook
```

## テスト観点

- `pnpm --filter @kufu/ui typecheck` が通る
- app から import 可能な public entrypoint が存在する
- shared component / design token / font / theme を `@kufu/ui` 配下へ集約していける構造になっている
- Storybook / tsdown を後続で追加できる構造になっている

## 検証コマンド

```sh
pnpm --filter @kufu/ui typecheck
pnpm typecheck
```

## 完了条件

- [ ] `@kufu/ui` が workspace package として追加されている
- [ ] `packages/ui/package.json` の最小 manifest が存在する
- [ ] public entrypoint が存在する
- [ ] shadcn/ui ベース部品、design token、font、theme の公開入口を後続で追加できる構造になっている
- [ ] `typecheck` script が定義されている
- [ ] UI 本実装を過剰に先回りしていない
