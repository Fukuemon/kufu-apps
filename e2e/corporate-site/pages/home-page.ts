import type { Locator, Page } from "@playwright/test";

/** `/` (トップページ) の Page Object。locator 規約は e2e/README.md。 */
export class HomePage {
  readonly header: Locator;
  readonly footer: Locator;
  readonly heroSection: Locator;
  readonly businessSection: Locator;
  readonly productsSection: Locator;
  readonly companySection: Locator;
  readonly categoryList: Locator;

  readonly navProductsLink: Locator;
  readonly navContactLink: Locator;
  readonly navToggle: Locator;
  readonly navMenu: Locator;
  readonly ctaProductsLink: Locator;
  readonly ctaContactLink: Locator;

  /** 索引リストのカテゴリ `<a>`。規約の例外 (DOM 上のアンカー数を数えるため)。 */
  readonly categoryLinks: Locator;

  constructor(private readonly page: Page) {
    this.header = page.getByTestId("site-header");
    this.footer = page.getByTestId("site-footer");
    this.heroSection = page.getByTestId("home-section-hero");
    this.businessSection = page.getByTestId("home-section-business");
    this.productsSection = page.getByTestId("home-section-products");
    this.companySection = page.getByTestId("home-section-company");
    this.categoryList = page.getByTestId("products-category-list");
    this.categoryLinks = this.categoryList.locator("a");

    // 規約の例外。ヘッダーとフッターに同じ文言のリンクが並び role で一意にならない。
    this.navProductsLink = page.getByTestId("site-nav-products");
    this.navContactLink = page.getByTestId("site-nav-contact");
    this.navToggle = page.getByTestId("site-nav-toggle");
    this.navMenu = page.getByTestId("site-nav-menu");
    this.ctaProductsLink = page.getByTestId("home-link-products");
    this.ctaContactLink = page.getByTestId("home-link-contact");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  /** フッター内のリンク。landmark で領域が一意に決まるため role=contentinfo を起点にする。 */
  footerLink(name: string): Locator {
    return this.page.getByRole("contentinfo").getByRole("link", { name });
  }

  async openMobileNav(): Promise<void> {
    await this.navToggle.click();
  }
}
