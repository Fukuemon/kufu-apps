import SectionHeading from "./SectionHeading.astro";

const meta = {
  title: "Common/SectionHeading",
  component: SectionHeading,
};

export default meta;

export const Default = {
  args: {
    number: "01",
    eyebrow: "事業内容",
    title: "製造現場を支える機器を、用途から探す",
    description:
      "駆動・変減速機器から搬送・省力化機器まで、現場の課題に合わせて最適な製品カテゴリを確認できます。",
  },
};

export const Center = {
  args: {
    eyebrow: "ご相談内容",
    title: "加工や部品調達の相談を受け付けています",
    description:
      "図面や仕様が固まりきっていない段階でも、必要な条件整理から相談できます。",
    align: "center",
  },
};

export const Minimal = {
  args: {
    title: "タイトルのみの最小構成",
  },
};

export const LongText = {
  args: {
    number: "18",
    eyebrow: "取扱製品・取扱メーカー",
    title:
      "見出しが複数行に折り返される長さになった場合の行間と字間を確認するための冗長なタイトル",
    description:
      "説明文が長文になった場合の折り返しと、見出しとの間隔・最大幅の制約を確認する。図面や仕様が固まりきっていない段階でも、必要な条件整理から相談できることを繰り返し述べて長さを確保している。",
  },
};
