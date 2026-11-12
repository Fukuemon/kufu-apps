export const productsCategoryContent = {
  heading: {
    eyebrow: "PRODUCTS & MAKERS / 取扱製品・取扱メーカー",
    title: "取扱製品カテゴリ",
    description:
      "減速機や軸受などの駆動・伝動部品から、空圧・油圧、工具、測定機器、工場設備まで。\n調達のご相談に応える領域を18のカテゴリに整理しています。",
  },
  summaryCta: {
    text: "各カテゴリの取扱メーカー一覧は、取扱製品ページに掲載しています。",
    label: "取扱製品ページへ →",
    href: "/products",
  },
} as const;

export const productsHeroContent = {
  breadcrumb: { home: "トップ", current: "取扱製品" },
  eyebrow: "PRODUCTS & MAKERS",
  title: "製造現場に必要な製品を、確かなメーカー網で。",
  lead: "駆動・伝動、空圧・油圧、工具、測定、搬送、工場設備まで。全18カテゴリ・延べ約320社の取扱メーカーから、製品の選定と調達に応えます。",
  primaryCta: { label: "製品について相談する", href: "/contact" },
  secondaryCta: {
    label: "カテゴリ一覧を見る",
    href: "#products-category-list",
  },
  imageAlt: "機械工具・関連機器",
  mediaCaption: {
    title: "機械工具・関連機器",
    sub: "駆動・伝動 / 工具・測定 / 搬送 / 工場設備",
  },
} as const;

export const productsIndexContent = {
  eyebrow: "CATEGORY INDEX",
  title: "取扱製品カテゴリ",
  lead: "製造現場の調達で相談が多い領域を18のカテゴリに整理し、各カテゴリの取扱メーカーを一覧にまとめています。",
} as const;

export const productsContactBandContent = {
  eyebrow: "MAKER SEARCH",
  title: "掲載のないメーカー・型番も確認します。",
  lead: "メーカー名、型番、数量、希望納期が分かる場合は、問い合わせ時にご記入ください。代替品や別作加工の可否も含めて確認します。",
  cta: { label: "お問い合わせ・お見積り", href: "/contact" },
} as const;
