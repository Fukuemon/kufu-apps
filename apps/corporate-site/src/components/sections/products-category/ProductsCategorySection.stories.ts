import ProductsCategorySection from "./ProductsCategorySection.astro";

const meta = {
  title: "Sections/ProductsCategory/ProductsCategorySection",
  component: ProductsCategorySection,
};

export default meta;

export const Default = {
  args: { number: "02" },
};
