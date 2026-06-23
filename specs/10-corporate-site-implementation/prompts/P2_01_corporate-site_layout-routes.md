# Corporate Site Layout And Routes

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- 表示専用 UI に `client:*` を付けない
- SiteHeader は Astro component + minimal script とし、React island 化しない
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

### ステップ 1: BaseLayout / SiteHeader / SiteFooter を追加

1. `apps/corporate-site/src/components/common/` に layout / header / footer を配置する
2. `SiteHeader` に `site-header`, `site-nav-toggle`, `site-nav-menu`, `site-nav-home`, `site-nav-products`, `site-nav-contact` を付与する
3. モバイル nav は `aria-expanded` / hidden 状態 / Escape key / nav 選択後 close を minimal script で扱う
4. `SiteFooter` に `site-footer` を付与し、LP 用 full と下層用 compact variant を用意する
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
6. diff レビューで React island と `client:*` が追加されていないことを確認する

### ステップ 2: `/products` / `/contact` route skeleton を追加

1. `apps/corporate-site/src/pages/products.astro` を追加する
2. `apps/corporate-site/src/pages/contact.astro` を追加する
3. 既存 `/` は BaseLayout 経由に寄せる
4. route skeleton は metadata と section placeholder に留め、P3〜P5 の section 実装に踏み込まない
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
6. diff レビューで route が `/`, `/products`, `/contact` の 3 つに収まっていることを確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
2. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
3. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
4. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
5. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Interface 設計`, `Screen Spec`, `data-testid 一覧`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/src/pages/index.astro`
  - `apps/corporate-site/src/pages/products.astro`
  - `apps/corporate-site/src/pages/contact.astro`
  - `apps/corporate-site/src/components/common/`
  - `apps/corporate-site/src/styles/globals.css`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_corporate-site_content-data.md`
- 完了後に着手可能になる後続 prompt: `P3_01_corporate-site_home-sections.md`, `P4_01_corporate-site_products-page.md`, `P5_01_corporate-site_contact-page.md`
- 必要な repo 状態: content data が import 可能である

## 不明点ハンドリング

- nav label / CTA 文言が spec と content data で矛盾する場合は停止する
- mobile nav の a11y 挙動を minimal script で満たせない場合は React 化せず、確認する
- 質問するときは、対象 component、満たせない挙動、選択肢を整理する

## タスク境界

### 実装する範囲

- BaseLayout
- SiteHeader / SiteFooter
- `/products` / `/contact` route skeleton
- common navigation と CTA link

### 実装しない範囲

- LP 各 section の完成実装
- Products 詳細一覧
- Contact 詳細 section
- E2E
- 問い合わせフォーム本体 / API

## 設計仕様

- route は `/`, `/products`, `/contact` の 3 つ。
- `/services` / `/company` は作らず、LP 内アンカー (`#business`, `#company` など) で導線を提供する。
- `SiteHeader` はブランド / nav / contact CTA を持ち、モバイル開閉は Astro + minimal script。
- `SiteFooter` は LP は full、下層は compact。
- 表示専用 UI に不要な `client:*` を追加しない。
- `@kufu/ui` の shared primitive は Astro から `client:*` なしで静的描画して consume する。

## テスト観点

- `/`, `/products`, `/contact` が build 対象として存在する。
- header nav / CTA / footer link が期待 route / anchor を指す。
- mobile viewport で `site-nav-toggle` が開閉し、nav link が使えることは P7 で E2E 化する。
- island guard: 表示専用 component に不要な `client:*` を追加していない。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] BaseLayout / SiteHeader / SiteFooter を追加した
- [ ] `site-*` data-testid を付与した
- [ ] mobile nav を Astro + minimal script で実装した
- [ ] `/products` / `/contact` route skeleton を追加した
- [ ] React island / `client:*` を追加していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
