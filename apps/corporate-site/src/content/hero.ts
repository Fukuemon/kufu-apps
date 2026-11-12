import { companyProfileSource } from "./source-references.js";

export const heroContent = {
  sourceReferences: [companyProfileSource],
  // 見出しの改行位置は意図的。要素ごとに 1 行として描画する
  titleLines: ["機械工具の調達と、", "特注加工から現場工事まで"],
  lead: "兵庫・稲美町から、製造現場に必要な製品供給と現場改善を支えます。\n見積もりから調達、図面・現物一個からの加工相談まで、現場の困りごとに応えます。",
  imageAlt: "工場設備と加工相談のイメージ",
  mediaCaptionLines: [
    "機械工具・関連機器の調達",
    "別作加工 / 樹脂 / 板金溶接 / ゴム加工",
    "設備修繕 / 小規模工事",
  ],
  primaryCta: {
    label: "お見積り・お問い合わせ",
    href: "/contact",
  },
  secondaryCta: {
    label: "取扱製品を見る",
    href: "/products",
  },
} as const;
