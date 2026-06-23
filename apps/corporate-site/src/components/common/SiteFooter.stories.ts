import SiteFooter from "./SiteFooter.astro";

const meta = {
  title: "Corporate Site/Common/SiteFooter",
  component: SiteFooter,
};

export default meta;

export const Compact = {
  args: {
    variant: "compact",
  },
};

export const Full = {
  args: {
    variant: "full",
  },
};
