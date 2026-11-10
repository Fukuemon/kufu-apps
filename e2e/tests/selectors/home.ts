import type { Locator, Page } from "@playwright/test";

/** フッター内のリンク。landmark で領域が一意に決まるため role=contentinfo を起点にする。 */
export const footerLink = (page: Page, name: string): Locator =>
  page.getByRole("contentinfo").getByRole("link", { name });
