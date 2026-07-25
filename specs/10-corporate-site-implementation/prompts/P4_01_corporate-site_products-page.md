# Corporate Site Products Page

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- LP content data を複製せず、P1 の ProductCategory / CategoryMakers を参照する
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

### ステップ 1: ProductsDetailSection を追加

1. `ProductsDetailSection.astro` を app-local component として追加する
2. `products-section-index`, `products-category-list`, `products-category-{id}`, `products-maker-list-{id}` を付与する
3. INDEX と 18 カテゴリ詳細を HTML first で表示する
4. メーカー一覧をカテゴリ別に表示する
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
6. diff レビューで LP 用 data の複製がないことを確認する

### ステップ 2: `/products` page を完成させる

1. `/products` route に ProductsDetailSection を組み込む
2. `products-link-contact` を付与し、Contact への CTA を表示する
3. footer は compact variant を使う
4. URL state を持つ検索 / filter は導入しない
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
6. diff レビューで JavaScript なしで一覧を走査できる HTML 構造か確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
2. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
3. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
4. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
5. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Content / Data 設計`, `Performance / Security 設計`, `Screen Spec`, `data-testid 一覧`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/src/pages/products.astro`
  - `apps/corporate-site/src/components/features/products/`
  - `apps/corporate-site/src/content/`
  - `design/features/corporate-site/component-map.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_corporate-site_content-data.md`, `P2_01_corporate-site_layout-routes.md`
- 完了後に着手可能になる後続 prompt: `P6_01_corporate-site_assets-images.md`, `P7_01_e2e_corporate-site-main-flow.md`
- 必要な repo 状態: 18 カテゴリと category makers が content collection から取得できる

## 不明点ハンドリング

- カテゴリ id の命名や anchor と data-testid の対応が不明なら停止する
- メーカー一覧とカテゴリの対応が欠落している場合は空表示で進めず確認する
- 質問するときは、対象カテゴリ、欠落 data、候補を整理する

## タスク境界

### 実装する範囲

- `/products` page
- 18 カテゴリ詳細 / INDEX / メーカー一覧
- Products から Contact への CTA
- Products page の data-testid

### 実装しない範囲

- LP section
- Contact page
- E2E
- 検索 / filter / URL state
- 問い合わせフォーム本体 / API

## 設計仕様

- WHEN 訪問者が取扱製品の詳細を知りたい時、システムは `/products` で 18 カテゴリとメーカー一覧を表示する。
- `/products` はメーカー一覧が長いため、初期 JS なしで走査できる HTML 構造を優先する。
- ProductCategory / CategoryMakers は P1 の Astro Content Collection を参照する。
- URL state を持つ filter / 検索は初期実装では導入しない。
- 表示専用 UI に React island を追加しない。

## テスト観点

- `/products` が 200 で表示される。
- Products の 18 カテゴリが表示される。
- Products の代表的なメーカーが表示される。
- Products から Contact への導線が存在する。
- 表示専用 component に不要な `client:*` を追加していない。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] ProductsDetailSection を追加した
- [ ] `/products` に 18 カテゴリ詳細 / INDEX / メーカー一覧を表示した
- [ ] `products-*` data-testid を付与した
- [ ] Products から Contact への CTA を表示した
- [ ] LP 用 data の複製をしていない
- [ ] React island / `client:*` を追加していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
