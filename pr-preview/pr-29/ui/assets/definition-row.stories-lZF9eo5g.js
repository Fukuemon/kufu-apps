import{i as e}from"./preload-helper-xPQekRTU.js";import{C as t}from"./iframe-DuJ0zyXk.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{n as r,t as i}from"./utils-CxKdngKp.js";import{n as a,t as o}from"./dist-BVPRWcbv.js";function s({className:e,term:t,children:n,layout:r=`default`,...a}){return(0,c.jsxs)(`div`,{"data-slot":`definition-row`,className:i(l({layout:r,className:e})),...a,children:[(0,c.jsx)(`dt`,{className:i(u({layout:r})),children:t}),(0,c.jsx)(`dd`,{className:i(d({layout:r})),children:n})]})}var c,l,u,d,f=e((()=>{t(),a(),r(),c=n(),l=o(`grid gap-1 border-border text-sm`,{variants:{layout:{default:`border-b py-3 sm:grid-cols-[12rem_1fr] sm:gap-6`,compact:`gap-3 border-t py-3.5 md:grid-cols-[6.5rem_1fr] md:gap-5`}},defaultVariants:{layout:`default`}}),u=o(``,{variants:{layout:{default:`font-medium text-muted-foreground`,compact:`font-mono text-[0.6875rem] font-normal leading-6 tracking-[0.12em] text-muted-foreground`}},defaultVariants:{layout:`default`}}),d=o(`text-foreground`,{variants:{layout:{default:``,compact:`leading-6`}},defaultVariants:{layout:`default`}}),s.__docgenInfo={description:``,methods:[],displayName:`DefinitionRow`,props:{term:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},layout:{defaultValue:{value:`"default"`,computed:!1},required:!1}}}})),p,m,h,g,_,v;e((()=>{f(),p=n(),m={title:`Patterns/DefinitionRow`,component:s,args:{term:`Label`,children:`Definition value`},decorators:[e=>(0,p.jsx)(`dl`,{className:`max-w-2xl`,children:(0,p.jsx)(e,{})})]},h={args:{}},g={render:()=>(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(s,{term:`Status`,children:`Ready`}),(0,p.jsx)(s,{term:`Owner`,children:`Shared UI`}),(0,p.jsx)(s,{term:`Updated`,children:`2026-06-20`})]})},_={render:()=>(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(s,{layout:`compact`,term:`Status`,children:`Ready`}),(0,p.jsx)(s,{layout:`compact`,term:`Owner`,children:`Shared UI`})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow term="Status">Ready</DefinitionRow>
      <DefinitionRow term="Owner">Shared UI</DefinitionRow>
      <DefinitionRow term="Updated">2026-06-20</DefinitionRow>
    </>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow layout="compact" term="Status">
        Ready
      </DefinitionRow>
      <DefinitionRow layout="compact" term="Owner">
        Shared UI
      </DefinitionRow>
    </>
}`,..._.parameters?.docs?.source}}},v=[`Default`,`MultipleRows`,`Compact`]}))();export{_ as Compact,h as Default,g as MultipleRows,v as __namedExportsOrder,m as default};