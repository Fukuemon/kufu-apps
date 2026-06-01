# <feature-name>

## メタ情報

- Issue: #<number> / draft-YYYYMMDD
- ステータス: Draft
- 作成日: YYYY-MM-DD
- 更新日: YYYY-MM-DD

## 設計フェーズ状況

状態は `未着手 / 進行中 / 完了 / レビュー済 / 保留` のいずれか。保留の場合は理由を備考に残す。

| #   | フェーズ                    | 状態   | 最終更新 | 備考 |
| --- | --------------------------- | ------ | -------- | ---- |
| 1   | 起票                        | 未着手 |          |      |
| 2   | 下書き                      | 未着手 |          |      |
| 3   | 上位文書突合                | 未着手 |          |      |
| 4   | 論点整理                    | 未着手 |          |      |
| 5   | 論点解決                    | 未着手 |          |      |
| 6   | Interface / Routing 設計    | 未着手 |          |      |
| 7   | Content / Data 設計         | 未着手 |          |      |
| 8   | Performance / Security 設計 | 未着手 |          |      |
| 9   | Test / Metrics 設計         | 未着手 |          |      |
| 10  | 実装分割                    | 未着手 |          |      |
| 11  | レビュー済                  | 未着手 |          |      |

## 上位ドキュメント確認

- PRD 更新要否: 要 / 不要
- Design Docs 更新要否: 要 / 不要
- ADR 起票要否: 要 / 不要

## 関連資料

- `PRD.md`:
- `design/DesignDoc.md`:
- 関連 issue / ticket:

## 背景

- なぜこの spec が必要か
- Phase 1 のどの完成条件に関わるか
- コーポレートサイト / 業務アプリ / 共通 package のどれに影響するか

## スコープ

### やること

-

### やらないこと

-

## 要件の解釈

### 実現したいユーザー価値

-

### 成功条件

-

### 対象ユーザー / 操作主体

-

## 論点一覧

| #   | 論点 | 決定候補 | 決定 |
| --- | ---- | -------- | ---- |
| 1   |      |          | 未決 |

## 解決済みの論点

-

## 未確定事項

-

## 実装対象

| モジュール       | 実装有無 | 主な責務                                                             |
| ---------------- | :------: | -------------------------------------------------------------------- |
| `corporate-site` |  ◯ / -   | Astro コーポレートサイト、ページ、section、assets                    |
| `cms`            |  ◯ / -   | コーポレートサイト掲載投稿管理 app、routing、form、client state      |
| `ui`             |  ◯ / -   | React app 向け shadcn/ui 基盤、design token、font、shared stylesheet |
| `config`         |  ◯ / -   | tsconfig、lint、format、test 設定                                    |
| `e2e`            |  ◯ / -   | Playwright の主要導線検証                                            |
| `future-api`     |  ◯ / -   | 将来の Hono API / CMS 連携候補                                       |

## 機能仕様

### User Flow

1.
2.
3.

### Reuse Policy

- 第一原則は feature / colocation とする
- 共通化は複数 feature / app をまたぐ再利用が明確になってから行う
- app や feature 内で閉じる UI / utility / asset はローカルに置く

### Performance

-

### Routing / URL State

-

### Content / Assets

-

### UI Reuse

-

### React Compiler

-

### Testing

-

## Interface 設計

### UI / API / Event Interface

-

### Props / Request / Response

-

## Content / Data 設計

### 保存・管理するデータ

-

### コンテンツ配置 / package / route

-

## Performance / Security 設計

### Performance

-

### Security / Privacy

-

## Error / Fallback 設計

### エラーケース

| #   | ケース | ユーザーへの見せ方 | リカバリ |
| --- | ------ | ------------------ | -------- |
| 1   |        |                    |          |

### Fallback

-

## テスト / 評価方針

### テスト観点

-

### 計測指標

-

## 実装分割

### 実装タスク案

| Phase | 対象 | 概要 | 依存 |
| ----- | ---- | ---- | ---- |
| P1    |      |      |      |

### prompts 生成方針

- `corporate-site` / `cms` / `ui` / `config` / `e2e` のどこで分けるか
- 並列実装できる境界

## 既存資料からの変更点

| 対象 | 変更内容 | 理由 |
| ---- | -------- | ---- |
|      |          |      |

## 変更履歴

| 日付 | 変更者 | 変更内容 |
| ---- | ------ | -------- |
|      |        |          |

## 備考
