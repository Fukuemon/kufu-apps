import type { Locator } from "@playwright/test";

// 問い合わせの帯のボタンと電話は、最初の画面のボタンとフッターの電話と名前が重なる。spec が拾った帯の領域を起点にする。
export const contactBandCtaLink = (band: Locator): Locator =>
  band.getByRole("link", { name: "お見積り・お問い合わせ" });

export const contactBandTelLink = (band: Locator): Locator =>
  band.getByRole("link", { name: "079-492-6465" });
