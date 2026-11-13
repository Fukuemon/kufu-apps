import{n as e}from"./rolldown-runtime-sJBDdmOt.js";var t;function n(){return(n=e((()=>{t=()=>{throw Error(`Astro components are rendered server-side by Storybook.`)},t.isAstroComponentFactory=!0,t.moduleId=`/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCarousel.astro`})))()}function r(e){let t=e.querySelector(`[data-carousel-track]`),n=e.querySelector(`[data-carousel-prev]`),r=e.querySelector(`[data-carousel-next]`);if(!t||!n||!r)return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`),a=(e,t)=>{e.setAttribute(`aria-disabled`,String(t))},o=e=>e.getAttribute(`aria-disabled`)===`true`,s=()=>{let e=t.scrollWidth-t.clientWidth;a(n,t.scrollLeft<=1),a(r,t.scrollLeft>=e-1)},c=()=>{let e=t.children[0],n=t.children[1];return e?n?n.offsetLeft-e.offsetLeft:e.getBoundingClientRect().width:0},l=e=>{t.scrollBy({left:c()*e,behavior:i.matches?`auto`:`smooth`})};n.addEventListener(`click`,()=>{o(n)||l(-1)}),r.addEventListener(`click`,()=>{o(r)||l(1)}),t.addEventListener(`scroll`,s,{passive:!0}),window.addEventListener(`resize`,s),s();let u=null,d=!1,f=0,p=0,m=()=>{u!==null&&(t.hasPointerCapture(u)&&t.releasePointerCapture(u),u=null,t.classList.remove(`is-dragging`))};t.addEventListener(`pointerdown`,e=>{d=!1,e.pointerType===`mouse`&&e.button===0&&(u=e.pointerId,f=e.clientX,p=t.scrollLeft)}),t.addEventListener(`pointermove`,e=>{if(u!==e.pointerId)return;if(!(e.buttons&1)){m();return}let n=e.clientX-f;if(!d){if(Math.abs(n)<4)return;d=!0,t.classList.add(`is-dragging`),t.setPointerCapture(e.pointerId)}t.scrollLeft=p-n}),t.addEventListener(`pointerup`,m),t.addEventListener(`pointercancel`,()=>{m(),d=!1}),t.addEventListener(`click`,e=>{d&&e.detail!==0&&(d=!1,e.preventDefault(),e.stopPropagation())},{capture:!0}),t.addEventListener(`dragstart`,e=>e.preventDefault())}var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),{expect:i,userEvent:a,waitFor:o,within:s}=__STORYBOOK_MODULE_TEST__,c=[`docs/design/features/corporate-site/reference/company-profile.md`],l=[{id:`drive-reducers`,collection:`productCategories`,data:{id:`drive-reducers`,order:1,name:`駆動・変減速機器`,summary:`モーター、変減速機、制御機器など駆動系の主要機器。`,groupId:`drive-transmission`,featuredImage:`https://images.unsplash.com/photo-1723022323088-ca3d68fae5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080`,sourceReferences:c}},...[{id:`bearings-linear-motion`,order:2,name:`軸受・直動機器`},{id:`automation-labor-saving`,order:3,name:`自動化・省力化機器`},{id:`chain-belt-sprocket-gear`,order:4,name:`チェーン・ベルト及びスプロケット・歯車`},{id:`power-transmission-supplies`,order:5,name:`伝動機器・用品`},{id:`pneumatic-hydraulic`,order:6,name:`空圧・油圧機器`}].map(({id:e,order:t,name:n})=>({id:e,collection:`productCategories`,data:{id:e,order:t,name:n,summary:`${n}。`,groupId:`drive-transmission`,sourceReferences:c}}))],u={title:`Sections/ProductsCategory/FeaturedCategoryCarousel`,component:t},d={args:{categories:l,makerCountsByCategoryId:{"drive-reducers":17,"bearings-linear-motion":20,"automation-labor-saving":29,"chain-belt-sprocket-gear":14,"power-transmission-supplies":9,"pneumatic-hydraulic":12}},play:async({canvasElement:e})=>{let t=e.querySelector(`[data-featured-carousel]`);if(!t)throw Error(`カルーセルが描画されていない`);r(t);let n=s(t),c=n.getByRole(`group`),l=n.getByRole(`button`,{name:`前のカテゴリ`}),u=n.getByRole(`button`,{name:`次のカテゴリ`}),d=e=>e.getAttribute(`aria-disabled`)===`true`,f=()=>o(async()=>{let e=c.scrollWidth-c.clientWidth;await i(d(l)).toBe(c.scrollLeft<=1),await i(d(u)).toBe(c.scrollLeft>=e-1)});await i(c.scrollLeft).toBe(0),await i(l).toHaveAttribute(`aria-disabled`,`true`),await i(u).toHaveAttribute(`aria-disabled`,`false`);let p=async(e,t)=>{let n=c.scrollLeft;await a.click(e),await o(()=>i((c.scrollLeft-n)*t).toBeGreaterThan(0)),await f()};for(await p(u,1),await i(l).toHaveAttribute(`aria-disabled`,`false`);!d(u);)await p(u,1);let m=c.scrollLeft;for(await i(m).toBeGreaterThanOrEqual(c.scrollWidth-c.clientWidth-1),await i(l).toHaveAttribute(`aria-disabled`,`false`),await a.click(u),await i(c.scrollLeft).toBe(m),await i(u).toHaveFocus();!d(l);)await p(l,-1);await i(c.scrollLeft).toBeLessThanOrEqual(1),await i(u).toHaveAttribute(`aria-disabled`,`false`)}},f={args:{categories:[],makerCountsByCategoryId:{}}},p=[`Default`,`Empty`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    categories,
    makerCountsByCategoryId: {
      "drive-reducers": 17,
      "bearings-linear-motion": 20,
      "automation-labor-saving": 29,
      "chain-belt-sprocket-gear": 14,
      "power-transmission-supplies": 9,
      "pneumatic-hydraulic": 12
    }
  },
  play: async ({
    canvasElement
  }: {
    canvasElement: HTMLElement;
  }) => {
    const carousel = canvasElement.querySelector<HTMLElement>("[data-featured-carousel]");
    if (!carousel) throw new Error("カルーセルが描画されていない");
    // Storybook では Astro の <script> が動かないので、同じ関数をここで呼ぶ。
    // 時間が経っても動かないことは、動きを減らす設定を付けない E2E が確かめる
    initFeaturedCarousel(carousel);
    const canvas = within(carousel);
    const track = canvas.getByRole("group");
    const prev = canvas.getByRole<HTMLButtonElement>("button", {
      name: "前のカテゴリ"
    });
    const next = canvas.getByRole<HTMLButtonElement>("button", {
      name: "次のカテゴリ"
    });

    // 端の矢印は aria-disabled で押せなくする。jest-dom の toBeDisabled は aria-disabled を見ないので、属性で比べる
    const isOff = (button: HTMLButtonElement) => button.getAttribute("aria-disabled") === "true";

    // 矢印の無効は scroll のイベントで変わり、位置より遅れる。位置に追い付くまで待つ
    const waitArrowsMatchPosition = () => waitFor(async () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      await expect(isOff(prev)).toBe(track.scrollLeft <= 1);
      await expect(isOff(next)).toBe(track.scrollLeft >= maxScroll - 1);
    });
    await expect(track.scrollLeft).toBe(0);
    await expect(prev).toHaveAttribute("aria-disabled", "true");
    await expect(next).toHaveAttribute("aria-disabled", "false");
    const send = async (button: HTMLButtonElement, direction: 1 | -1) => {
      const before = track.scrollLeft;
      await userEvent.click(button);
      await waitFor(() => expect((track.scrollLeft - before) * direction).toBeGreaterThan(0));
      await waitArrowsMatchPosition();
    };
    await send(next, 1);
    await expect(prev).toHaveAttribute("aria-disabled", "false");

    // 末尾まで送ると「次のカテゴリ」を押せなくなる。押しても送らず、フォーカスは矢印に残る
    while (!isOff(next)) await send(next, 1);
    const end = track.scrollLeft;
    await expect(end).toBeGreaterThanOrEqual(track.scrollWidth - track.clientWidth - 1);
    await expect(prev).toHaveAttribute("aria-disabled", "false");
    await userEvent.click(next);
    await expect(track.scrollLeft).toBe(end);
    await expect(next).toHaveFocus();

    // 先頭に戻すと「前のカテゴリ」を押せなくなる。VRT は先頭の状態を撮る
    while (!isOff(prev)) await send(prev, -1);
    await expect(track.scrollLeft).toBeLessThanOrEqual(1);
    await expect(next).toHaveAttribute("aria-disabled", "false");
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    categories: [],
    makerCountsByCategoryId: {}
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{d as Default,f as Empty,p as __namedExportsOrder,u as default};