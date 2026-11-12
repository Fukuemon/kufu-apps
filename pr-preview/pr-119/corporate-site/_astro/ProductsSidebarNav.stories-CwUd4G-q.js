import{n as e}from"./rolldown-runtime-sJBDdmOt.js";var t;function n(){return(n=e((()=>{t=()=>{throw Error(`Astro components are rendered server-side by Storybook.`)},t.isAstroComponentFactory=!0,t.moduleId=`/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-detail/ProductsSidebarNav.astro`})))()}var r,i,a,o,s,c;function l(){return(l=e((()=>{n(),r=(e,t,n)=>({id:e,collection:`productCategories`,data:{id:e,order:t,name:n,summary:``,groupId:`drive-transmission`,sourceReferences:[`docs/design/features/corporate-site/reference/company-profile.md`]}}),i=[{title:`駆動・伝動`,items:[{category:r(`drive-reducers`,1,`駆動・変減速機器`)},{category:r(`bearings-linear-motion`,2,`軸受・直動機器`)}]}],a={title:`Sections/ProductsDetail/ProductsSidebarNav`,component:t,parameters:{vrt:{viewport:{width:1280,height:800}}}},o={args:{categoryGroups:i,makerCountById:{"drive-reducers":17,"bearings-linear-motion":19}}},s={args:{categoryGroups:[{title:`空圧・油圧・真空とその他周辺機器`,items:[{category:r(`pneumatic-hydraulic-vacuum`,17,`空圧・油圧・真空機器と関連する周辺制御機器一式`)}]}],makerCountById:{"pneumatic-hydraulic-vacuum":102}}},c=[`Default`,`LongNames`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    categoryGroups,
    makerCountById: {
      "drive-reducers": 17,
      "bearings-linear-motion": 19
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    categoryGroups: [{
      title: "空圧・油圧・真空とその他周辺機器",
      items: [{
        category: category("pneumatic-hydraulic-vacuum", 17, "空圧・油圧・真空機器と関連する周辺制御機器一式")
      }]
    }],
    makerCountById: {
      "pneumatic-hydraulic-vacuum": 102
    }
  }
}`,...s.parameters?.docs?.source}}}})))()}l();export{o as Default,s as LongNames,c as __namedExportsOrder,a as default};