import ProductsCategoryAccordionList from "./ProductsCategoryAccordionList.astro";

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

const makers = (categoryId: string, makerNames: string[]) => ({
  id: `${categoryId}-makers`,
  collection: "categoryMakers" as const,
  data: {
    id: `${categoryId}-makers`,
    categoryId,
    order: 1,
    categoryName: categoryId,
    makers: makerNames,
    sourceReferences: [
      "design/features/corporate-site/reference/company-profile.md",
    ],
  },
});

const categoryGroups = [
  {
    eyebrow: "CATEGORY 01–01",
    title: "駆動・伝動",
    items: [
      {
        category: category("drive-reducers", 1, "駆動・変減速機器"),
        makers: makers("drive-reducers", [
          "株式会社サンプルA",
          "株式会社サンプルB",
        ]),
      },
    ],
  },
];

const meta = {
  title: "Sections/ProductsDetail/ProductsCategoryAccordionList",
  component: ProductsCategoryAccordionList,
};

export default meta;

export const Default = {
  args: {
    categoryGroups,
  },
};

export const EmptyMakers = {
  args: {
    categoryGroups: [
      {
        eyebrow: "CATEGORY 99",
        title: "掲載メーカー準備中",
        items: [
          {
            category: category("placeholder-category", 99, "準備中カテゴリ"),
            makers: makers("placeholder-category", []),
          },
        ],
      },
    ],
  },
};
