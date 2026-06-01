# corporate-site skeleton

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止して確認する
- 参照 path を外れて広く探索しない
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する

## 作業ステップ

1. spec の該当節を確認する
2. prompt 内に埋め込まれた前提と仕様を確認する
3. `Astro` の scaffold を非対話で再現できる条件を固定する
4. 対象 path を読む
5. `apps/corporate-site` skeleton を実装する
6. 検証する

## 実装コンテキスト

- Spec: `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
- 対象 path:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/apps/corporate-site/`
- 参照ファイル:
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/3-monorepo-foundation/index.md`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/package.json`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/pnpm-workspace.yaml`
  - `$(ghq root)/github.com/Fukuemon/kufu-apps/turbo.json`

## 前提条件

- ## spec から抜粋した前提:
- `apps/corporate-site` は Astro LP、静的ページ、section、assets、最小 dev/build 導線を担う
- LP は Astro の静的生成前提で構成し、Astro で解決できるものを React island にしない
- `apps/corporate-site` の page / route は Astro 標準の file-based routing に従う
- `typecheck` は `astro check` を標準とする
- 将来 E2E 対象になった時は `build`、`preview`、`e2e:serve` を持てる構成にする
- ## 実装前に満たしている依存条件:
- P1 root workspace foundation が完了している

## 不明点ハンドリング

- 初期ページ内容は最小の placeholder でよい。LP の本番コンテンツや詳細デザインは入れない
- asset 構成や section 名が未確定でも、Astro app として自然な最小構成を優先する
- 矛盾や未確定事項を見つけたら停止して確認する

## タスク境界

### 実装する範囲

- `apps/corporate-site` の `package.json`
- Astro の最小 app 構成
- `dev`、`build`、`preview`、`typecheck`、`e2e:serve` script
- 最小の route / page と静的配信前提の構成

### 実装しない範囲

- LP の情報設計、詳細 UI、コンテンツ埋め込み
- React island の導入
- Cloudflare deploy 設定
- Playwright test の本体

## 設計仕様

- package 名は `@kufu/corporate-site`
- `dev` / `build` / `preview` / `typecheck` を root から呼べるようにする
- `typecheck` は `astro check`
- `preview` は build artifact をローカル配信できること
- `e2e:serve` は `preview` の alias でもよいが、必ず定義する
- LP 内で閉じる UI は `apps/corporate-site` 配下に置き、`packages/ui` への依存を前提にしない
- 初期生成は公式 scaffold を使い、生成後に monorepo の package 名と script 契約へ合わせる
- 生成後は少なくとも package 名を `@kufu/corporate-site` に揃え、root `dev:corporate` / `build` / `typecheck` / `e2e` から呼べる script 構成へ寄せる

## インストールコマンド

```sh
pnpm create astro@latest apps/corporate-site -- --template minimal --install --no-git
```

## テスト観点

- `pnpm --filter @kufu/corporate-site dev` が起動可能である
- `pnpm --filter @kufu/corporate-site build` が通る
- `pnpm --filter @kufu/corporate-site typecheck` が `astro check` で通る
- `pnpm --filter @kufu/corporate-site e2e:serve` で preview 起動できる
- root `dev:corporate` と `build` から呼び出せる

## 検証コマンド

```sh
pnpm --filter @kufu/corporate-site dev
pnpm --filter @kufu/corporate-site build
pnpm --filter @kufu/corporate-site typecheck
pnpm --filter @kufu/corporate-site e2e:serve
pnpm dev:corporate
```

## 完了条件

- [ ] `apps/corporate-site` が workspace package として追加されている
- [ ] Astro app の最小 route / page が存在する
- [ ] `dev`、`build`、`preview`、`typecheck`、`e2e:serve` が定義されている
- [ ] 将来 E2E を接続できる起動 contract が壊れていない
- [ ] 公式 scaffold の生成物が monorepo contract に合わせて整理されている
- [ ] `package.json` の package 名が `@kufu/corporate-site` へ調整されている
