const t=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};t.isAstroComponentFactory=!0;t.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/common/ContactCtaLink.astro";const a={title:"Common/ContactCtaLink",component:t},e={args:{href:"/contact",size:"sm",slots:{default:"相談する"}}},r={args:{href:"/contact",size:"hero",slots:{default:"加工・調達の相談をする"}}},s={args:{href:"/contact",size:"lg",slots:{default:"問い合わせフォームへ"}}},o={args:{href:"/contact",size:"lg",slots:{default:"図面が固まっていない段階の加工・部品調達の相談を受け付けています"}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    href: "/contact",
    size: "sm",
    slots: {
      default: "相談する"
    }
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    href: "/contact",
    size: "hero",
    slots: {
      default: "加工・調達の相談をする"
    }
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    href: "/contact",
    size: "lg",
    slots: {
      default: "問い合わせフォームへ"
    }
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    href: "/contact",
    size: "lg",
    slots: {
      default: "図面が固まっていない段階の加工・部品調達の相談を受け付けています"
    }
  }
}`,...o.parameters?.docs?.source}}};const n=["Sm","Hero","Lg","LongLabel"];export{r as Hero,s as Lg,o as LongLabel,e as Sm,n as __namedExportsOrder,a as default};
