# monorepo-foundation

## メタ情報

- Issue: #3
- ステータス: Draft
- 作成日: 2026-05-08
- 更新日: 2026-05-09

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新   | 備考                                   |
| --- | --------------------------- | ------ | ---------- | -------------------------------------- |
| 1   | 起票                        | 完了   | 2026-05-08 | issue #3 起票済み                      |
| 2   | 下書き                      | 進行中 | 2026-05-08 | monorepo scaffold の contract を整理中 |
| 3   | 上位文書突合                | 完了   | 2026-05-08 | PRD / Design Doc の Phase 境界を更新   |
| 4   | 論点整理                    | 未着手 |            |                                        |
| 5   | 論点解決                    | 未着手 |            |                                        |
| 6   | Interface / Routing 設計    | 未着手 |            |                                        |
| 7   | Content / Data 設計         | 未着手 |            |                                        |
| 8   | Performance / Security 設計 | 未着手 |            |                                        |
| 9   | Test / Metrics 設計         | 未着手 |            |                                        |
| 10  | 実装分割                    | 未着手 |            |                                        |
| 11  | レビュー済                  | 未着手 |            |                                        |

## 上位ドキュメント確認

- PRD 更新要否: 更新済み。Phase 1 を LP foundation に絞る前提へ修正
- Design Docs 更新要否: 更新済み。`e2e` と `packages/config` の責務境界を修正
- ADR 起票要否: 不要

## 関連資料

- `PRD.md`: `$(ghq root)/github.com/Fukuemon/kufu-apps/PRD.md`
- `design/DesignDoc.md`: `$(ghq root)/github.com/Fukuemon/kufu-apps/design/DesignDoc.md`
- `adr/0001-terraform-infra-repository-boundary.md`: `$(ghq root)/github.com/Fukuemon/kufu-apps/adr/0001-terraform-infra-repository-boundary.md`
- 関連 issue / ticket: `#3 🛠 task: Kufu Monorepo の基盤構成を作成する`

## 背景

- 現状の repository は docs / rules / hooks が中心で、`apps/`、`packages/`、`e2e/`、workspace 設定など monorepo の実体がまだ存在しない
- PRD、Design Docs、AI 向けルールは将来的な monorepo 構成を前提に整備済みであり、文書上の contract と実ファイル構成に差がある
- issue #3 は、この差を埋めるために Kufu Monorepo の最小 scaffold を作成し、後続の LP 実装と CMS 設計判断の基盤を揃えるためのもの
- Phase 1 の完成条件のうち、LP 用 app 境界、共通 package 境界、workspace task 導線、AI が迷わない構成整備に直接関わる
- 影響範囲は `apps/lp-site`、`packages/ui`、`packages/config`、`e2e`、および root workspace 設定一式である

## スコープ

### やること

- root に monorepo として必要な workspace 設定、task runner 設定、主要 scripts を定義する
- `apps/lp-site`、`packages/ui`、`packages/config`、`e2e` の最小 scaffold を作成する前提を整理する
- `pnpm install` 後に `dev`、`dev:lp`、`build`、`lint`、`format`、`typecheck`、`test`、`e2e` の最小導線を成立させる contract を定義する
- app / package / root config の責務境界と共有ルールを明文化する
- PRD / Design Docs / ADR と scaffold 実装のズレが出ないよう確認観点を定義する
- app 実装と並行して E2E と typecheck を追加できるよう、app ごとの標準 command contract を定義する

### やらないこと

- CMS / API / 認証 / 管理画面 / 内部業務ツールの本実装
- LP の本番コンテンツ、情報設計、デザイン詳細の作り込み
- 過剰な UI 抽象化や未使用コンポーネントの先回り実装
- Cloudflare / Terraform / infra repo 側の実装
- 業務ドメイン model、API schema、CMS schema の定義

## 要件の解釈

### 実現したいユーザー価値

- 開発者が monorepo の app / package 構成を迷わず理解し、最小セットアップ後すぐに各 app の実装を始められる
- AI エージェントが repo 構成と責務境界を誤解せず、対象外の実装や過剰共通化を避けられる
- 後続の LP 実装や共通 UI 整備を、既存文書と矛盾しない形で進められる

### 成功条件

