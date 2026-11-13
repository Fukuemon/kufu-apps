import type { Locator, Page } from "@playwright/test";

/** フッター内のリンク。landmark で領域が一意に決まるため role=contentinfo を起点にする。 */
export const footerLink = (page: Page, name: string): Locator =>
  page.getByRole("contentinfo").getByRole("link", { name });

/**
 * カルーセルのカテゴリのカード。カテゴリの索引にも同じ名前のリンクがあるため、spec が拾ったカルーセルの領域を起点にする。
 * カードの名前は番号と社数を含むので、カテゴリの名前の部分一致で拾う。
 */
export const carouselCategoryCard = (
  carousel: Locator,
  name: string,
): Locator => carousel.getByRole("link", { name });

export const carouselPrevButton = (carousel: Locator): Locator =>
  carousel.getByRole("button", { name: "前のカテゴリ" });

export const carouselNextButton = (carousel: Locator): Locator =>
  carousel.getByRole("button", { name: "次のカテゴリ" });

/** カードを並べた横スクロールの領域。testid を持たないので、role=group で拾う。 */
export const carouselTrack = (carousel: Locator): Locator =>
  carousel.getByRole("group");
