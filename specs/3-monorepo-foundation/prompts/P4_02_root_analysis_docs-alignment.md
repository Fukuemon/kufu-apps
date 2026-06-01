# root analysis and docs alignment

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止して確認する
- 参照 path を外れて広く探索しない
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する

## 作業ステップ

1. spec の該当節を確認する
2. prompt 内に埋め込まれた前提と仕様を確認する
3. 対象 path を読む
4. analysis tool と docs alignment を実装する
5. 検証する

## 実装コンテキスト

- Spec: `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
- 対象 path:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/package.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/`
- 参照ファイル:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/PRD.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/design/DesignDoc.md`

## 前提条件

- ## spec から抜粋した前提:
- `knip` と `dependency-cruiser` は issue #3 で実導入し、root script から実行できる状態まで作る
- `e2e`、`knip`、`dependency-cruiser`、`oxfmt` は root script から直実行する
- Cloudflare / Terraform は contract だけを文書化し、実装スコープ外
- foundation 完了後に infra repo 側の design issue 候補として論点を洗い出す
- ## 実装前に満たしている依存条件:
- P1 から P4_01 までの prompt が完了している

## 不明点ハンドリング

- knip / dependency-cruiser の設定密度は Phase 1 最小でよい。まずは root script から動かせることを優先する
- docs alignment は spec と実装差分の最終確認に留め、追加設計へ広げない
- 矛盾や未確定事項を見つけたら停止して確認する

## タスク境界

### 実装する範囲

- root `package.json` に `knip` / `depcruise` script を接続する
- 必要なら root config を追加して最小実行導線を成立させる
- 実装結果が spec / PRD / Design Doc の contract とズレていないか確認し、必要最小限の文言調整を行う

### 実装しない範囲

- infra repo の設計実装
- Cloudflare preview / production 運用ルールの具体化
- Storybook / tsdown の本格運用ルール

## 設計仕様

- `knip` と `dependency-cruiser` は root task として扱う
- root scripts は `knip` と `depcruise` を直実行する
- docs alignment は root scaffold 実装と spec の contract 整合確認までに留める
- infra repo に送る論点はこの repo では issue 候補の洗い出しまでとする

## インストールコマンド

```sh
pnpm add -D knip dependency-cruiser
```

## テスト観点

- `pnpm knip` が実行可能である
- `pnpm depcruise` が実行可能である
- 実装後の root / app / package 構成が spec の責務境界と矛盾しない

## 検証コマンド

```sh
pnpm knip
pnpm depcruise
pnpm build
pnpm typecheck
pnpm e2e
```

## 完了条件

- [ ] `knip` と `depcruise` の root 実行導線がある
- [ ] 必要なら最小 config が追加されている
- [ ] spec / PRD / Design Doc と実装の明確なズレが残っていない
- [ ] infra repo へ送る論点がこの repo の実装スコープへ混入していない