- root に必要な主要ファイルが揃い、pnpm workspace として package 解決できる
- `apps/lp-site`、`packages/ui`、`packages/config`、`e2e` の最小構成と責務が一致している
- root scripts と workspace package 名、および root 管理の設定ファイル責務が明記されている
- 今回採用する toolchain と補助ツールの導入対象、用途、導入順が spec 上で明示されている
- 開発、build、check、test の最小導線が root から実行できる前提になっている
- E2E 対象 app を後から追加しても、root Playwright 設定と app 側 command contract だけで接続できる
- app / package ごとの typecheck command が定義され、root `typecheck` がそれを束ねる前提になっている
- 文書上の Phase 1 前提と実ファイル構成にズレが残らない

### 対象ユーザー / 操作主体

- 主操作主体は Kufu Monorepo の開発者と AI エージェント
- 二次的な利用者は、後続の LP 実装、CMS 設計、共通 package 整備を行う実装担当者

## 論点一覧

| #   | 論点                                                | 決定候補                                                      | 決定                         |
| --- | --------------------------------------------------- | ------------------------------------------------------------- | ---------------------------- |
| 1   | issue #3 を 1 spec に閉じるか、app ごとに分割するか | 1 spec で Phase 1 foundation / root 基盤のみ / app 単位に分割 | 1 spec で Phase 1 foundation |
| 2   | 初回 scaffold の完成度をどこに置くか                | 構造のみ / 起動可能最小 / Storybook・E2E まで厚く整備         | 起動可能最小                 |
| 3   | 共通 UI の範囲をどこまで許容するか                  | LP 内ローカルのみ / `packages/ui` まで先行整備                | LP 内ローカルのみ            |
| 4   | `e2e` を root 管理にするか package 化するか         | root 管理 / `@kufu/e2e` package 化                            | root 管理                    |
| 5   | infra 前提をこの spec に含めるか                    | contract のみ / Terraform 実装まで含める                      | contract のみ                |

## 解決済みの論点

- issue #3 の対象は root 設定、`apps/lp-site`、`packages/ui`、`packages/config`、root 管理の `e2e` を含む最小 foundation とする
- 初回 scaffold は「起動可能最小」を目標にし、詳細な Storybook / E2E シナリオ整備は後続に回す
- `apps/cms` は issue #3 では実装しない。LP 投稿管理向けの将来 app 候補として文書にだけ記載し、技術選定と設計は後続 issue / spec に送る
- Cloudflare / Terraform は contract だけを文書化し、実装スコープ外とする
- `e2e` は root `playwright.config.ts` と `e2e/` 配下で管理し、workspace package にはしない
- `packages/config` は少なくとも `tsconfig`、`oxlint`、`vitest` の shared config を公開する
- `oxfmt`、`knip`、`dependency-cruiser` は root script / root config を正本とし、`packages/config` export には含めない
- `Storybook` と `tsdown` は `packages/ui` の骨組みに必要な入口だけ整え、本格運用は後続 issue に送る
- `Rolldown` と `React Compiler` は repository 方針として維持するが、issue #3 では `packages/ui` 側のルール明文化に留める。`apps/cms` 実装時の実効設定は後続 issue で扱う
- `knip` と `dependency-cruiser` は issue #3 で実導入し、root script から実行できる状態まで作る
- root scripts は workspace task を `turbo run` で束ね、root 管理ツールは直実行に分ける
- `packages/config` の export は用途別 subpath に分け、`tsconfig/base`、`tsconfig/react`、`tsconfig/astro`、`oxlint/base`、`vitest/base` を初期対象とする
- app scaffold は手動 `add` よりも公式 `create` command を優先し、issue #3 では `apps/lp-site` の `pnpm create astro@latest apps/lp-site` を正とする
- `Vite+` は monorepo 全体の toolchain 契約を見直す論点が大きいため、issue #3 では採用しない

## 未確定事項

- この issue 内で未解決の論点はない

## 後続 issue / 他 repo へ送る論点

