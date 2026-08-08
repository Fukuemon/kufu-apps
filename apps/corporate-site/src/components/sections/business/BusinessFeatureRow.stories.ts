import BusinessFeatureRow from "./BusinessFeatureRow.astro";

const meta = {
  title: "Sections/Business/BusinessFeatureRow",
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

export const LongContent = {
  args: {
    number: "03",
    eyebrow: "BUSINESS 03 / LONG CONTENT EDGE CASE FOR CATALOG REVIEW",
    title:
      "長い見出しが複数行に折り返されるケースを確認するための、意図的に冗長なタイトル表現の確認",
    description:
      "説明文が長文になった場合の行間・折り返し・メディア領域との高さバランスを確認する。仕様整理と加工条件の検討を並行して進め、量産を見据えた形状・工程へ調整し、検査観点の整理までを一気通貫で扱う想定の文章を長さ確認のために連ねている。",
    items: [
      "材料選定の相談と代替材の検討",
      "加工工程の検討と治具構成の見直し",
      "納期と品質の調整",
      "検査観点の整理と記録様式の統一",
      "量産移行時の条件固定",
    ],
    mediaLabel: "Edge",
    mediaCaption: "長文時のレイアウト確認",
    mediaPosition: "right",
  },
};

export const Minimal = {
  args: {
    eyebrow: "BUSINESS",
    title: "最小構成",
    description: "number と image を省略した最小構成。",
    items: ["項目 1"],
    mediaLabel: "Min",
    mediaCaption: "画像なしプレースホルダ",
    mediaPosition: "left",
  },
};
