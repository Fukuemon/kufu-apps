# Corporate Site Content Data

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- 問い合わせフォーム island / `POST /api/contact` / Turnstile / Resend は実装しない
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

### ステップ 1: content schema と singleton data を追加

1. `apps/corporate-site/src/content/` を作成する
2. hero / business / services / contact / company の singleton data を追加する
3. 各 data に `sourceReferences` として `design/features/corporate-site/reference/company-profile.md` を明記する
4. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck` を実行する
5. diff レビューを行い、参照元 path と表示用 data の責務が混ざっていないことを確認する

### ステップ 2: ProductCategory / CategoryMakers を Astro Content Collection 化

1. ProductCategory と CategoryMakers の schema を定義する
2. 18 カテゴリを単一データソースとして登録する
3. カテゴリ別メーカー一覧を登録する
4. 各 entry に `sourceReferences` として `company-profile.md` / `manufacturers.md` を明記する
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm test` と `pnpm typecheck` を実行する
6. diff レビューで LP と Products が二重管理にならない export 形状か確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build` を実行する
2. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
3. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Content / Data 設計`, `実装分割`, `Screen Spec`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/src/content/`
  - `apps/corporate-site/src/pages/index.astro`
  - `design/features/corporate-site/reference/company-profile.md`
  - `design/features/corporate-site/reference/manufacturers.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし
- 完了後に着手可能になる後続 prompt: `P2_01_corporate-site_layout-routes.md`, `P3_01_corporate-site_home-sections.md`, `P4_01_corporate-site_products-page.md`, `P5_01_corporate-site_contact-page.md`
- 必要な repo 状態: issue #10 の spec が PASS 済みで、未確定事項がない

## 不明点ハンドリング

- reference markdown と spec の内容が矛盾したら作業を止める
- 18 カテゴリの名称・順序・メーカー対応が判断できない場合は推測で補完しない
- 質問するときは、止まっている data、判断が必要な論点、候補を整理する

## タスク境界

### 実装する範囲

- 表示用 content data
- ProductCategory / CategoryMakers の Astro Content Collection
- content data の schema validation
- reference path の明記

### 実装しない範囲

- UI section / route 実装
- E2E 実装
- 問い合わせフォーム本体 / API
- CMS / loader / build-time markdown parser

## 設計仕様

- ProductCategory / CategoryMakers は Astro Content Collection とする。
- reference markdown は正本として残し、実装では `apps/corporate-site/src/content/` の entry / plain TS data へ手動で写す。
- hero / business / service pillars / contact info / company profile は singleton / bespoke data とする。
- 18 カテゴリ + メーカー一覧は単一データソースから表示し、LP と Products で二重管理しない。
- 実装データに参照元 reference path を明記し、PR review で content 正本と表示先の対応を確認できるようにする。

## テスト観点

- Astro Content Collection / content data の schema validation。
- 18 カテゴリが単一データソースとして登録されている。
- 代表的なメーカーがカテゴリに紐づく。
- content data に参照元 reference path が明記されている。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm test`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] singleton content data を追加した
- [ ] ProductCategory / CategoryMakers を Astro Content Collection 化した
- [ ] 18 カテゴリ + メーカー一覧が単一データソースになっている
- [ ] 各 data に参照元 reference path を明記した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
