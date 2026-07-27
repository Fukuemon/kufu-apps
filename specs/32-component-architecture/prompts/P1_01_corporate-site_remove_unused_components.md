---
phase: 1
seq: 1
target: corporate-site
issue: 32
depends_on: []
---

# 未使用 component の削除 (D12)

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
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

## 作業ステップ (この順序で実行する)

### ステップ 0: ブランチ準備と着手記録

ブランチ命名と base branch は `AGENTS.md` の `Spec Workflow Contract` および `workflow-git` に従う。本 issue は既に `feature/32` で作業中のため、ブランチ作成は不要。

1. issue #32 の `status:*` が `status:implementing` でなければ付け替え、状態遷移コメントを残す (`workflow-git` の `references/issue-status.md`)
2. 現在のブランチが `feature/32` であることを確認する

### ステップ 1: 削除対象 4 ファイルを削除する

1. 次の 4 ファイルを削除する:
   - `apps/corporate-site/src/components/features/services/ServicePillar.astro`
   - `apps/corporate-site/src/components/features/services/ServicePillar.stories.ts`
   - `apps/corporate-site/src/components/features/contact/ContactInfoRow.astro`
   - `apps/corporate-site/src/components/features/contact/ContactInfoRow.stories.ts`
2. `services/` ディレクトリは中身が空になるため削除する (`contact/` には `ContactSection.astro` / `ContactSection.stories.ts` が残るのでディレクトリは残す)
3. `## 検証コマンド` を実行する
4. diff レビューを回し、指摘を対応してから次へ

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. 削除したファイルへの参照が残っていないことを、typecheck / build の成功で確認する
3. 変更をコミットする (commit message に `Refs #32` を含める)

## 実装コンテキスト

- spec: `specs/32-component-architecture/index.md` (D12 / 実装分割 P1)
- 参照する path:
  - `apps/corporate-site/src/components/features/services/`
  - `apps/corporate-site/src/components/features/contact/`
- 規約の正本: `context/component-design.md`、判断根拠: `adr/0014-corporate-site-sections-architecture.md` (決定 6)

## 前提条件

- 完了しているべき phase / 依存 prompt: なし (本 prompt が最初)
- 完了後に着手可能になる後続 prompt: `P2_01_corporate-site_sections_migration.md`
- 必要な repo 状態: `feature/32` ブランチで作業していること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 変更する repo 領域

`apps/corporate-site/src/components/features/` のみ

### 実装する範囲

- `ServicePillar.astro` + story、`ContactInfoRow.astro` + story の削除
- 空になった `services/` ディレクトリの削除

### 実装しない範囲

- **content 層のファイル削除**。`content/services.ts` は `Hero.astro` が、`content/contact.ts` は `SiteFooter.astro` が使用中。`content/source-references.ts` も content 層の 5 ファイルと `content-data.test.ts` が使用中のため削除しない
- ディレクトリ移動 (P2 の責務)
- 他の component の変更

## 設計仕様

spec の D12 より抜粋:

> **D12 (2026-07-26, ユーザー): 未使用の component を削除する**。
>
> - 削除対象: `ServicePillar.astro` + story、`ContactInfoRow.astro` + story (いずれも story からのみ参照され、実ページから未使用)
> - 削除しないもの: `content/services.ts` (`Hero.astro` が使用)、`content/contact.ts` (`SiteFooter.astro` が使用)。ファイル名が似ているため取り違えに注意
> - **`content/source-references.ts` は削除対象外**。`content/` 配下の 5 ファイル (`business.ts` / `company.ts` / `contact.ts` / `hero.ts` / `services.ts`) と `content-data.test.ts` が `companyProfileSource` 等を import している

ADR-0014 決定 6 より:

> 使われない component を新構成へ移送すると「カタログにあるが実ページにない」ものが恒久化し、section の公開面規約 (どの Section が起点か) も曖昧になるため、story ごと削除する。再実装が必要になった時点で feature doc の section 構成表へ追加する。

## テスト観点

- 削除した component / content への参照が残っていないか (build / typecheck で検出)
- 既存の unit test (`content-data.test.ts`) が引き続きパスすること

## 検証コマンド

- `pnpm --filter @kufu/corporate-site typecheck`
- `pnpm --filter @kufu/corporate-site build`
- `pnpm --filter @kufu/corporate-site test`
- `pnpm --filter @kufu/corporate-site storybook:build`
- `pnpm format:check`
- `pnpm knip && pnpm depcruise`

## 完了条件

- [ ] ステップ 0 で issue の status ラベルを `status:implementing` に更新した
- [ ] 全ステップを順序通りに実行した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] content 層のファイルを 1 つも削除していない
- [ ] 変更を `Refs #32` 付きでコミットした
- [ ] 未解決の仕様質問が残っていない
