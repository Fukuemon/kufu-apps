import SectionHeadingPresentation from "./SectionHeadingPresentation.astro";

const meta = {
  title: "CorporateSite/SectionHeading",
  component: SectionHeadingPresentation,
};

export default meta;

export const Default = {
  args: {
    number: "01",
    eyebrow: "Products",
    title: "製造現場を支える機器を、用途から探す",
    description:
      "駆動・変減速機器から搬送・省力化機器まで、現場の課題に合わせて最適な製品カテゴリを確認できます。",
  },
};

export const Center = {
  args: {
    eyebrow: "Contact",
    title: "加工や部品調達の相談を受け付けています",
    description:
      "図面や仕様が固まりきっていない段階でも、必要な条件整理から相談できます。",
    align: "center",
  },
};
