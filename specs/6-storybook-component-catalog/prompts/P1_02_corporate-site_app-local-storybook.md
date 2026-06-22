# corporate-site App-Local Storybook

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない。ただし Storybook / framework の設定確認に限り、`package.json` / lockfile / npm metadata / 公式 docs は確認してよい
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- corporate-site 専用 Presentation component を `packages/ui` に移さない
- `pnpm` を実行するときは `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH"` を付ける
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止

### 実装アンチパターンの回避 (必守)

- スコープ厳守: spec / 本 prompt に明記された機能のみ実装する。未要求の機能追加・
  先回りの抽象化・無関係なリファクタ・暗黙の互換維持をしない。
- 既存規約への整合: 命名・エラー処理・ログ・テスト・API 連携方式は、対象コードベースの
  既存パターンに合わせる。新方式を持ち込む場合は理由を述べて確認を取る。
- 観測可能な契約の保持: UI 文言・イベント名・戻り値・エラーメッセージ・ログ形式・API を
  要求なく変更しない。変更が必要なら理由と影響を明記する。
- 推測の排除: 要件・業務ルール・API 仕様が不明なら停止して確認する。それらしいが
  誤った実装 (存在しない API 呼び出し / 非互換な引数) を避け、import と API の実在を確認する。
- fallback の最小化: `??` / `||` / 既定引数 / 多段 fallback / 暗黙のエラー握り潰しは
  「任意データ」に限定する。必須データの欠落は隠さず明示的に失敗させる。
- 過剰実装の排除: 単純な条件分岐を strategy / handler map に置換しない。
  要求も計測もない caching / memoization を入れない。
- dead code を残さない: 到達不能コード・未使用の変数 / 関数 / import / export・
  変更後に不要化した型定義を削除する。
- 判断の記録: 非自明な設計判断は理由 (or spec / ADR へのリンク) を残す。

## 作業ステップ

### ステップ 0: ブランチ準備

ブランチ命名と base branch は `AGENTS.md` の `Spec Workflow Contract` および `workflow-git` に従う。

1. 最新の base branch を取得する
2. 作業ブランチ `feature/6` を作成する
3. PR テンプレートを確認し、完了条件を description に転記する
4. Draft PR を作成して push する
5. 検証: `git status --short` で作業ブランチ上にいることを確認する

### ステップ 1: app-local Storybook 導線

1. `apps/corporate-site/package.json` に `storybook` / `storybook:build` script を追加する
   - `storybook`: `storybook dev --host 127.0.0.1 --port 6007`
   - `storybook:build`: `storybook build`
2. `apps/corporate-site/package.json` に `storybook@^10.4.6` / `@storybook-astro/framework@^1.5.0` を devDependency として追加する
3. `apps/corporate-site/.storybook/main.ts` を追加し、framework は `@storybook-astro/framework` にする
4. Storybook script は `storybook dev` / `storybook build` を使い、旧 `start-storybook` / `build-storybook` は使わない
5. Storybook addon は初期導入を最小にする
6. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/corporate-site typecheck`
7. diff レビューを実施し、production build 設定へ混ぜていないことを確認する

### ステップ 2: presentation component と story

1. `apps/corporate-site/src/components/features/<feature>/` (domain feature 単位) 配下に対象 component を置く。横断 component は `components/common/<Component>/` に置く
2. `ServicePillar` (services), `BusinessFeatureRow` (business), `ContactInfoRow` (contact) を presentation component (`<Component>.astro`、`Presentation` suffix なし) として実装する。content / fixture は component に直書きせず story 側に持つ (本体実装段階で content 層へ移す)
3. story は `<Component>.stories.*` とし、presentation component を対象にする。title は feature 単位 (`Business/...`, `Products/...`, `Contact/...`, `Services/...`, `Common/...`)
4. `BusinessFeatureRow` は `MediaRight` / `MediaLeft` の story を持つ
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/corporate-site storybook:build`
6. diff レビューを実施し、空 Container を末端 component ごとに作っていないことを確認する