- Cloudflare Pages preview / production に紐づく branch、domain、secret の運用ルール粒度
- Cloudflare Pages / Workers の deploy 設定を app repo と infra repo のどちらでどこまで持つか
- preview URL を使ったレビュー手順を repo ルールとしてどの文書に固定するか
- Cloudflare Turnstile や Analytics など edge サービスを採用する場合の責務境界
- 上記は `$(ghq root)/github.com/Fukuemon/kufu-infra` 側で設計が必要になりうるため、foundation 完了後に infra repo 側の design issue 候補として洗い出す
- LP 掲載投稿を管理する `apps/cms` の責務、公開フロー、権限、データモデル
- `apps/cms` を作る場合の技術選定。初期案として Hono + Inertia + React を候補に置くが、採否は別 spec で判断する

## 実装対象

| モジュール   | 実装有無 | 主な責務                                                             |
| ------------ | :------: | -------------------------------------------------------------------- |
| `lp-site`    |    ◯     | Astro LP、静的ページ、section、assets、最小 dev/build 導線           |
| `ui`         |    ◯     | 共有 UI 基盤の骨組み、public entrypoint、将来の Storybook 入口       |
| `config`     |    ◯     | TypeScript、lint、test などの共有設定                                |
| `e2e`        |    ◯     | root 管理の Playwright 実行入口、LP の smoke / critical flow 検証    |
| `cms`        |    -     | LP 掲載投稿の管理 app 候補。技術選定と設計のみ後続で扱う             |
| `future-api` |    -     | 初期スコープ外。将来の Hono API / CMS 連携候補                       |

## 機能仕様

### User Flow

1. 開発者が root で依存解決を行い、workspace 全体の package を認識できる
2. 開発者が `dev` / `dev:lp` や各種 check scripts を実行し、LP と monorepo foundation の最小導線を確認できる
3. 開発者が app と root / package 設定の責務境界を把握し、後続実装を適切な配置先で始められる

### Performance

- Phase 1 では `apps/lp-site` の performance を最優先する
- LP は Astro の静的生成前提で構成し、Astro で解決できるものを React island にしない
- 初回 scaffold の時点で不要な client directive やクライアント JavaScript を増やさない

### Routing / URL State

- この issue では CMS app の route 設計は扱わない
- `apps/lp-site` の page / route は Astro 標準の file-based routing に従う
- 将来 `apps/cms` を導入する際は、URL で表現できる状態を router 側へ寄せる、という repository 標準方針を引き継ぐ

### Content / Assets

- `apps/lp-site` は静的 asset と LP 固有コンテンツの置き場を持つ
- `packages/config` は設定ファイルと共通 presets のみを扱い、業務データや app asset は持たない

### UI Reuse

- 第一原則は feature / colocation とし、各 feature や app の文脈で閉じる UI はその feature 配下に置く
- LP 内で閉じる UI は `apps/lp-site` 配下に置く
- 共通 UI package は `packages/ui` として骨組みを置き、複数 feature / app をまたいで再利用が明確になったものだけを集約する正規入口にする
- `packages/ui` には shadcn/ui ベース部品、design token、font、theme を置けるが、先回りした共通化はしない
- 初回 scaffold では過剰な UI 抽象化を避け、public entrypoint と最小構成だけを定義する

### Rolldown / React Compiler

- `Rolldown` は repository の採用方針としてこの issue で明文化する
- `React Compiler` も repository 標準方針としてこの issue で明文化する
- 実際の compiler 設定は `packages/ui` と将来の `apps/cms` 実装時に判断し、`'use no memo'` 判断は後続の React 実装 spec で継続する

### Testing

- root から `lint`、`format`、`typecheck`、`test`、`e2e` を実行できる最小導線を持つ
- root 管理の `e2e` と workspace package の build / typecheck の責務を切り分ける
- E2E は初回は実行入口を成立させることを優先し、詳細シナリオ拡充は後続とする
- E2E は root `playwright.config.ts` を正本とし、app 実装と並走して test を追加できる command contract を優先する
- `knip` と `dependency-cruiser` は root で扱う analysis tool 候補として明記する
- `Storybook` は `packages/ui` skeleton の入口として扱い、詳細運用は後続とする

## Interface 設計

### UI / API / Event Interface

- root public scripts
  - `dev`
  - `dev:lp`
  - `build`
  - `lint`
  - `format`
  - `format:check`
  - `typecheck`
  - `test`
  - `e2e`
  - `knip`
  - `depcruise`
- workspace public packages
  - `@kufu/lp-site`
  - `@kufu/ui`
  - `@kufu/config`
