import { expect, test } from "@playwright/test";

import { footerLink } from "../../selectors/home";

test.describe("トップ", () => {
  test.describe("ヘッダーのナビ", () => {
    // ヘッダーとフッターに同じ文言のリンクが並び、role では一意にならないため testid で拾う
    test("デスクトップの幅で取扱製品とお問い合わせを順に押した場合、それぞれの画面が開くこと", async ({
      page,
    }) => {
      await page.goto("/");

      await page.getByTestId("site-nav-products").click();
      await expect(page).toHaveURL("/products");
      await expect(page.getByTestId("products-section-index")).toBeVisible();

      await page.getByTestId("site-nav-contact").click();
      await expect(page).toHaveURL("/contact");
      await expect(page.getByTestId("contact-section-info")).toBeVisible();
    });
  });

  test.describe("フッターのリンク", () => {
    test("取扱製品を押した場合、取扱製品が開くこと", async ({ page }) => {
      await page.goto("/");

      await footerLink(page, "取扱製品").click();

      await expect(page).toHaveURL("/products");
      await expect(page.getByTestId("products-section-index")).toBeVisible();
    });

    test("お問い合わせ・お見積りを押した場合、お問い合わせが開くこと", async ({
      page,
    }) => {
      await page.goto("/");

      await footerLink(page, "お問い合わせ・お見積り").click();

      await expect(page).toHaveURL("/contact");
      await expect(page.getByTestId("contact-section-info")).toBeVisible();
    });
  });

  test.describe("モバイルの幅のナビ", () => {
    test.use({ viewport: { width: 390, height: 900 } });

    test("開閉のボタンを 2 回押した場合、1 回目で開き、2 回目で閉じること", async ({
      page,
    }) => {
      const navToggle = page.getByTestId("site-nav-toggle");
      const navMenu = page.getByTestId("site-nav-menu");

      await page.goto("/");
      await expect(navToggle).toHaveAttribute("aria-expanded", "false");
      await expect(navMenu).toHaveAttribute("data-open", "false");

      await navToggle.click();
      await expect(navToggle).toHaveAttribute("aria-expanded", "true");
      await expect(navMenu).toHaveAttribute("data-open", "true");

      await navToggle.click();
      await expect(navToggle).toHaveAttribute("aria-expanded", "false");
      await expect(navMenu).toHaveAttribute("data-open", "false");
    });

    test("開いたナビで取扱製品とお問い合わせを順に押した場合、それぞれの画面が開き、ナビが閉じていること", async ({
      page,
    }) => {
      const navToggle = page.getByTestId("site-nav-toggle");
      const navMenu = page.getByTestId("site-nav-menu");

      await page.goto("/");

      await navToggle.click();
      await expect(navMenu).toHaveAttribute("data-open", "true");
      await page.getByTestId("site-nav-products").click();
      await expect(page).toHaveURL("/products");
      await expect(page.getByTestId("products-section-index")).toBeVisible();
      await expect(navMenu).toHaveAttribute("data-open", "false");

      await navToggle.click();
      await expect(navMenu).toHaveAttribute("data-open", "true");
      await page.getByTestId("site-nav-contact").click();
      await expect(page).toHaveURL("/contact");
      await expect(page.getByTestId("contact-section-info")).toBeVisible();
      await expect(navMenu).toHaveAttribute("data-open", "false");
    });
  });
});
