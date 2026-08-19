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

// VRT は既定で viewport の高さを最小にして内容の高さに合わせる (.storybook/test-runner.ts)。
// このコンポーネントは calc(100vh - 18rem) で一覧の高さを決めるため、最小の高さだと潰れる。
const vrt = { viewport: { width: 1280, height: 800 } };

const meta = {
  title: "Sections/ProductsDetail/ProductsSidebarNav",
  component: ProductsSidebarNav,
  parameters: { vrt },
};

export default meta;

export const Default = {
  args: {
    categoryGroups,
    makerCountById: { "drive-reducers": 17, "bearings-linear-motion": 19 },
  },
};

export const LongNames = {
  args: {
    categoryGroups: [
      {
        eyebrow: "CATEGORY 17–18",
        title: "空圧・油圧・真空とその他周辺機器",
        items: [
          {
            category: category(
              "pneumatic-hydraulic-vacuum",
              17,
              "空圧・油圧・真空機器と関連する周辺制御機器一式",
            ),
          },
        ],
      },
    ],
    makerCountById: { "pneumatic-hydraulic-vacuum": 102 },
  },
};