- 共有境界
  - root 直下の quality / e2e 設定は root が責務を持つ
  - app 間の直接依存は禁止
  - 共有設定は `@kufu/config` を正規入口とする
  - `e2e`、`knip`、`dependency-cruiser`、`oxfmt` は root script から直実行する

### Tooling / Command Contract

- root toolchain
  - package manager: pnpm workspace
  - task runner: Turborepo
  - language: TypeScript
- app / package toolchain
  - `apps/lp-site`: Astro
  - `packages/ui`: shared UI foundation package + Storybook 入口
  - `packages/config`: shared config package
- build / quality tools
  - bundler: Rolldown
  - lint: oxlint
  - type-aware lint: oxlint-tsgolint
  - format: oxfmt
  - unit test: Vitest
  - e2e: Playwright
  - dead code detection: knip
  - dependency analysis: dependency-cruiser
  - package build: tsdown
- 初回 scaffold での扱い
  - 必須で実行導線まで作る: pnpm workspace, Turborepo, Astro, TypeScript, oxlint, oxlint-tsgolint, oxfmt, Vitest, Playwright
  - issue #3 で採用方針だけ明文化する: Rolldown, React Compiler
  - root 管理の analysis tool として実導入する: knip, dependency-cruiser
  - 骨組みの入口だけ整え、詳細運用は後続に送る: Storybook, tsdown
  - ESLint は初期必須ツールに含めない。oxlint で不足するルールや plugin 互換が見つかった場合のみ併用を再検討する

### E2E Command Contract

- `pnpm e2e` は root `playwright.config.ts` から実行する repository task とする
- Phase 1 の既定対象は `apps/lp-site` とし、将来 `apps/cms` や追加 app も同じ contract で接続できるようにする
- app 側で E2E 対象になる workspace は、少なくとも次の script を持てる構成に揃える
  - `build`: E2E 前提の build を作る
  - `preview`: build artifact をローカル配信する
  - `e2e:serve`: root Playwright から呼び出す E2E 用起動 command。初期は `preview` の alias でもよい
- root Playwright 設定は `webServer` を使う前提とし、対象 app の `e2e:serve` を起動してから test を流す
- root 側の標準 env は以下を初期 contract とする
  - `E2E_TARGET`: 既定は `lp-site`
  - `E2E_BASE_URL`: 既定は `http://127.0.0.1:<E2E_PORT>`
  - `E2E_PORT`: app ごとに固定値を割り当てる。初期案は `lp-site=4321`、`cms=4173`
- test 配置は `e2e/<target>/` を基本とし、app 実装と並走して対象 app の suite を追加できるようにする
- issue #3 時点では test 本数よりも、root config と app script をつなぐ起動契約が成立していることを受け入れ条件とする

### Typecheck Contract

- `pnpm typecheck` は root から `turbo run typecheck` で束ねる
- typecheck は app / package ごとに自前 script を持ち、root は集約だけを担う
- 初期の標準 command は次を採用する
  - `apps/lp-site`: `astro check`
  - `packages/ui`: `tsc --noEmit`
  - `packages/config`: `tsc --noEmit`
- `packages/config` は shared tsconfig preset を配布するが、typecheck の実行主体は各 workspace 自身とする
- Phase 1 では TypeScript project references までは必須にしない。workspace が増え、build 順や型依存の最適化が必要になった時点で後続 issue で再検討する
- app / package が追加された場合は、対応する `typecheck` script を必須とし、root `typecheck` に自動的に参加できる状態を正とする

### 導入順 / インストール方針

1. root workspace 基盤を作成し、pnpm workspace と Turborepo を導入する
2. root quality scripts の前提として TypeScript、oxlint、oxlint-tsgolint、oxfmt、Vitest、Playwright の依存を追加する
3. `apps/lp-site` に Astro を導入し、最小 entrypoint を作る
4. `packages/ui` と `packages/config` を作成し、shared package として解決できる状態にする
5. `Rolldown` と `React Compiler` の採用位置を明文化し、`packages/ui` と将来の `apps/cms` 設計へ引き継ぐ
6. `knip` と `dependency-cruiser` を root analysis tool として導入し、root script へ接続する
7. 最後に root scripts から `dev`、`dev:lp`、`build`、`lint`、`format`、`typecheck`、`test`、`e2e` を順に確認する

