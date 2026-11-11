# 今の画面と構成の課題

[spec の本文](index.md) の Design が参照する調査の結果である。  
画面は、コミット 6beb42f を手元で build し、`astro preview` で開いて、幅 1280px と 390px で撮った。動きを減らす設定を有効にして、reveal のアニメーションが終わった状態を撮っている。  
コードの根拠の行は、同じコミットのものである。

## 今の画面

| ページ       | 1280px                                              | 390px                                             | 高さ（1280px / 390px） |
| ------------ | --------------------------------------------------- | ------------------------------------------------- | ---------------------- |
| トップ       | [current-home-1280](current-home-1280.webp)         | [current-home-390](current-home-390.webp)         | 6987px / 10484px       |
| 取扱製品     | [current-products-1280](current-products-1280.webp) | [current-products-390](current-products-390.webp) | 7067px / 13631px       |
| お問い合わせ | [current-contact-1280](current-contact-1280.webp)   | [current-contact-390](current-contact-390.webp)   | 1241px / 2132px        |

## 画面の課題

重要な順に並べる。観点は、導線、情報の並び、モバイルでの見え方、読みやすさ、セクションの分け方である。

### 768px 未満のトップで、hero より下に問い合わせへのボタンが出ない（導線、モバイル）

- トップで `/contact` へ進むリンクは、ヘッダー、hero、フッターの 3 か所だけである。相談の内容、事業の紹介、取扱製品、会社概要の 4 つのセクションは、`/contact` へのリンクを持たない。
  - `apps/corporate-site/src/components/sections/hero/Hero.astro:80-95` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/hero/Hero.astro#L80-L95)
  - `apps/corporate-site/src/components/common/SiteFooter.astro:64-66` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteFooter.astro#L64-L66)
- 768px 以上では、画面の上に留まるヘッダーに、問い合わせへのボタンが常に出る。課題は 768px 未満に限る。
  - `apps/corporate-site/src/components/common/SiteHeader.astro:40-42` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteHeader.astro#L40-L42)
  - `apps/corporate-site/src/styles/components.css:645-653` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/styles/components.css#L645-L653)
- 390px では、ヘッダーのナビはボタンで開くまで表示されない。hero のボタン（上から約 1250px）を過ぎると、フッター（約 10000px）まで、問い合わせへのボタンが画面に出ない。
  - `apps/corporate-site/src/styles/components.css:513-525` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/styles/components.css#L513-L525)
- 会社概要まで読んで信頼できると判断した訪問者が、その場で連絡へ進めない。PRD の「見込み顧客が、どのページからも問い合わせ先へ着ける」に対して、道筋が遠い。

### トップが長く、モバイルでは会社概要が約 8300px 下にある（モバイル、情報の並び）

- 390px のトップは 10484px で、画面 12 枚分を超える。会社概要は約 8300px から始まる。
- 長さの主な内訳は、hero（約 1400px）、相談の内容と流れ（約 1750px）、事業の紹介（約 2700px）、取扱製品（約 1900px）、会社概要（約 2200px）である。
- 取扱製品の索引は、390px では 18 行が 1 列に並び、約 1000px を使う。
  - `apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro:50-80` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro#L50-L80)

### hero に要素が多く、390px では最初の画面にボタンが入らない（モバイル、情報の並び）

- hero は、eyebrow、見出し、リード、写真とキャプション、3 本の柱、ボタン 2 つを持つ。390px では、ボタンは 3 本の柱の下で、上から約 1250px にある。高さ 844px の最初の画面に入らない。
  - `apps/corporate-site/src/components/sections/hero/Hero.astro:17-95` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/hero/Hero.astro#L17-L95)
- hero の 3 本の柱と、事業の紹介の行は、同じ題（見積もり・販売、加工）を 2 回示す。小規模工事は、hero では柱の 1 本だが、事業の紹介では写真の行を持たず、下のパネルだけで示す。見出しは「三本柱」だが、同じ形で並ぶのは 2 本である。
  - `apps/corporate-site/src/content/services.ts:3-22` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/content/services.ts#L3-L22)
  - `apps/corporate-site/src/content/business.ts:12-63` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/content/business.ts#L12-L63)

### セクションの順が、訪問者の問いの順と合っていない（情報の並び）

- 今の順は、hero、相談の内容（00）、事業の紹介（01）、取扱製品（02）、会社概要（03）である。何をする会社かを示す事業の紹介より先に、相談の事例と、相談から納品までの流れが来る。
  - `apps/corporate-site/src/pages/index.astro:15-19` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/pages/index.astro#L15-L19)
- 相談の内容は、ヘッダーとフッターのナビに項目がない。着けるのは、スクロールと、hero の SCROLL のリンク（768px 以上だけ）である。
  - `apps/corporate-site/src/components/common/SiteHeader.astro:14-37` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteHeader.astro#L14-L37)
