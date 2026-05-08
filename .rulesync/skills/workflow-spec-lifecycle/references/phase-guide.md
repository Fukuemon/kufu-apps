# Spec Phase Guide

Kufu Monorepo の spec は次のフェーズで進める。

| フェーズ                       | 作業                                                                 | 完了条件                               | 次アクション                           |
| ------------------------------ | -------------------------------------------------------------------- | -------------------------------------- | -------------------------------------- |
| 1. 起票確認                    | issue、背景、上位文書を確認する                                      | 要求の起点が明確                       | `workflow-spec-draft` で下書き         |
| 2. 下書き                      | `specs/TEMPLATE.md` を埋める                                         | 背景、スコープ、論点、実装対象がある   | draft review                           |
| 3. 上位文書突合                | `PRD.md` / `design/DesignDoc.md` / 関連 ADR と整合確認               | 矛盾がない                             | 論点整理                               |
| 4. 論点整理                    | 未確定事項を列挙し優先度を付ける                                     | 重要論点が見える                       | 論点解決                               |
| 5. 論点解決                    | performance、routing、content、UI reuse、React Compiler などを決める | 未確定事項が実装阻害にならない         | interface 設計                         |
| 6. Interface / Routing 設計    | UI / route / API / props / event の境界を決める                      | 入出力と責務境界が明確                 | content / data 設計                    |
| 7. Content / Data 設計         | コンテンツ、assets、URL state、データ取得の流れを決める              | 実装 package ごとの責務が明確          | performance / security 設計            |
| 8. Performance / Security 設計 | LP 性能、client JS、privacy、fallback、Cloudflare 境界を決める       | 性能と安全性の懸念が書ける             | test / metrics 設計                    |
| 9. Test / Metrics 設計         | 検証方法と観測指標を定義する                                         | 完了判定が検証可能                     | 実装分割                               |
| 10. 実装分割                   | prompt に落とせる単位へ切る                                          | 各 prompt が 1 責務になる              | `workflow-spec-implementation-prompts` |
| 11. レビュー済                 | review gate の指摘を反映し、spec をレビュー完了状態にする            | 指摘の反映方針が確定し、次工程へ渡せる | 実装または handoff                     |

## review gate

- フェーズ 2 完了後: draft として読み手が背景、スコープ、論点を追えるか確認する
- フェーズ 5 完了後: 重要論点が未解決のまま残っていないか確認する
- フェーズ 8 完了後: performance と security の前提が app / package 間で矛盾しないか確認する
- フェーズ 10 完了後: prompt が自己完結かつ実装可能か確認する
- フェーズ 11 完了後: review 指摘への対応方針が確定し、実装へ進める状態か確認する

## Kufu Monorepo で毎回確認する論点

- LP の performance budget と不要な client JS をどう抑えるか
- Astro で完結する範囲と React island にする範囲
- Cloudflare Pages preview / production と local の確認境界をどう分けるか
- Cloudflare Workers を使うべき処理と静的配信で閉じる処理の境界
- secret を client / build-time / runtime のどこに置くべきか
- URL state / routing をどこで表現するか
- `packages/ui` へ昇格する UI と app 固有 UI の境界
- React Compiler 互換性と `'use no memo'` の要否
- CMS/API を初期スコープに含めるか、将来 ADR に送るか
- Playwright / Vitest / Storybook の検証境界

## フェーズを止めるべき条件

- 実装対象 app / package が特定できない
- 変更が `PRD.md` で扱うべきか `design/DesignDoc.md` で扱うべきか逆転している
- spec 自体が app / package をまたいだ要求追跡に使えない
