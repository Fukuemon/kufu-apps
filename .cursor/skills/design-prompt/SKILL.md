---
name: design-prompt
description: Drafts a Claude Design request prompt (.prompt.md) under design/features/<feature>/ by linking the design system (packages/ui only) and filling the goal/layout/content/audience template. Use to start Phase A0 of the design workflow or when the user asks to create a Claude Design prompt.
---

# Design Prompt

デザイン制作ワークフロー Phase A0。対象画面の Claude Design 依頼文を組み、`design/features/<feature>/<screen>.prompt.md` に保存する。出力品質は依頼文に強く依存するため、テンプレに沿って具体的に書く。

## いつ使うか

- 新しい画面/セクションの Claude Design 依頼文 (`.prompt.md`) を作る
- デザイン制作ワークフローの Phase A0 を始める

## 先に読むもの

- `context/design-workflow.md` の §3 Phase A0 (本文・原則の正本) と §1 大原則
- `packages/ui/src/styles/globals.css` (踏襲するトークンの正本)
- `references/prompt-scaffold.md` (穴埋めスケルトンと書き方の注記)

## 実行フロー

1. **対象と前提の確認**
   - どの app / 画面 / セクションを、何のために作るか
   - IA / 構造の正本: issue #11 と `design/features/<feature>/`
2. **design system link の確認** (Claude Design 側)
   - codebase を Import し、`packages/ui` (+ 対象 app) **だけ** をリンクする
   - モノレポ全体や `.git` / `node_modules` はリンクしない (性能・安定性)
3. **依頼文の作成** (`references/prompt-scaffold.md`)
   - goal / layout / content / audience / 制約 / 出力 / 状態 を密な1段落にまとめる
   - 否定形でなく **具体指定** (色・角丸・字形を名指し)。汎用 AI 然 (Inter/Roboto・紫グラデ等) を避ける
   - コンポーネント名を一貫させる (後段の import/実装まで伝わる)
4. **保存**
   - `design/features/<feature>/<screen>.prompt.md` に保存する (再現性のため commit 対象)
   - 既存があれば上書きせず差分案を提示する
5. **commit** は `workflow-git` に従う (この skill では行わない)

## 停止条件

- 対象画面が特定できない / 目的が不明
- IA (issue #11 / feature doc) が未確定で layout を具体化できない
- `packages/ui` のトークンが未整備で「踏襲する正本」が無い (先に #13)
- 具体指定が出せず否定形 (「〜を使わない」) しか書けない
