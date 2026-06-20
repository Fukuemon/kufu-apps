# Pencil Component Map 整理

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない。ただし Storybook / framework の設定確認に限り、`package.json` / lockfile / npm metadata / 公式 docs は確認してよい
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- `.pen` は Pencil tooling 経由で扱い、生 JSON を直接編集しない
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

### ステップ 1: component-map.md 更新

1. `design/features/corporate-site/component-map.md` に Page Sections / GenericComponents / CorporateSiteComponents の対応表を維持する
2. `.pen` 名、実装 Container、実装 Presentation、配置、Storybook 階層を spec と一致させる
3. `.pen` と実装 component が 1:1 にならない場合は、分割・統合理由を Notes に追記する
4. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`
5. diff レビューを実施し、すべての実装 component 名が PascalCase 相当であることを確認する

### ステップ 2: index.pen component 粒度整理

1. Pencil tooling で `design/features/corporate-site/index.pen` を開く
2. `Components` フレームを `GenericComponents` と `CorporateSiteComponents` に分ける
3. page section は page 内に保持する
4. `GenericComponents` には shared primitive / pattern 候補を置く
5. `CorporateSiteComponents` には corporate-site 内で再利用する固有 component を置く
6. 検証: Pencil screenshot / layout snapshot で component 分類を確認する
7. diff レビューを実施し、生 JSON 差分だけに依存していないことを確認する

### ステップ最終: 最終確認

1. `## 検証コマンド` をすべて実行する
2. spec の `## 上位資料からの変更点` に追記が必要なら `spec-track` に渡す
3. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/6-storybook-component-catalog/index.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `design/features/corporate-site/index.pen`
  - `design/features/corporate-site/component-map.md`
  - `context/component-design.md`
  - `context/design-workflow.md`
- 正本:
  - `design/features/corporate-site/index.pen`
  - `context/component-design.md`
  - `context/design-workflow.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし
- 完了後に着手可能になる後続 prompt: `P3_01_core_verification-sync.md`
- 必要な repo 状態: Pencil tooling が `.pen` を扱える状態

## 不明点ハンドリング

- Pencil tooling で `index.pen` を編集できない場合は、生 JSON を直接編集せず、`component-map.md` の更新と未実施理由を PR に残して停止する
- `.pen` 名と実装 component 名が対応できない場合は、分割・統合理由を整理して確認する
- 質問するときは、止まっている作業単位、判断が必要な論点、選択肢を整理する

## タスク境界

### 実装する範囲

- `design/features/corporate-site/component-map.md` の対応表
- `design/features/corporate-site/index.pen` の component 分類
- `.pen` page section / subcomponent 名と実装 component 名の写像

### 実装しない範囲

- corporate-site 本体の UI 実装
- `packages/ui` component / story 実装
- Storybook config / scripts
- feature doc への durable 方針追加
- `.pen` 生 JSON の直接編集

## 設計仕様

- `.pen` は design 正本、code / Storybook は実装正本である
- Pencil の `Components` フレームは `GenericComponents` と `CorporateSiteComponents` に分ける
- page 固有 section (`Hero`, `BusinessSection`, `ProductsCategorySection`, `ContactSection`) は page 内に保持する
- `GenericComponents` は `Button`, `LinkButton`, `Tag`, `SectionHeading`, `Card`, `Separator`, `FormField`, `Input`, `Select`, `Textarea`, `DefinitionRow`
- `CorporateSiteComponents` は `ServicePillar`, `BusinessFeatureRowMediaRight`, `BusinessFeatureRowMediaLeft`, `ContactInfoRow`
- 対応表の置き場所は `design/features/corporate-site/component-map.md`
- 実装 component 名は PascalCase 相当にする

## テスト観点

- `design/features/corporate-site/index.pen` の section / subcomponent 名が PascalCase 相当で実装 component 名に写像できる
- `.pen` component 粒度整理はレンダリング / スクショ / Pencil 差分のレビューで確認し、生 JSON 差分だけに依存しない
- `component-map.md` に page section と subcomponent の両方が含まれる
- `GenericComponents` と `CorporateSiteComponents` の境界が `context/component-design.md` と一致する

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm format:check`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm lint`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] `component-map.md` に page section と subcomponent の対応表がある
- [ ] すべての実装 component 名が PascalCase 相当である
- [ ] `index.pen` の `Components` が `GenericComponents` / `CorporateSiteComponents` に分かれている
- [ ] page 固有 section を page 内に保持している
- [ ] `.pen` を生 JSON で直接編集していない
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 未解決の仕様質問が残っていない
