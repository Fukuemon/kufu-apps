import { expect, test } from "@playwright/test";

import {
  contactEmailLink,
  contactFaxText,
  contactTelLink,
} from "../../selectors/contact";
import {
  contactBandCtaLink,
  contactBandTelLink,
} from "../../selectors/contact-band";
import { footerLink } from "../../selectors/home";
import {
  productsCategoryArticles,
  productsCategoryLinks,
  productsText,
} from "../../selectors/products";

test.describe("トップ", () => {
  test.describe("表示", () => {
    test("開いた場合、題とヘッダーとフッターと主な領域が出ること", async ({
      page,
    }) => {
      await page.goto("/");

      await expect(page).toHaveTitle("有限会社フクウラ");
      await expect(page.getByTestId("site-header")).toBeVisible();
      await expect(page.getByTestId("site-footer")).toBeVisible();
      await expect(page.getByTestId("home-section-hero")).toBeVisible();
      await expect(page.getByTestId("home-section-business")).toBeVisible();
      await expect(page.getByTestId("home-section-products")).toBeVisible();
      await expect(page.getByTestId("home-section-company")).toBeVisible();
      // 索引リストは18カテゴリを連番で全件並べる (画像カードはカルーセルで別掲)
      await expect(productsCategoryLinks(page)).toHaveCount(18);
    });

    test("開いた場合、見出しの上に、01 から始まるセクションの番号と和文のラベルだけが出ること", async ({
      page,
    }) => {
      await page.goto("/");

      await expect(page.getByTestId("home-section-consultation")).toContainText(
        /01\s*ご相談内容/,
      );
      await expect(page.getByTestId("home-section-business")).toContainText(
        /02\s*事業内容/,
      );
      await expect(page.getByTestId("home-section-products")).toContainText(
        /03\s*取扱製品・取扱メーカー/,
      );
      const company = page.getByTestId("home-section-company");
      await expect(company).toContainText(/04\s*会社概要/);
      await expect(company).toContainText("経営理念");
      // 上の確認で描画を待ってから、外した英字のラベルが無いことを見る
      await expect(page.getByTestId("home-section-hero")).not.toContainText(
        "INDUSTRIAL SUPPLY",
      );
      await expect(page.getByTestId("home-section-hero")).not.toContainText(
        "SCROLL",
      );
      await expect(
        page.getByTestId("home-section-consultation"),
      ).not.toContainText("CONSULTATION");
      await expect(company).not.toContainText("PHILOSOPHY");
      await expect(page.getByTestId("site-nav-menu")).not.toContainText(
        "BUSINESS",
      );
      await expect(page.getByTestId("site-footer")).not.toContainText(
        "SITEMAP",
      );
    });

    test("開いた場合、問い合わせの帯に、見出しと受付時間と、お問い合わせへのボタンと電話のリンクが出ること", async ({
      page,
    }) => {
      await page.goto("/");

      const band = page.getByTestId("home-section-contact-band");
      await expect(band).toBeVisible();
      await expect(band).toContainText("お問い合わせ・お見積り");
      await expect(band).toContainText("受付時間 / 平日 9:00-18:00");
      await expect(contactBandCtaLink(band)).toHaveAttribute(
        "href",
        "/contact",
      );
      await expect(contactBandTelLink(band)).toHaveAttribute(
        "href",
        "tel:0794926465",
      );
    });
  });
});

test.describe("取扱製品", () => {
  test.describe("表示", () => {
    test("開いた場合、題と一覧とカテゴリの全件とメーカーの名前が出ること", async ({
      page,
    }) => {
      await page.goto("/products");

      await expect(page).toHaveTitle("取扱製品 | 有限会社フクウラ");
      await expect(page.getByTestId("products-section-index")).toBeVisible();
      await expect(productsCategoryLinks(page)).toHaveCount(18);
      await expect(productsCategoryArticles(page)).toHaveCount(18);
      await expect(productsText(page, "住友重機械工業（株）")).toBeVisible();
      await expect(productsText(page, "三菱電機（株）").first()).toBeVisible();
      // 上の確認で一覧の描画を待ってから、番号の前の英字が無いことを見る
      await expect(
        page.getByTestId("products-section-index"),
      ).not.toContainText("CATEGORY");
    });

    test("開いた場合、問い合わせの帯に、見出しと受付時間と、お問い合わせへのボタンと電話のリンクが出ること", async ({
      page,
    }) => {
      await page.goto("/products");

      const band = page.getByTestId("products-section-contact-band");
      await expect(band).toBeVisible();
      await expect(band).toContainText(
        "掲載のないメーカー・型番も確認します。",
      );
      await expect(band).toContainText("受付時間 / 平日 9:00-18:00");
      await expect(contactBandCtaLink(band)).toHaveAttribute(
        "href",
        "/contact",
      );
      await expect(contactBandTelLink(band)).toHaveAttribute(
        "href",
        "tel:0794926465",
      );
    });

    test("開いた場合、フッターに、トップと同じサイトマップのリンクと連絡先が出ること", async ({
      page,
    }) => {
      await page.goto("/products");

      await expect(footerLink(page, "事業内容")).toHaveAttribute(
        "href",
        "/#business",
      );
      await expect(footerLink(page, "取扱製品")).toHaveAttribute(
        "href",
        "/products",
      );
      await expect(footerLink(page, "会社概要")).toHaveAttribute(
        "href",
        "/#company",
      );
      await expect(footerLink(page, "お問い合わせ・お見積り")).toHaveAttribute(
        "href",
        "/contact",
      );
      await expect(footerLink(page, "TEL 079-492-6465")).toHaveAttribute(
        "href",
        "tel:0794926465",
      );
    });
  });
});

test.describe("お問い合わせ", () => {
  test.describe("表示", () => {
    test("開いた場合、題と問い合わせ先とフォームの枠が出ること", async ({
      page,
    }) => {
      await page.goto("/contact");

      await expect(page).toHaveTitle("お問い合わせ | 有限会社フクウラ");
      await expect(page.getByTestId("contact-section-info")).toBeVisible();
      await expect(contactTelLink(page)).toBeVisible();
      // FAX は操作対象ではない <p> のため、領域の内側の文言で見る
      await expect(contactFaxText(page)).toBeVisible();
      await expect(contactEmailLink(page)).toBeVisible();
      await expect(page.getByTestId("contact-form-slot")).toBeVisible();
    });

    test("開いた場合、フッターに、トップと同じサイトマップのリンクと連絡先が出ること", async ({
      page,
    }) => {
      await page.goto("/contact");

      await expect(footerLink(page, "事業内容")).toHaveAttribute(
        "href",
        "/#business",
      );
      await expect(footerLink(page, "取扱製品")).toHaveAttribute(
        "href",
        "/products",
      );
      await expect(footerLink(page, "会社概要")).toHaveAttribute(
        "href",
        "/#company",
      );
      await expect(footerLink(page, "お問い合わせ・お見積り")).toHaveAttribute(
        "href",
        "/contact",
      );
      await expect(footerLink(page, "TEL 079-492-6465")).toHaveAttribute(
        "href",
        "tel:0794926465",
      );
    });
  });
});
