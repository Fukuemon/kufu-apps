import ContactBand from "./ContactBand.astro";
import { contactPageContent } from "../../content/contact.js";
import { productsContactBandContent } from "../../content/products.js";

const meta = {
  title: "Common/ContactBand",
  component: ContactBand,
};

export default meta;

export const Home = {
  args: {
    title: contactPageContent.title,
    lead: contactPageContent.lead,
    "data-testid": "home-section-contact-band",
  },
};

export const Products = {
  args: {
    title: productsContactBandContent.title,
    lead: productsContactBandContent.lead,
    "data-testid": "products-section-contact-band",
  },
};
