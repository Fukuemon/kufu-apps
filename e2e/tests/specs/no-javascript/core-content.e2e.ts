import { expect, test } from "@playwright/test";

import {
  productsCategoryArticles,
  productsText,
} from "../../selectors/products";

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps core content visible", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("home-section-business")).toBeVisible();
    await expect(page.getByTestId("home-section-products")).toBeVisible();
    await expect(page.getByTestId("home-section-company")).toBeVisible();

    await page.goto("/products");
    await expect(page.getByTestId("products-section-index")).toBeVisible();
    await expect(productsCategoryArticles(page)).toHaveCount(18);
    await expect(productsText(page, "住友重機械工業（株）")).toBeVisible();

    await page.goto("/contact");
    await expect(page.getByTestId("contact-section-info")).toBeVisible();
    await expect(page.getByTestId("contact-form-slot")).toBeVisible();
  });
});
