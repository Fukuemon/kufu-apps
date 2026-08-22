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

方針の正本は [adr/0018](adr/0018-story-vrt-on-storybook-test-integrations.md)、責務分担は [context/testing.md](context/testing.md)。

| 系統  | 撮影対象                              | 撮影                                                                     | baseline              | 実行             |
| ----- | ------------------------------------- | ------------------------------------------------------------------------ | --------------------- | ---------------- |
| story | Storybook の全 story (fixture は除く) | `@storycap-testrun` (ui は addon-vitest / corporate-site は test-runner) | リポジトリ (Git 管理) | `pnpm vrt:story` |
| route | 3 route × desktop / mobile = 6 枚     | Playwright `toHaveScreenshot`                                            | リポジトリ (Git 管理) | `pnpm vrt:route` |

両系統に共通する決まり。

- **許容 diff は 0 (完全一致)** を初期値とし、flake が実測されたときだけその値を上回る最小値まで緩める
- **baseline の正は CI (ubuntu-latest / amd64) で撮った画像**とする。ホストとはフォント描画が違うため、ローカル実行では差分が出る。撮り直しは `ci.yml` の `workflow_dispatch` から行い、artifact の PNG を commit する
- 角丸のアンチエイリアスが 1 チャンネルあたり ±1 で揺れるため、色の許容差だけ 0.02 を置く。差分ピクセル数は 0 のまま

## story 側 VRT

| コマンド                | 内容                                             |
| ----------------------- | ------------------------------------------------ |
| `pnpm vrt:story`        | Storybook を build して撮影し、baseline と比べる |
| `pnpm vrt:story:update` | 同じ実行で baseline を撮り直す                   |

Storybook が 2 インスタンスあり、撮影の載せ方が違う。Astro は `@storybook/addon-vitest` (Vite の公式 renderer 限定) に載らないため。

| Storybook             | 撮影                                                    | 設定                                              |
| --------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| `packages/ui`         | `@storybook/addon-vitest` + `@storycap-testrun/browser` | `vitest.config.ts` / `.storybook/vitest.setup.ts` |
| `apps/corporate-site` | `@storybook/test-runner` + `@storycap-testrun/node`     | `.storybook/test-runner.ts`                       |

比較は `reg-cli`。差分レポートは `.vrt/report.html`、撮影結果は `.vrt/actual/`、baseline は `vrt/baseline/`。

### container へ寄せていない

route 側と違い、撮影と判定を CI に一本化する。`@storybook/addon-vitest` が撮影時に Vite のバンドルを回すため、Apple Silicon 上の amd64 エミュレーションでは Storybook の build だけで 25 分以上かかる (実測。ホストでは 9 秒)。ローカルは撮影が通ることの確認に使う。

### 撮影の安定化

- **幅は固定し、高さは最小にする** (1280x10)。`fullPage` が内容の高さまで伸ばすので余白が残らない。幅を固定するのは、内容に合わせると `w-full` のコンポーネントが潰れてレイアウト情報が落ちるため
- 高さを viewport から算出する story (`calc(100vh - ...)`) は `parameters.vrt.viewport` で上書きする
- 撮影時だけスクロールバーとキャレットを CSS で隠す。どちらも画像の端で揺れる (実測)
- `CompanySection` は撮影対象から外している (`parameters.screenshot.skip`)。並列実行時にページの load 状態が完了せず撮影が終わらない。原因は未特定で別 issue で扱う

## route 側 VRT

3 route を desktop / mobile で撮り、baseline を Git 管理する。

| コマンド                | 内容                                   |
| ----------------------- | -------------------------------------- |
| `pnpm vrt:route`        | container で実行し baseline と比較する |
| `pnpm vrt:route:update` | 同じ実行で baseline を撮り直す         |

### 撮影環境の固定

Playwright の baseline はファイル名に platform を含み、macOS で撮った `-darwin.png` は CI では使われない。Playwright 公式 container (`linux/amd64`) に固定する。`scripts/vrt-container.mjs` が指定した pnpm script を container で回す。

- **image tag は `@playwright/test` の版から導出する**。二重管理だとブラウザ版だけ取り残される
- **アーキテクチャも固定する**。CI の runner は amd64 で、arm64 で撮った画像とは一致しない (実測で 6 枚中 2 枚が変わった)
- container 内でホストとは別に `pnpm install` をやり直す。`node_modules` は名前付き volume に隔離する。掃除は `docker volume ls | grep kufu-e2e` から `docker volume rm`
- `pnpm vrt:route` を経由しない実行は skip される。6 件すべての実行を JSON レポートで検査する

**Linux ホストでの注意**: container は root でリポジトリを read-write に bind mount する。生成物が root 所有で残り、以降のホスト実行が失敗しうる。

### 撮影の安定化

- 外部への通信を落とす。Google Maps とカテゴリ写真 (Unsplash) は内容も応答時間も実行ごとに変わるため、`page.route` で same-origin 以外を abort する
- 地図 iframe は通信を落としても枠が残るため `mask` で隠す
- reveal とカルーセルの自動スクロールは、既存実装が持つ `prefers-reduced-motion` の分岐で止める

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
