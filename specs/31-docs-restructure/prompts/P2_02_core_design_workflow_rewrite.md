---
phase: 2
seq: 2
target: core
issue: 31
depends_on: [P1_02_core_specs_cleanup.md]
---

# design-workflow / feature doc の Pencil 記述改訂と index.pen・design assets の削除

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **IF 基準 (spec 受け入れ基準)**: 削除する記述に、他へ転記されていない durable な設計情報が含まれている場合、転記先を確定・反映するまで削除しない
- **`.pen` ファイルは暗号化されており Read / Grep してはならない** (Pencil MCP 専用フォーマット)。中身を読まずに削除する
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

1. issue #31 の `status:*` が `status:implementing` であることを確認する
2. `feature/31` ブランチ上で作業する
3. 既存 Draft PR に本作業を含める

### ステップ 1: `context/design-workflow.md` の改訂

1. 対象ファイルを Read する
2. `## 設計仕様` の新フロー定義に沿って、以下を書き換える:
   - 冒頭の「⚠️ 改訂予定」注記を削除し、改訂後の内容に置き換える
   - §1 大原則: 「デザイン正本は `.pen`」を「デザイン正本は実装 (コード + Storybook)」に改める。トークン正本 (`packages/ui`) は維持する
   - §2 全体フロー: mermaid 図と phase 表から Pencil (phase B) / import 工程を除去し、A0 → A → C の 3 段にする
   - §3 フェーズ詳細: 「Phase B — UI 収束」と「なぜコードを Pencil へ戻さないか」を削除し、Phase C の参照元を「採用案の HTML + 実装 + Storybook」に改める
   - §4 ディレクトリ / ファイル規約: `.pen` / `<feature>.lib.pen` / `images/` の行を削除し、画像アセットの置き場は `apps/<app>/src/assets/` に一本化する旨を記載する
   - その他の節に残る Pencil / `.pen` 前提の記述を除去する
3. **転記先の無い durable 情報を見つけたら停止**し、転記先をユーザーに確認する (IF 基準)
4. 最終更新日を更新する
5. `styleguide-documents` skill の品質基準に照らして確認する
6. diff レビュー (`multi-agent-review` または `spec-review`) を回し、指摘を対応する

### ステップ 2: feature doc の `.pen` 参照改訂

1. `design/features/corporate-site/DesignDoc_corporate-site.md` を Read する
2. 以下の行に含まれる `.pen` 前提の記述を改訂する (行番号は目安。内容で特定する):
   - 5 行目: 冒頭の「⚠️ デザイン正本の変更」注記 → 改訂完了後の記述に置き換える (正本 = 実装 + Storybook、根拠 ADR-0012)
   - 61 行目付近: サイトマップ見出しの「デザイン正本: [index.pen](index.pen)」→ 実装 + Storybook を正本とする記述へ
   - 72 行目付近: 「`.pen` 正本は 3 画面の desktop に加えて…」→ 状態系 / モバイル variant の扱いを実装側の規約として記述し直す
   - 91 行目付近 / 219〜222 行目付近: `.pen` を参照する記述を実装 + Storybook 参照に改める
3. 転記先の無い durable 情報 (デザイン意図・状態系の扱い等) があれば、本 doc 内に文章として残す
4. 最終更新日・変更履歴を更新する
5. diff レビューを回し、指摘を対応する

### ステップ 3: `context/component-design.md` の `.pen` 記述改訂

1. 対象ファイルを Read する (該当行の目安: 275, 277, 278, 281, 288)
2. `.pen` / Pencil を前提とした記述を、実装 + Storybook を正本とする記述に改める
3. 最終更新日を更新する
4. diff レビューを回し、指摘を対応する

### ステップ 4: `index.pen` と design assets の削除

1. `design/features/corporate-site/index.pen` を削除する (中身は読まない)
2. `design/features/corporate-site/assets/` (画像 4 点) を削除する。**削除前に、`apps/corporate-site/src/assets/` に同名ファイルが存在することを `ls` で確認する** (D7 の前提)
3. `design/features/corporate-site/ia-exploration-single-lp.prompt.md` は A0 依頼文であり **削除しない** (新フローでも `.prompt.md` は commit 対象)
4. `pnpm build` を実行し、画像 import が壊れていないことを確認する
5. diff レビューを回し、指摘を対応する

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. repo 全体に `.pen` を正本として扱う記述が残っていないことを、本 prompt の対象ファイル範囲で確認する
3. spec の `## 上位資料からの変更点` の context / feature doc テーブルに反映結果を追記する

## 実装コンテキスト

- spec: `specs/31-docs-restructure/index.md`
- 参照する spec 節:
  - `## 解決済みの論点` → D5 (デザインフロー) / D7 (画像アセット)
  - `## 上位資料からの変更点` → context / feature doc テーブル
