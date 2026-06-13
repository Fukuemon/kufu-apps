# P1_02: corporate-site のトークン参照を新 3 entry へ移行する

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **完了条件のタスク化**: 作業開始前に「完了条件」セクションの各項目を todo として登録し、各ステップ完了時に状態を更新すること。タスク化せずに作業を開始することは禁止

## 作業ステップ (この順序で実行する)

### ステップ 0: ブランチ準備

ブランチ命名と base branch は `AGENTS.md` の `Spec Workflow Contract` および `workflow-git` に従う (`feature/13`)。

1. P1_01 と **同一 PR / 同一ブランチ (`feature/13`)** で実施する (P1_01 が旧トークンを削除するため、本タスクまで完了して初めて corporate-site のビルドが通る)
2. P1_01 の変更がブランチに入っていることを確認する

### ステップ 1: stylesheet import の移行

1. `apps/corporate-site/src/styles/globals.css` の先頭 import を以下へ変更する:
   - 変更前: `@import "@kufu/ui/styles.css";`
   - 変更後: `@import "@kufu/ui/tokens.css";` と `@import "@kufu/ui/fonts.css";` の 2 行
   - 理由: corporate-site は React app 向けの全量エントリ (`styles.css`) を必要とせず、トークン + フォントのみで成立する (Decision Priority: パフォーマンス。ADR-0007 / ADR-0008)
2. `## 検証コマンド` の `pnpm build` を実行する
3. diff レビュー (`spec-review` または repo 標準レビュー手段) を回し、指摘を対応する

### ステップ 2: dangling 参照の置換

1. `apps/corporate-site/src/styles/globals.css` 内の `font-family: var(--kufu-font-body);` を `font-family: var(--font-sans);` へ置換する (旧 `--kufu-font-body` は P1_01 で削除済み)
2. 他に `--kufu-color-*` / `--kufu-radius-*` / `--kufu-font-*` を参照する箇所が `apps/corporate-site/src` に無いことを `## 検証コマンド` の `pnpm build` (未定義変数でビルド/型が落ちる) で確認する
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応する

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認する (P1_01 + P1_02 の両方が入った状態で `pnpm build` が通ること)
2. spec の `## 上位資料からの変更点` に追記が必要なら `spec-track` に渡す
3. PR を Ready に変更しレビュアーを指名する

## 実装コンテキスト

- spec: `specs/13-design-system-foundation/index.md`
- 参照する section: `## Interface 設計` (stylesheet export 表 / corporate-site の import 移行)、`## 機能仕様 → Reuse Policy`
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `apps/corporate-site/src/styles/globals.css` (現行。移行対象)
- 決定根拠: `adr/0007-design-token-architecture.md` (3 entry 配信)、`adr/0008-astro-react-island-policy.md` (corporate-site の消費方針)

## 前提条件

- 完了しているべき phase / 依存 prompt: `P1_01_ui_token_restructure.md` (新 `tokens.css` / `fonts.css` export と旧トークン削除が前提。同一 PR で連続実施)
- 完了後に着手可能になる後続 prompt: なし (P1 の終端)
- 必要な repo 状態: P1_01 の変更が `feature/13` に入っていること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 特に: `apps/corporate-site/src` 内に本 prompt の想定 (`--kufu-font-body` 1 箇所) を超える旧 `--kufu-*` 参照が見つかった場合は、置換方針を停止して確認する (新 semantic 変数のどれに対応づけるかは spec の対応表に従うが、対応表に無い用途なら確認)
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `apps/corporate-site/src/styles/globals.css` の import を `tokens.css` + `fonts.css` へ移行
- `--kufu-font-body` → `--font-sans` の置換 (dangling 参照の解消)

### 実装しない範囲

- `packages/ui` のトークン定義 (→ P1_01)
- ページ / コンポーネントの実装、shadcn コンポーネントの consume (→ #10)
- `@astrojs/react` の導入 (→ #10。ADR-0008)
- Pencil variables の rename (→ P2、Pencil MCP 作業)

## 設計仕様

spec `specs/13-design-system-foundation/index.md` `## Interface 設計` から抜粋:

- corporate-site は自前の `src/styles/globals.css` から `@kufu/ui/tokens.css` + `@kufu/ui/fonts.css` を import する (現行の `styles.css` 全量 import から移行)
- 現行 corporate-site が参照する `--kufu-font-body` は削除対象のため、移行時に `--font-sans` へ置換する

3 entry の役割 (P1_01 で構築済み):

| export 経路           | corporate-site が使うか                           |
| --------------------- | ------------------------------------------------- |
| `@kufu/ui/tokens.css` | ◯ (CSS 変数)                                      |
| `@kufu/ui/fonts.css`  | ◯ (font-face)                                     |
| `@kufu/ui/styles.css` | - (React app 向け全量。corporate-site は使わない) |

現行ファイル (移行前) の関連箇所:

```css
@import "@kufu/ui/styles.css";

:root {
  color-scheme: light;
}

body {
  margin: 0;
  font-family: var(--kufu-font-body);
}
```

## テスト観点

spec `## テスト / 評価方針` から:

- `apps/corporate-site` が build できること (P1_01 + P1_02 の両方が入った状態)
- 実装コードに raw hex / arbitrary value が残っていないこと
- 計測指標: `.pen` ↔ `tokens.css` の値不一致件数 = 0 (本 PR で旧 fork 状態が解消される)

## 検証コマンド

- `pnpm build` (corporate-site を含む全 app)
- `pnpm --filter @kufu/corporate-site build`
- `pnpm lint`
- `pnpm format:check`
- `pnpm knip`
- `pnpm depcruise`

## 完了条件

- [ ] ステップ 0 で P1_01 と同一ブランチ / PR であることを確認した
- [ ] `globals.css` の import を `tokens.css` + `fonts.css` へ移行した
- [ ] `--kufu-font-body` → `--font-sans` の置換を行い、他の旧 `--kufu-*` 参照が無いことを確認した
- [ ] `## 検証コマンド` がすべてパスする (`pnpm build` が P1_01 + P1_02 の状態で通る)
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] PR を Ready に変更しレビュアーを指名した
- [ ] 未解決の仕様質問が残っていない
