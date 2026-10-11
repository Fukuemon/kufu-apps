const t=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};t.isAstroComponentFactory=!0;t.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-detail/ProductsCategoryAccordionList.astro";const a=(e,s,n)=>({id:e,collection:"productCategories",data:{id:e,order:s,name:n,summary:"",groupId:"drive-transmission",sourceReferences:["design/features/corporate-site/reference/company-profile.md"]}}),c=(e,s)=>({id:`${e}-makers`,collection:"categoryMakers",data:{id:`${e}-makers`,categoryId:e,order:1,categoryName:e,makers:s,sourceReferences:["design/features/corporate-site/reference/company-profile.md"]}}),p=[{eyebrow:"CATEGORY 01–01",title:"駆動・伝動",items:[{category:a("drive-reducers",1,"駆動・変減速機器"),makers:c("drive-reducers",["株式会社サンプルA","株式会社サンプルB"])}]}],m={title:"Sections/ProductsDetail/ProductsCategoryAccordionList",component:t},r={args:{categoryGroups:p}},o={args:{categoryGroups:[{eyebrow:"CATEGORY 99",title:"掲載メーカー準備中",items:[{category:a("placeholder-category",99,"準備中カテゴリ"),makers:c("placeholder-category",[])}]}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    categoryGroups
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    categoryGroups: [{
      eyebrow: "CATEGORY 99",
      title: "掲載メーカー準備中",
      items: [{
        category: category("placeholder-category", 99, "準備中カテゴリ"),
        makers: makers("placeholder-category", [])
      }]
    }]
  }
}`,...o.parameters?.docs?.source}}};const d=["Default","EmptyMakers"];export{r as Default,o as EmptyMakers,d as __namedExportsOrder,m as default};
