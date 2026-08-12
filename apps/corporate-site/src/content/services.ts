import { companyProfileSource } from "./source-references.js";

export const servicePillars = [
  {
    sourceReferences: [companyProfileSource],
    number: "01",
    title: "見積もり・販売",
    lead: "機械工具・駆動部品・省力化機器から、必要な製品の見積もり・調達に対応。",
  },
  {
    sourceReferences: [companyProfileSource],
    number: "02",
    title: "加工",
    lead: "機械加工・樹脂成型・板金溶接・ゴム加工。別作・特注品に対応。",
  },
] as const;
