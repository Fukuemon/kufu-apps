# Kufu Monorepo

Kufu のコーポレートサイト、Phase 2 以降の CMS / 業務アプリ、共通 UI / 設定 / テスト基盤を pnpm workspace で管理する monorepo。

Phase 1 は Astro によるコーポレートサイト構築を最優先とする。CMS/API、管理画面、内部業務ツールは初期スコープ外で、必要になった時点で spec / ADR により採否を判断する。

## Requirements

- Node.js `>=22.12.0`
- pnpm `10.27.0`

## Setup

```sh
pnpm install
```

## Commands

正本は [context/project.yml](context/project.yml) の Quick Commands。主要コマンドのみ抜粋:

| コマンド                       | 内容                     |
| ------------------------------ | ------------------------ |
| `pnpm dev:corporate`           | コーポレートサイトを起動 |
| `pnpm build`                   | ビルド                   |
| `pnpm lint` / `pnpm typecheck` | 静的検査 / 型チェック    |
| `pnpm test` / `pnpm e2e`       | 単体テスト / E2E         |

開発サーバーは `http://127.0.0.1:4321` で起動する。

`pnpm storybook:pages` は `packages/ui` と `apps/corporate-site` の Storybook を build し、GitHub Pages 用 artifact を `.storybook-pages/` に生成する。PR では `pr-preview/pr-<number>/` へ、`develop` への push 後は Pages root へ deploy される。

## Visual Regression Testing (VRT)

VRT は story 側 (storycap + reg-suit) と route 側 (Playwright) の 2 系統を持つ。方針の正本は [adr/0015-visual-regression-testing-policy.md](adr/0015-visual-regression-testing-policy.md)、テスト種別の責務分担は [context/testing.md](context/testing.md)。以下は story 側の手順で、route 側の baseline はリポジトリで Git 管理する。

### 前提

- Docker が起動していること。story 側の baseline はローカルの S3 互換ストレージ (MinIO) に置く
- **この baseline は破棄前提**とする。#33 の時点では仕組みが成立することの検証が目的で、正となる baseline は #47 の完了後に CI 環境で撮り直し、保管先を Cloudflare R2 へ移す

### 資格情報の受け渡し

資格情報の実値はリポジトリに置かない。git 管理外の `.env` へ書き、`docker compose` と VRT スクリプトの双方がそこから読む。値は各自で生成する。`.env` は他の設定も持つため、既存の内容を消さないよう追記する。

```sh
umask 077
{
  echo "VRT_S3_ENDPOINT=http://127.0.0.1:9000"
  echo "VRT_S3_ACCESS_KEY_ID=$(openssl rand -hex 8)"
  echo "VRT_S3_SECRET_ACCESS_KEY=$(openssl rand -hex 20)"
} >> .env
```

### ストレージの起動と破棄

```sh
docker compose up -d --wait   # 起動し、バケット kufu-vrt-baseline を作る
docker compose down -v        # 破棄する (baseline も消える)
```

### 実行

