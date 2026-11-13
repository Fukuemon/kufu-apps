import FeaturedCategoryCard from "./FeaturedCategoryCard.astro";

const meta = {
  title: "Sections/ProductsCategory/FeaturedCategoryCard",
  component: FeaturedCategoryCard,
};

export default meta;

export const Default = {
  args: {
    category: "01",
    count: "17社",
    title: "駆動・変減速機器",
    href: "/products#drive-reducers",
  },
};

export const WithoutCount = {
  args: {
    category: "02",
    title: "搬送・省力化機器",
    href: "/products#automation-labor-saving",
  },
};

export const LongTitle = {
  args: {
    category: "18",
    count: "102社",
    title: "空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式",
    href: "/products#pneumatic-hydraulic",
  },
};