- 関連 ADR: `adr/0012-design-source-of-truth-implementation.md` (本作業の判断正本。ADR-0004 は置換済み) / `adr/0007-design-token-architecture.md` (トークン正本は不変)
- 参照する品質基準: `styleguide-documents` skill
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `context/design-workflow.md`
  - `context/component-design.md`
  - `design/features/corporate-site/DesignDoc_corporate-site.md`
  - `design/features/corporate-site/index.pen` (削除対象。読まない)
  - `design/features/corporate-site/assets/` (削除対象)
  - `apps/corporate-site/src/assets/` (存続確認のみ)

## 前提条件

- 完了しているべき依存 prompt: `P1_02_core_specs_cleanup.md` (spec への参照リンク是正が済んでいること)
- 完了後に着手可能になる後続 prompt: なし
- 必要な repo 状態: ADR-0012 が存在し ADR-0004 が置換済みであること (sync phase で完了済み)
- 並列実行: `P2_01_core_designdoc_rewrite.md` と並列可 (編集対象ファイルが重複しない)

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 削除しようとしている記述に転記先未定の durable 情報が含まれる場合は停止して確認する
- 推測で削除を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `context/design-workflow.md` の Pencil / `.pen` 前提の全面改訂
- `design/features/corporate-site/DesignDoc_corporate-site.md` の `.pen` 参照改訂
- `context/component-design.md` の `.pen` 記述改訂
- `design/features/corporate-site/index.pen` と `assets/` の削除

### 実装しない範囲

- `design/DesignDoc.md` の改訂 (P2_01 の範囲)
- specs の清算 (P1_02 の範囲)
- `packages/ui` のトークン体系の変更 (ADR-0007 のまま不変)
- `apps/corporate-site/src/assets/` の変更 (存続確認のみ)
- `ia-exploration-single-lp.prompt.md` の削除 (新フローでも commit 対象)
- 共有プロセス層 (`.rulesync/` 配下の `design-prompt` skill 等) の改修 (sdd-template 側の課題)

## 設計仕様

### 改訂後のデザイン制作フロー (ADR-0012)

| Phase       | ツール             | 目的                                   | 成果の扱い                          |
| ----------- | ------------------ | -------------------------------------- | ----------------------------------- |
| A0 依頼設計 | 手動 / Claude Code | Claude Design 依頼文を組む             | `.prompt.md` を commit (再現性)     |
| A 方向性    | Claude Design      | 方向性プロトを 2〜3 案出して比較・決定 | 使い捨て HTML。commit しない        |
| C 実装      | Claude Code 等     | 採用案を参照して直接実装               | `.astro` / React + Storybook (正本) |

- **デザイン正本は実装 (コード + Storybook)**。`.pen` を含む中間デザイン正本を持たない
- 確認・レビューは Storybook と実画面で行う
- Pencil (旧 phase B) と import 工程は廃止する
- デザイントークンの正本は従来どおり `packages/ui` (ADR-0007。本改訂で変更しない)

### 画像アセットの置き場 (D7 / ADR-0012 追記分)

- 画像アセットの置き場を `apps/corporate-site/src/assets/` に一本化する
- `design/features/corporate-site/assets/` は `.pen` 付随アセット兼 design source として二重管理されていたが、両者はバイト完全一致であり design 側を削除する
- issue #10 で定めた「design source / 配信用コピー」の二重管理ルールは ADR-0012 に吸収し廃止する

## テスト観点

spec `## テスト / 評価方針` および受け入れ基準より:

- WHEN 本 issue が完了したとき、`context/design-workflow.md` と feature doc から `.pen` 正本前提の記述が排除されている
- WHEN 本 issue が完了したとき、`design/features/corporate-site/index.pen` と付随アセットが repo に存在しない
- IF 改訂対象文書の durable な設計情報が他に転記されていない場合、THEN 該当記述を削除しない
- 画像削除後も `pnpm build` が成功すること (app 側 import が壊れていない)
- 上位文書間 (DesignDoc / feature doc / context / ADR) に矛盾が残っていないこと

## 検証コマンド

- `pnpm build`
- `pnpm format:check`
- `pnpm knip && pnpm depcruise` (健全性検査)
- `pnpm check:specs` (P1 で追加。exit 0)

## 完了条件

- [ ] ステップ 0 でブランチ / Draft PR の状態を確認した
- [ ] `context/design-workflow.md` から Pencil / `.pen` 前提を排除し、新フロー (A0 → A → C) に改訂した
- [ ] feature doc の `.pen` 参照を実装 + Storybook 正本の記述に改訂した
- [ ] `context/component-design.md` の `.pen` 記述を改訂した
- [ ] 転記先の無い durable 情報が無いことを確認した (あれば転記先を確認して反映した)
- [ ] `apps/corporate-site/src/assets/` に同名画像が存在することを確認した上で design 側 `assets/` を削除した
- [ ] `index.pen` を削除した (中身は読んでいない)
- [ ] `ia-exploration-single-lp.prompt.md` を削除していない
- [ ] 各文書の最終更新日 / 変更履歴を更新した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする (特に `pnpm build`)
- [ ] spec の `## 上位資料からの変更点` に反映結果を追記した
- [ ] 未解決の仕様質問が残っていない