- 相談から納品までの流れは、問い合わせる直前に読むと役に立つ内容だが、問い合わせへのボタンから離れている。
- Design Doc のページの構成の表と流れの図は、相談の内容のセクションを載せていない。

### 取扱製品のページがモバイルで 13631px あり、目当てのメーカーまでが遠い（モバイル）

- 390px では、hero（写真を含めて約 1050px）、見出し、開いた状態の索引（約 1150px）の後に、18 カテゴリのメーカーの一覧が全て開いた状態で続く。
  - `apps/corporate-site/src/components/sections/products-detail/ProductsSidebarNav.astro:17` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsSidebarNav.astro#L17)
  - `apps/corporate-site/src/components/sections/products-detail/ProductsCategoryAccordionList.astro:44` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsCategoryAccordionList.astro#L44)
- 検索の欄は、索引のパネルの中にあり、390px では上から約 1400px にある。索引は 1024px 以上でだけ画面に留まるので、390px では、一覧の途中から検索と索引に戻るには「カテゴリ先頭へ」のボタンを使う。
  - `apps/corporate-site/src/components/sections/products-detail/ProductsSidebarNav.astro:16` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsSidebarNav.astro#L16)
- PRD の「担当者が、取扱製品のカテゴリとメーカーを短時間で確認できる」に対して、モバイルでは手数が多い。

### トップの取扱製品が、同じカテゴリをカルーセルと索引で 2 回示し、カルーセルのカードは押せない（情報の並び、導線）

- カルーセルは、写真を持つカテゴリだけを、自動で流して示す。カードは `article` で、リンクを持たない。写真を見て押しても、どこにも進まない。
  - `apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCard.astro:12-36` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCard.astro#L12-L36)
- 直下の索引は、同じカテゴリを含む 18 カテゴリを、リンク付きで示す。
- カルーセルのスクリプトは約 170 行で、行数では、トップのスクリプトのうち最も長い。配る JavaScript の量は測っていない。
  - `apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCarousel.astro:60-233` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCarousel.astro#L60-L233)

### お問い合わせのページで、送れないフォームの枠が画面の大半を占め、電話が目立たない（導線）

- フォームは「デザイン確認用のフォーム枠」で、送信できない。390px では、連絡先（約 440px）の下に、約 1200px のフォームの枠が続く。
  - `apps/corporate-site/src/components/sections/contact/ContactSection.astro:57-113` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/contact/ContactSection.astro#L57-L113)
- 今、実際に連絡できる手段は、電話、FAX、メールである。電話とメールのリンクは、15px の文字で、押せる領域が小さい。
  - `apps/corporate-site/src/components/sections/contact/ContactSection.astro:29-44` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/contact/ContactSection.astro#L29-L44)
- フォームの実装は、問い合わせフォームの要求が扱う。この要求が扱えるのは、連絡先とフォームの置き方である。

### 取扱製品の hero で、背面の写真の上のリードが読みにくい（読みやすさ）

- 1280px では、hero の写真が文字の背面で左へ伸び、リードの「全18カテゴリ・延べ約320社」の文字の背景になる。写真を文字の背面へ薄く広げるのは、スタイルのコメントにある、意図した表現である。トップの hero も同じ作りだが、トップでは文字に掛かっていない。
  - 画面: [current-products-1280](current-products-1280.webp) の上端から 430〜470px
  - `apps/corporate-site/src/styles/components.css:39-86` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/styles/components.css#L39-L86)

### 見出しが、390px で語の途中か 2 文字で折り返す（読みやすさ、モバイル）

- hero の見出しは「機械工具の調達」「と、」と、2 文字だけの行ができる。セクションの見出しは「こんな相談に対応でき / ます」「販売と加工、小規模工 / 事の三本柱」と、語の途中で折り返す。
  - 画面: [current-home-390](current-home-390.webp) の上端から 150〜330px、1560〜1640px、3060〜3150px
  - `apps/corporate-site/src/components/common/SectionHeading.astro:49-53` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SectionHeading.astro#L49-L53)

### 同じ行き先の呼び名が、場所ごとに違う（導線）

- ヘッダーは「会社情報」、フッターとセクションの見出しは「会社概要」である。パンくずの先頭は、取扱製品では「トップ」、お問い合わせでは「ホーム」である。
  - `apps/corporate-site/src/components/common/SiteHeader.astro:30-36` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteHeader.astro#L30-L36)
  - `apps/corporate-site/src/components/common/SiteFooter.astro:61-63` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteFooter.astro#L61-L63)
  - `apps/corporate-site/src/components/sections/products-detail/ProductsHero.astro:12-16` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsHero.astro#L12-L16)
  - `apps/corporate-site/src/components/sections/contact/ContactSection.astro:8-12` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/contact/ContactSection.astro#L8-L12)
