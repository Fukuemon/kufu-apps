import { expect, test } from "@playwright/test";

import { ContactPage } from "./pages/contact-page";
import { HomePage } from "./pages/home-page";
import { ProductsPage } from "./pages/products-page";

test("renders main routes and content", async ({ page }) => {
  const home = new HomePage(page);
  const products = new ProductsPage(page);
  const contact = new ContactPage(page);

  await home.goto();

  await expect(page).toHaveTitle("有限会社フクウラ");
  await expect(home.header).toBeVisible();
  await expect(home.footer).toBeVisible();
  await expect(home.heroSection).toBeVisible();
  await expect(home.businessSection).toBeVisible();
  await expect(home.productsSection).toBeVisible();
  await expect(home.companySection).toBeVisible();
  // 索引リストは18カテゴリを連番で全件並べる (画像カードはカルーセルで別掲)
  await expect(home.categoryLinks).toHaveCount(18);

  await products.goto();
  await expect(page).toHaveTitle("取扱製品 | 有限会社フクウラ");
  await expect(products.indexSection).toBeVisible();
  await expect(products.categoryLinks).toHaveCount(18);
  await expect(products.categoryArticles).toHaveCount(18);
  await expect(products.text("住友重機械工業（株）")).toBeVisible();
  await expect(products.text("三菱電機（株）").first()).toBeVisible();

  await contact.goto();
  await expect(page).toHaveTitle("お問い合わせ | 有限会社フクウラ");
  await expect(contact.infoSection).toBeVisible();
  await expect(contact.telLink).toBeVisible();
  // FAX は操作対象ではない <p> のため、領域の内側の文言で見る
  await expect(contact.faxText).toBeVisible();
  await expect(contact.emailLink).toBeVisible();
  await expect(contact.formSlot).toBeVisible();
});

test("navigates through header footer and LP CTAs", async ({ page }) => {
  const home = new HomePage(page);

  await home.goto();

  await home.navProductsLink.click();
  await expect(page).toHaveURL("/products");

  await home.navContactLink.click();
  await expect(page).toHaveURL("/contact");

  await home.goto();
  await home.ctaProductsLink.click();
  await expect(page).toHaveURL("/products");

  await home.goto();
  await home.ctaContactLink.click();
  await expect(page).toHaveURL("/contact");

  await home.goto();
  await home.footerLink("取扱製品").click();
  await expect(page).toHaveURL("/products");
});

test("toggles mobile navigation", async ({ page }) => {
  const home = new HomePage(page);

  await page.setViewportSize({ width: 390, height: 900 });
  await home.goto();

  await expect(home.navToggle).toHaveAttribute("aria-expanded", "false");
  await expect(home.navMenu).toHaveAttribute("data-open", "false");

  await home.openMobileNav();
  await expect(home.navToggle).toHaveAttribute("aria-expanded", "true");
  await expect(home.navMenu).toHaveAttribute("data-open", "true");

  await home.navProductsLink.click();
  await expect(page).toHaveURL("/products");
});

test("persists product search in the URL", async ({ page }) => {
  const products = new ProductsPage(page);

  await products.goto();

  await products.search("住友重機械工業");

  await expect(page).toHaveURL(/\/products\?q=/);
  await expect(products.searchResult).toContainText("件のカテゴリが一致");

  await page.reload();
  await expect(products.searchBox).toHaveValue("住友重機械工業");

  await products.clearSearch();
  await expect(page).toHaveURL("/products");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps core content visible", async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const contact = new ContactPage(page);

    await home.goto();

    await expect(home.businessSection).toBeVisible();
    await expect(home.productsSection).toBeVisible();
    await expect(home.companySection).toBeVisible();

    await products.goto();
    await expect(products.indexSection).toBeVisible();
    await expect(products.categoryArticles).toHaveCount(18);
    await expect(products.text("住友重機械工業（株）")).toBeVisible();

    await contact.goto();
    await expect(contact.infoSection).toBeVisible();
    await expect(contact.formSlot).toBeVisible();
  });
});
