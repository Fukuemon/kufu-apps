# Prompt Rules

## 目的

spec から生成する prompt の粒度、責務境界、自己完結性を揃える。

## ルール

- 1 prompt 1 責務を守る
- 明示された path 以外の探索を前提にしない
- 依存関係を phase で表現する
- backend / frontend / infra / evaluation を無理に 1 本へ混ぜない
- 未確定事項が残るなら prompt を出さず、spec 側へ戻る
- prompt から他 repo の追加探索を要求しない
- 実装に必要な仕様は spec から抜粋して埋め込む

## 命名

`P{phase}_{seq}_{target}_{scope}.md`

例:

- `P1_01_indexer_provider_adapter.md`
- `P2_01_rag_search_scope.md`
- `P2_02_app_citation_render.md`

## KufuApp でよく使う target

- `app`
- `rag`
- `indexer`
- `infra`
- `evaluation`
