const o=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};o.isAstroComponentFactory=!0;o.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-category/FeaturedCategoryCarousel.astro";const s=[{id:"drive-reducers",collection:"productCategories",data:{id:"drive-reducers",order:1,name:"駆動・変減速機器",summary:"モーター、変減速機、制御機器など駆動系の主要機器。",groupId:"drive-transmission",featuredImage:"https://images.unsplash.com/photo-1723022323088-ca3d68fae5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",sourceReferences:["design/features/corporate-site/reference/company-profile.md"]}}],t={title:"Sections/ProductsCategory/FeaturedCategoryCarousel",component:o},e={args:{categories:s,makerCountsByCategoryId:{"drive-reducers":17}}},r={args:{categories:[],makerCountsByCategoryId:{}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    categories,
    makerCountsByCategoryId: {
      "drive-reducers": 17
    }
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    categories: [],
    makerCountsByCategoryId: {}
  }
}`,...r.parameters?.docs?.source}}};const a=["Default","Empty"];export{e as Default,r as Empty,a as __namedExportsOrder,t as default};
