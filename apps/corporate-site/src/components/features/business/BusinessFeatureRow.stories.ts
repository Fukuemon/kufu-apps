import BusinessFeatureRow from "./BusinessFeatureRow.astro";

const meta = {
  title: "Business/BusinessFeatureRow",
  component: BusinessFeatureRow,
};

export default meta;

export const MediaRight = {
  args: {
    number: "01",
    eyebrow: "BUSINESS 01 / SALES & SUPPLY",
    title: "金属加工の相談を、初期段階から伴走",
    description:
      "小ロットの試作から継続生産まで、仕様整理と加工条件の検討を並行して進めます。",
    items: ["材料選定の相談", "加工工程の検討", "納期と品質の調整"],
    mediaLabel: "Sales",
    mediaCaption: "図面・条件・納期を整理する初期相談",
    mediaPosition: "right",
  },
};

export const MediaLeft = {
  args: {
    number: "02",
    eyebrow: "BUSINESS 02 / MACHINING & CUSTOM",
    title: "精密加工の現場知見を、設計へ戻す",
    description:
      "加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整します。",
    items: ["切削条件の確認", "治具構成の検討", "検査観点の整理"],
    mediaLabel: "Machining",
    mediaCaption: "加工現場での条件確認",
    mediaPosition: "left",
  },
};
