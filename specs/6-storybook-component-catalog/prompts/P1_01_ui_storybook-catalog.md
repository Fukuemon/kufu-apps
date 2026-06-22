# packages/ui Storybook Catalog

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない。ただし Storybook / framework の設定確認に限り、`package.json` / lockfile / npm metadata / 公式 docs は確認してよい
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- `packages/ui` には corporate-site 固有 component / page-level sample を置かない
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

### ステップ 1: packages/ui Storybook 導線

1. `packages/ui/package.json` に `storybook` / `storybook:build` script を追加する
   - `storybook`: `storybook dev --host 127.0.0.1 --port 6006`
   - `storybook:build`: `storybook build`
2. `packages/ui/package.json` に `storybook@^10.4.6` / `@storybook/react-vite@^10.4.6` を devDependency として追加する
3. `packages/ui/.storybook/` に Storybook 10 の最小 config を追加し、framework は `@storybook/react-vite` にする
4. Storybook script は `storybook dev` / `storybook build` を使い、旧 `start-storybook` / `build-storybook` は使わない
5. Storybook addon は初期導入を最小にする
6. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/ui typecheck`
7. diff レビューを実施し、`packages/ui` 以外へ不要な変更がないことを確認する

### ステップ 2: shared component と story

1. `packages/ui/src/components/` に初期 shared catalog 対象を追加する
2. 各 component に default story を 1 件以上追加する
3. variant / error / disabled を持つ component は該当 story を追加する
4. `packages/ui/src/components/index.ts` と `packages/ui/src/index.ts` の公開入口を必要最小限で更新する
5. 検証: `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/ui storybook:build`
6. diff レビューを実施し、corporate-site 固有 wording や page 文脈が混入していないことを確認する

### ステップ最終: 最終確認

1. `## 検証コマンド` をすべて実行する
2. spec の `## 上位資料からの変更点` に追記が必要なら `spec-track` に渡す
3. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/6-storybook-component-catalog/index.md`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `packages/ui/package.json`
  - `packages/ui/.storybook/`
  - `packages/ui/src/components/`
  - `packages/ui/src/components/index.ts`
  - `packages/ui/src/index.ts`
  - `packages/ui/src/styles/tokens.css`
  - `packages/ui/src/styles/globals.css`
  - `packages/ui/README.md`
- 正本:
  - `context/component-design.md`
  - `context/engineering.md`
  - `context/project.md`

## 前提条件

- 完了しているべき phase / 依存 prompt: なし
- 完了後に着手可能になる後続 prompt: `P2_01_core_storybook-contract-docs.md`, `P3_01_core_verification-sync.md`
- 必要な repo 状態: `packages/ui` は `Button` と shared UI skeleton を持つ

## 不明点ハンドリング

- Storybook 10 と現在の React / Vite 設定で build が成立しない場合は、失敗ログと必要設定を整理して停止する
- spec にない component 追加が必要に見える場合は、追加せず確認する
- 質問するときは、止まっている作業単位、判断が必要な論点、選択肢を整理する

## タスク境界

### 実装する範囲

- `packages/ui` の Storybook 起動 / build script
- `packages/ui` の Storybook config
- 初期 shared catalog component と story
- shared component の公開入口

### 実装しない範囲

- `apps/corporate-site` の app-local Storybook
- root script
- corporate-site 固有 component
- `.pen` 編集
- visual regression service
- Storybook の production artifact 配信

## 設計仕様

- `packages/ui` Storybook は shared component catalog とする
- `packages/ui` Storybook は Storybook 10 + `@storybook/react-vite` で構成する
- `packages/ui/.storybook/main.ts` の型 import は `@storybook/react-vite` から行う
- 初期 shared catalog 対象は `Button`, `LinkButton`, `Tag`, `Card`, `Separator`, `FormField`, `Input`, `Select`, `Textarea`, `DefinitionRow`
- story 階層は `Primitives/Button`, `Primitives/Tag`, `Primitives/Separator`, `Primitives/Card`, `Patterns/FormField`, `Patterns/DefinitionRow`
- shared component は default story を必須にする
- variant / state がある component は同一 catalog に story を追加する
- app 固有 component や page-level sample は `packages/ui` Storybook に載せない
- `GenericComponents` 相当は shadcn primitive / token / shared component 表示契約の検証であり、business wording や page 文脈を持たせない

## テスト観点

- `pnpm --filter @kufu/ui storybook` で Storybook が起動できる
- `pnpm --filter @kufu/ui storybook:build` で静的 build が成功する
- shared component に default / 主要 variant / 必要 state の story がある
- `GenericComponents` 相当の初期 shared component が Storybook catalog に掲載されている
- `packages/ui` に載せた component が `@kufu/ui` の token / style contract に従っている
- corporate-site 専用 component が `packages/ui` に混入していない

## 検証コマンド

- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/ui lint`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/ui typecheck`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/ui build`
- `PATH="$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH" pnpm --filter @kufu/ui storybook:build`

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] `packages/ui` に Storybook 起動 / build 導線を追加した
- [ ] 初期 shared catalog 対象 11 件に default story がある
- [ ] variant / error / disabled が必要な component に該当 story がある
- [ ] corporate-site 固有 component / page-level sample を `packages/ui` に追加していない
- [ ] `## 検証コマンド` がすべてパスする
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 未解決の仕様質問が残っていない
