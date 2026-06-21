import ContactInfoRowPresentation from "./ContactInfoRowPresentation.astro";

const meta = {
  title: "CorporateSite/ContactInfoRow",
  component: ContactInfoRowPresentation,
};

export default meta;

export const Tel = {
  args: {
    label: "Tel",
    value: "03-0000-0000",
    href: "tel:0300000000",
  },
};

export const Address = {
  args: {
    label: "所在地",
    value: "東京都千代田区丸の内 1-1-1",
  },
};
