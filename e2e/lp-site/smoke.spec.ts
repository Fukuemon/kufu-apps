import { expect, test } from "@playwright/test";

test("renders the lp-site smoke page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Kufu LP Site/);
  await expect(
    page.getByRole("heading", {
      name: "Kufu LP Site",
    }),
  ).toBeVisible();
});
