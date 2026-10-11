const t=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};t.isAstroComponentFactory=!0;t.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/common/SiteHeader.astro";const s={title:"Common/SiteHeader",component:t},r={args:{currentPath:"/"}},e={args:{currentPath:"/products"}},o={args:{currentPath:"/contact"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    currentPath: "/"
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    currentPath: "/products"
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    currentPath: "/contact"
  }
}`,...o.parameters?.docs?.source}}};const a=["Home","Products","Contact"];export{o as Contact,r as Home,e as Products,a as __namedExportsOrder,s as default};
