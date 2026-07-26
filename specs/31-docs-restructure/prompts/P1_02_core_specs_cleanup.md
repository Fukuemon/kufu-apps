---
phase: 1
seq: 2
target: core
issue: 31
depends_on: [P1_01_core_specs_residue_check.md]
---

# 残存 spec 9 ディレクトリの清算 (sync 確認 → 手順文書化 → 削除 → 参照元是正)

## 絶対ルール

- spec に明記された範囲だけを対象にする
- 不明点は推測で埋めず、停止してユーザーに確認する
- 参照 path を外れて広く探索しない (Grep / Glob / 既存実装の探索は禁止)
- 別 app / package を追加探索せず、この prompt 内の情報だけで判断する
- 各作業ステップに含まれる検証 / レビュー手順をスキップしない
- **IF 基準 (spec 受け入れ基準)**: 清算手順が文書化される前に削除を実行してはならない
- **IF 基準 (spec 受け入れ基準)**: 削除対象 spec に、他へ転記されていない durable な設計情報が含まれている場合、転記先を確定・反映するまで削除しない
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

1. issue #31 の `status:*` が `status:implementing` であることを確認する (P1_01 で遷移済みなら何もしない)
2. `feature/31` ブランチ上で作業する
3. P1_01 の Draft PR に本作業も含める

### ステップ 1: 清算手順の文書化 (削除より先に必ず実施)

1. `specs/README.md` に「closeout 清算手順」の節を追加する。内容は `## 設計仕様` の手順 A〜D
2. 追記時は `specs/README.md` のメタ情報 (存在するもの) を更新する
3. diff レビューを回し、指摘を対応する

### ステップ 2: 9 ディレクトリの sync 済み判定

対象 9 ディレクトリ (すべて close 済み issue) について、durable な設計成果が design / context / ADR に反映済みかを 1 件ずつ判定する。判定結果は PR 本文または issue コメントに表として残す。

判定対象:

| spec dir                            | issue | 主な durable 成果の想定転記先 (要確認)                                |
| ----------------------------------- | ----- | --------------------------------------------------------------------- |
| `3-monorepo-foundation/`            | #3    | `design/DesignDoc.md` モジュール責務 / ADR-0002 / ADR-0003            |
| `6-storybook-component-catalog/`    | #6    | `context/component-design.md` / ADR-0010                              |
| `10-corporate-site-implementation/` | #10   | `design/features/corporate-site/DesignDoc_corporate-site.md`          |
| `11-corporate-site-ia/`             | #11   | feature doc ページ構成 (IA) / ADR-0006 (旧 5 ページ IA の決定経緯)    |
| `13-design-system-foundation/`      | #13   | ADR-0007 / `context/architecture.md` / feature doc デザイントークン節 |
| `14-contact-form/`                  | #14   | feature doc 問い合わせフォーム仕様 / ADR-0009                         |
| `16-design-workflow/`               | #16   | `context/design-workflow.md` / ADR-0012 (ADR-0004 を置換)             |
| `17-corporate-site-ia/`             | #17   | feature doc ページ構成 (IA) / ADR-0006                                |
| `21-sdd-template-adoption/`         | #21   | `CLAUDE.md` Spec Workflow Contract / `.template-version`              |

1. 各 dir の `index.md` (無ければ `requirements.md`) を Read し、`## 上位資料からの変更点` の反映状態と本文の durable 情報を確認する
2. 転記先に情報が存在すれば「sync 済み」と判定する
3. **未転記の durable 情報を見つけたら削除せず停止**し、転記先 (feature doc / context / ADR) をユーザーに確認してから反映する (IF 基準)
4. 判定表を PR 本文に記録する

### ステップ 3: 参照元リンクの是正

削除により壊れるリンクを、削除前に是正する。対象ファイルと行は以下 (探索不要):

| ファイル                                                     | 該当行                   |
| ------------------------------------------------------------ | ------------------------ |
| `adr/0002-monorepo-scaffold-create-command-policy.md`        | 79, 80                   |
| `adr/0003-phase1-corporate-site-only-and-cms-deferred.md`    | 93, 94                   |
| `adr/0006-corporate-site-three-route-ia.md`                  | 26, 88                   |
| `adr/0007-design-token-architecture.md`                      | 76                       |
| `adr/0009-corporate-site-contact-form-backend.md`            | 14, 20, 64, 73           |
| `adr/0010-shadcn-base-ui-primitive-policy.md`                | 71                       |
| `context/architecture.md`                                    | 31                       |
| `context/component-design.md`                                | 5, 285                   |
| `design/features/corporate-site/DesignDoc_corporate-site.md` | 16, 43, 59, 95, 219, 227 |

是正方針:

