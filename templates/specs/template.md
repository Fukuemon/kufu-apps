# {{title}}

> Kufu Monorepo の spec 本体テンプレート (minimal core)。
> API / Database / Authorization / Screen / data-testid など機能固有の節は `templates/specs/appendices/<topic>.md` から該当 appendix を取り込む。

## メタ情報

- Issue: `#{{issue-id}}`
- Branch: `feature/{{issue-id}}`
- Owner:
- Status: `draft / in-progress / review / done`

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留は備考に理由を記載する。

| #   | フェーズ             | Skill                                  | 状態   | 最終更新 | 備考 |
| --- | -------------------- | -------------------------------------- | ------ | -------- | ---- |
| 1   | intake               | `spec-issue-read` / `spec-requirement` | 未着手 |          |      |
| 2   | scaffold             | `spec-draft`                           | 未着手 |          |      |
| 3   | clarify              | `spec-resolve`                         | 未着手 |          |      |
| 4   | diagram              | `spec-diagrams`                        | 未着手 |          |      |
| 5   | track                | `spec-track`                           | 未着手 |          |      |
| 6   | upstream sync (任意) | `spec-sync`                            | 未着手 |          |      |
| 7   | tasks                | `spec-prompts`                         | 未着手 |          |      |
| 8   | review               | `spec-review`                          | 未着手 |          |      |

## 上位文書整合

正本 ([PRD](../../PRD.md) / [Design Doc](../../design/DesignDoc.md) / ADR) のどの節と整合させたかを記録する。

| 上位文書      | 節 / 該当箇所 | 整合方針 (継承 / 補足 / 変更提案) |
| ------------- | ------------- | --------------------------------- |
| PRD           |               | 継承                              |
| Design Doc    |               | 継承                              |
| ADR (なら ID) |               |                                   |

> 矛盾を検出した場合は `spec-sync` で PRD / Design Doc / ADR への back-propagation を提案する。

## 関連資料

- []()

## 背景

## スコープ

### やること

-

### やらないこと

-

## 要件の解釈

EARS 風で記述する (`<who>` `<trigger>` 時、システムは `<expected behavior>` する)。

- WHEN ... THEN ...
- IF ... THEN ...
- WHILE ... THE SYSTEM SHALL ...

### 設計時の論点

| #   | 論点 | 選択肢 | 決定 |
| --- | ---- | ------ | ---- |
|     |      |        |      |

### 解決済みの論点

(`spec-resolve` で確定したものをここに移動する)

### 未確定事項

(決定できない項目を理由とともに残す。1 件でも残っていれば下流 phase は止める)

## 実装対象

正規 target は `lp-site / cms / ui / config / e2e / future-api`。

| Target            | 実装有無 | 備考 |
| ----------------- | :------: | ---- |
| `apps/lp-site`    |    -     |      |
| `apps/cms`        |    -     |      |
| `packages/ui`     |    -     |      |
| `packages/config` |    -     |      |
| `e2e`             |    -     |      |
| その他            |    -     |      |

## 機能仕様

### Performance

- LP の場合: 不要な client JS / Astro island の最小化、画像・フォントの最適化方針

### Routing / URL State

- URL に寄せる state / Router の責務境界

### Content / Assets

- コンテンツ更新フロー / 静的 asset 配置 / Cloudflare CDN 前提

### UI Reuse

- `@kufu/ui` 経由か、feature / colocation 内で閉じるか

### React Compiler

- 利用ライブラリの React Compiler 互換性 / `'use no memo'` の要否

### Testing

- Vitest / Storybook / Playwright のどこで何を担保するか

## フロー / シーケンス

(`spec-diagrams` で生成)

### Flowchart (ユーザー操作起点)

```mermaid
flowchart TD
```

### Sequence

```mermaid
sequenceDiagram
```

## 上位資料からの変更点

本 spec で PRD / Design Doc / 既存 ADR から変更・追加した内容。
反映先別に分けて記録する。`spec-track` / `spec-sync` で更新する。

### PRD への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

### Design Doc への影響

| 対象節 | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

### ADR の新規 / 更新

| ADR ID | 変更内容 | 理由 |
| ------ | -------- | ---- |
|        |          |      |

## レビュー

`spec-review` (fresh-context evaluator) の最新結果。完全な記録は `review.md` を参照。

| 日付 | 結果 (PASS / NEEDS_WORK) | 指摘要点 | 対応 |
| ---- | ------------------------ | -------- | ---- |
|      |                          |          |      |

## 備考

<!--
追加 appendix が必要な spec は、templates/specs/appendices/ から該当 topic を取り込むこと:

- API endpoint / request / response → appendices/api.md
- ER 図 / DDL / シードデータ → appendices/database.md
- ロール別 UI 制御 / API 認可マトリクス → appendices/authorization.md
- 画面コンポーネントツリー / 表示条件 → appendices/screen-spec.md
- data-testid 一覧 → appendices/testid.md
-->
