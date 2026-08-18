import type { Locator, Page } from "@playwright/test";

/**
 * `/` (トップページ) の Page Object。
 *
 * セレクタと操作をここへ集約し、テスト本体はシナリオだけを書く (adr/0017 の D2)。
 * locator は用途で使い分ける (context/testing.md)。この規約は Page Object の内部にも適用する。
 *
 * - 領域の特定 (セクション / ページ): `data-testid`
 * - 操作対象 (ボタン / リンク / 入力欄): `getByRole`
 *
 * 規約へ寄せられない箇所は理由をコメントで残す。
 */
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

  /**
   * 索引リストに並ぶカテゴリの `<a>`。件数の検証に使う。
   *
   * 規約の例外。ここは「DOM 上のアンカー数」を数えており、`getByRole("link")` にすると
   * `href` の無いアンカーとアクセシビリティツリー上の非表示要素が除かれて件数の意味が変わる。
   */
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

    // 規約の例外。ヘッダーとフッターに同じ文言のリンクが並ぶため role では一意にならない。
    // 領域を特定する testid が既にあるのでそれを使う。
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

  /**
   * フッター内のリンクを名前で引く。
   *
   * 起点が `this.footer` (testid) ではなく role=contentinfo なのは、フッターを領域として
   * 一意に決められる landmark があるため。移し替え前のテストもこの経路で引いていた。
   */
  footerLink(name: string): Locator {
    return this.page.getByRole("contentinfo").getByRole("link", { name });
  }

  async openMobileNav(): Promise<void> {
    await this.navToggle.click();
  }
}
