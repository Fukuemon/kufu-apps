import{n as e}from"./rolldown-runtime-sJBDdmOt.js";var t;function n(){return(n=e((()=>{t=()=>{throw Error(`Astro components are rendered server-side by Storybook.`)},t.isAstroComponentFactory=!0,t.moduleId=`/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-detail/ProductsCategoryAccordionList.astro`})))()}var r,i,a,o,s,c,l;function u(){return(u=e((()=>{n(),r=(e,t,n)=>({id:e,collection:`productCategories`,data:{id:e,order:t,name:n,summary:``,groupId:`drive-transmission`,sourceReferences:[`docs/design/features/corporate-site/reference/company-profile.md`]}}),i=(e,t)=>({id:`${e}-makers`,collection:`categoryMakers`,data:{id:`${e}-makers`,categoryId:e,order:1,categoryName:e,makers:t,sourceReferences:[`docs/design/features/corporate-site/reference/company-profile.md`]}}),a=[{eyebrow:`CATEGORY 01–01`,title:`駆動・伝動`,items:[{category:r(`drive-reducers`,1,`駆動・変減速機器`),makers:i(`drive-reducers`,[`株式会社サンプルA`,`株式会社サンプルB`])}]}],o={title:`Sections/ProductsDetail/ProductsCategoryAccordionList`,component:t},s={args:{categoryGroups:a}},c={args:{categoryGroups:[{eyebrow:`CATEGORY 99`,title:`掲載メーカー準備中`,items:[{category:r(`placeholder-category`,99,`準備中カテゴリ`),makers:i(`placeholder-category`,[])}]}]}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    categoryGroups
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}},l=[`Default`,`EmptyMakers`]})))()}u();export{s as Default,c as EmptyMakers,l as __namedExportsOrder,o as default};