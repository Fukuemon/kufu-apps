/**
 * トップの取扱製品カテゴリのカルーセルに、矢印、端の無効、マウスのドラッグの操作を付ける。
 * 自動では送らない。並びは端で止まる。
 * Astro の <script> と、Storybook の story の play の両方から呼ぶ。Storybook では Astro の <script> が動かないためである。
 */
export function initFeaturedCarousel(carousel: HTMLElement): void {
  const track = carousel.querySelector<HTMLElement>("[data-carousel-track]");
  const prev = carousel.querySelector<HTMLButtonElement>(
    "[data-carousel-prev]",
  );
  const next = carousel.querySelector<HTMLButtonElement>(
    "[data-carousel-next]",
  );
  if (!track || !prev || !next) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)"); // design-system-allow: scrollBy の behavior の指定は CSS の scroll-behavior で止められない（MOTION-REDUCE）

  // スクロールの位置は小数になるため、1px の誤差を端とみなす
  const edgeTolerance = 1;

  const updateArrows = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= edgeTolerance;
    next.disabled = track.scrollLeft >= maxScroll - edgeTolerance;
  };

  const stepWidth = () => {
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    return second
      ? second.offsetLeft - first.offsetLeft
      : first.getBoundingClientRect().width;
  };

  const move = (direction: number) => {
    track.scrollBy({
      left: stepWidth() * direction,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();

  // マウスのドラッグで左右に動かす。タッチは native の横スクロールに任せる。
  // 押しただけのクリックをカードのリンクに通すため、閾値を超えて動いたときだけドラッグにする
  const dragThreshold = 4;
  let pointerId: number | null = null;
  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  const endDrag = () => {
    if (pointerId === null) return;
    if (track.hasPointerCapture(pointerId)) {
      track.releasePointerCapture(pointerId);
    }
    pointerId = null;
    track.classList.remove("is-dragging");
  };

  track.addEventListener("pointerdown", (event) => {
    dragging = false;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = track.scrollLeft;
  });

  track.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    // 閾値の前に track の外で離すと pointerup が届かない。ボタンを離した後の移動で終える
    if ((event.buttons & 1) === 0) {
      endDrag();
      return;
    }
    const deltaX = event.clientX - startX;
    if (!dragging) {
      if (Math.abs(deltaX) < dragThreshold) return;
      dragging = true;
      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    }
    track.scrollLeft = startScroll - deltaX;
  });

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", () => {
    endDrag();
    dragging = false;
  });

  // ドラッグの後に続くクリックで、カードのリンクを開かない。キーボードのクリック（detail が 0）は通す
  track.addEventListener(
    "click",
    (event) => {
      if (!dragging || event.detail === 0) return;
      dragging = false;
      event.preventDefault();
      event.stopPropagation();
    },
    { capture: true },
  );

  // リンクの native のドラッグが、横のドラッグを奪わないようにする
  track.addEventListener("dragstart", (event) => event.preventDefault());
}
