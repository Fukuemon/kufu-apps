---
type: feature-design
title: コーポレートサイト
description: Astro のコーポレートサイトの設計。ページの構成と情報の置き場、section の構成、掲載する内容の一次情報、デザインシステムの文書への参照、ページだけの表現の決め、E2E と VRT の対象
status: stable
governs:
  - apps/corporate-site/
verified_commit: unverified
---

# コーポレートサイト

## Overview

Astro によるコーポレートサイトを、高い表示の速さと保守のしやすさで公開する。  
全体像は [docs/design/DesignDoc.md](../../docs/design/DesignDoc.md) に、横断の取り決めは [context/](../../context/index.md) にある。

## Scope

持つものは次のとおり。

- `apps/corporate-site` の 3 つの route と、全ページに共通の layout
- 掲載する内容のデータ（`src/content/`）と、一次情報の文書との対応
- コーポレートサイトの中で閉じる UI。section の中か `components/common/` に置く。
- ブランドの表現の指針

持たないものは次のとおり。

- Astro で完結できる機能の React 化
- CMS による内容の管理。候補は [CMS の Design Doc](../../docs/design/features/cms/DesignDoc.md) にある。
- 問い合わせフォームの入力の項目、送信、API の設計。[問い合わせフォームの Design Doc](../../docs/design/features/contact-form/DesignDoc.md) にある。
- デザイントークンの値と、ブランドの表現の基準。[デザインシステムの文書](../../packages/ui/DESIGN.md) にある。

## Design

### 設計の方針

- Astro の `.astro` のコンポーネントを基本にする。
- React の island は、問い合わせフォームと、ネイティブの要素で足りない操作の UI のためにライブラリを入れたコンポーネントに限る。
  - 表示だけの UI は、`@kufu/ui` のコンポーネントを `client:*` なしで静的に描画する。
  - ADR-0022: [corporate-site の island の方針](../../docs/adr/0022-corporate-site-island-policy.md)
