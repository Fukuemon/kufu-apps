import ProductsDetailSection from "./ProductsDetailSection.astro";

// VRT は既定で viewport の高さを最小にして内容の高さに合わせる (.storybook/test-runner.ts)。
// 内包する ProductsSidebarNav は calc(100vh - 18rem) で一覧の高さを決めるため、最小の高さだと潰れる。
const vrt = { viewport: { width: 1280, height: 800 } };

const meta = {
  title: "Sections/ProductsDetail/ProductsDetailSection",
  component: ProductsDetailSection,
  parameters: { vrt },
};

export default meta;

export const Default = {
  args: {},
};
