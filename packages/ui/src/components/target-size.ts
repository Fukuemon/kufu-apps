import { expect } from "storybook/test";

/** 押せる領域の最小の幅と高さ（CSS px）。DESIGN.md の `TARGET-SIZE` の値である。 */
const MIN_TARGET_SIZE = 44;

/** 要素の描画した幅と高さが、`TARGET-SIZE` の最小の値以上であることを確かめる。story の play から呼ぶ。 */
async function expectTargetSize(element: Element) {
  const { width, height } = element.getBoundingClientRect();
  await expect(width).toBeGreaterThanOrEqual(MIN_TARGET_SIZE);
  await expect(height).toBeGreaterThanOrEqual(MIN_TARGET_SIZE);
}

export { expectTargetSize };
