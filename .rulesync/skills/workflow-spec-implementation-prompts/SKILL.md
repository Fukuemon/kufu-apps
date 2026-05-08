---
name: workflow-spec-implementation-prompts
description: Kufu Monorepo の spec から、自己完結な実装 prompt を `specs/*/prompts/` に生成する。
targets:
  - "*"
---

# Workflow Spec Implementation Prompts

spec から実装セッション用 prompt を生成するスキル。

## いつ使うか

- spec の論点解決が終わり、実装単位へ分割したい
- app / package ごとの作業 prompt を作りたい

## 先に読むもの

- `references/prompt-rules.md`
- `references/prompt-template.md`

## 実行フロー

1. spec の実装対象、依存関係、テスト観点を確認する
2. phase と責務単位で prompt を分割する
3. 各 prompt に spec から必要情報を埋め込み、自己完結にする
4. 各 prompt で次の必須節を揃える
   - `## 絶対ルール`
   - `## 作業ステップ`
   - `## 実装コンテキスト`
   - `## 前提条件`
   - `## 不明点ハンドリング`
   - `## タスク境界`
   - `## 設計仕様`
   - `## テスト観点`
   - `## 検証コマンド`
   - `## 完了条件`
5. `## 完了条件` はチェックリスト形式で書く
6. `specs/<spec-dir>/prompts/` に保存する
7. 不明点が残る prompt は生成せず、spec 側へ差し戻す

## 停止条件

- prompt が他 repo の探索を前提にしないと成立しない
- 実装範囲 / 非対象範囲 / 検証条件が書けない
- phase 依存が曖昧で、並列実行可否を判断できない
- validator 必須節を満たせない
