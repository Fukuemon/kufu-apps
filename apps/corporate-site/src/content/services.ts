import { companyProfileSource } from "./source-references.js";

export const servicePillars = [
  {
    sourceReferences: [companyProfileSource],
    number: "01",
    title: "見積もり・販売",
    lead: "機械工具、省力化機器、伝動機器、物流・搬送機器、各種工場設備機器を扱います。",
  },
  {
    sourceReferences: [companyProfileSource],
    number: "02",
    title: "加工",
    lead: "各種機械加工、樹脂成型加工、板金・溶接加工、各種ゴム製品加工に対応します。",
  },
] as const;
