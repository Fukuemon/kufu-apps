---
name: workflow-spec-lifecycle
description: Kufu Monorepo の spec を、下書きから論点解決、レビュー、実装分割まで進める phase guide。
targets:
  - "*"
---

# Workflow Spec Lifecycle

spec を段階的に固めるための phase guide。

## いつ使うか

- 既存 spec の次アクションを決めたい
- 下書きから実装分割までを止まらず進めたい

## 先に読むもの

- `../shared-rules/references/path-resolution.md`
- `../shared-rules/references/issue-traceability.md`
- `references/phase-guide.md`

## 実行フロー

1. 対象 spec の現在フェーズと未解決論点を確認する
2. まだ完了していない最小フェーズから再開する
3. フェーズ完了条件を満たしたら review gate を通す
4. review を通過したら次フェーズまたは次 skill を提案する
5. 実装分割まで進んだら `workflow-spec-implementation-prompts` に渡す

## 停止条件

- PRD / Design Doc / ADR と矛盾する
- 未解決論点が残ったまま次フェーズへ進もうとしている
- 実装対象 app / package、interface、performance / security 境界のいずれかが曖昧
- prompt に落とせる粒度まで slice できない
