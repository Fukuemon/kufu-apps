# Corporate Site Quality Guard

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- 正式 lint / pre-commit 自動化を新設せず、rg ベースの軽量 token guard に留める
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
2. 作業ブランチ `feature/10` を作成する
3. PR テンプレートを確認し、完了条件を description に転記する
4. Draft PR を作成して push する
5. 検証: `git status --short` で作業ブランチ上にいることを確認する

### ステップ 1: token guard を追加

1. `apps/corporate-site/src` を対象に raw hex (`#[0-9a-fA-F]{3,8}`) と Tailwind 色 arbitrary value (`text-[#...]` 等) を検出する軽量 check を追加する
2. false positive の除外は最小限にし、許容理由を近接コメントまたは script 内コメントに残す
3. 正式 lint / pre-commit 自動化には広げない
4. 検証: 追加した token guard コマンドを実行する
5. diff レビューで raw hex / 色 arbitrary value の混入がないことを確認する

### ステップ 2: performance / accessibility / preview smoke 修正

1. 表示専用 UI に React island / `client:*` が追加されていないことを確認する
2. `@kufu/ui/styles.css` 全量ではなく corporate-site の lean Tailwind entry を継続していることを確認する
3. nav / CTA / contact link の a11y 属性を確認する
4. Cloudflare preview smoke 相当で検出される layout / asset の問題を最小修正する
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build` と `pnpm e2e`
6. diff レビューで未要求の refactor が混ざっていないことを確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
2. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`
3. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
4. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm test`
5. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
6. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm e2e`
7. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm knip`
8. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm depcruise`
9. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
10. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Performance / Security 設計`, `テスト / 評価方針`, `実装分割`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/src/`
  - `apps/corporate-site/package.json`
  - `package.json`
  - `context/project.yml`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P3_01_corporate-site_home-sections.md`, `P4_01_corporate-site_products-page.md`, `P5_01_corporate-site_contact-page.md`, `P6_01_corporate-site_assets-images.md`, `P7_01_e2e_corporate-site-main-flow.md`
- 完了後に着手可能になる後続 prompt: なし
- 必要な repo 状態: #10 の UI / assets / E2E が実装済みである

## 不明点ハンドリング

- token guard の false positive を安全に除外できない場合は停止する
- performance / a11y の修正が別 prompt の仕様変更を要求する場合は停止する
- 質問するときは、対象ファイル、検出内容、最小修正案を整理する

## タスク境界

### 実装する範囲

- rg ベースの軽量 token guard
- raw hex / 色 arbitrary value の除去
- #10 範囲内の performance / accessibility / preview smoke 修正
- 最終 verification

### 実装しない範囲

- 正式 lint rule / pre-commit hook 新設
- visual screenshot / VRT
- Lighthouse / bundle size 数値目標の導入
- 問い合わせフォーム / API
- unrelated refactor

## 設計仕様

- raw hex / 色 arbitrary value は使わず、semantic token utility (`text-foreground`, `bg-background`, `border-border` 等) を使う。
- rg ベースの軽量 token guard で `apps/corporate-site/src` の混入を検出する。
- #10 の範囲では React island を追加しない。
- `@kufu/ui/styles.css` 全量ではなく、corporate-site の lean Tailwind entry を継続する。
- visual screenshot / VRT は #28 で扱う。

## テスト観点

- rg ベースの token guard で raw hex / 色 arbitrary value が混入していないこと。
- island 数。
- Build / typecheck / unit / E2E が通る。
- Contact の連絡先表示とフォーム差し込み境界が壊れていない。
- design source と `src/assets` の配信用コピーの対応が崩れていない。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm test`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm e2e`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm knip`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm depcruise`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] rg ベースの軽量 token guard を追加した
- [ ] raw hex / 色 arbitrary value の混入がないことを確認した
- [ ] 表示専用 UI に React island / `client:*` が追加されていないことを確認した
- [ ] performance / accessibility / preview smoke の #10 範囲内問題を修正した
- [ ] visual screenshot / VRT / Lighthouse 数値目標を追加していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