| コマンド                  | 内容                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm vrt:story`          | 2 つの Storybook を VRT 用に build して撮影し、baseline と比較する。差分があれば終了コード 1 を返す |
| `pnpm vrt:story:baseline` | 同じ撮影と比較を行い、差分では失敗させない。base branch 上で baseline を撮り直すときに使う          |

**どちらの実行も、撮影結果を現在のコミットのスナップショットとしてストレージへ publish する。** 両者の違いは差分で失敗させるかどうかだけである。

`--skip-build` を渡すと Storybook の build を省略して既存の `storybook-static` を撮影する。VRT 用に build した成果物でなければ実行を止めるので、通常の `pnpm storybook:build` の出力を誤って撮ることはない。

差分レポートは `.reg/index.html`、撮影結果は `__screenshots__/<Storybook インスタンス>/` に出る。Storybook は `@kufu/ui` と `@kufu/corporate-site` の 2 インスタンスあり、story id がインスタンスをまたぐと衝突しうるため、インスタンス名のサブディレクトリで名前空間を分けている。

失敗させる差分は **changed と deleted** とする。deleted は story を消したときだけでなく撮影が欠けたときにも出るため、見逃さない。new は story の追加と baseline 不在の初回で必ず出るので、件数だけ報告する。

baseline は reg-suit がブランチの分岐点コミットから解決する。意図した UI 変更を baseline に取り込むには、その変更を base branch へ merge し、base branch 上で `pnpm vrt:story:baseline` を実行する。

### 設定上の注意

`reg-publish-s3-plugin` は `sdkOptions` を `S3Client` のコンストラクタへ渡すため S3 互換ストレージで動く。ただし既定値のままでは失敗するため、`regconfig.json` で次を設定している (正本は ADR-0015)。

| 設定                              | 理由                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `enableACL: false`                | plugin の既定は `acl: public-read` だが、R2 はオブジェクト ACL を未実装で PutObject が失敗する        |
| `sdkOptions.region: "auto"`       | R2 の region は `auto` が正                                                                           |
| `customDomain` を設定しない       | `endpoint` と併用すると差分レポートの URL が二重に組み立てられる                                      |
| `sdkOptions.forcePathStyle: true` | MinIO は virtual-host style のホスト名を解決できない。R2 も path style を受け付けるため移行後も使える |

R2 へ移行するときに差し替えるのは `sdkOptions.endpoint` と `.env` の資格情報だけで、残りはそのまま使える。

VRT 関連の devDependency (`storycap` / `reg-*` / `http-server`) は `^` を付けず版を固定している。撮影結果のピクセルが依存の更新で動くと baseline が一斉に無効化されるため、更新は意図して行う。

### 撮影の安定化

`CompanySection` の Google Maps iframe は、タイル内容も読み込み完了時刻も実行ごとに変わり、許容 diff 0 と両立しない。そのため VRT 用のビルドでだけ埋め込みフレームを遮断している。

- 一次の遮断: `.storybook/main.ts` が VRT ビルドにだけ `frame-src 'none'` の CSP を preview へ入れる。リクエストが出る前に止まるので読み込みとの競合が起きない
- 二重化: `.storybook/preview.ts` が同じ iframe から `src` を外す

通常の `pnpm storybook` と `pnpm storybook:pages` は地図をそのまま表示する。

## Project Structure

```text
.
├── apps/
│   └── corporate-site/  # Astro コーポレートサイト
├── packages/
│   ├── ui/              # 共通 UI / デザイントークン / フォント
│   └── config/          # 共通 tsconfig / lint / test 設定
├── e2e/                 # ルート管理の Playwright テスト
├── design/              # 設計文書
├── context/             # 技術規約 / 運用契約
├── adr/                 # 意思決定記録
├── specs/               # Issue 単位の作業 spec
└── templates/           # spec / ADR / requirements テンプレート
```

### Package Boundaries

- `apps/corporate-site`: Astro のページ、ルーティング、コンテンツ構成、必要最小限の island
- `packages/ui`: 共通デザイン基盤 (token / font / stylesheet entry / 再利用が明確な UI)
- `packages/config`: TypeScript / lint / test の共有設定
- `e2e`: ルート管理の Playwright テスト

禁止: 再利用すべき UI の app 内重複、app 間の直接依存、コーポレートサイトでの不要な React island、実装コードでの token 値直書き。

## Documentation

確認順は上から。

| 層                       | 文書                                       | 役割                                                                      |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------------------- |
| Why / What / How: 全体像 | [design/DesignDoc.md](design/DesignDoc.md) | 誰のどの課題を、なぜ・何で解決するか / 全体像 / モジュール責務 / 横断方針 |
| How: feature             | [design/features/](design/features/)       | feature 単位の設計                                                        |
| How: 技術規約            | [context/](context/)                       | 技術スタック規約 / codebase architecture / 運用契約                       |
| Decision                 | [adr/](adr/)                               | 長期参照する意思決定                                                      |
| Issue 作業文書           | [specs/](specs/)                           | Issue / 機能単位の要求・設計・テスト観点                                  |

AI エージェント向けの操作契約 (`AGENTS.md` / `CLAUDE.md` / `.codex/` / `.claude/` / `.cursor/`) は sdd-template が定め、symlink で接続する。本リポジトリでは追跡しないため、clone しただけの状態では存在しない。接続は sdd-template 側で `bash scripts/link.sh <このリポジトリ>`、確認は `bash scripts/doctor.sh`。

## Workflow

1. [Documentation](#documentation) の順に正本を確認する。
2. feature 作業では `specs/<issue-number>-<slug>/` に Issue 単位の spec を作成・更新する。
3. Issue を越えて残る判断は feature doc、`context/`、`adr/` へ反映する。
4. PR 作成・更新前に、対象範囲に応じた品質検査を実行する。

コマンドの対象範囲判断と E2E 実行の詳細は [context/engineering.md](context/engineering.md) / [context/testing.md](context/testing.md) を参照。
