import FeaturedCategoryCarousel from "./FeaturedCategoryCarousel.astro";

const categories = [
  {
    id: "drive-reducers",
    collection: "productCategories",
    data: {
      id: "drive-reducers",
      order: 1,
      name: "駆動・変減速機器",
      summary: "モーター、変減速機、制御機器など駆動系の主要機器。",
      groupId: "drive-transmission",
      featuredImage:
        "https://images.unsplash.com/photo-1723022323088-ca3d68fae5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      sourceReferences: [
        "design/features/corporate-site/reference/company-profile.md",
      ],
    },
  },
] as const;

const meta = {
  title: "Products/FeaturedCategoryCarousel",
  component: FeaturedCategoryCarousel,
};

export default meta;

export const Default = {
  args: {
    categories,
    makerCountsByCategoryId: { "drive-reducers": 17 },
  },
};
