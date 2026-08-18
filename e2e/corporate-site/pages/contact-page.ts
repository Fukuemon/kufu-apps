import type { Locator, Page } from "@playwright/test";

/**
 * `/contact` (お問い合わせ) の Page Object。
 *
 * locator の使い分けは home-page.ts と同じ規約に従う (context/testing.md)。
 */
export class ContactPage {
  readonly infoSection: Locator;
  readonly formSlot: Locator;
  readonly telLink: Locator;
  readonly emailLink: Locator;
  readonly faxText: Locator;

  constructor(private readonly page: Page) {
    this.infoSection = page.getByTestId("contact-section-info");
    this.formSlot = page.getByTestId("contact-form-slot");
    // 電話とメールは <a href="tel:"> / <a href="mailto:"> の操作対象なので role で引く。
    // 指す要素は移し替え前と同じ <a> で、アサーションも toBeVisible のまま変えていない。
    // FAX は <p> のテキストで操作対象ではないため、領域の内側の文言で見る。
    this.telLink = this.infoSection.getByRole("link", { name: "079-492-6465" });
    this.emailLink = this.infoSection.getByRole("link", {
      name: "fukuura@mist.ocn.ne.jp",
    });
    this.faxText = this.infoSection.getByText("079-492-6429");
  }

  async goto(): Promise<void> {
    await this.page.goto("/contact");
  }
}
