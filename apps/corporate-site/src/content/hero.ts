import { companyProfileSource } from "./source-references.js";

export const heroContent = {
  sourceReferences: [companyProfileSource],
  eyebrow: "INDUSTRIAL SUPPLY & CUSTOM MACHINING",
  title: "機械工具の調達と、特注加工を一社で。",
  lead: "兵庫・稲美町から、製造現場に必要な製品供給と別作加工を支えます。\n見積もりから調達、図面・現物一個からの加工相談まで、現場の困りごとに応えます。",
  primaryCta: {
    label: "お見積り・お問い合わせ",
    href: "/contact",
  },
  secondaryCta: {
    label: "取扱製品を見る",
    href: "/products",
  },
} as const;
