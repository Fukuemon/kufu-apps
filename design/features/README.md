# Feature 設計 doc 一覧

`design/features/` は **feature 単位の設計 (How)** を置く層。全体像 (system landscape / モジュール責務 / 横断方針) は [design/DesignDoc.md](../DesignDoc.md)、技術スタック規約・運用契約は [context/](../../context/) を正本とする。

各 feature doc は「仕様 (What) をどう実現するか」を、データ構造・画面・フロー単位で記述する。

## 一覧

| Feature            | 文書                                   | Phase   | 状態              |
| ------------------ | -------------------------------------- | ------- | ----------------- |
| コーポレートサイト | [corporate-site.md](corporate-site.md) | Phase 1 | 設計済 (skeleton) |
| CMS / React アプリ | [cms.md](cms.md)                       | Phase 2 | 標準のみ (未着手) |

## 新規追加

[templates/features/template.md](../../templates/features/template.md) を `design/features/<feature>.md` にコピーして起票する。
