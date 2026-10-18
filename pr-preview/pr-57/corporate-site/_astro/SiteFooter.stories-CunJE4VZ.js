const e=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};e.isAstroComponentFactory=!0;e.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/common/SiteFooter.astro";const a={title:"Common/SiteFooter",component:e},r={args:{variant:"compact"}},o={args:{variant:"full"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "compact"
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "full"
  }
}`,...o.parameters?.docs?.source}}};const t=["Compact","Full"];export{r as Compact,o as Full,t as __namedExportsOrder,a as default};
