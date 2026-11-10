import{j as e}from"./jsx-runtime-u17CrQMm.js";import{c}from"./index-LHNt3CwB.js";import{c as d}from"./utils-BQHNewu7.js";const p=c("grid gap-1 border-border text-sm",{variants:{layout:{default:"border-b py-3 sm:grid-cols-[12rem_1fr] sm:gap-6",compact:"gap-3 border-t py-3.5 md:grid-cols-[6.5rem_1fr] md:gap-5"}},defaultVariants:{layout:"default"}}),f=c("",{variants:{layout:{default:"font-medium text-muted-foreground",compact:"font-mono text-[0.6875rem] font-normal leading-6 tracking-[0.12em] text-muted-foreground"}},defaultVariants:{layout:"default"}}),g=c("text-foreground",{variants:{layout:{default:"",compact:"leading-6"}},defaultVariants:{layout:"default"}});function r({className:s,term:m,children:l,layout:i="default",...u}){return e.jsxs("div",{"data-slot":"definition-row",className:d(p({layout:i,className:s})),...u,children:[e.jsx("dt",{className:d(f({layout:i})),children:m}),e.jsx("dd",{className:d(g({layout:i})),children:l})]})}r.__docgenInfo={description:"",methods:[],displayName:"DefinitionRow",props:{term:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},layout:{defaultValue:{value:'"default"',computed:!1},required:!1}}};const h={title:"UI/DefinitionRow",component:r,args:{term:"Label",children:"Definition value"},decorators:[s=>e.jsx("dl",{className:"max-w-2xl",children:e.jsx(s,{})})]},t={args:{}},a={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(r,{term:"Status",children:"Ready"}),e.jsx(r,{term:"Owner",children:"Shared UI"}),e.jsx(r,{term:"Updated",children:"2026-06-20"})]})},o={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(r,{layout:"compact",term:"Status",children:"Ready"}),e.jsx(r,{layout:"compact",term:"Owner",children:"Shared UI"})]})},n={args:{term:"事業内容",children:"産業機械部品の販売、精密機械加工、治具設計、省力化機器の提案など、値が長文になった場合の折り返しと行間を確認するための説明文をここに連ねている。"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow term="Status">Ready</DefinitionRow>
      <DefinitionRow term="Owner">Shared UI</DefinitionRow>
      <DefinitionRow term="Updated">2026-06-20</DefinitionRow>
    </>
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow layout="compact" term="Status">
        Ready
      </DefinitionRow>
      <DefinitionRow layout="compact" term="Owner">
        Shared UI
      </DefinitionRow>
    </>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    term: "事業内容",
    children: "産業機械部品の販売、精密機械加工、治具設計、省力化機器の提案など、値が長文になった場合の折り返しと行間を確認するための説明文をここに連ねている。"
  }
}`,...n.parameters?.docs?.source}}};const y=["Default","MultipleRows","Compact","LongValue"];export{o as Compact,t as Default,n as LongValue,a as MultipleRows,y as __namedExportsOrder,h as default};