- どちらの語にそろえるかは、文言の変更に当たるので、運営者が決める（[spec の本文](index.md) の Open Points）。

### 下層のページのフッターに、ほかのページへのリンクがない（導線）

- 取扱製品とお問い合わせのフッターは、会社名、電話、住所だけを持つ。ページの末尾からほかのページへ進むには、ヘッダーまで戻る。
  - `apps/corporate-site/src/components/common/SiteFooter.astro:18-36` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteFooter.astro#L18-L36)

### 写真の上の「イメージ」のラベルと、顔写真の枠が、仮の表示に見える（読みやすさ）

- 事業の紹介の写真は、「取扱製品イメージ」「加工イメージ」のラベルを重ねる。代表の挨拶は、「顔写真」と書いた枠を示す。
  - `apps/corporate-site/src/components/sections/business/BusinessFeatureRow.astro:100-102` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/business/BusinessFeatureRow.astro#L100-L102)
  - `apps/corporate-site/src/components/sections/company/CompanySection.astro:82-92` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/company/CompanySection.astro#L82-L92)
- 写真と文言の差し替えは、この要求の範囲の外である。置き方だけを、改善案で扱う。

## 構成の課題

`apps/corporate-site/src/` の中で、セクションを足す、並べ替える、ページを足すときに困る点を、重要な順に並べる。

### 文言と連絡先が、content 層の外の 9 つのファイルに直接書いてある

- `context/codebase.md` は、文言とリストを content 層に置くと決めている。次のファイルは、見出し、リード、連絡先をコンポーネントに直接書いている。
  - `apps/corporate-site/src/components/sections/contact/ContactSection.astro:13-54` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/contact/ContactSection.astro#L13-L54)
  - `apps/corporate-site/src/components/sections/company/CompanySection.astro:8-30` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/company/CompanySection.astro#L8-L30)
  - `apps/corporate-site/src/components/sections/company/CompanySection.astro:87-115` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/company/CompanySection.astro#L87-L115)
  - `apps/corporate-site/src/components/sections/products-detail/ProductsHero.astro:17-25` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsHero.astro#L17-L25)
  - `apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro:67-107` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro#L67-L107)
  - `apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro:35-40` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro#L35-L40)
  - `apps/corporate-site/src/components/common/SiteFooter.astro:46-48` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteFooter.astro#L46-L48)
  - `apps/corporate-site/src/components/sections/hero/Hero.astro:52-54` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/hero/Hero.astro#L52-L54)
  - `apps/corporate-site/src/components/sections/consultation/ConsultationSection.astro:42-47` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/consultation/ConsultationSection.astro#L42-L47)
  - `apps/corporate-site/src/components/common/SiteHeader.astro:14-37` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteHeader.astro#L14-L37)
- `/contact` へのリンクの文言は、「お見積り・お問い合わせ」「お問い合わせ」「お問い合わせ・お見積り」「製品について相談する」の 4 通りある。
- 電話と FAX の番号は、`content/contact.ts`、`content/company.ts` の `rows`、`CompanySection.astro` の 115 行、`ContactSection.astro` の 4 か所にある。番号が変わると 4 か所を直す。
- `content/contact.ts` の `contactInfo.rows` は、どのコンポーネントも使っていない。お問い合わせのページは、同じ内容を直接書いている。
  - `apps/corporate-site/src/content/contact.ts:8-23` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/content/contact.ts#L8-L23)
- セクションを別のページに移すとき、文言をコンポーネントから取り出す作業が先に要る。

### セクションの番号を、4 つのファイルに直接書いている

- 番号 00〜03 は、content の 2 ファイルと、コンポーネントの 2 ファイルにある。セクションを並べ替えるか足すと、4 つのファイルの番号を直す。
  - `apps/corporate-site/src/content/consultation.ts:3` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/content/consultation.ts#L3)
  - `apps/corporate-site/src/content/business.ts:6` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/content/business.ts#L6)
  - `apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro:36` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro#L36)
  - `apps/corporate-site/src/components/sections/company/CompanySection.astro:20` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/company/CompanySection.astro#L20)
- 番号は並び順で決まる値なので、並べる側（ページ）が持つのが自然である。

### ページの組み方が、トップと下層でそろっていない

- トップは、ページが 5 つのセクションを並べる。取扱製品は、ページが 1 つのセクションだけを置き、その中に hero、索引と一覧、問い合わせの帯の 3 つの `section` 要素がある。
  - `apps/corporate-site/src/pages/products.astro:11` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/pages/products.astro#L11)
  - `apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro:62-114` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro#L62-L114)
- 問い合わせの帯は `ProductsDetailSection` の中にあるので、トップの末尾に置けない。section の間の import は禁じている。
- ページの見出しの部分（パンくず、eyebrow、h1、リード）は、`ProductsHero` と `ContactSection` が別々に書いている。ページを足すと、3 つ目の書き方ができる。パンくずも 2 か所に別々にある。

