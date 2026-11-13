/**
 * トップの取扱製品カテゴリのカルーセルに、矢印、端の無効、マウスのドラッグの操作を付ける。矢印は横にあふれるときだけ出す。
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

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)"); // design-system-allow: scrollTo の behavior の指定は CSS の scroll-behavior で止められない（MOTION-REDUCE）

  // スクロールの位置は小数になるため、1px の誤差を端とみなす
  const edgeTolerance = 1;

  // 端の矢印は disabled にせず aria-disabled にする。disabled にすると、押していた矢印からフォーカスが外れる
  const setOff = (button: HTMLButtonElement, off: boolean) => {
    button.setAttribute("aria-disabled", String(off));
  };
  const maxScroll = () => track.scrollWidth - track.clientWidth;

  // 矢印は hidden で描いておき、横にあふれるときだけ出す。JS が無効のときと、カードが全て収まるときは出さない
  const updateArrows = () => {
    const overflows = maxScroll() > edgeTolerance;
    for (const button of [prev, next]) {
      if (!overflows && button.contains(document.activeElement)) track.focus();
      button.hidden = !overflows;
    }
    setOff(prev, track.scrollLeft <= edgeTolerance);
    setOff(next, track.scrollLeft >= maxScroll() - edgeTolerance);
  };

  // 送り先にするカードの左の端の位置。末尾の位置を超えるものは末尾の位置にまとめる
  const stops = () => {
    const items = [...track.children] as HTMLElement[];
    const origin = items[0]?.offsetLeft ?? 0;
    const max = maxScroll();
    return [
      ...new Set(items.map((item) => Math.min(item.offsetLeft - origin, max))),
    ];
  };

  // 滑らかな送りの途中で続けて押したとき、途中の位置ではなく、送り先から 1 枚分を数える
  let target: number | null = null;
  // 送り先までの距離。送りの途中は縮み続ける。広がったら、利用者がほかの操作で動かしたとみなす
  let distanceToTarget = Number.POSITIVE_INFINITY;

  const forgetTarget = () => {
    target = null;
    distanceToTarget = Number.POSITIVE_INFINITY;
  };

  // 数え始める位置。送り先が残っていれば送り先、無ければ今の位置。幅が縮んだときのため、末尾の位置を超えない
  const countFrom = () => Math.min(target ?? track.scrollLeft, maxScroll());

  const move = (direction: 1 | -1) => {
    const from = countFrom();
    // 端では送らない。送りの途中に逆の矢印を押した場合も、送り先から数えて端かを決める
    if (
      direction < 0
        ? from <= edgeTolerance
        : from >= maxScroll() - edgeTolerance
    )
      return;
    const positions = stops();
    const to =
      direction > 0
        ? (positions.find((p) => p > from + edgeTolerance) ?? maxScroll())
        : ([...positions].reverse().find((p) => p < from - edgeTolerance) ?? 0);
    forgetTarget();
    const distance = Math.abs(to - track.scrollLeft);
    if (distance > edgeTolerance) {
      target = to;
      distanceToTarget = distance;
    }
    track.scrollTo({
      left: to,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  // 送り先に着いたか、送り先から離れる向きに動いたら、送り先を忘れる。
  // 離れる向きの動きは、キーボード、フォーカスの移動、タッチ、ホイールでのスクロールを含む
  track.addEventListener(
    "scroll",
    () => {
      if (target !== null) {
        const distance = Math.abs(track.scrollLeft - target);
        if (
          distance <= edgeTolerance ||
          distance > distanceToTarget + edgeTolerance
        ) {
          forgetTarget();
        } else {
          distanceToTarget = distance;
        }
      }
      updateArrows();
    },
    { passive: true },
  );
  const onResize = () => {
    forgetTarget();
    updateArrows();
  };
  // ResizeObserver が無いブラウザでは、幅の変化を見ない。ドラッグの処理の登録まで止めないよう、例外を投げさせない
  if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(track);
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
    forgetTarget();
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
