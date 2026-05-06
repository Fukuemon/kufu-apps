---
name: workflow-spec-draft
description: KufuApp の spec 下書き workflow。PRD と Design Doc を起点に spec の雛形を作る。
---

# Workflow Spec Draft

spec の新規下書きを作るための入口スキル。

## いつ使うか

- issue 単位の spec を新規作成する
- 要求はあるが、実装スコープや論点をまだ整理していない

## 先に読むもの

- `$(ghq root)/github.com/Fukuemon/kufu-apps/specs/TEMPLATE.md`

## 実行フロー

1. `PRD.md` と `design/DesignDoc.md` から対象機能の前提だけを抜き出す
2. issue 番号または draft slug から spec directory を決める
3. `specs/TEMPLATE.md` を元に `index.md` を作る
4. 初回 draft でも template の必須節を削らずに残す
5. 少なくとも次を埋める
   - `## メタ情報`
   - `## 設計フェーズ状況`
   - `## 上位ドキュメント確認`
   - `## 関連資料`
   - `## 背景`
   - `## スコープ`
   - `## 要件の解釈`
   - `## 論点一覧`
   - `## 未確定事項`
   - `## 実装対象`
6. `## 設計フェーズ状況` には 11 フェーズを template のまま保持する
7. `## 機能仕様` には KufuApp 固有論点の節を残す
   - `### Provider Adapter`
   - `### Search Scope Control`
   - `### Answer / Citation`
   - `### Freshness`
   - `### Access Control`
   - `### Observability / Metrics`
8. `## スコープ` の `### やること` / `### やらないこと` を必ず埋める
9. 次に進む前に、未確定事項と cross-repo 影響を明示する

## 停止条件

- 上位文書と矛盾する
- 対象 issue / spec directory が決まらない
- 実装対象 repo が特定できない
- provider / permission / freshness など重要論点が起こせない
- template の必須節や phase 表を保てない
