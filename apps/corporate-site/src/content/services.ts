import { companyProfileSource } from "./source-references.js";

export const servicePillars = [
  {
    sourceReferences: [companyProfileSource],
    title: "見積もり・販売",
    lead: "機械工具・駆動部品・省力化機器から、必要な製品の見積もり・調達に対応。",
  },
  {
    sourceReferences: [companyProfileSource],
    title: "加工",
    lead: "機械加工・樹脂成型・板金溶接・ゴム加工。別作・特注品に対応。",
  },
  {
    sourceReferences: [companyProfileSource],
    title: "小規模工事",
    lead: "設備修繕から更新、交換工事等各種小規模工事にも対応。",
  },
] as const;
