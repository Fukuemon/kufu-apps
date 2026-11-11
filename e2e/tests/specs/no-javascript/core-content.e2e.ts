import { expect, test } from "@playwright/test";

import { contactEmailLink, contactTelLink } from "../../selectors/contact";
import {
  productsCategoryArticles,
  productsText,
} from "../../selectors/products";

test.describe("トップ", () => {
  test.describe("JavaScript を使わない表示", () => {
    test.use({ javaScriptEnabled: false });

    test("JavaScript が無効の場合、事業内容と取扱製品と会社情報の領域が出ること", async ({
      page,
    }) => {
      await page.goto("/");

      await expect(page.getByTestId("home-section-business")).toBeVisible();
      await expect(page.getByTestId("home-section-products")).toBeVisible();
      await expect(page.getByTestId("home-section-company")).toBeVisible();
    });
  });
});

test.describe("取扱製品", () => {
  test.describe("JavaScript を使わない表示", () => {
    test.use({ javaScriptEnabled: false });

    test("JavaScript が無効の場合、取扱製品の一覧とカテゴリの全件が出ること", async ({
      page,
    }) => {
      await page.goto("/products");

      await expect(page.getByTestId("products-section-index")).toBeVisible();
      await expect(productsCategoryArticles(page)).toHaveCount(18);
      await expect(productsText(page, "住友重機械工業（株）")).toBeVisible();
    });
  });
});

test.describe("お問い合わせ", () => {
  test.describe("JavaScript を使わない表示", () => {
    test.use({ javaScriptEnabled: false });

    test("JavaScript が無効の場合、問い合わせ先とフォームの枠が出ること", async ({
      page,
    }) => {
      await page.goto("/contact");

      await expect(page.getByTestId("contact-section-info")).toBeVisible();
      await expect(page.getByTestId("contact-form-slot")).toBeVisible();
    });

    test("JavaScript が無効の場合、電話とメールのリンクの行き先が tel: と mailto: であること", async ({
      page,
    }) => {
      await page.goto("/contact");

      await expect(contactTelLink(page)).toHaveAttribute(
        "href",
        "tel:0794926465",
      );
      await expect(contactEmailLink(page)).toHaveAttribute(
        "href",
        "mailto:fukuura@mist.ocn.ne.jp",
      );
    });
  });
});
