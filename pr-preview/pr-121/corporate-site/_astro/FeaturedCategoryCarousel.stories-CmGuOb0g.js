import{n as e}from"./rolldown-runtime-sJBDdmOt.js";var t;function n(){return(n=e((()=>{t=()=>{throw Error(`Astro components are rendered server-side by Storybook.`)},t.isAstroComponentFactory=!0,t.moduleId=`/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCarousel.astro`})))()}function r(e){let t=e.querySelector(`[data-carousel-track]`),n=e.querySelector(`[data-carousel-prev]`),r=e.querySelector(`[data-carousel-next]`);if(!t||!n||!r)return;let i=window.matchMedia(`(prefers-reduced-motion: reduce)`),a=()=>{let e=t.scrollWidth-t.clientWidth;n.disabled=t.scrollLeft<=1,r.disabled=t.scrollLeft>=e-1},o=()=>{let e=t.children[0],n=t.children[1];return e?n?n.offsetLeft-e.offsetLeft:e.getBoundingClientRect().width:0},s=e=>{t.scrollBy({left:o()*e,behavior:i.matches?`auto`:`smooth`})};n.addEventListener(`click`,()=>s(-1)),r.addEventListener(`click`,()=>s(1)),t.addEventListener(`scroll`,a,{passive:!0}),window.addEventListener(`resize`,a),a();let c=null,l=!1,u=0,d=0,f=()=>{c!==null&&(t.hasPointerCapture(c)&&t.releasePointerCapture(c),c=null,t.classList.remove(`is-dragging`))};t.addEventListener(`pointerdown`,e=>{l=!1,e.pointerType===`mouse`&&e.button===0&&(c=e.pointerId,u=e.clientX,d=t.scrollLeft)}),t.addEventListener(`pointermove`,e=>{if(c!==e.pointerId)return;if(!(e.buttons&1)){f();return}let n=e.clientX-u;if(!l){if(Math.abs(n)<4)return;l=!0,t.classList.add(`is-dragging`),t.setPointerCapture(e.pointerId)}t.scrollLeft=d-n}),t.addEventListener(`pointerup`,f),t.addEventListener(`pointercancel`,()=>{f(),l=!1}),t.addEventListener(`click`,e=>{l&&e.detail!==0&&(l=!1,e.preventDefault(),e.stopPropagation())},{capture:!0}),t.addEventListener(`dragstart`,e=>e.preventDefault())}var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),{expect:i,userEvent:a,waitFor:o,within:s}=__STORYBOOK_MODULE_TEST__,c=[`docs/design/features/corporate-site/reference/company-profile.md`],l=[{id:`drive-reducers`,collection:`productCategories`,data:{id:`drive-reducers`,order:1,name:`駆動・変減速機器`,summary:`モーター、変減速機、制御機器など駆動系の主要機器。`,groupId:`drive-transmission`,featuredImage:`https://images.unsplash.com/photo-1723022323088-ca3d68fae5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080`,sourceReferences:c}},...[{id:`bearings-linear-motion`,order:2,name:`軸受・直動機器`},{id:`automation-labor-saving`,order:3,name:`自動化・省力化機器`},{id:`chain-belt-sprocket-gear`,order:4,name:`チェーン・ベルト及びスプロケット・歯車`},{id:`power-transmission-supplies`,order:5,name:`伝動機器・用品`},{id:`pneumatic-hydraulic`,order:6,name:`空圧・油圧機器`}].map(({id:e,order:t,name:n})=>({id:e,collection:`productCategories`,data:{id:e,order:t,name:n,summary:`${n}。`,groupId:`drive-transmission`,sourceReferences:c}}))],u={title:`Sections/ProductsCategory/FeaturedCategoryCarousel`,component:t},d={args:{categories:l,makerCountsByCategoryId:{"drive-reducers":17,"bearings-linear-motion":20,"automation-labor-saving":29,"chain-belt-sprocket-gear":14,"power-transmission-supplies":9,"pneumatic-hydraulic":12}},play:async({canvasElement:e})=>{let t=e.querySelector(`[data-featured-carousel]`);if(!t)throw Error(`カルーセルが描画されていない`);r(t);let n=s(t),c=n.getByRole(`group`),l=n.getByRole(`button`,{name:`前のカテゴリ`}),u=n.getByRole(`button`,{name:`次のカテゴリ`}),d=()=>o(async()=>{let e=c.scrollWidth-c.clientWidth;await i(l.disabled).toBe(c.scrollLeft<=1),await i(u.disabled).toBe(c.scrollLeft>=e-1)});await i(c.scrollLeft).toBe(0),await i(l).toBeDisabled(),await i(u).toBeEnabled();let f=async(e,t)=>{let n=c.scrollLeft;await a.click(e),await o(()=>i((c.scrollLeft-n)*t).toBeGreaterThan(0)),await d()};for(await f(u,1),await i(l).toBeEnabled();!u.disabled;)await f(u,1);for(await i(c.scrollLeft).toBeGreaterThanOrEqual(c.scrollWidth-c.clientWidth-1),await i(l).toBeEnabled();!l.disabled;)await f(l,-1);await i(c.scrollLeft).toBeLessThanOrEqual(1),await i(u).toBeEnabled()}},f={args:{categories:[],makerCountsByCategoryId:{}}},p=[`Default`,`Empty`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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

    // 矢印の無効は scroll のイベントで変わり、位置より遅れる。位置に追い付くまで待つ
    const waitArrowsMatchPosition = () => waitFor(async () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      await expect(prev.disabled).toBe(track.scrollLeft <= 1);
      await expect(next.disabled).toBe(track.scrollLeft >= maxScroll - 1);
    });
    await expect(track.scrollLeft).toBe(0);
    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();
    const send = async (button: HTMLButtonElement, direction: 1 | -1) => {
      const before = track.scrollLeft;
      await userEvent.click(button);
      await waitFor(() => expect((track.scrollLeft - before) * direction).toBeGreaterThan(0));
      await waitArrowsMatchPosition();
    };
    await send(next, 1);
    await expect(prev).toBeEnabled();

    // 末尾まで送ると「次のカテゴリ」を押せなくなる
    while (!next.disabled) await send(next, 1);
    await expect(track.scrollLeft).toBeGreaterThanOrEqual(track.scrollWidth - track.clientWidth - 1);
    await expect(prev).toBeEnabled();

    // 先頭に戻すと「前のカテゴリ」を押せなくなる。VRT は先頭の状態を撮る
    while (!prev.disabled) await send(prev, -1);
    await expect(track.scrollLeft).toBeLessThanOrEqual(1);
    await expect(next).toBeEnabled();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    categories: [],
    makerCountsByCategoryId: {}
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{d as Default,f as Empty,p as __namedExportsOrder,u as default};