import { expect, test } from "@playwright/test";

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
  await expect(
    page.getByTestId("products-category-list").locator("a"),
  ).toHaveCount(18);

  await page.goto("/products");
  await expect(page).toHaveTitle("取扱製品 | 有限会社フクウラ");
  await expect(page.getByTestId("products-section-index")).toBeVisible();
  await expect(
    page.getByTestId("products-category-list").locator("a"),
  ).toHaveCount(18);
  await expect(
    page.locator('article[data-testid^="products-category-"]'),
  ).toHaveCount(18);
  await expect(page.getByText("住友重機械工業（株）")).toBeVisible();
  await expect(page.getByText("三菱電機（株）").first()).toBeVisible();

  await page.goto("/contact");
  await expect(page).toHaveTitle("お問い合わせ | 有限会社フクウラ");
  const contactInfo = page.getByTestId("contact-section-info");
  await expect(contactInfo).toBeVisible();
  await expect(contactInfo.getByText("079-492-6465")).toBeVisible();
  await expect(contactInfo.getByText("079-492-6429")).toBeVisible();
  await expect(contactInfo.getByText("fukuura@mist.ocn.ne.jp")).toBeVisible();
  await expect(page.getByTestId("contact-form-slot")).toBeVisible();
});

test("navigates through header footer and LP CTAs", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("site-nav-products").click();
  await expect(page).toHaveURL("/products");

  await page.getByTestId("site-nav-contact").click();
  await expect(page).toHaveURL("/contact");

  await page.goto("/");
  await page.getByTestId("home-link-products").click();
  await expect(page).toHaveURL("/products");

  await page.goto("/");
  await page.getByTestId("home-link-contact").click();
  await expect(page).toHaveURL("/contact");

  await page.goto("/");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "取扱製品" })
    .click();
  await expect(page).toHaveURL("/products");
});

test("toggles mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  const toggle = page.getByTestId("site-nav-toggle");
  const menu = page.getByTestId("site-nav-menu");

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toHaveAttribute("data-open", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toHaveAttribute("data-open", "true");

  await page.getByTestId("site-nav-products").click();
  await expect(page).toHaveURL("/products");
});

test("persists product search in the URL", async ({ page }) => {
  await page.goto("/products");

  const search = page.getByRole("searchbox", {
    name: "カテゴリ・メーカー名で検索",
  });
  await search.fill("住友重機械工業");

  await expect(page).toHaveURL(/\/products\?q=/);
  await expect(page.locator("[data-products-result]")).toContainText(
    "件のカテゴリが一致",
  );

  await page.reload();
  await expect(search).toHaveValue("住友重機械工業");

  await search.fill("");
  await expect(page).toHaveURL("/products");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps core content visible", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("home-section-business")).toBeVisible();
    await expect(page.getByTestId("home-section-products")).toBeVisible();
    await expect(page.getByTestId("home-section-company")).toBeVisible();

    await page.goto("/products");
    await expect(page.getByTestId("products-section-index")).toBeVisible();
    await expect(
      page.locator('article[data-testid^="products-category-"]'),
    ).toHaveCount(18);
    await expect(page.getByText("住友重機械工業（株）")).toBeVisible();

    await page.goto("/contact");
    await expect(page.getByTestId("contact-section-info")).toBeVisible();
    await expect(page.getByTestId("contact-form-slot")).toBeVisible();
  });
});
