# Feature 設計 doc 一覧

`design/features/` は **feature 単位の設計 (How)** を置く層。全体像 (system landscape / モジュール責務 / 横断方針) は [design/DesignDoc.md](../DesignDoc.md)、技術スタック規約・運用契約は [context/](../../context/) を正本とする。

各 feature doc は「仕様 (What) をどう実現するか」を、データ構造・画面・主要シナリオ / フロー単位で記述する。責務・範囲・方針の層に留め、ファイル配置・directive・テスト手順などの実装レベルの手順は spec ([specs/](../../specs/)) へ委譲する。

## 一覧

| Feature            | 文書                                                                                     | Phase                                           | 状態 |
| ------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------- | ---- |
| コーポレートサイト | [corporate-site/DesignDoc_corporate-site.md](corporate-site/DesignDoc_corporate-site.md) | 設計確定 (IA / トークン / フォーム仕様)・実装中 |
| CMS / React アプリ | [cms/DesignDoc_cms.md](cms/DesignDoc_cms.md)                                             | 標準候補のみ (未着手)                           |

各 feature は `design/features/<feature>/` ディレクトリに集約する。design doc は `DesignDoc_<feature>.md`、付随するコンテンツ正本は `<feature>/reference/` に置く (例: [corporate-site/reference/](corporate-site/reference/))。

## 新規追加

`templates/features/template.md` を `design/features/<feature>/DesignDoc_<feature>.md` にコピーして起票する。`templates/` は sdd-template から symlink で繋がっており本 repo では追跡しない (未接続なら `bash scripts/doctor.sh`)。
