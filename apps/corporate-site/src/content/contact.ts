import { companyProfileSource } from "./source-references.js";

export const contactInfo = {
  sourceReferences: [companyProfileSource],
  tel: "079-492-6465",
  fax: "079-492-6429",
  email: "fukuura@mist.ocn.ne.jp",
  rows: [
    {
      label: "TEL",
      value: "079-492-6465",
      href: "tel:0794926465",
    },
    {
      label: "FAX",
      value: "079-492-6429",
    },
    {
      label: "E MAIL",
      value: "fukuura@mist.ocn.ne.jp",
      href: "mailto:fukuura@mist.ocn.ne.jp",
    },
  ],
} as const;