### セクションの外枠（面、余白、幅）を、セクションごとに書き写している

- セクションはどれも、`mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-14` と縦の余白、面の色を、自分で書いている。下の罫線は、書くセクションと書かないセクションがある。縦の余白は `py-14 md:py-20`、`md:py-18`、`pb-18 pt-12`、`py-12 md:py-16` と、少しずつ違う。
  - `apps/corporate-site/src/components/sections/consultation/ConsultationSection.astro:6-11` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/consultation/ConsultationSection.astro#L6-L11)
  - `apps/corporate-site/src/components/sections/business/BusinessSection.astro:13-18` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/business/BusinessSection.astro#L13-L18)
  - `apps/corporate-site/src/components/sections/contact/ContactSection.astro:5-6` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/contact/ContactSection.astro#L5-L6)
- 面の色をセクションが自分で決めるので、並べ替えると同じ面が続く。今も、相談の内容と事業の紹介は、どちらも `bg-surface` である。Design Doc は、明るい面を交互に置くと決めている。
- eyebrow と h3 の組は、`CompanySection` だけで 3 回、同じクラスで書き写している。`SectionHeading` は h2 の形だけを持つ。
  - `apps/corporate-site/src/components/sections/company/CompanySection.astro:40-47` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/company/CompanySection.astro#L40-L47)

### セクションのスタイルが、664 行の 1 つのファイルにまとまっている

- `styles/components.css` は、hero、事業、相談、カルーセル、索引、アコーディオン、ナビ、フッターのクラスを 1 つのファイルに持つ。セクションを消しても、スタイルが残っていることに気づけない。セクションを足すと、離れたファイルにクラスを足す。
  - `apps/corporate-site/src/styles/components.css:1-664` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/styles/components.css#L1-L664)
- `context/codebase.md` は、このファイルを cva と utility へ移して減らし、最後は消すと決めている。移す順は決まっていない。

### reveal の対象を、共通の layout がセクションのクラス名で持っている

- `BaseLayout` のスクリプトは、`.consultation-case`、`.business-row`、`.featured-category-card`、`.catalog-board`、`.custom-order-panel` を名指しする。セクションを足して reveal を付けるには、`common/` の layout を直す。
  - `apps/corporate-site/src/components/common/BaseLayout.astro:42-45` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/BaseLayout.astro#L42-L45)
- import ではないので、section の境界のチェックは検出しない。`common` が `sections` の中身を知っている。

### ナビの項目を、ヘッダーとフッターが別々に持っている

- ヘッダーは `navItems` の配列を、フッターはリンクを 4 つ直接書いている。ページかアンカーを足すと 2 か所を直す。ラベルの違いは、ここから生じている。
  - `apps/corporate-site/src/components/common/SiteHeader.astro:14-37` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteHeader.astro#L14-L37)
  - `apps/corporate-site/src/components/common/SiteFooter.astro:51-67` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/common/SiteFooter.astro#L51-L67)

### 写真と内容を、配列の順で対応づけている

- `BusinessSection` は、写真の配列と `features` の配列を、同じ添字で対応づける。`features` の順を変えるか、行を足すと、写真がずれる。
  - `apps/corporate-site/src/components/sections/business/BusinessSection.astro:8-38` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/business/BusinessSection.astro#L8-L38)

### testid がページの名前を含み、セクションを移すと名前が合わなくなる

- セクションは `home-section-business` のように、載るページの名前を testid に直接持つ。セクションを別のページに移すと、testid か E2E の selectors を直す。
  - `apps/corporate-site/src/components/sections/business/BusinessSection.astro:16` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/business/BusinessSection.astro#L16)
- testid の名前の規則は `context/testing/e2e.md` にあるので、変えるなら E2E の要求と合わせる。

### カテゴリとメーカーの数の集計を、2 つのセクションが別々に書いている

- `ProductsCategorySection` と `ProductsDetailSection` は、同じ collection を読み、カテゴリごとのメーカーの数を別々に計算する。
  - `apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro:7-13` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-category/ProductsCategorySection.astro#L7-L13)
  - `apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro:10-36` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro#L10-L36)

### 取扱製品のスクリプトが、3 つのコンポーネントの属性に依存している

- 検索、開閉、現在地の表示のスクリプトは `ProductsDetailSection` にあり、`ProductsSidebarNav` と `ProductsCategoryAccordionList` の `data-*` と id に依存する。依存はコメントで書いてあるが、チェックはない。
  - `apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro:116-124` / [GitHub](https://github.com/Fukuemon/kufu-apps/blob/6beb42f461260fc53745cfb172cfcb3a0a6e4001/apps/corporate-site/src/components/sections/products-detail/ProductsDetailSection.astro#L116-L124)
