import type { Locator, Page } from "@playwright/test";

const contactInfoSection = (page: Page): Locator =>
  page.getByTestId("contact-section-info");

// 電話とメールは <a> の操作対象なので role で拾う。FAX は <p> のため文言で見る。
export const contactTelLink = (page: Page): Locator =>
  contactInfoSection(page).getByRole("link", { name: "079-492-6465" });

export const contactEmailLink = (page: Page): Locator =>
  contactInfoSection(page).getByRole("link", {
    name: "fukuura@mist.ocn.ne.jp",
  });

export const contactFaxText = (page: Page): Locator =>
  contactInfoSection(page).getByText("079-492-6429");
