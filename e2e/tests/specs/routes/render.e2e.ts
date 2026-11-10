import { expect, test } from "@playwright/test";

import {
  contactEmailLink,
  contactFaxText,
  contactTelLink,
} from "../../selectors/contact";
import {
  productsCategoryArticles,
  productsCategoryLinks,
  productsText,
} from "../../selectors/products";

test("renders main routes and content", async ({ page }) => {
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

  await page.goto("/products");
  await expect(page).toHaveTitle("取扱製品 | 有限会社フクウラ");
  await expect(page.getByTestId("products-section-index")).toBeVisible();
  await expect(productsCategoryLinks(page)).toHaveCount(18);
  await expect(productsCategoryArticles(page)).toHaveCount(18);
  await expect(productsText(page, "住友重機械工業（株）")).toBeVisible();
  await expect(productsText(page, "三菱電機（株）").first()).toBeVisible();

  await page.goto("/contact");
  await expect(page).toHaveTitle("お問い合わせ | 有限会社フクウラ");
  await expect(page.getByTestId("contact-section-info")).toBeVisible();
  await expect(contactTelLink(page)).toBeVisible();
  // FAX は操作対象ではない <p> のため、領域の内側の文言で見る
  await expect(contactFaxText(page)).toBeVisible();
  await expect(contactEmailLink(page)).toBeVisible();
  await expect(page.getByTestId("contact-form-slot")).toBeVisible();
});
