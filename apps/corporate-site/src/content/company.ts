import { contactInfo } from "./contact.js";
import { companyProfileSource } from "./source-references.js";

const postalCode = "〒675-1114";
const streetAddress = "兵庫県加古郡稲美町国安973番地の10";

export const companyProfile = {
  sourceReferences: [companyProfileSource],
  name: "有限会社フクウラ",
  nameRoman: "FUKUURA",
  footerSummary:
    "機械工具と関連機器の販売、各種別作加工、小規模工事。兵庫県加古郡稲美町より、製造現場の調達と加工、設備の工事を支えます。",
  tagline: "機械工具と関連機器 / 販売・加工・小規模工事",
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
      "機械工具・関連機器の販売／各種機械加工・樹脂成型・板金溶接・ゴム製品加工／小規模工事",
    ],
    ["創立", "1996年（平成8年）6月"],
    ["所在地", `${postalCode} ${streetAddress}`],
    ["電話 / FAX", contactInfo.telFax],
    ["E-mail", contactInfo.email],
  ],
  heading: {
    eyebrow: "COMPANY / 会社概要",
    title: "会社概要",
  },
  philosophyEyebrow: "PHILOSOPHY / 経営理念",
  profileSection: { eyebrow: "PROFILE / 基本情報", title: "基本情報" },
  messageSection: { eyebrow: "MESSAGE / 代表挨拶", title: "ご挨拶" },
  portraitPlaceholder: "顔写真",
  representativeName: "福浦 崇志",
  representativeTitle: "代表取締役",
  accessSection: { eyebrow: "ACCESS / アクセス", title: "アクセス" },
  mapTitle: "有限会社フクウラ 所在地の地図",
  philosophyLead:
    "創意工夫と誠実な対応で、お客様の信頼に応える。\n創業以来変わらない、私たちの仕事の指針です。",
  // 段落ごとの本文。強調したい区間だけ emphasis を立てる (出典の太字指定を保持するため)
  greeting: [
    [
      {
        text: "　有限会社フクウラは創業30年、機械工具・関連機器の販売をはじめ、各種機械加工や小規模工事を通じて、お客様のものづくりを支えてまいりました。",
      },
    ],
    [
      { text: "企業理念である" },
      { text: "「『創意』と『誠意』で真心奉仕」", emphasis: true },
      {
        text: "を経営の原点とし、お客様にとって最適なご提案と確かな技術・サービスをご提供することを使命としております。",
      },
    ],
    [
      {
        text: "私は二代目として事業を引き継ぎ、創業者が築いてきた信頼と実績を大切に守りながら、新しい発想や柔軟な対応を取り入れ、これからの時代にも必要とされる会社を目指してまいります。",
      },
    ],
    [
      {
        text: "従業員5名という少数精鋭の体制だからこそ、小回りの利く対応力と、お客様との距離の近さを強みとし、一つひとつのご依頼に責任を持って取り組んでおります。",
      },
    ],
    [
      {
        text: "これからも「創意」と「誠意」を胸に、真心を込めたサービスを通じて、お客様に信頼され、地域社会に貢献できる企業であり続けられるよう、社員一同努力を重ねてまいります。",
      },
    ],
  ],
} as const;
