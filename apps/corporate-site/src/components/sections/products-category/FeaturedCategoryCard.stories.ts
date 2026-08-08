import FeaturedCategoryCard from "./FeaturedCategoryCard.astro";

const meta = {
  title: "Sections/ProductsCategory/FeaturedCategoryCard",
  component: FeaturedCategoryCard,
};

export default meta;

export const Default = {
  args: {
    category: "CATEGORY 01",
    count: "17社",
    title: "駆動・変減速機器",
  },
};

export const WithoutCount = {
  args: {
    category: "CATEGORY 02",
    title: "搬送・省力化機器",
  },
};

export const LongTitle = {
  args: {
    category: "CATEGORY 18",
    count: "102社",
    title: "空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式",
  },
};