### ステップ最終: 最終確認

1. `## 検証コマンド` をすべて実行する
2. spec の `## 上位資料からの変更点` に追記が必要なら `spec-track` に渡す
3. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/6-storybook-component-catalog/index.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/package.json`
  - `apps/corporate-site/.storybook/`
  - `apps/corporate-site/src/components/features/<feature>/` (+ `components/common/`)
  - `apps/corporate-site/src/styles/globals.css`
  - `apps/corporate-site/README.md`
  - `design/features/corporate-site/component-map.md`
- 正本:
  - `context/component-design.md`
  - `context/engineering.md`
  - `adr/0008-astro-react-island-policy.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし
- 完了後に着手可能になる後続 prompt: `P2_01_core_storybook-contract-docs.md`, `P3_01_core_verification-sync.md`
- 必要な repo 状態: `apps/corporate-site` は Astro app として存在し、`@kufu/ui` を依存に持つ

## 不明点ハンドリング

- `@storybook-astro/framework` が Astro 6 / Storybook 10 の組み合わせで成立しない場合は、React wrapper に逃がさず停止し、app-local Storybook の後続 issue 分離を提案する
- Presentation props が不足する場合は、固定 fixture で表現できる最小 props を定義し、business rule を推測しない
- 質問するときは、止まっている作業単位、判断が必要な論点、選択肢を整理する

## タスク境界

### 実装する範囲

- `apps/corporate-site` の app-local Storybook 起動 / build script
- `apps/corporate-site/.storybook/` の Astro Storybook config
- `ServicePillar`, `BusinessFeatureRow`, `ContactInfoRow` の Container / Presentation skeleton
- 上記 3 component の Presentation story

### 実装しない範囲

- `packages/ui` Storybook
- root script
- corporate-site 本体 route の完成実装
- API / CMS / external service 連携
- `.pen` 編集
- production artifact としての Storybook 配信

## 設計仕様

- app-local Storybook は `.astro` Presentation component を直接確認するため Storybook 10 + `@storybook-astro/framework` を採用する
- `apps/corporate-site/.storybook/main.ts` の型 import は `@storybook-astro/framework` から行う
- `@storybook-astro/framework@1.5.0` の React renderer peer は optional なので、React wrapper 用依存を初期導入しない
- corporate-site 固有 component は `apps/corporate-site/src/components/features/<feature>/` (domain feature 単位、app 名フォルダなし)、横断 component は `components/common/` に置く
- presentation component は `<Component>.astro` (`Presentation` suffix なし)。data/logic は content 層、束ねは `<Feature>Section.astro` (本体実装段階で追加)
- Storybook 対象は presentation component とする
- 初期 story 対象は `ServicePillar`, `BusinessFeatureRow`, `ContactInfoRow`
- story 階層は `Services/ServicePillar`, `Business/BusinessFeatureRow`, `Contact/ContactInfoRow`
- stories は固定 props / fixture を使い、本番 secret や実送信を伴わない

## テスト観点

- `pnpm --filter @kufu/corporate-site storybook` で app-local Storybook が起動できる
- `pnpm --filter @kufu/corporate-site storybook:build` で app-local Storybook build が成功する
- corporate-site 固有 presentation component が app-local Storybook catalog に掲載されている
- corporate-site 固有 story が presentation component (`<Component>.astro`) を対象にしている
- corporate-site の route entry と feature component が `pages` / `components/features/<feature>` (domain feature 単位) に分かれている
- Storybook 追加に起因する corporate-site runtime JS 増加がない

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/corporate-site lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/corporate-site typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/corporate-site build`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/corporate-site storybook:build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] `apps/corporate-site` に app-local Storybook 起動 / build 導線を追加した
- [ ] `@storybook-astro/framework` 前提の Storybook config を追加した
- [ ] 初期対象 3 component の Presentation story がある
- [ ] story は Container ではなく Presentation component を対象にしている
- [ ] `packages/ui` に corporate-site 固有 component を追加していない
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 未解決の仕様質問が残っていない
