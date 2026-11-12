export const headerNavItems = [
  {
    href: "/",
    label: "トップ",
    subLabel: "TOP",
    testId: "site-nav-home",
    isPage: false,
  },
  {
    href: "/#business",
    label: "事業内容",
    subLabel: "BUSINESS",
    testId: "site-nav-business",
    isPage: false,
  },
  {
    href: "/products",
    label: "取扱製品",
    subLabel: "PRODUCTS",
    testId: "site-nav-products",
    isPage: true,
  },
  {
    href: "/#company",
    label: "会社情報",
    subLabel: "COMPANY",
    testId: "site-nav-company",
    isPage: false,
  },
] as const;

export const headerContactCta = {
  href: "/contact",
  label: "お問い合わせ",
  testId: "site-nav-contact",
} as const;

export const footerNav = {
  heading: "SITEMAP",
  items: [
    { href: "/#business", label: "事業内容" },
    { href: "/products", label: "取扱製品" },
    { href: "/#company", label: "会社概要" },
    { href: "/contact", label: "お問い合わせ・お見積り" },
  ],
} as const;
