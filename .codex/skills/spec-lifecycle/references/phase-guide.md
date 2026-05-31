# Phase Guide

`spec-lifecycle` の各 phase の完了条件と、Kufu Monorepo で毎回確認する論点。
project 共通の SDD 流れと、Kufu 固有の論点を分けて記述する。

## Phase 一覧 (project 共通)

| Phase            | 作業                                                                            | 完了条件                                                         | 次アクション    |
| ---------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------- |
| 1. intake        | issue / requirements doc を読み、対象機能を確認                                 | 要求の起点が明確                                                 | `spec-draft`    |
| 2. scaffold      | `templates/specs/template.md` を埋める / 上位文書整合                           | 背景 / スコープ / 論点 / 実装対象がある                          | draft review    |
| 3. clarify       | `spec-resolve` で未確定論点を 1 件ずつ確定                                      | 未解決論点ゼロ                                                   | diagram         |
| 4. diagram       | `spec-diagrams` で flow / sequence を描く                                       | 図と機能仕様が整合する                                           | track           |
| 5. track         | `spec-track` で `## 上位資料からの変更点` を最新化                              | 差分が PRD / Design Doc / feature doc / context / ADR 別に整理済 | sync (任意)     |
| 6. upstream sync | `spec-sync` で PRD / Design Doc / feature doc / context / ADR に back-propagate | 変更提案行がゼロ                                                 | tasks           |
| 7. tasks         | `spec-prompts` で実装 prompt を生成                                             | 各 prompt が自己完結 / phase 依存表                              | review          |
| 8. review        | `spec-review` で fresh-context evaluator を通す                                 | PASS                                                             | 実装 or handoff |

## Phase Gate (review が必須なタイミング)

- Phase 2 完了後: draft として読み手が背景 / スコープ / 論点を追えるか
- Phase 3 完了後: 重要論点が未解決のまま残っていないか
- Phase 5 完了後: 差分が上位文書側と矛盾していないか
- Phase 7 完了後: prompts が自己完結かつ実装可能か
- Phase 8: 最終 review (`PASS` で終端)

## Kufu Monorepo で毎回確認する論点

スコープに応じて該当する論点だけを `spec-resolve` で確定する。

- LP の performance budget と不要な client JS をどう抑えるか
- Astro で完結する範囲と React island にする範囲
- Cloudflare Pages preview / production と local の確認境界をどう分けるか
- Cloudflare Workers を使うべき処理と静的配信で閉じる処理の境界
- secret を client / build-time / runtime のどこに置くべきか
- URL state / routing をどこで表現するか (TanStack Router の責務境界)
- `packages/ui` へ昇格する UI と app / feature 固有 UI の境界
- Feature / colocation を崩してまで先回りした共通化をしていないか
- React Compiler 互換性と `'use no memo'` の要否
- CMS / 将来 API を初期スコープに含めるか、将来 ADR に送るか
- Playwright / Vitest / Storybook の検証境界
- `dependency-cruiser` / `knip` のルール違反を生まないか (app 間直接依存禁止)

## Phase を止めるべき条件 (Kufu 固有)

- 実装対象 app / package が特定できない (target 一覧から外れる)
- 変更が `PRD.md` (Why/What) か `design/DesignDoc.md` / feature doc / context (How) のどちらで扱うべきか逆転している
- spec 自体が app / package をまたいだ要求追跡に使えない
- Cloudflare Pages / Workers 境界が不明 (静的配信 vs Workers 中継)
- secret / runtime boundary が `context/infrastructure.md` / `context/architecture.md` と矛盾
- LP performance に直接影響する判断 (例: 不要 React 化) を独断で進めようとしている
