import { companyProfileSource } from "./source-references.js";

export const companyProfile = {
  sourceReferences: [companyProfileSource],
  name: "有限会社フクウラ",
  founded: "1996 年 (平成 8 年) 6 月",
  capital: "300 万円",
  representative: "代表取締役 福浦 崇志",
  address: "〒675-1114 兵庫県加古郡稲美町国康 973-10",
  philosophy: "「創意」と「誠意」で真心奉仕",
  rows: [
    ["会社名", "有限会社フクウラ"],
    ["創立", "1996 年 (平成 8 年) 6 月"],
    ["資本金", "300 万円"],
    ["代表者", "代表取締役 福浦 崇志"],
    ["所在地", "〒675-1114 兵庫県加古郡稲美町国康 973-10"],
    ["TEL", "079-492-6465"],
    ["FAX", "079-492-6429"],
    ["E メール", "fukuura@mist.ocn.ne.jp"],
  ],
} as const;
