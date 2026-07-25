# Corporate Site Contact Page

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- #10 ではフォーム island / `POST /api/contact` / Turnstile / Resend / Workers unit を実装しない
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

### ステップ 1: ContactSection を追加

1. `ContactSection.astro` を app-local component として追加する
2. TEL / FAX / Email の連絡先導線を表示する
3. `contact-section-info` を付与する
4. `contact-form-slot` を section / placeholder として配置し、#26 のフォーム実装境界を示す
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
6. diff レビューでフォーム本体や API が追加されていないことを確認する

### ステップ 2: `/contact` page を完成させる

1. `/contact` route に ContactSection を組み込む
2. footer は compact variant を使う
3. フォーム未実装でも TEL / FAX / Email で接点確保できる表示にする
4. privacy 注記やフォーム validation は #26 に残す
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
6. diff レビューで #14 の form contract と矛盾する文言や input がないことを確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
2. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
3. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
4. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
5. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Interface 設計`, `Security / Privacy`, `Screen Spec`, `data-testid 一覧`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/src/pages/contact.astro`
  - `apps/corporate-site/src/components/features/contact/`
  - `apps/corporate-site/src/content/contact.ts`
  - `specs/14-contact-form/index.md`
  - `design/features/corporate-site/DesignDoc_corporate-site.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_corporate-site_content-data.md`, `P2_01_corporate-site_layout-routes.md`
- 完了後に着手可能になる後続 prompt: `P6_01_corporate-site_assets-images.md`, `P7_01_e2e_corporate-site-main-flow.md`
- 必要な repo 状態: contact info data が import 可能である

## 不明点ハンドリング

- TEL / FAX / Email の値が reference と矛盾する場合は停止する
- #26 が差し込む境界の id / data-testid が衝突する場合は停止する
- 質問するときは、対象 UI、矛盾する contract、候補を整理する

## タスク境界

### 実装する範囲

- `/contact` page
- TEL / FAX / Email の連絡先表示
- `contact-form-slot` の配置境界
- Contact page の data-testid

### 実装しない範囲

- 問い合わせフォーム island
- `POST /api/contact`
- Turnstile / Resend / Workers unit
- form 分岐 E2E
- 問い合わせ内容の DB / storage 永続化

## 設計仕様

- WHEN 訪問者が問い合わせたい時、システムは全ページ共通 CTA と `/contact` で電話 / FAX / メールの接点を提示し、`contact-form-slot` として #26 のフォーム実装境界を表示する。
- IF #26 のフォーム本体が未実装の時、システムは TEL / FAX / Email の代替導線で接点確保を維持する。
- #10 では `/contact` route、静的な連絡先表示、フォームを差し込む section 境界までを扱う。
- #26 で React form island / `POST /api/contact` / Turnstile / Resend / Workers unit / form 分岐 E2E を実装する。

## テスト観点

- `/contact` が 200 で表示される。
- Contact の TEL / FAX / Email が表示される。
- Contact の連絡先表示とフォーム差し込み境界が表示される。
- form 分岐 E2E は #26 に委譲し、#10 では実装しない。
- 表示専用 component に不要な `client:*` を追加していない。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] ContactSection を追加した
- [ ] `/contact` に TEL / FAX / Email を表示した
- [ ] `contact-section-info` と `contact-form-slot` を付与した
- [ ] フォーム本体 / API / Workers 関連を実装していない
- [ ] React island / `client:*` を追加していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
