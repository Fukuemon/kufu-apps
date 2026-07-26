---
phase: 1
seq: 1
target: core
issue: 31
depends_on: []
---

# specs 残存検査スクリプトの追加 (closed issue × specs/ 照合)

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

ブランチ命名と base branch は `AGENTS.md` の `Spec Workflow Contract` および `workflow-git` に従う。

1. issue #31 の `status:*` が `status:implementing` でなければ付け替え、状態遷移コメントを残す (`workflow-git` の `references/issue-status.md`)
2. 最新の base branch を取得
3. 作業ブランチ `feature/31` を使う (既存の場合はそのまま)
4. PR テンプレートを確認し、完了条件を description に転記する
5. Draft PR を作成して push する

### ステップ 1: 検査スクリプトの作成

1. `scripts/check-specs-residue.sh` を新規作成する。仕様は `## 設計仕様` のとおり
2. 実行権限を付与する (`chmod +x`)
3. 手動実行し、**現時点では残存 9 件を検出して exit 1 になる**ことを確認する (この時点では失敗が正しい。清算は P1_02 で行う)
4. 出力に残存ディレクトリ名と対応する issue 番号・state が読み取れることを確認する
5. diff レビュー (`multi-agent-review` または `spec-review`) を回し、指摘を対応する

### ステップ 2: コマンド登録とドキュメント反映

1. `package.json` の scripts に `check:specs` を追加し、`scripts/check-specs-residue.sh` を呼ぶ
2. `context/project.yml` の `commands` に `check-specs: pnpm check:specs` を追加する
3. `context/engineering.md` の quality gate に関する節へ、本検査の位置づけ (closeout 時に手動実行、CI 常設化は issue #12 へ委譲、lefthook には組み込まない) を追記する。追記時は同 doc のメタ情報 (最終更新日等、存在するもの) も更新する
4. `pnpm check:specs` で起動できることを確認する (この時点では exit 1 のままでよい)
5. diff レビューを回し、指摘を対応する

### ステップ最終: 最終確認

1. `## 検証コマンド` がすべてパスすることを確認 (`check:specs` のみ、清算前のため exit 1 が期待値)
2. spec の `## 上位資料からの変更点` に必要な追記がないかを確認する
3. PR を Ready にはせず、P1_02 完了まで Draft のままにする

## 実装コンテキスト

- spec: `specs/31-docs-restructure/index.md`
- 参照する spec 節:
  - `## フロー / シーケンス` → 「Sequence: 検査スクリプト (closed issue × specs/ 照合)」
  - `## 解決済みの論点` → D1 / D3 / D4
- 関連 ADR: `adr/0011-specs-closeout-enforcement.md` (本作業の判断正本)
- repo root: `$(ghq root)/github.com/Fukuemon/kufu-apps`
- 参照する path:
  - `scripts/` (スクリプト設置先)
  - `package.json` (scripts 登録)
  - `context/project.yml` (commands 契約)
  - `context/engineering.md` (quality gate 記載)
  - `specs/` (検査対象ディレクトリ)

## 前提条件

- 完了しているべき依存 prompt: なし
- 完了後に着手可能になる後続 prompt: `P1_02_core_specs_cleanup.md`
- 必要な repo 状態: `gh` CLI が認証済みであること (tracker は GitHub / `Fukuemon/kufu-apps`)

## 不明点ハンドリング

- 矛盾 / 欠落 / 未定義を見つけたら作業を止める
- 推測で実装を進めない
- 質問するときは: 止まっている作業単位 / 判断が必要な論点 / 選択肢 を整理する

## タスク境界

### 実装する範囲

- `scripts/check-specs-residue.sh` の新規作成
- `package.json` scripts と `context/project.yml` commands への登録
- `context/engineering.md` への検査の位置づけの追記

### 実装しない範囲

- 残存 spec ディレクトリの削除 (P1_02 の範囲)
- CI (GitHub Actions) ワークフローの作成 (issue #12 へ委譲)
- lefthook への組み込み (ADR-0011 で明示的に不採用)
- 文書の再編成 (P2_01 / P2_02 の範囲)

## 設計仕様

spec `## フロー / シーケンス` の「Sequence: 検査スクリプト」および ADR-0011 より抜粋:

検査スクリプトの仕様:

1. `specs/` 配下のディレクトリ名から issue 番号を抽出する (命名は `<issue-id>-<slug>`)
2. 各 issue 番号について `gh issue view <n> --repo Fukuemon/kufu-apps --json state` で state を照会する
3. state が `CLOSED` のディレクトリを違反として一覧出力し、exit 1 で終了する
4. 違反が無ければ OK を出力し exit 0 で終了する
5. `specs/README.md` などディレクトリ以外のエントリは対象外とする

運用上の位置づけ (ADR-0011):

- 実行は手動 (コマンド登録)。CI への常設化は CI パイプライン方針 (issue #12) に委譲する
- lefthook (pre-commit / pre-push) には組み込まない (gh 呼び出しによるオフライン時・commit 速度への影響を避ける)

## テスト観点

spec `## テスト / 評価方針` および受け入れ基準より:

- WHEN 本 issue が完了したとき、`specs/` に close 済み issue の spec ディレクトリが残存しておらず、**残存を検出する検査コマンドが実行可能である**
- 検査スクリプトが CLOSED issue の spec 残存を検出し、非ゼロ終了すること (現時点で 9 件検出されるのが期待値)
- 検査スクリプトが OPEN issue の spec (`specs/31-docs-restructure/` 等) を違反として報告しないこと

## 検証コマンド

- `pnpm check:specs` (本 prompt で追加。清算前は exit 1 が期待値)
- `pnpm format:check`
- `pnpm knip && pnpm depcruise` (健全性検査)

## 完了条件

- [ ] ステップ 0 でブランチと Draft PR を作成した
- [ ] `scripts/check-specs-residue.sh` を作成し、CLOSED issue の spec 残存を検出できることを確認した
- [ ] OPEN issue の spec を違反として報告しないことを確認した
- [ ] `package.json` と `context/project.yml` にコマンドを登録した
- [ ] `context/engineering.md` に検査の位置づけを追記し、メタ情報を更新した
- [ ] 各ステップで diff レビューを実施し、指摘を対応した
- [ ] `## 検証コマンド` の format / 健全性検査がパスする
- [ ] 未解決の仕様質問が残っていない
