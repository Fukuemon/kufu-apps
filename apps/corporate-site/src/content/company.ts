import { companyProfileSource } from "./source-references.js";

const postalCode = "〒675-1114";
const streetAddress = "兵庫県加古郡稲美町国安973番地の10";

export const companyProfile = {
  sourceReferences: [companyProfileSource],
  name: "有限会社フクウラ",
  tagline: "機械工具と関連機器 / 販売・加工",
  postalCode,
  streetAddress,
  founded: "1996年（平成8年）6月",
  capital: "300万円",
  representative: "代表取締役 福浦 崇志",
  address: `${postalCode} ${streetAddress}`,
  philosophy: "「創意」と「誠意」で真心奉仕",
  rows: [
    ["会社名", "有限会社フクウラ"],
    ["代表者", "代表取締役 福浦 崇志"],
    ["資本金", "300万円"],
    [
      "事業内容",
      "機械工具・関連機器の販売／各種機械加工・樹脂成型・板金溶接・ゴム製品加工",
    ],
    ["創立", "1996年（平成8年）6月"],
    ["所在地", `${postalCode} ${streetAddress}`],
    ["電話 / FAX", "TEL 079-492-6465 ／ FAX 079-492-6429"],
    ["E-mail", "fukuura@mist.ocn.ne.jp"],
  ],
  philosophyLead:
    "創意工夫と誠実な対応で、お客様の信頼に応える。\n創業以来変わらない、私たちの仕事の指針です。",
  greeting:
    "当社は機械工具と関連機器の販売、そして別作・特注の加工を通じて、\n製造業のお客様のものづくりを支えてまいりました。\n「創意」と「誠意」で真心奉仕。\nこの理念のもと、確かな製品供給と柔軟な加工対応で、現場一つひとつの課題に向き合います。",
} as const;
