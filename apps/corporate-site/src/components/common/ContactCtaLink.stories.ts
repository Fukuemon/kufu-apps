import ContactCtaLink from "./ContactCtaLink.astro";

const meta = {
  title: "Common/ContactCtaLink",
  component: ContactCtaLink,
};

export default meta;

export const Sm = {
  args: {
    href: "/contact",
    size: "sm",
    slots: { default: "相談する" },
  },
};

export const Hero = {
  args: {
    href: "/contact",
    size: "hero",
    slots: { default: "加工・調達の相談をする" },
  },
};

export const Lg = {
  args: {
    href: "/contact",
    size: "lg",
    slots: { default: "問い合わせフォームへ" },
  },
};

export const LongLabel = {
  args: {
    href: "/contact",
    size: "lg",
    slots: {
      default:
        "図面が固まっていない段階の加工・部品調達の相談を受け付けています",
    },
  },
};