- 画像、フォント、スクリプトは、性能予算を意識して管理する。
- コンポーネントは `components/sections/<section>/` の 1 階層に並べ、各 section の公開面は `index.ts` の再輸出だけにする。
  - 層と依存の向き、共有へ移す条件は [context/codebase.md](../../context/codebase.md#app-の中の層) にある。
  - ADR-0004: [corporate-site の sections 構成](../../docs/adr/0004-corporate-site-sections-architecture.md)
- `src/styles/` のファイルの分け方は [context/codebase.md](../../context/codebase.md#スタイルのファイル) にある。
- 画像は `src/assets/` に置き、Astro Image か import で扱う。
  - build の asset graph に載せ、width、height、lazy loading、形式の最適化を適用する。
  - `public` に直接置くと、参照を追えず最適化も弱いため使わない。
- 公開するアセットは Cloudflare の CDN からの配信を前提に、キャッシュと更新の単位を意識して置く。

### ページの構成

3 つの route と、全ページに共通の layout で構成する。  
ADR-0003: [corporate-site の IA を 3 route にする](../../docs/adr/0003-corporate-site-three-route-ia.md)

| ページ         | route       | 主な section                                                                                                                                                                 |
| -------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| トップ         | `/`         | hero（理念と事業の要約）、相談の内容、事業の紹介（販売と加工のジグザグの構成と、小規模工事の事例）、取扱製品の索引（写真のカードと 18 カテゴリ）、会社の情報、問い合わせの帯 |
| 取扱製品       | `/products` | 18 カテゴリの詳細（索引のパネルと、カテゴリごとの全メーカーの一覧）、問い合わせの帯                                                                                          |
| お問い合わせ   | `/contact`  | 連絡先（TEL、FAX、メール）と問い合わせフォーム                                                                                                                               |
| 全ページに共通 | なし        | ヘッダー（ナビと CTA）と、サイトマップ付きのフッター                                                                                                                         |

- 画面ごとの要素、操作、幅による配置は、画面仕様書（[site-home](../../docs/screens/site-home_トップ/index.md)、[product-list](../../docs/screens/product-list_取扱製品/index.md)、[contact-info](../../docs/screens/contact-info_お問い合わせ/index.md)）にある。
- 事業の内容と会社の情報は、トップの section に入れ、単独の route を作らない。直接の導線は、トップの中のアンカーで提供する。
- トップと取扱製品の末尾には、同じ形の問い合わせの帯（暗い面）を置く。帯は、見出し、リード、`/contact` へのボタン、電話の番号と受付時間を持ち、section の外でページが並べる。
- 取扱製品の写真のカードは、自動では動かさない。矢印とスワイプで送り、端で止める。
- コンテナの幅と横の余白は、全ページで 1440px と横の padding 56 に揃える。実装は 1 つの max-width と共通の padding にする。
- 3 つの route それぞれに、desktop とモバイルの表示を用意する。
  - hover、focus、フォームのエラーのような状態は `@kufu/ui` の規約に従って実装し、Storybook で確認する。
- `/products` のカテゴリとメーカーの検索は、`q` の query parameter だけを状態の基準にする。
  - 最初の表示、再読込、共有した URL から検索の条件を戻す。入力の途中では履歴を増やさない。空の文字列では `q` を消す。
  - JavaScript を実行する前の HTML に、18 カテゴリと全メーカーを持たせる。
- reveal のアニメーションは progressive enhancement にする。
  - JavaScript が無効か、`IntersectionObserver` が使えない環境では、すべての内容を最初から表示する。
  - アニメーションのために、HTML だけでの読みやすさを損なわない。

情報の項目ごとに、置くページと section は次のとおり。

| 項目                                 | 置く先                                         | 補足                                 |
| ------------------------------------ | ---------------------------------------------- | ------------------------------------ |
| 会社名、創立、資本金、代表、所在地   | トップの会社の情報                             | フッターにも要約を置く               |
| TEL、FAX、E メール                   | トップの会社の情報、`/contact`、全ページに共通 | どのページからも連絡できるようにする |
| 経営理念                             | トップの hero と会社の情報                     | 訴求と信頼の中心                     |
| 業務の内容（見積、販売、加工、工事） | トップの事業の紹介                             | 販売、加工、小規模工事の 3 本の柱    |
| 取扱製品のカテゴリ（18 区分）        | トップの索引と `/products`                     | 1 つのデータを両方のページが参照する |
| 取扱メーカー（延べ約 320 社）        | `/products`                                    | カテゴリごとの全メーカーの一覧       |
| アクセスと地図                       | トップの会社の情報の中                         | 地図を埋め込むかは性能予算で判断する |
| 代表の挨拶                           | トップの会社の情報                             | 本文は FB の反映（#46）で入れた      |
| 沿革                                 | トップの会社の情報（placeholder）              | 本文は後から入れる                   |

- 会社概要の一次の情報（社名、所在地、代表、連絡先）は、トップの会社の情報を基準にする。フッターなどは参照にとどめる。
- アクセスと地図、沿革のうち決まっていないものは、placeholder で公開できる状態を保つ。
- グローバルナビ（トップの section へのアンカーと、取扱製品、お問い合わせ）と、全ページに共通の問い合わせの CTA で、どのページからも `/contact` に着けるようにする。
  - ナビの項目は `src/content/navigation.ts` が持ち、ヘッダーとフッターが読む。項目の追加と並べ替えは、このファイルだけを直す。

ナビゲーションの構造は次のとおり。

```mermaid
flowchart TD
    Header["全ページに共通のヘッダー（ナビと問い合わせの CTA）"]
    subgraph P1 ["トップ /"]
        Hero["hero（理念と事業の要約）"]
        Consultation["相談の内容"]
        Business["事業の紹介"]
        Index["取扱製品の索引（18 カテゴリ）"]
        Company["会社の情報"]
        Band1["問い合わせの帯"]
    end
    subgraph P3 ["取扱製品 /products"]
        Detail["18 カテゴリの詳細"]
        Band3["問い合わせの帯"]
    end
    P6["お問い合わせ /contact"]
    Footer["フッター（全ページでサイトマップ付き）"]

    Header -->|"アンカー"| Business
    Header -->|"アンカー"| Company
    Header --> Detail
    Header --> P6
    Hero --> Consultation --> Business --> Index --> Company --> Band1
    Index -->|"カテゴリの詳細へ"| Detail
    Detail --> Band3
    Hero -->|"CTA"| P6
    Band1 -->|"CTA と電話"| P6
    Band3 -->|"CTA と電話"| P6
    Footer -->|"サイトマップと連絡先"| P6
```

訪問者が知りたい情報から問い合わせまで進む流れは次のとおり。

```mermaid
flowchart TD
    Start(["訪問者がトップに着く"]) --> Hero["理念と事業の要約を把握する"]
    Hero --> Decide{"知りたい情報は"}
    Decide -->|"何ができる会社か"| Services["事業の紹介: 販売、加工、小規模工事の 3 本の柱"]
    Decide -->|"扱う製品"| Products["取扱製品の索引から /products: 18 カテゴリの詳細"]
    Decide -->|"信頼できるか"| Company["会社の情報: 概要、理念、沿革、挨拶、アクセス"]

    Company --> MapCheck{"地図を埋め込めるか"}
    MapCheck -->|"できる"| MapEmbed["地図の widget を表示"]
    MapCheck -->|"できない"| MapLink["住所の文字と外部の地図へのリンク"]
    Company --> ContentCheck{"沿革と挨拶が決まっているか"}
    ContentCheck -->|"決まっていない"| Placeholder["placeholder の section を表示"]

    MapEmbed --> Band["問い合わせの帯: ボタンと電話"]
    MapLink --> Band
    Placeholder --> Band
    Products --> Band
    Band --> Contact
    Services --> Contact
    Hero -.->|"全ページに共通の導線"| Contact
    Contact(["お問い合わせ: 連絡先とフォーム"]) --> Goal(["電話、FAX、メール、フォームで連絡する"])
```

### section の構成

section と、その公開面、使うページの対応は次のとおり。  
section の名前はドメインで付けるので、ページとの対応はディレクトリから読めず、この表で表す。  
ADR-0004: [corporate-site の sections 構成](../../docs/adr/0004-corporate-site-sections-architecture.md)

| section             | 公開面（`index.ts` が再輸出する） | 内部の presentation                                                                     | 使うページ  |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------------------- | ----------- |
| `hero`              | `Hero.astro`                      | なし                                                                                    | `/`         |
| `business`          | `BusinessSection.astro`           | `BusinessFeatureRow.astro`                                                              | `/`         |
| `company`           | `CompanySection.astro`            | なし                                                                                    | `/`         |
| `consultation`      | `ConsultationSection.astro`       | なし                                                                                    | `/`         |
| `products-category` | `ProductsCategorySection.astro`   | `FeaturedCategoryCarousel.astro`、`FeaturedCategoryCard.astro`                          | `/`         |
| `products-detail`   | `ProductsDetailSection.astro`     | `ProductsHero.astro`、`ProductsSidebarNav.astro`、`ProductsCategoryAccordionList.astro` | `/products` |
| `contact`           | `ContactSection.astro`            | なし                                                                                    | `/contact`  |

- 複数の section かページで使う site のコンポーネントは、`components/common/` の直下に平らに置く。
  - 例は `BaseLayout`、`SiteHeader`、`SiteFooter`、`SectionHeading`、`ContactCtaLink`、`ContactBand`。
- `products-category` は products のドメインのデータ（`productCategories` と `categoryMakers` の collection）を扱うが、載せる先は `/` である。
  - ドメインと載せるページが一致しないので、ディレクトリはドメインで分け、ページとの対応はこの表で表す。

### コンテンツの一次情報

掲載する内容の一次情報は、リポジトリの [docs/design/features/corporate-site/reference/](../../docs/design/features/corporate-site/reference/) に置く。

- [company-profile.md](../../docs/design/features/corporate-site/reference/company-profile.md): 会社概要、業務の内容、取扱製品のカテゴリ 18 区分
- [manufacturers.md](../../docs/design/features/corporate-site/reference/manufacturers.md): 取扱メーカー、延べ約 320 社
- `.ai-out/` は AI エージェントが取り込むための未追跡の作業場所で、一次情報にしない。
- 取扱製品は、カテゴリ（18 区分）から、そのカテゴリの取扱メーカーの一覧へ進むモデルで示す。
  - 同じメーカーが複数のカテゴリに出ることは、取扱の範囲として認める。
- コードが読むデータは Astro の Content Collection と `src/content/` に置き、一次情報から手で写して保つ。
  - 写したデータには、元の一次情報のパスを書く（`src/content/source-references.ts`）。
  - 食い違いは、pull request のレビューと表示の確認で見つける。
- 18 カテゴリとメーカーの一覧は、`/` の索引と `/products` の両方に出るので、1 つのデータを両方のページが参照する。ページに直接書いて二重に管理しない。

### 問い合わせフォーム

`/contact` の問い合わせフォームは、連絡先（TEL、FAX、メール）と並ぶ補助の導線である。  
フォームの送信に失敗しても、電話、FAX、メールで連絡できる構成にする。  
入力の項目、検証、送信の流れ、API の契約、セキュリティの規則は、[問い合わせフォームの Design Doc](../../docs/design/features/contact-form/DesignDoc.md) にある。

### デザイントークン

トークンの値、名前、使う場面は、デザインシステムが持つ。この文書には写さない。

- 規則: [デザインシステムの文書](../../packages/ui/DESIGN.md)。色、文字、余白、角丸、動きの使う場面は、[トークンの文書](../../packages/ui/design/tokens.md) にある。
- 値: `packages/ui/src/tokens/` の `primitive.css`、`semantic.css`、`theme.css`。暗い面の参照先は `surface-inverse.css` に、font-face の登録は `fonts.css` にある。
- コンポーネントの使い方: [コンポーネントの文書](../../packages/ui/design/components.md)
- 層の分け方
  - ADR-0018: [トークンを、Kufu の色と DADS の値を持つプリミティブトークン、セマンティックトークン、テーマ変数の 3 つの層にし、shadcn の語彙をやめる](../../docs/adr/0018-design-tokens-three-layers.md)

### トーンとマナー

ブランドの表現の基準は、デザインシステムの文書が持つ。

- 残す色、書体、ロゴ、装飾の語彙と、使う場所: [デザインシステムの文書](../../packages/ui/DESIGN.md#kufu-の見た目として残すもの) の「Kufu の見た目として残すもの」
- 書体と文字のスタイルの使う場面、面の構成、余白の段、section の余白: [トークンの文書](../../packages/ui/design/tokens.md)
  - ADR-0025: [Kufu の色、書体、ロゴ、装飾の語彙を残し、状態の色、フォーカス、文字の最小の大きさ、押せる領域を DADS に合わせ、見出しの上のラベルを日本語だけにする](../../docs/adr/0025-kufu-identity-japanese-labels.md)

この節には、corporate-site のページだけの決めを書く。

- 書体の読み込み
  - 読み込みは `@fontsource-variable/*`（可変フォント）を使う。日本語は unicode-range で分けたサブセットにし、すべての glyph を一度に読み込まない。`font-display: swap`（FOUT を許す）にする。
  - `components/common/BaseLayout.astro` が `@kufu/ui/fonts.css?url` を preload と link で読み込み、フォントの配信を document の head の側で制御する。
- section の見出し: 見出しの上に、mono の番号と、見出しにない情報を持つ和文のラベル（sans）を並べる。見出しと同じ意味のラベルと、英字だけのラベルは置かない。
- 使わない表現
  - 飾りの em-dash。区切りは `/` を使う。
  - 順も索引も表さない並びの番号。番号は、セクション、手順、カテゴリのように順か索引の意味があるものにだけ付ける。
  - 内容を持たない飾りの面。背景の方眼、写真の上の目盛、霧のような背景、タグの下の短い線、「SCROLL」のリンク。
  - 自動で動き続ける表示。カルーセルは、訪問者の操作でだけ送る。
  - 数字を大きく並べる stat のカード。事実は文章の中で述べる。
  - カテゴリごとに、代表のメーカーを強調したうえで全メーカーを載せる二重の掲載。全メーカーの 1 つのリストに揃える。
  - 暗い面のトーンは 1 つに揃える。

### 静的なページの配信

ページは事前に生成した静的なアセットとして配信する。

```mermaid
sequenceDiagram
    actor User as 訪問者
    participant Browser as Browser
    participant CDN as Cloudflare CDN

    User->>Browser: ページの URL へアクセス
    Browser->>CDN: 静的なページを要求（HTML、CSS、画像）
    CDN-->>Browser: 事前に生成した静的なアセットを返す
    Browser-->>User: ページを表示（island は要る箇所だけ）
```

## Interface

- route: `src/pages/index.astro`、`src/pages/products.astro`、`src/pages/contact.astro`
- section: `src/components/sections/<section>/index.ts`
- 共有の site のコンポーネント: `src/components/common/`
- 内容のデータ: `src/content/` と `src/content.config.ts`。一次情報への参照は `src/content/source-references.ts`
- スタイルの entry: `src/styles/globals.css`
- app の Storybook: `.storybook/`
- E2E のための script: `build`、`preview`、`e2e:serve`。取り決めは [context/testing.md](../../context/testing.md#runtime-requirements) にある。
- section の境界のチェック: `scripts/check-section-boundary.mjs`。`lint` に含まれる。

## Verification

次の観点で確認する。

- `apps/corporate-site` をビルドできる。
- Cloudflare Pages の preview deployment で、主なページを表示できる。
- 主なページと問い合わせへの導線を、Playwright で確認できる。
- Astro のページに、不要な React の island と client directive が増えていない。

### E2E が担うジャーニー

route をまたいだ到達を、E2E で確認する。  
テストの規約は [context/testing.md](../../context/testing.md#test-types-and-guarantees) にある。  
ADR-0028: [E2E のテストのコードを層に分けて書き、ページ単位の Page Object をやめる](../../docs/adr/0028-e2e-test-code-layers.md)

- 回遊: `/` から `/products` へ進み、カテゴリを検索し（URL に検索の条件が残る）、`/contact` に着く。
- ナビゲーション: ヘッダーとフッターのリンクと、モバイルのナビの開閉から、各 route へ着ける。
- JavaScript が無効のとき: JavaScript を無効にしても、3 つの route の主な内容が表示され、問い合わせ先へ着ける。

問い合わせフォームの送信のジャーニーは、フォームを実装したときに足す。

### VRT の対象

ADR-0026: [VRT の方針](../../docs/adr/0026-visual-regression-testing-policy.md)

- 3 つの route（`/`、`/products`、`/contact`）を、desktop と mobile の 2 つの幅で撮り、baseline との差分を検出する。
- app の Storybook の story も撮る。
- 許す差分は 0（完全一致）から始め、差分が出たら CI を失敗させる。
