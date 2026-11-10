import { expect, test } from "@playwright/test";

import {
  productsSearchBox,
  productsSearchResult,
} from "../../selectors/products";

test("persists product search in the URL", async ({ page }) => {
  await page.goto("/products");

  await productsSearchBox(page).fill("住友重機械工業");

  await expect(page).toHaveURL(/\/products\?q=/);
  await expect(productsSearchResult(page)).toContainText("件のカテゴリが一致");

  await page.reload();
  await expect(productsSearchBox(page)).toHaveValue("住友重機械工業");

  await productsSearchBox(page).fill("");
  await expect(page).toHaveURL("/products");
});
