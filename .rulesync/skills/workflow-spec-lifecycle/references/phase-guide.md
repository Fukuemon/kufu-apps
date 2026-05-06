# Spec Phase Guide

KufuApp の spec は次のフェーズで進める。

| フェーズ                   | 作業                                                          | 完了条件                             | 次アクション                           |
| -------------------------- | ------------------------------------------------------------- | ------------------------------------ | -------------------------------------- |
| 1. 起票確認                | issue、背景、上位文書を確認する                               | 要求の起点が明確                     | `workflow-spec-draft` で下書き         |
| 2. 下書き                  | `specs/TEMPLATE.md` を埋める                                  | 背景、スコープ、論点、実装対象がある | draft review                           |
| 3. 上位文書突合            | `PRD.md` / `design/DesignDoc.md` / 関連 ADR と整合確認        | 矛盾がない                           | 論点整理                               |
| 4. 論点整理                | 未確定事項を列挙し優先度を付ける                              | 重要論点が見える                     | 論点解決                               |
| 5. 論点解決                | provider、permission、freshness、citation、scope などを決める | 未確定事項が実装阻害にならない       | interface 設計                         |
| 6. Interface 設計          | UI / API / event / schema の境界を決める                      | 入出力と責務境界が明確               | data / job 設計                        |
| 7. Data / Job 設計         | repository、job、indexing、同期などの流れを決める             | 実装 repo ごとの責務が明確           | error / permission 設計                |
| 8. Error / Permission 設計 | 失敗時挙動と権限境界を決める                                  | 異常系とアクセス境界が書ける         | test / metrics 設計                    |
| 9. Test / Metrics 設計     | 検証方法と観測指標を定義する                                  | 完了判定が検証可能                   | 実装分割                               |
| 10. 実装分割               | prompt に落とせる単位へ切る                                   | 各 prompt が 1 責務になる            | `workflow-spec-implementation-prompts` |

## review gate

- フェーズ 2 完了後: draft として読み手が背景、スコープ、論点を追えるか確認する
- フェーズ 5 完了後: 重要論点が未解決のまま残っていないか確認する
- フェーズ 8 完了後: permission と異常系が sibling repo 間で矛盾しないか確認する
- フェーズ 10 完了後: prompt が自己完結かつ実装可能か確認する

## KufuApp で毎回確認する論点

- GitHub / self-hosted GitLab 差分をどこで吸収するか
- 単一 repository 既定をどう維持するか
- 横断検索 opt-in の UI / API 契約
- 節単位 citation の構造
- `Last Indexed At` と re-indexing の見せ方
- repository 単位権限の境界
- `Time to Relevant Source` と `Task Resolution Time` の計測点

## フェーズを止めるべき条件

- 実装対象 repo が特定できない
- 変更が `PRD.md` で扱うべきか `design/DesignDoc.md` で扱うべきか逆転している
- spec 自体が sibling repo をまたいだ要求追跡に使えない
