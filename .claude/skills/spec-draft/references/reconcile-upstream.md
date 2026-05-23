# Reconcile Upstream Docs

`spec-draft` (および `spec-resolve` / `spec-prompts`) が PRD / Design Doc / ADR と spec の整合を検証するための手順。

## 入力

- PRD path (`Spec Workflow Contract` 参照)
- Design Doc path (同上)
- ADR dir (同上)
- 対象 issue 要約 / draft 内容

## 検証手順

1. PRD の以下を確認:
   - スコープ (Phase 内 / Phase 外)
   - Non Goals
   - 関連する Persona / Outcome / Guardrail
2. Design Doc の以下を確認:
   - モジュール責務 (`apps/*`, `packages/*`, `e2e`)
   - Phase 設計方針
   - Toolchain / Infrastructure / Environment Strategy
   - Caveats / Security / Privacy
3. ADR を以下で検索:
   - 関連する技術選定 (例: framework / routing / data fetching)
   - 既に却下された代替案
4. 各項目を以下のいずれかに分類:
   - **継承**: 上位文書と完全に整合
   - **補足**: 上位文書の枠内で詳細化 (spec 側で OK)
   - **変更提案**: 上位文書の更新が必要 (spec だけでは閉じない)

## 出力

spec の `## 上位文書整合` テーブルに以下を記入する:

| 上位文書   | 節 / 該当箇所       | 整合方針 (継承 / 補足 / 変更提案) |
| ---------- | ------------------- | --------------------------------- |
| PRD        | スコープ → Phase 1  | 継承                              |
| Design Doc | モジュール責務 → ui | 補足                              |
| ADR-0003   | UI 共通化判断条件   | 変更提案                          |

## 「変更提案」を 1 件でも検出したときの扱い

- spec の `論点一覧` に `<上位文書> への変更提案` を追加する
- 下流 phase (clarify / diagram / tasks) に進む前に `spec-sync` を提案して停止する
- spec 単独で勝手に上位文書を書き換えてはならない
