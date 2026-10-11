const o=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};o.isAstroComponentFactory=!0;o.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCard.astro";const a={title:"Sections/ProductsCategory/FeaturedCategoryCard",component:o},e={args:{category:"CATEGORY 01",count:"17社",title:"駆動・変減速機器"}},r={args:{category:"CATEGORY 02",title:"搬送・省力化機器"}},t={args:{category:"CATEGORY 18",count:"102社",title:"空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    category: "CATEGORY 01",
    count: "17社",
    title: "駆動・変減速機器"
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    category: "CATEGORY 02",
    title: "搬送・省力化機器"
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    category: "CATEGORY 18",
    count: "102社",
    title: "空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式"
  }
}`,...t.parameters?.docs?.source}}};const s=["Default","WithoutCount","LongTitle"];export{e as Default,t as LongTitle,r as WithoutCount,s as __namedExportsOrder,a as default};