### Root Script Contract

- `turbo run` で束ねる script
  - `dev`
  - `dev:lp`
  - `build`
  - `lint`
  - `typecheck`
  - `test`
- root 直実行にする script
  - `format`
  - `format:check`
  - `e2e`
  - `knip`
  - `depcruise`
- 代表コマンド案
  - `dev`: `turbo run dev --parallel`
  - `dev:lp`: `turbo run dev --filter=@kufu/lp-site`
  - `build`: `turbo run build`
  - `lint`: `turbo run lint`
  - `typecheck`: `turbo run typecheck`
  - `test`: `turbo run test`
  - `format`: `oxfmt . --write`
  - `format:check`: `oxfmt . --check`
  - `e2e`: `playwright test`
  - `knip`: `knip`
  - `depcruise`: `dependency-cruiser .`

### `packages/config` Export Contract

- `@kufu/config` は用途別 subpath export を正とする
- 初期 export 対象
  - `@kufu/config/tsconfig/base`
  - `@kufu/config/tsconfig/react`
  - `@kufu/config/tsconfig/astro`
  - `@kufu/config/oxlint/base`
  - `@kufu/config/vitest/base`
- `package.json` の `exports` は上記 subpath を明示し、雑な単一 entrypoint に寄せない
- `Storybook` と `tsdown` は後続で必要性が固まった時点で追加 export を検討する
- `oxfmt`、`knip`、`dependency-cruiser`、`playwright` は root 管理のため export 対象に含めない

### Lint / Format 方針

- `lint` は `oxlint` を正とし、TypeScript project では `oxlint-tsgolint` を併用して type-aware lint を有効化する
- `format` は `oxfmt` を正とし、`prettier` は導入しない
- 日常運用では `format` による自動整形を基本とし、必要なら `format:check` を CI や確認用途で使う
- `eslint` は初期必須ではない
- `eslint` を残す条件は、`oxlint` で未対応のルール、既存 plugin 依存、または project 固有 rule が issue #3 の実装で必要になった場合に限る
- その場合も `oxlint` を先に実行し、不足分だけ `eslint` で補う段階移行を基本方針とする

### フェーズ別実行コマンド案

以下は issue #3 を順に実行するための標準コマンド案である。実際の package 名と script 名は scaffold 作成時にこれへ合わせる。

#### P1: root workspace / task runner

```sh
pnpm add -D turbo typescript oxlint oxlint-tsgolint oxfmt @playwright/test vitest
```

```sh
pnpm add -D @types/node
```

- root `package.json` に `dev`、`dev:lp`、`build`、`lint`、`format`、`format:check`、`typecheck`、`test`、`e2e` を定義する
- root に `pnpm-workspace.yaml`、`turbo.json`、`playwright.config.ts`、共通 `tsconfig` の入口を配置する
- `lint` script は `oxlint`、必要に応じて `--type-aware` を含む構成を前提にする
- `format` script は `oxfmt`、確認用は `oxfmt --check` を前提にする
- `playwright.config.ts` は `webServer` と `E2E_TARGET` / `E2E_PORT` / `E2E_BASE_URL` の env contract を扱える形にする

#### P2: `apps/lp-site`

```sh
pnpm create astro@latest apps/lp-site
```

- `apps/lp-site` に Astro app の最小 entrypoint を置く
- build / dev script は root から `pnpm --filter @kufu/lp-site ...` で呼べる形に揃える
- 初期 scaffold は `pnpm create astro@latest apps/lp-site` をベースにし、monorepo 契約に合わせて script と設定を調整する
- `typecheck` は `astro check` を標準とし、将来 E2E 対象になった時は `e2e:serve` を追加する

#### P3: `packages/ui`

```sh
pnpm --filter @kufu/ui add react react-dom
```

```sh
pnpm --filter @kufu/ui add -D typescript tsdown storybook
```

- `packages/ui` は shared UI foundation の public entrypoint と最小 build 入口を持つ
- `packages/ui` は shadcn/ui ベース部品、design token、font、theme など、複数 feature / app をまたいで再利用が確定した UI 基盤の置き場とする
- feature / colocation を優先し、app や feature 内で閉じる UI は `packages/ui` へ移さない
- `Storybook` と `tsdown` は、骨組みとしての入口だけ整え、本格運用は後続に送る
- `typecheck` は `tsc --noEmit` を標準とする

