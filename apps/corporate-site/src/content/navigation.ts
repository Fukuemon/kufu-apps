export const headerNavItems = [
  {
    href: "/",
    label: "トップ",
    testId: "site-nav-home",
    isPage: false,
  },
  {
    href: "/#business",
    label: "事業内容",
    testId: "site-nav-business",
    isPage: false,
  },
  {
    href: "/products",
    label: "取扱製品",
    testId: "site-nav-products",
    isPage: true,
  },
  {
    href: "/#company",
    label: "会社概要",
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
  items: [
    { href: "/#business", label: "事業内容" },
    { href: "/products", label: "取扱製品" },
    { href: "/#company", label: "会社概要" },
    { href: "/contact", label: "お問い合わせ・お見積り" },
  ],
} as const;
