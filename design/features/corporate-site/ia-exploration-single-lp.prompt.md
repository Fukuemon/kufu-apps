# corporate-site / IA 探索 — 単一 LP 案 — Claude Design prompt

> design-workflow Phase A0 ([context/design-workflow.md](../../../context/design-workflow.md) §3)。issue #17 (corporate-site IA 再検討) の方向案「単一 LP」を Claude Design で発散させるための依頼文。
> 下の **「依頼文 (投入用)」だけ** を Claude Design に貼る。配色・タイポ・コンポーネントはリンク済みデザインシステム (`packages/ui`) が自動適用するため、依頼文では生の hex / CSS 変数名 / repo パスを書かず、ブランドトークンを役割名 (surface / foreground / accent) で参照する (Claude Design ベストプラクティス: 値のハードコードでなくデザインシステムを名前で参照)。トークンの実値・リンク設定・出力先は「運用メモ」に分離 (Claude Design には貼らない)。

## 依頼文 (投入用 / 密な1段落で書く)

製造業向け商社「有限会社フクウラ」のコーポレートサイトを、全情報を 1 ページの長スクロール LP に集約した **単一 LP 案** として作りたい (目的: 情報設計を最小化し、入口 1 枚で訴求と信頼性を成立させられるかを検証する)。配色・タイポ・コンポーネントはリンク済みデザインシステムのものをそのまま使い、基調はブランドの surface トーン (温かみのあるオフホワイト)、本文はブランドの foreground (落ち着いたダークグレー)、CTA とアクセントはブランドの accent (ティールグリーン) を当て、角丸と書体 (Geist 系の humanist sans) もデザインシステムのトークンに従う。製造業 B2B らしい清潔で堅実な質感にし、汎用 AI 然とした既定 (紫グラデ・Inter/Roboto・過度な装飾) は避ける。レイアウトは固定追従の `SiteHeader` (ロゴ + セクションアンカーナビ + 右端に問い合わせ CTA ボタン) → `Hero` (経営理念「『創意』と『誠意』で真心奉仕」を主見出しに、販売×加工の二本柱を一文要約 + 問い合わせ CTA) → `BusinessSection` (見積もり・販売 と 加工 を 2 カラムで対比) → `ProductCategoryGrid` (取扱製品 18 カテゴリをカード grid で網羅提示) + 代表 `ManufacturerList` (カテゴリ→代表メーカーの抜粋) → `CompanyProfile` (会社概要 / 経営理念 / 沿革 / 代表挨拶 / アクセス・地図) → `ContactBlock` (連絡先 + 問い合わせフォーム枠) → `SiteFooter` (会社概要要約 + 連絡先) とし、ナビは同一ページ内のアンカー遷移で構成する。content は実コンテンツで、会社名「有限会社フクウラ」/ 経営理念「『創意』と『誠意』で真心奉仕」/ 創立 1996 年 (平成 8 年) / 所在地 〒675-1114 兵庫県加古郡稲美町国康 973-10 / TEL 079-492-6465・FAX 079-492-6429・Eメール fukuura@mist.ocn.ne.jp、事業二本柱は見積もり・販売 (機械工具 / 省力化機器 / 伝動機器 / 物流・搬送機器 / 各種工場設備機器) と 加工 (各種機械加工 / 樹脂成型加工 / 板金・溶接加工 / 各種ゴム製品加工)、取扱製品は 18 カテゴリ (駆動・変減速機器 / 軸受・直動機器 / 自動化・省力化機器 …〜… 作業工具 / 材料・ボルト関連) と取扱メーカー 延べ約 320 社 (カテゴリ→代表メーカー構成) を使う (ダミーテキストは使わない)。audience は製造業の取引先 (購買・技術担当) を主、採用候補を従とし、堅実さと取扱網羅性で信頼を得るトーン。Astro 静的生成・最小 island で実装する前提に合わせ、クライアント JS に依存しない構造で desktop と mobile の両レイアウトを出す。empty / loading / error に加え、取扱製品カテゴリが 18 区分フルの場合と抜粋の場合、メーカー数の多寡、沿革・代表挨拶が未確定で placeholder になる場合のデータ量違いも示す。出力は standalone HTML で、この単一 LP 方向の中での視覚バリエーション (hero の見せ方・情報密度・セクション配置の違い) を 2〜3 案並べて比較できるようにする。

## 運用メモ (Claude Code 用 / Claude Design には貼らない)

- **design system link**: Claude Design の Import で `packages/ui` (+ 必要なら `apps/corporate-site`) **だけ** をリンクする (モノレポ全体・`.git`・`node_modules` は含めない)。これにより下記トークンが自動適用される。
- **画像添付 (Claude Design / 任意)**: パンフレット表紙 `.ai-out/企業情報/パンフレット/1.jpg` と裏表紙 `6.jpg` を添付し、**FUKUURA ロゴ・歯車モチーフ・実直なブランド性格・実コンテンツのスケール**の参照に限定する (取扱網羅感は `3.jpg` を代表に任意追加)。**配色・タイポはデザインシステム優先**で、パンフレットの 1990 年代風の青グレーグラデや A4 印刷レイアウトは再現せず、現代的な web IA に再解釈させる。※ `.ai-out/` は未追跡スクラッチ。ロゴを正式素材化するなら後段で `reference/` か `images/` に整理する。
- **トークン正本** ([packages/ui/globals.css](../../../packages/ui/src/styles/globals.css)、依頼文に値は書かず参照のみ): surface #fffdf8 / foreground #1f2937 / accent #0f766e / border #d9d5cc / radius 6-12-16px (sm/md/lg) / font Geist Variable。
- **コンテンツ正本**: [reference/company-profile.md](reference/company-profile.md) / [reference/manufacturers.md](reference/manufacturers.md)。**IA 正本**: [DesignDoc_corporate-site.md](DesignDoc_corporate-site.md)。
- **出力**: 採用案を Export (standalone HTML) し `design/.staging/` (gitignore) に保存。HTML は正本にしない (phase B で `.pen` 化)。
- **コンポーネント名**は他の方向案 prompt と共通 (`SiteHeader` / `SiteFooter` / `Hero` / `BusinessSection` / `ProductCategoryGrid` / `ManufacturerList` / `CompanyProfile` / `ContactBlock`)。import / 実装まで一貫させる。
- 参照例 (任意):
- 確定した方向性 (A で更新):
