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

方針の正本は [adr/0015](adr/0015-visual-regression-testing-policy.md)、責務分担は [context/testing.md](context/testing.md)。どちらの系統も Docker が要る。

| 系統  | 撮影対象                              | baseline の置き場                    | 実行コマンド     |
| ----- | ------------------------------------- | ------------------------------------ | ---------------- |
| story | Storybook の全 story (fixture は除く) | ローカル S3 互換ストレージ → 将来 R2 | `pnpm vrt:story` |
| route | 3 route × desktop / mobile = 6 枚     | リポジトリ (Git 管理)                | `pnpm vrt:route` |

## story 側 VRT

baseline はローカルの MinIO に置く。**破棄前提**であり、正となる baseline は #47 の完了後に CI 環境で撮り直して R2 へ移す。

### 資格情報

実値はリポジトリに置かず、git 管理外の `.env` から `docker compose` と VRT スクリプトの双方が読む。`.env` は他の設定も持つため追記する。

```sh
umask 077
{
  echo "VRT_S3_ENDPOINT=http://127.0.0.1:9000"
  echo "VRT_S3_ACCESS_KEY_ID=$(openssl rand -hex 8)"
  echo "VRT_S3_SECRET_ACCESS_KEY=$(openssl rand -hex 20)"
} >> .env
```

```sh
docker compose up -d --wait   # 起動し、バケット kufu-vrt-baseline を作る
docker compose down -v        # 破棄する (baseline も消える)
```

### 実行

| コマンド                  | 内容                                                                         |
| ------------------------- | ---------------------------------------------------------------------------- |
| `pnpm vrt:story`          | 撮影して baseline と比較する。差分があれば終了コード 1                       |
| `pnpm vrt:story:baseline` | 同じ実行で差分では失敗させない。base branch で baseline を撮り直すときに使う |

どちらも撮影結果を現在のコミットのスナップショットとして publish する。違いは差分で失敗させるかどうかだけ。

- `--skip-build`: Storybook の build を省く。VRT 用ビルドでなければ実行を止める
- 差分レポートは `.reg/index.html`、撮影結果は `__screenshots__/<Storybook インスタンス>/`
- 失敗させるのは **changed と deleted**。deleted は撮影欠損でも出る。new は初回と story 追加で必ず出るため報告だけ
- baseline は reg-suit がブランチの分岐点コミットから解決する。意図した変更を取り込むには base branch へ merge し、そこで `pnpm vrt:story:baseline` を実行する
- viewport は Storybook ごとに変える。`packages/ui` は 800x200 (単体コンポーネントは余白が大半を占めるため高さを詰める)、`apps/corporate-site` は 1280x800 (800px では `lg:` 未満の狭い並びになる)。背の高い story は fullPage で伸びるため切れない

### 設定上の注意

`reg-publish-s3-plugin` は既定値のままでは S3 互換ストレージで失敗するため、`regconfig.json` で次を設定している (正本は ADR-0015)。

| 設定                              | 理由                                                                     |
| --------------------------------- | ------------------------------------------------------------------------ |
| `enableACL: false`                | R2 はオブジェクト ACL を未実装で、既定の `acl: public-read` では失敗する |
| `sdkOptions.region: "auto"`       | R2 の region は `auto` が正                                              |
| `customDomain` を設定しない       | `endpoint` と併用すると差分レポートの URL が二重に組み立てられる         |
| `sdkOptions.forcePathStyle: true` | MinIO は virtual-host style のホスト名を解決できない                     |

R2 へ移行するときに差し替えるのは `sdkOptions.endpoint` と `.env` の資格情報だけ。

VRT 関連の devDependency (`storycap` / `reg-*` / `http-server`) は版を固定している。依存の更新でピクセルが動くと baseline が一斉に無効化されるため。

### 撮影の安定化

`CompanySection` の Google Maps は読み込み完了時刻もタイル内容も実行ごとに変わるため、VRT 用ビルドでだけ埋め込みフレームを遮断する。

- `.storybook/main.ts` が `frame-src 'none'` の CSP を入れる (リクエスト前に止まる)
- `.storybook/preview.ts` が同じ iframe から `src` を外す (二重化)

通常の `pnpm storybook` と `pnpm storybook:pages` は地図を表示する。

## route 側 VRT

3 route を desktop / mobile で撮り、baseline を Git 管理する。差分が PR レビューに乗ることを狙った使い分け (ADR-0015)。

| コマンド                | 内容                                   |
| ----------------------- | -------------------------------------- |
| `pnpm vrt:route`        | container で実行し baseline と比較する |
| `pnpm vrt:route:update` | 同じ実行で baseline を撮り直す         |

### 撮影環境の固定

Playwright の baseline はファイル名に platform を含み、macOS で撮った `-darwin.png` は CI では使われない。フォント描画も環境で違うため、Playwright 公式 container (`linux/amd64`) に固定する。

- **image tag は `@playwright/test` の版から導出する**。二重管理だとブラウザ版だけ取り残され、baseline が黙って無効化される
- **アーキテクチャも固定する**。CI の runner は amd64 で、arm64 で撮った画像とは一致しない (実測で 6 枚中 2 枚が変わった)。Apple Silicon では Rosetta で動くため遅くなる
- container 内でホストとは別に `pnpm install` をやり直す。ホストのネイティブ依存が Linux で動かないため。`node_modules` は名前付き volume に隔離する。volume 名には checkout の path を混ぜてあり worktree 間で競合しない。掃除は `docker volume ls | grep kufu-e2e` から `docker volume rm`
- `pnpm vrt:route` を経由しない実行は skip される。skip されたまま緑になる事故を防ぐため、6 件すべての実行を JSON レポートで検査する
- baseline の正は CI で撮った画像とする。撮り直しは `ci.yml` の `workflow_dispatch` (`update-route-vrt-baseline`) から行い、artifact の PNG を commit する

**Linux ホストでの注意**: container は root でリポジトリを read-write に bind mount する。baseline PNG や `test-results/` が root 所有で残り、以降のホスト実行が失敗しうる。

### 撮影の安定化

- 外部への通信を落とす。Google Maps とカテゴリ写真 (Unsplash) は内容も応答時間も実行ごとに変わるため、`page.route` で same-origin 以外を abort する
- 地図 iframe は通信を落としても枠が残るため `mask` で隠す
- reveal とカルーセルの自動スクロールは、既存実装が持つ `prefers-reduced-motion` の分岐で止める。テスト都合のコードをプロダクションへ足していない

差分画像は `test-results/` に出る。`.gitignore` 済み。

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
