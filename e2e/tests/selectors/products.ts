import type { Locator, Page } from "@playwright/test";

/**
 * 索引リストのカテゴリ `<a>`。`/` と `/products` の両方にある。
 * DOM 上のアンカー数を数えるため、role ではなく CSS で拾う。
 */
export const productsCategoryLinks = (page: Page): Locator =>
  page.getByTestId("products-category-list").locator("a");

/**
 * カテゴリ記事 18 件。testid の前方一致だけでは同じ接頭辞を持つ
 * `products-category-list` を拾い、role では非表示要素が除かれて件数が変わる。
 */
export const productsCategoryArticles = (page: Page): Locator =>
  page.locator('article[data-testid^="products-category-"]');

export const productsSearchBox = (page: Page): Locator =>
  page.getByRole("searchbox", { name: "カテゴリ・メーカー名で検索" });

/** role も testid も持たない aria-live の `<p>`。markup の変更は別 issue。 */
export const productsSearchResult = (page: Page): Locator =>
  page.locator("[data-products-result]");

/** 表示内容の確認に使う文言。 */
export const productsText = (page: Page, value: string): Locator =>
  page.getByText(value);

/**
 * 幅 1024px 未満で索引を開閉する `<summary>`。`summary` は role を持たないので文言で拾う。
 */
export const productsIndexToggle = (page: Page): Locator =>
  page.getByText("カテゴリを探す", { exact: true });