#### P3: `packages/config`

```sh
pnpm --filter @kufu/config add -D typescript oxlint vitest
```

- `packages/config` は少なくとも tsconfig / oxlint / vitest の shared config を公開する
- `knip` と `dependency-cruiser` は workspace 全体を見るため root config を正とし、package export には含めない
- `Storybook` は `packages/ui` 側の責務とし、`packages/config` export 対象に含めない
- export file 名は `tsconfig/base.json`、`tsconfig/react.json`、`tsconfig/astro.json`、`oxlint/base.json`、`vitest/base.ts` を初期案とする
- `packages/config` 自身も `typecheck` script を持ち、配布する config の型破綻を root `typecheck` で検知できるようにする

#### P4: analysis / maintenance / e2e

```sh
pnpm add -D knip dependency-cruiser
```

- `knip` と `dependency-cruiser` は root から実行する analysis tool として導入する
- `e2e` は root `playwright.config.ts` と `e2e/` 配下の tests を root 管理にする
- `playwright.config.ts` は app 固有実装を持ち込まず、`E2E_TARGET` と app script contract で接続する

#### 導入後の確認コマンド

```sh
pnpm install
pnpm dev
pnpm dev:lp
pnpm build
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
pnpm test
pnpm e2e
pnpm knip
pnpm depcruise
```

#### 補足

- `Rolldown` は将来の `apps/cms` 採用候補を含む repository 方針として扱い、issue #3 では実装を入れない
- `React Compiler` は `packages/ui` と将来の React app での設定ルールをこの issue で先に明文化する
- `knip` と `dependency-cruiser` は root analysis tool として扱い、`packages/config` export には含めない
- `Storybook` と `tsdown` は `packages/ui` の骨組みに入口だけ置き、詳細運用は後続 issue へ送る
- 依存追加はすべて `pnpm --filter` を優先し、root 専用ツールだけ root に追加する
- app 初期生成は `pnpm --filter ... add` ではなく公式 `create` command を使い、その後に monorepo 契約へ寄せる
- `eslint` は新規導入しない。`oxlint` で不足が確認された時だけ追加候補とする

### Props / Request / Response

- この spec では API request / response は定義しない
- `packages/ui` は app から import 可能な public entrypoint を持つ
- `packages/config` は app / package から参照できる shared config entrypoint を持つ
- `apps/lp-site` は dev / build の entrypoint を持つ

## Content / Data 設計

### 保存・管理するデータ

- この spec ではアプリケーションデータや CMS データの保存仕様は扱わない
- 管理対象は repo 構造、設定ファイル、最小 scaffold、テスト実行入口のみとする

### コンテンツ配置 / package / route

- root: workspace 定義、task runner、共通 scripts、Playwright 設定
- `apps/lp-site`: Astro app 本体、静的 asset、LP 用 route / page の土台
- `packages/ui`: 共通 UI 基盤の public entry と最小 build 入口
- `packages/config`: tsconfig / oxlint / vitest の shared config
- `e2e`: Playwright tests と共通 test utility の入口
- `apps/cms`: LP 掲載投稿の管理 app 候補。issue #3 では実装せず、文書上の将来配置先としてのみ扱う
- app ごとの E2E suite は `e2e/<target>/` へ増設する

## Performance / Security 設計

### Performance

- LP の performance を repository 全体で最優先する
- Astro で解決できる構成は Astro に留め、初期段階で不要な React 化をしない
- workspace scaffold は app の責務境界を明確にし、LP 向け asset と shared UI を混在させない

### Security / Privacy

- secrets、token、API key を repo に保存しない
- Cloudflare secret 管理を前提とし、この repo には contract と責務だけを残す
- 将来フォームや外部 API を追加する場合は、秘匿情報を client bundle に含めない前提を維持する

## Error / Fallback 設計

### エラーケース

