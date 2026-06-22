import FeaturedCategoryCard from "./FeaturedCategoryCard.astro";

const meta = {
  title: "Products/FeaturedCategoryCard",
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
