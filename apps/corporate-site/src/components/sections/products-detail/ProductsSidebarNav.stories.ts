import ProductsSidebarNav from "./ProductsSidebarNav.astro";

const category = (id: string, order: number, name: string) => ({
  id,
  collection: "productCategories" as const,
  data: {
    id,
    order,
    name,
    summary: "",
    groupId: "drive-transmission",
    sourceReferences: [
      "design/features/corporate-site/reference/company-profile.md",
    ],
  },
});

const categoryGroups = [
  {
    eyebrow: "CATEGORY 01–02",
    title: "駆動・伝動",
    items: [
      { category: category("drive-reducers", 1, "駆動・変減速機器") },
      { category: category("bearings-linear-motion", 2, "軸受・直動機器") },
    ],
  },
];

const meta = {
  title: "Products/ProductsSidebarNav",
  component: ProductsSidebarNav,
};

export default meta;

export const Default = {
  args: {
    categoryGroups,
    makerCountById: { "drive-reducers": 17, "bearings-linear-motion": 19 },
  },
};
