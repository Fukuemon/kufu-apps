import SiteHeader from "./SiteHeader.astro";

const meta = {
  title: "Corporate Site/Common/SiteHeader",
  component: SiteHeader,
};

export default meta;

export const Home = {
  args: {
    currentPath: "/",
  },
};

export const Products = {
  args: {
    currentPath: "/products",
  },
};

export const Contact = {
  args: {
    currentPath: "/contact",
  },
};
