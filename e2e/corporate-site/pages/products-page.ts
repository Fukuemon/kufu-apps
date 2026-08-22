import type { Locator, Page } from "@playwright/test";

/** `/products` (取扱製品) の Page Object。locator 規約は e2e/README.md。 */
export class ProductsPage {
  readonly indexSection: Locator;
  readonly categoryList: Locator;
  readonly searchBox: Locator;
  readonly searchResult: Locator;

  /** 索引リストのカテゴリ `<a>`。規約の例外 (DOM 上のアンカー数を数えるため)。 */
  readonly categoryLinks: Locator;

  /**
   * カテゴリ記事 18 件。規約の例外。testid の前方一致だけでは同じ接頭辞を持つ
   * `products-category-list` を拾い、role では非表示要素が除かれて件数が変わる。
   */
  readonly categoryArticles: Locator;

  constructor(private readonly page: Page) {
    this.indexSection = page.getByTestId("products-section-index");
    this.categoryList = page.getByTestId("products-category-list");
    this.categoryLinks = this.categoryList.locator("a");
    this.categoryArticles = page.locator(
      'article[data-testid^="products-category-"]',
    );
    this.searchBox = page.getByRole("searchbox", {
      name: "カテゴリ・メーカー名で検索",
    });
    // 規約の例外。role も testid も持たない aria-live の <p>。markup 変更は別 issue。
    this.searchResult = page.locator("[data-products-result]");
  }

  async goto(): Promise<void> {
    await this.page.goto("/products");
  }

  /** 表示内容の確認に使う。文言の検証は locator 規約の対象外。 */
  text(value: string): Locator {
    return this.page.getByText(value);
  }

  async search(keyword: string): Promise<void> {
    await this.searchBox.fill(keyword);
  }

  async clearSearch(): Promise<void> {
    await this.searchBox.fill("");
  }
}
