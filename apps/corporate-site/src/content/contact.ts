import { companyProfileSource } from "./source-references.js";

const tel = "079-492-6465";
const fax = "079-492-6429";
const email = "fukuura@mist.ocn.ne.jp";

export const contactInfo = {
  sourceReferences: [companyProfileSource],
  tel,
  telHref: `tel:${tel.replaceAll("-", "")}`,
  fax,
  email,
  emailHref: `mailto:${email}`,
  telFax: `TEL ${tel} ／ FAX ${fax}`,
} as const;

export const contactPageContent = {
  breadcrumb: { home: "トップ", current: "お問い合わせ" },
  title: "お問い合わせ・お見積り",
  lead: "製品のお見積り、加工のご相談、掲載のないメーカー・製品のお取り寄せまで。お電話・FAX・メール・フォームよりお気軽にご連絡ください。",
  infoLabels: {
    tel: "Tel",
    fax: "Fax",
    email: "E-mail",
    address: "所在地",
  },
  notice: {
    hours: "受付時間 / 平日 9:00-18:00",
    estimate:
      "お見積りはお電話・FAX・メールでも承ります。図面がある場合はメール添付いただくとスムーズです。",
  },
} as const;

/** 問い合わせの帯の、ページによらない文言。見出しとリードは、帯を置くページが渡す。 */
export const contactBandContent = {
  cta: { label: "お見積り・お問い合わせ", href: "/contact" },
  telLabel: "TEL",
  hours: contactPageContent.notice.hours,
} as const;
