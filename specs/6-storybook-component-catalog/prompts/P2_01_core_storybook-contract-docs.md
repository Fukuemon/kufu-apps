# Root Storybook Contract And Docs

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない。ただし Storybook / framework の設定確認に限り、`package.json` / lockfile / npm metadata / 公式 docs は確認してよい
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- root `build` に Storybook build を混ぜない
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

### ステップ 1: root script contract

1. root `package.json` に `storybook:ui` を追加し、`@kufu/ui` の Storybook 起動へ委譲する
   - `storybook:ui`: `pnpm --filter @kufu/ui storybook`
2. root `package.json` に `storybook:corporate` を追加し、`@kufu/corporate-site` の Storybook 起動へ委譲する
   - `storybook:corporate`: `pnpm --filter @kufu/corporate-site storybook`
3. root `package.json` に dedicated quality gate として `storybook:build` を追加し、shared / app-local Storybook build をまとめる
   - `storybook:build`: `pnpm --filter @kufu/ui storybook:build && pnpm --filter @kufu/corporate-site storybook:build`
4. production `build` script は変更しない
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm storybook:build`
6. diff レビューを実施し、root task boundary に反していないことを確認する

### ステップ 2: docs

1. `context/engineering.md` に Storybook / shared UI review 運用契約を反映する
2. `packages/ui/README.md` に起動方法、story 追加手順、review checklist へのリンクを追加する
3. `apps/corporate-site/README.md` に app-local component 配置と Storybook 導線を追加する
4. 必要なら `context/project.md` の Quick Commands と整合させる
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`
6. diff レビューを実施し、正本の二重管理になっていないことを確認する

### ステップ最終: 最終確認

1. `## 検証コマンド` をすべて実行する
2. spec の `## 上位資料からの変更点` に追記が必要なら `spec-track` に渡す
3. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/6-storybook-component-catalog/index.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `package.json`
  - `context/project.md`
  - `context/engineering.md`
  - `context/component-design.md`
  - `packages/ui/README.md`
  - `apps/corporate-site/README.md`
- 正本:
  - `context/project.md`
  - `context/engineering.md`
  - `context/component-design.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_ui_storybook-catalog.md`, `P1_02_corporate-site_app-local-storybook.md`
- 完了後に着手可能になる後続 prompt: `P3_01_core_verification-sync.md`
- 必要な repo 状態: package 側に `storybook` / `storybook:build` scripts が存在する

## 不明点ハンドリング

- root `storybook:build` が package script 不在で成立しない場合は、依存 prompt の未完了として停止する
- docs の正本が衝突する場合は、`context/engineering.md` を運用契約、README を手順とリンクに限定する
- 質問するときは、止まっている作業単位、判断が必要な論点、選択肢を整理する

## タスク境界

### 実装する範囲

- root Storybook scripts
- Storybook quality gate の docs
- shared UI review 手順と checklist への導線
- app-local Storybook 導線の README 記載

### 実装しない範囲

- `packages/ui` component / story 実装
- `apps/corporate-site` Presentation component / story 実装
- `.pen` 編集
- CI workflow ファイルの追加
- production `build` への Storybook 組み込み

## 設計仕様

- root `storybook:ui` は `packages/ui` Storybook 起動へ委譲する
- root `storybook:corporate` は `apps/corporate-site` app-local Storybook 起動へ委譲する
- root `storybook:build` は shared / app-local Storybook build をまとめて実行する dedicated quality gate とする
- package 側 Storybook script は Storybook 10 の `storybook dev` / `storybook build` を使う
- Storybook build は production `build` には混ぜない
- `context/engineering.md` を Storybook / shared UI review 運用契約の正本にする
- `packages/ui/README.md` は `packages/ui` を触る開発者向けの起動方法、story 追加手順、review checklist へのリンクを置く
- `apps/corporate-site/README.md` は app-local component 配置と Storybook 導線を置く

## テスト観点

- `pnpm storybook:ui` で root から `packages/ui` Storybook が起動できる
- `pnpm storybook:corporate` で root から app-local Storybook が起動できる
- `pnpm storybook:build` で shared / app-local Storybook build が成功する
- Storybook build は CI quality gate に含めるが、package の production build には混ぜない
- `.pen` はデザイン意図、Storybook / code は実装 catalog という正本境界が docs から辿れる

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm storybook:build`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] root `storybook:ui` / `storybook:corporate` / `storybook:build` を追加した
- [ ] Storybook build を production `build` に混ぜていない
- [ ] `context/engineering.md` に Storybook review contract がある
- [ ] `packages/ui/README.md` に起動方法と story 追加手順がある
- [ ] `apps/corporate-site/README.md` に app-local Storybook 導線がある
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 未解決の仕様質問が残っていない
