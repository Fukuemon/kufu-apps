import type { Locator, Page } from "@playwright/test";

/**
 * `/products` (取扱製品) の Page Object。
 *
 * locator の使い分けは home-page.ts と同じ規約に従う (context/testing.md)。
 */
export class ProductsPage {
  readonly indexSection: Locator;
  readonly categoryList: Locator;
  readonly searchBox: Locator;
  readonly searchResult: Locator;

  /**
   * 索引リストに並ぶカテゴリの `<a>`。件数の検証に使う。
   *
   * 規約の例外。理由は home-page.ts の同名プロパティと同じ (DOM 上のアンカー数を数える)。
   */
  readonly categoryLinks: Locator;

  /**
   * カテゴリ記事 18 件。
   *
   * 規約の例外。`data-testid` の前方一致に加えて要素が `article` であることまで必要で
   * (サイドバーの `products-category-list` が同じ接頭辞を持つ)、かつ「DOM 上の件数」を
   * 数えるため、`getByRole("article")` では非表示要素が除かれて意味が変わる。
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
    // 規約の例外。検索結果の件数表示は aria-live の <p> で、role も testid も持たない。
    // 規約へ寄せるには production の markup に testid を足す必要があり、本 issue の範囲外。
    this.searchResult = page.locator("[data-products-result]");
  }

  async goto(): Promise<void> {
    await this.page.goto("/products");
  }

  /**
   * ページ全体から文言を引く。メーカー名のような表示内容の確認に使う。
   *
   * 文言の検証は領域の特定でも操作対象でもないため locator 規約の対象外。
   * 探索範囲は移し替え前と同じくページ全体に保つ。
   */
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