- spec への path リンクを **issue へのリンク** (`https://github.com/Fukuemon/kufu-apps/issues/<n>`) に置き換える
- 呼称は `Spec Workflow Contract` の用語規約に従い、「決定経緯」「issue 単位の作業記録」等にする (削除済み spec を「正本」と呼ばない)
- feature doc の `関連 spec` 行は「関連 issue」に改め、issue リンクの列挙にする
- 各ファイルのメタ情報 (最終更新日 / 変更履歴、存在するもの) を更新する
- diff レビューを回し、指摘を対応する

### ステップ 4: 削除の実行と検証

1. 9 ディレクトリを削除する (`specs/31-docs-restructure/` は本 issue 進行中のため残す)
2. `pnpm check:specs` を実行し、**exit 0 (残存なし)** になることを確認する
3. `context/impact-index.yaml` の `source_refs` に削除した spec を指すエントリが無いことを確認する
4. 削除後のリンク切れが無いことを、ステップ 3 の対象ファイルで確認する
5. diff レビューを回し、指摘を対応する

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認
2. spec の `## 上位資料からの変更点` に必要な追記を行う
3. 判定表 (ステップ 2) を issue #31 のコメントとして残す

## 実装コンテキスト

- spec: `specs/31-docs-restructure/index.md`
- 参照する spec 節:
  - `## フロー / シーケンス` → 「Flowchart: specs 清算 / closeout フロー」
  - `## 解決済みの論点` → D1 / D3
- 関連 ADR: `adr/0011-specs-closeout-enforcement.md` (本作業の判断正本)
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `specs/` (清算対象。README.md に手順を追記)
  - ステップ 3 の参照元ファイル一覧 (上表)
  - `context/impact-index.yaml`

## 前提条件

- 完了しているべき依存 prompt: `P1_01_core_specs_residue_check.md` (`pnpm check:specs` が使えること)
- 完了後に着手可能になる後続 prompt: `P2_01_core_designdoc_rewrite.md` / `P2_02_core_design_workflow_rewrite.md`
- 必要な repo 状態: `gh` CLI が認証済みであること

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 特に「未転記の durable 情報」を見つけた場合は削除に進まず、転記先をユーザーに確認する
- 推測で削除を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `specs/README.md` への清算手順の追記
- 9 ディレクトリの sync 済み判定と、未転記情報の転記
- 参照元リンクの是正 (上表のファイル)
- 9 ディレクトリの削除と検査コマンドによる検証

### 実装しない範囲

- `specs/31-docs-restructure/` の削除 (本 issue 進行中。close 時に closeout で削除)
- 検査スクリプト自体の作成 (P1_01 の範囲)
- DesignDoc / design-workflow / feature doc の**内容**の再編成 (P2_01 / P2_02 の範囲。本 prompt はリンク是正のみ)
- `index.pen` の削除 (P2_02 の範囲)

## 設計仕様

spec `## フロー / シーケンス` の清算フローより、`specs/README.md` に記載する清算手順 (手順 A〜D):

- **A. sync 済み確認**: 対象 spec の durable な設計成果 (IA / データモデル / フロー / アーキ判断) が design / context / ADR に反映済みかを確認する
- **B. 未 sync 分の sync**: 未反映があれば先に反映先を確定し、反映する (ADR 化基準は `Spec Workflow Contract` に従う)
- **C. 参照元の是正**: 削除する spec を指すリンクを issue リンク等に置き換える
- **D. 削除と検証**: spec ディレクトリを削除し、`pnpm check:specs` で残存ゼロを確認する

IF 基準 (spec 受け入れ基準): 上記手順が文書化される前に削除を行わない。durable な設計情報が転記されていない場合は該当記述を削除しない。

## テスト観点

spec `## テスト / 評価方針` および受け入れ基準より:

- WHEN 本 issue が完了したとき、`specs/` に close 済み issue の spec ディレクトリが残存していない
- IF 清算手順が文書化されていない場合、THEN 実削除を行わない
- IF 改訂対象文書の durable な設計情報が他に転記されていない場合、THEN 該当記述を削除しない
- 削除後に、参照元ファイルからのリンク切れが発生していないこと

## 検証コマンド

- `pnpm check:specs` (清算後は exit 0 が期待値)
- `pnpm format:check`
- `pnpm knip && pnpm depcruise` (健全性検査)

## 完了条件

- [ ] ステップ 0 でブランチ / Draft PR の状態を確認した
- [ ] `specs/README.md` に清算手順 (A〜D) を文書化した (削除より先に実施)
- [ ] 9 ディレクトリの sync 済み判定を行い、判定表を残した
- [ ] 未転記の durable 情報があれば転記先を確認し反映した
- [ ] 参照元ファイルのリンクを是正し、各ファイルのメタ情報を更新した
- [ ] 9 ディレクトリを削除した
- [ ] `pnpm check:specs` が exit 0 になることを確認した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` がすべてパスする
- [ ] spec の `## 上位資料からの変更点` に必要な追記を行った
- [ ] 未解決の仕様質問が残っていない
