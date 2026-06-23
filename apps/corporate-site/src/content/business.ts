import { companyProfileSource } from "./source-references.js";

export const businessContent = {
  sourceReferences: [companyProfileSource],
  heading: {
    number: "01",
    eyebrow: "BUSINESS",
    title: "販売と加工で、現場の要望に応える",
    description:
      "有限会社フクウラは、工場設備に関わる幅広い製品の見積もり・販売と、各種加工の相談を受け付けています。",
  },
  features: [
    {
      number: "01",
      eyebrow: "SUPPLY",
      title: "機械工具・省力化機器の見積もりと販売",
      description:
        "機械工具、省力化機器、伝動機器、物流・搬送機器、各種工場設備機器まで、現場に必要な品目を幅広く取り扱います。",
      items: [
        "機械工具",
        "省力化機器",
        "伝動機器",
        "物流 / 搬送機器",
        "各種工場設備機器",
      ],
      mediaLabel: "INDUSTRIAL SUPPLY",
      mediaCaption: "工場設備機器の販売領域",
      mediaPosition: "right",
    },
    {
      number: "02",
      eyebrow: "MACHINING",
      title: "各種加工の相談に対応",
      description:
        "機械加工、樹脂成型加工、板金・溶接加工、各種ゴム製品加工など、部品や治具の加工相談にも対応します。",
      items: [
        "各種機械加工",
        "樹脂成型加工",
        "板金・溶接加工",
        "各種ゴム製品加工",
      ],
      mediaLabel: "CUSTOM MACHINING",
      mediaCaption: "加工相談の対応領域",
      mediaPosition: "left",
    },
  ],
} as const;
