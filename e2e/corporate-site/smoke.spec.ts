import { expect, test } from "@playwright/test";

test("renders the corporate-site smoke page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Kufu Corporate Site/);
  await expect(
    page.getByRole("heading", {
      name: "Kufu Corporate Site",
    }),
  ).toBeVisible();
});
