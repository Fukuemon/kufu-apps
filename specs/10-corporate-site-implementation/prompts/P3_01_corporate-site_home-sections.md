# Corporate Site Home Sections

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- Products 詳細 page と Contact 詳細 page の責務に踏み込まない
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

### ステップ 1: LP section assembly を追加

1. `Hero.astro`, `BusinessSection.astro`, `ProductsCategorySection.astro`, `CompanySection.astro` を app-local component として追加する
2. `SectionHeading`, `BusinessFeatureRow`, `FeaturedCategoryCard`, `ContactInfoRow`, `ServicePillar` を必要に応じて静的描画で利用する
3. `home-section-hero`, `home-section-business`, `home-section-products`, `home-section-company` を付与する
4. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
5. diff レビューで business wording が app-local に閉じていることを確認する

### ステップ 2: `/` に LP 導線を実装

1. `/` に理念 / 事業内容 / 取扱製品索引 / 会社情報 / 問い合わせ導線を順に配置する
2. `home-link-products` と `home-link-contact` を付与する
3. 18 カテゴリの索引は P1 の ProductCategory を参照し、LP 専用 data を作らない
4. footer は full variant を使う
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
6. diff レビューで `/products` / `/contact` の詳細責務を実装していないことを確認する

### ステップ最終: 最終確認

1. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
2. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
3. `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`
4. `specs/10-corporate-site-implementation/index.md` の `## 上位資料からの変更点` に追記が必要か確認する
5. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/10-corporate-site-implementation/index.md`
- 参照する appendix: `Screen Spec`, `data-testid 一覧`, `Content / Data 設計`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/src/pages/index.astro`
  - `apps/corporate-site/src/components/features/`
  - `apps/corporate-site/src/components/common/`
  - `apps/corporate-site/src/content/`
  - `design/features/corporate-site/component-map.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_corporate-site_content-data.md`, `P2_01_corporate-site_layout-routes.md`
- 完了後に着手可能になる後続 prompt: `P6_01_corporate-site_assets-images.md`, `P7_01_e2e_corporate-site-main-flow.md`
- 必要な repo 状態: `/` が BaseLayout 経由で描画され、content data が import 可能である

## 不明点ハンドリング

- `.pen` / component-map と spec の section 対応が矛盾する場合は停止する
- 会社情報や事業内容の公開文言が不足する場合は placeholder を増やさず確認する
- 質問するときは、対象 section、欠落している文言、候補を整理する

## タスク境界

### 実装する範囲

- LP の Hero / Business / Products index / Company section
- LP から Products / Contact への導線
- LP の data-testid

### 実装しない範囲

- Products 詳細 page
- Contact 詳細 page
- E2E
- 画像 asset の最終コピーと最適化
- 問い合わせフォーム本体 / API

## 設計仕様

- WHEN 訪問者が `/` に到達した時、システムは理念 / 事業内容 / 取扱製品索引 / 会社情報 / 問い合わせ導線を順に提示する。
- Products index は P1 の 18 カテゴリ単一データソースを参照する。
- section / page 文脈 / business wording を持つ component は `apps/corporate-site` に置く。
- `@kufu/ui` shared primitive は静的描画で consume し、新規 shared 昇格は原則行わない。
- 表示専用 UI に React island を追加しない。

## テスト観点

- `/` が 200 で表示される。
- 主要コピー、18 カテゴリ索引、会社連絡先が表示される。
- LP から Products / Contact への導線が存在する。
- 表示専用 component に不要な `client:*` を追加していない。

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] LP section assembly を追加した
- [ ] LP に理念 / 事業内容 / 取扱製品索引 / 会社情報 / 問い合わせ導線を表示した
- [ ] `home-*` data-testid を付与した
- [ ] Products index が P1 の単一データソースを参照している
- [ ] React island / `client:*` を追加していない
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
