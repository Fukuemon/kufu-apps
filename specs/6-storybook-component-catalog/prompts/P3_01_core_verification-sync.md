# Storybook Catalog Verification And Sync

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない。ただし Storybook / framework の設定確認に限り、`package.json` / lockfile / npm metadata / 公式 docs は確認してよい
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- 検証で失敗したコマンドを握り潰さず、原因と未完了範囲を PR に記録する
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

### ステップ 1: catalog completeness review

1. `packages/ui` の初期 shared catalog 対象 11 件が Storybook に載っていることを確認する
2. `apps/corporate-site` の初期 Presentation story 3 件が app-local Storybook に載っていることを確認する
3. corporate-site 固有 component が `packages/ui` に混入していないことを確認する
4. `design/features/corporate-site/component-map.md` と story 階層の対応を確認する
5. `packages/ui` は Storybook 10 + `@storybook/react-vite`、`apps/corporate-site` は Storybook 10 + `@storybook-astro/framework` で構成されていることを確認する
6. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm storybook:build`
7. diff レビューを実施し、検証で見つけた不足だけを修正する

### ステップ 2: repository quality gate

1. root lint / typecheck / build / test を実行する
2. root format check を実行する
3. knip / depcruise を実行する
4. 失敗した場合は、原因、影響範囲、修正方針を整理してから修正する
5. 検証: `## 検証コマンド` を再実行する
6. diff レビューを実施し、検証専用 prompt の範囲を超える機能追加がないことを確認する

### ステップ 3: spec sync check

1. `context/component-design.md`, `context/engineering.md`, README, `context/project.md` の記述が実装結果と一致するか確認する
2. 差分が durable な運用ルールなら `spec-track` / `spec-sync` に渡す
3. spec の `## 上位資料からの変更点` に必要な追記があれば更新する
4. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`
5. diff レビューを実施し、正本境界が二重管理になっていないことを確認する

### ステップ最終: 最終確認

1. すべての検証結果を PR description に転記する
2. 未実施の検証がある場合は理由を明記する
3. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/6-storybook-component-catalog/index.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `package.json`
  - `packages/ui/`
  - `apps/corporate-site/`
  - `context/project.md`
  - `context/engineering.md`
  - `context/component-design.md`
  - `packages/ui/README.md`
  - `apps/corporate-site/README.md`
  - `design/features/corporate-site/component-map.md`
  - `specs/6-storybook-component-catalog/index.md`
- 正本:
  - `context/project.md`
  - `context/engineering.md`
  - `context/component-design.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_ui_storybook-catalog.md`, `P1_02_corporate-site_app-local-storybook.md`, `P2_01_core_storybook-contract-docs.md`, `P2_02_corporate-site_pencil-component-map.md`
- 完了後に着手可能になる後続 prompt: なし
- 必要な repo 状態: Storybook scripts / stories / docs / component map が実装済み

## 不明点ハンドリング

- 検証失敗が別 prompt の未完了に起因する場合は、その依存 prompt に戻す
- root quality gate の失敗が issue #6 と無関係な既存不具合に見える場合は、修正せず失敗内容を PR に記録して確認する
- 質問するときは、止まっている作業単位、判断が必要な論点、選択肢を整理する

## タスク境界

### 実装する範囲

- issue #6 実装結果の検証
- Storybook catalog / component map / docs の整合修正
- spec の `## 上位資料からの変更点` の必要最小限の更新

### 実装しない範囲

- 新規 component の追加
- Storybook addon の追加
- CI workflow の新設
- corporate-site 本体のページ完成実装
- spec にない design / architecture 変更

## 設計仕様

- Storybook build success は 100% を目標にする
- Storybook framework は Storybook 10 系に揃え、`@storybook/astro` など存在しない package 名を使わない
- shared component story coverage は issue #6 の初期 shared component 1 件につき default story 1 件以上
- corporate-site Presentation story coverage は app-local Presentation component 1 件につき default story 1 件以上
- Direct UI Duplication Count は共通化すべき UI の app-local 重複 0 件
- Unnecessary Client JS Count は Storybook 追加に起因する corporate-site runtime JS 増加 0 件
- durable な運用ルールは `context/component-design.md` / `context/engineering.md` / README へ同期する

## テスト観点

- `pnpm storybook:build` で shared / app-local Storybook build が成功する
- `pnpm lint` / `pnpm typecheck` / `pnpm build` / `pnpm test` が成功する
- `pnpm knip` / `pnpm depcruise` が成功する
- shared component に default / 主要 variant / 必要 state の story がある
- corporate-site 固有 Presentation component が app-local Storybook catalog に掲載されている
- corporate-site 専用 component が `packages/ui` に混入していない
- docs と実装結果の script contract が一致している

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm storybook:build`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm test`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm knip`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm depcruise`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] shared / app-local Storybook build が成功した
- [ ] root quality gate が成功した
- [ ] 初期 shared catalog 対象 11 件の story coverage を確認した
- [ ] 初期 corporate-site Presentation story 3 件の coverage を確認した
- [ ] docs と script contract が一致している
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 検証結果を PR description に転記した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] 未解決の仕様質問が残っていない
