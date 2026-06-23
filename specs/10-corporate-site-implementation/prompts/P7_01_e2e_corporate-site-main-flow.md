# Corporate Site Main Flow E2E

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- form 分岐 E2E / API E2E / visual screenshot / VRT は実装しない
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

### ステップ 1: route / content E2E を追加

1. `e2e/corporate-site/` 配下の spec を更新する
2. `/`, `/products`, `/contact` の表示を検証する
3. LP の主要 section と Products の 18 カテゴリを検証する
4. Products の代表的なメーカーを検証する
5. Contact の TEL / FAX / Email と `contact-form-slot` を検証する
6. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm e2e`
7. diff レビューで #26 のフォーム分岐に踏み込んでいないことを確認する

### ステップ 2: navigation / mobile nav E2E を追加

1. header nav / CTA / footer link の遷移を検証する
2. LP から Products / Contact への導線を検証する
3. mobile viewport で `site-nav-toggle` が開閉し、nav link が使えることを検証する
4. route intercept が必要な場合は root Playwright の既存 contract に従う
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm e2e`
6. diff レビューで flaky な visual assertion を追加していないことを確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
2. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
3. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
4. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm e2e`
5. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
6. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Testing`, `テスト / 評価方針`, `data-testid 一覧`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `e2e/corporate-site/smoke.spec.ts`
  - `playwright.config.ts`
  - `apps/corporate-site/src/pages/`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P2_01_corporate-site_layout-routes.md`, `P3_01_corporate-site_home-sections.md`, `P4_01_corporate-site_products-page.md`, `P5_01_corporate-site_contact-page.md`, `P6_01_corporate-site_assets-images.md`
- 完了後に着手可能になる後続 prompt: `P8_01_corporate-site_quality-guard.md`
- 必要な repo 状態: data-testid 一覧の要素が実装済みである

## 不明点ハンドリング

- data-testid が実装と spec で違う場合はテスト側で勝手に別名を作らず停止する
- content 文言が E2E で安定して検証できない場合は、対象 data-testid と検証対象を整理して確認する
- 質問するときは、止まっている assertion、期待値、候補を整理する

## タスク境界

### 実装する範囲

- 3 route smoke
- header / footer / CTA navigation
- LP から Products / Contact への導線
- Products の 18 カテゴリと代表メーカー
- Contact の連絡先表示と `contact-form-slot`
- mobile nav toggle

### 実装しない範囲

- form 分岐 E2E
- API / Workers E2E
- visual screenshot / VRT
- Lighthouse / bundle size 計測

## 設計仕様

- #10 の E2E は `/`, `/products`, `/contact` の表示、header / footer / CTA の遷移、LP から Products / Contact への導線、Products の 18 カテゴリと代表的メーカー、Contact の TEL / FAX / Email と `contact-form-slot`、mobile viewport の `site-nav-toggle` 開閉までを最小合格にする。
- form 分岐 E2E は #26 に委譲する。
- visual screenshot / VRT は #28 で検討し、#10 の最小合格に含めない。

## テスト観点

- `/`, `/products`, `/contact` の表示。
- header / footer / CTA の遷移。
- LP から Products / Contact への導線。
- Products の 18 カテゴリ表示。
- Products の代表的なメーカー表示。
- Contact の連絡先表示。
- Contact の連絡先表示とフォーム差し込み境界。
- mobile viewport で `site-nav-toggle` が開閉し、nav link が使えること。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm e2e`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] 3 route smoke を実装した
- [ ] header / footer / CTA navigation を検証した
- [ ] LP から Products / Contact への導線を検証した
- [ ] Products の 18 カテゴリと代表メーカーを検証した
- [ ] Contact の連絡先表示と `contact-form-slot` を検証した
- [ ] mobile nav toggle を検証した
- [ ] form 分岐 E2E / visual screenshot / VRT を追加していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
