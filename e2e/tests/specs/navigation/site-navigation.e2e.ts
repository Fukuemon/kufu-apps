import { expect, test } from "@playwright/test";

import { footerLink } from "../../selectors/home";

test("navigates through header footer and LP CTAs", async ({ page }) => {
  await page.goto("/");

  // ヘッダーとフッターに同じ文言のリンクが並び、role では一意にならないため testid で拾う
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
  await footerLink(page, "取扱製品").click();
  await expect(page).toHaveURL("/products");
});

test("toggles mobile navigation", async ({ page }) => {
  const navToggle = page.getByTestId("site-nav-toggle");
  const navMenu = page.getByTestId("site-nav-menu");

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  await expect(navToggle).toHaveAttribute("aria-expanded", "false");
  await expect(navMenu).toHaveAttribute("data-open", "false");

  await navToggle.click();
  await expect(navToggle).toHaveAttribute("aria-expanded", "true");
  await expect(navMenu).toHaveAttribute("data-open", "true");

  await page.getByTestId("site-nav-products").click();
  await expect(page).toHaveURL("/products");
});
