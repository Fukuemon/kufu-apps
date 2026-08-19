const t=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};t.isAstroComponentFactory=!0;t.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/sections/products-detail/ProductsSidebarNav.astro";const o=(a,s,n)=>({id:a,collection:"productCategories",data:{id:a,order:s,name:n,summary:"",groupId:"drive-transmission",sourceReferences:["design/features/corporate-site/reference/company-profile.md"]}}),c=[{eyebrow:"CATEGORY 01–02",title:"駆動・伝動",items:[{category:o("drive-reducers",1,"駆動・変減速機器")},{category:o("bearings-linear-motion",2,"軸受・直動機器")}]}],u={viewport:{width:1280,height:800}},i={title:"Sections/ProductsDetail/ProductsSidebarNav",component:t,parameters:{vrt:u}},e={args:{categoryGroups:c,makerCountById:{"drive-reducers":17,"bearings-linear-motion":19}}},r={args:{categoryGroups:[{eyebrow:"CATEGORY 17–18",title:"空圧・油圧・真空とその他周辺機器",items:[{category:o("pneumatic-hydraulic-vacuum",17,"空圧・油圧・真空機器と関連する周辺制御機器一式")}]}],makerCountById:{"pneumatic-hydraulic-vacuum":102}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    categoryGroups,
    makerCountById: {
      "drive-reducers": 17,
      "bearings-linear-motion": 19
    }
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    categoryGroups: [{
      eyebrow: "CATEGORY 17–18",
      title: "空圧・油圧・真空とその他周辺機器",
      items: [{
        category: category("pneumatic-hydraulic-vacuum", 17, "空圧・油圧・真空機器と関連する周辺制御機器一式")
      }]
    }],
    makerCountById: {
      "pneumatic-hydraulic-vacuum": 102
    }
  }
}`,...r.parameters?.docs?.source}}};const m=["Default","LongNames"];export{e as Default,r as LongNames,m as __namedExportsOrder,i as default};
