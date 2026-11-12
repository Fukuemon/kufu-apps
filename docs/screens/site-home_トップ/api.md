# site-home API との対応

[トップ](index.md) の項目と、画面の型の項目、API の項目の対応。画面を作る人、API を変える人、仕様と実装を照らす人が読む。

このページは静的に書き出すので、API を呼ばない。値は、`apps/corporate-site/src/content/` のファイルと content collection から読む。

## 値の対応

| 要素名                     | 表示する値           | 画面の型の項目                                  | API の項目 |
| -------------------------- | -------------------- | ----------------------------------------------- | ---------- |
| ページのタイトル           | タイトルの 2 行      | `heroContent.titleLines`                        | なし       |
| 3 本の柱                   | 題と説明             | `servicePillars` の `title` と `lead`           | なし       |
| お見積り・お問い合わせ     | リンクの文言         | `heroContent.primaryCta.label`                  | なし       |
| 相談の内容                 | 事例の題と説明       | `consultationContent.cases`                     | なし       |
| カテゴリの索引             | 番号、名前、社数     | content collection の取扱製品のカテゴリ         | なし       |
| 問い合わせの帯             | 見出しとリード       | `contactPageContent` の `title` と `lead`       | なし       |
| 帯のお見積り・お問い合わせ | リンクの文言         | `contactBandContent.cta.label`                  | なし       |
| 帯の電話                   | 電話の番号と受付時間 | `contactInfo.tel` と `contactBandContent.hours` | なし       |

## 条件の対応

| 条件                        | 判定に使う値                                 |
| --------------------------- | -------------------------------------------- |
| 画面の幅が 768px 未満である | CSS のメディアクエリ `min-width: 48rem` の外 |

## 要素の testid

| 番号 | 要素名                 | testid                      |
| ---- | ---------------------- | --------------------------- |
| 1    | ヘッダー               | `site-header`               |
| 2    | ナビゲーション         | `site-nav-menu`             |
| 3    | メニューを開く         | `site-nav-toggle`           |
| 4    | ヘッダーのお問い合わせ | `site-nav-contact`          |
| 7    | お見積り・お問い合わせ | `home-link-contact`         |
| 9    | 相談の内容             | `home-section-consultation` |
| 11   | 事業の紹介             | `home-section-business`     |
| 13   | 取扱製品カテゴリ       | `home-section-products`     |
| 16   | カテゴリの索引         | `products-category-list`    |
| 17   | 取扱製品ページへ       | `home-link-products`        |
| 18   | 会社概要               | `home-section-company`      |
| 19   | アクセスの地図         | `company-access-map`        |
| 20   | 問い合わせの帯         | `home-section-contact-band` |
| 23   | フッター               | `site-footer`               |

最初の画面のセクションの `home-section-hero` は、番号のない入れ物に付けているので、表に載せない。
