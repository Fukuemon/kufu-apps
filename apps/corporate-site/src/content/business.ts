import { companyProfileSource } from "./source-references.js";

export const businessContent = {
  sourceReferences: [companyProfileSource],
  heading: {
    number: "01",
    eyebrow: "BUSINESS / 事業内容",
    title: "販売と加工、二つの柱",
    description:
      "必要な「もの」を確かなメーカー網で届ける販売と、図面・現物一個から請け負う加工。\n仕入れから特注対応まで一社で完結します。",
  },
  features: [
    {
      number: "01",
      eyebrow: "BUSINESS 01 / SALES & SUPPLY",
      title: "見積もり・販売",
      description:
        "機械工具から省力化機器まで、延べ約320社の取扱メーカーから現場に必要な製品を調達し供給する。",
      items: [
        "機械工具",
        "省力化機器",
        "伝動機器",
        "物流 / 搬送機器",
        "各種工場設備機器",
      ],
      mediaLabel: "取扱製品イメージ",
      mediaCaption: "工場設備機器の販売領域",
      mediaPosition: "right",
    },
    {
      number: "02",
      eyebrow: "BUSINESS 02 / MACHINING & CUSTOM",
      title: "加工",
      description:
        "図面一枚、現物一個から。別作・特注の加工を一括して請け負う。",
      items: ["各種機械加工", "樹脂加工", "板金・溶接加工", "各種ゴム製品加工"],
      mediaLabel: "加工イメージ",
      mediaCaption: "加工相談の対応領域",
      mediaPosition: "left",
    },
  ],
  customOrder: {
    eyebrow: "CUSTOM ORDER",
    title: "別作・特注対応",
    items: [
      "ギヤー・プーリー・スプロケット他 軸穴キー加工",
      "別作ギヤー・プーリー・スプロケット製作",
      "別作ローラー製作",
      "別作マシンキー・バネ製作",
      "別作ゴム・ウレタンゴム・ライニング成型加工",
      "別作樹脂成型加工",
    ],
  },
} as const;
