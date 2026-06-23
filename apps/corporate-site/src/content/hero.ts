import { companyProfileSource } from "./source-references.js";

export const heroContent = {
  sourceReferences: [companyProfileSource],
  eyebrow: "FUKUURA INDUSTRIAL SUPPLY",
  title: "「創意」と「誠意」で真心奉仕",
  lead: "機械工具、省力化機器、伝動機器、物流・搬送機器から各種加工まで。工場の調達・保全・改善を、販売と加工の両面から支えます。",
  primaryCta: {
    label: "お問い合わせ",
    href: "/contact",
  },
  secondaryCta: {
    label: "取扱製品を見る",
    href: "/products",
  },
} as const;
