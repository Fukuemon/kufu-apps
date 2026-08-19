import type { Locator, Page } from "@playwright/test";

/** `/contact` (お問い合わせ) の Page Object。locator 規約は e2e/README.md。 */
export class ContactPage {
  readonly infoSection: Locator;
  readonly formSlot: Locator;
  readonly telLink: Locator;
  readonly emailLink: Locator;
  readonly faxText: Locator;

  constructor(private readonly page: Page) {
    this.infoSection = page.getByTestId("contact-section-info");
    this.formSlot = page.getByTestId("contact-form-slot");
    // 電話とメールは <a> の操作対象なので role で引く。FAX は <p> のため文言で見る。
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