| #   | ケース                                            | ユーザーへの見せ方                         | リカバリ                                                   |
| --- | ------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| 1   | install 不整合で workspace 依存解決に失敗する     | root install 時に失敗ログが出る            | package 名、workspace 定義、依存の整合を見直す             |
| 2   | workspace 解決失敗で app / package が認識されない | root scripts が対象 package を解決できない | `pnpm-workspace.yaml` と package 名、配置を確認する        |
| 3   | app / package 間で import 境界違反が起きる        | build / typecheck / lint で検知する        | 共有コードを `packages/*` へ寄せ、app 間直接依存を解消する |
| 4   | 開発コマンド未整備で dev / check 導線が使えない   | root scripts 実行時に失敗する              | root scripts と各 workspace の entrypoint を揃える         |

### Fallback

- 初回 scaffold では「起動可能最小」を優先し、詳細な機能実装や検証は後続 spec へ分離する
- 未確定の shared UI や shared config は、必要最小の entrypoint のみ用意し、過剰に先回りしない

## テスト / 評価方針

### テスト観点

- root から workspace 依存解決できること
- `apps/lp-site` が build / typecheck / dev の入口を持つこと
- `packages/ui` と `packages/config` が共有 package として参照可能であること
- `lint`、`format`、`typecheck`、`test`、`e2e` の root scripts が揃っていること
- `playwright.config.ts` が app 側 `e2e:serve` と env contract で接続できること
- `knip` と `depcruise` の root scripts が揃っていること
- Playwright の root 実行入口があり、後続で critical flow を追加できること

### 計測指標

- Workspace Resolve Pass: root install 後に各 package が解決できるか
- Script Availability Pass: root scripts が定義されているか
- App Build Pass: `apps/lp-site` の build 導線が通るか
- Typecheck Pass: app / package ごとの `typecheck` script が root `typecheck` から実行できるか
- Check Pipeline Pass: lint / format / typecheck / test / e2e の最小実行導線が通るか
- E2E Wiring Pass: `E2E_TARGET` を切り替えても root Playwright 設定と app script contract で接続できるか
- Analysis Pass: `knip` と `dependency-cruiser` の実行導線が通るか
- Toolchain Coverage Pass: Design Docs / AGENTS.md にある採用技術が spec の導入対象または後続判断対象として列挙されているか

## 実装分割

### 実装タスク案

| Phase | 対象                              | 概要                                                                                                                                        | 依存       |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| P1    | root workspace / task runner      | `package.json`、`pnpm-workspace.yaml`、`turbo.json`、共通 scripts、TypeScript / oxlint / oxfmt / Vitest / Playwright の root 導線を整備する | なし       |
| P2    | `apps/lp-site`                    | Astro LP skeleton を作り、root から `dev:lp` / `build` を呼べる状態にする                                                                  | P1         |
| P3    | `packages/ui` / `packages/config` | UI package skeleton と tsconfig / oxlint / vitest の shared config package を作り、root と app から参照できる状態にする                     | P1         |
| P4    | `e2e` / analysis / docs alignment | root 管理の Playwright 実行入口、knip / dependency-cruiser の導入方針、Rolldown / React Compiler の骨組み設定、文書差分の最終調整を行う     | P1, P2, P3 |

### prompts 生成方針

- `root workspace`、`apps`、`packages`、`e2e/docs` の単位で prompt 分割する
- root scripts と shared config package の contract を先に固定する
- `apps/cms` は今回の prompt 分割に含めず、別 issue / spec で技術選定と設計から着手する

## 既存資料からの変更点

| 対象                                              | 変更内容 | 理由                                                                       |
| ------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `PRD.md`                                          | 更新あり | issue #3 を LP foundation に絞り、Phase 1 / Phase 2 の境界を明確にするため |
| `design/DesignDoc.md`                             | 更新あり | root 管理の `e2e` と `packages/config` の責務を明確にするため              |
| `adr/0001-terraform-infra-repository-boundary.md` | 変更なし | infra repo 分離方針は issue #3 の前提として流用できるため                  |

## 変更履歴

| 日付       | 変更者 | 変更内容                                            |
| ---------- | ------ | --------------------------------------------------- |
| 2026-05-09 | Codex  | `apps/base` を実装対象から外し、`apps/cms` を将来設計の文書対象へ変更 |
| 2026-05-08 | Codex  | issue #3 向けの monorepo foundation spec を新規作成 |

## 備考

- 初回 draft では、後続実装に必要な public contract と受け入れ条件の確定を優先する
- `workflow-spec-lifecycle` に沿って、次回は上位文書突合、未確定事項の解消、interface / testing のレビューを進める
