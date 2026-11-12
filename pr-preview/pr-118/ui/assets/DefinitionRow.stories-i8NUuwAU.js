import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./clsx-DSXoiAHx.js";function a({term:e,children:t,layout:n=`default`,...r}){return(0,o.jsxs)(`div`,{"data-slot":`definition-row`,className:i(`grid border-divider text-body`,s[n]),...r,children:[(0,o.jsx)(`dt`,{className:c[n],children:e}),(0,o.jsx)(`dd`,{className:l[n],children:t})]})}var o,s,c,l;function u(){return(u=e((()=>{r(),o=n(),s={default:`gap-1 border-b py-3 sm:grid-cols-[12rem_1fr] sm:gap-6`,compact:`gap-3 border-t py-3.5 md:grid-cols-[6.5rem_1fr] md:gap-5`},c={default:`font-medium text-text-secondary`,compact:`font-mono text-caption font-normal leading-6 tracking-[0.12em] text-text-secondary`},l={default:`text-text`,compact:`text-text leading-6`},a.__docgenInfo={description:"説明リストの 1 行。`dl` の中に置き、見出しを `dt`、値を `dd` で出す。",methods:[],displayName:`DefinitionRow`,props:{term:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},layout:{required:!1,tsType:{name:`union`,raw:`"default" | "compact"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"compact"`}]},description:``,defaultValue:{value:`"default"`,computed:!1}}}}})))()}var d=t({Compact:()=>g,Default:()=>m,LongValue:()=>_,MultipleRows:()=>h,__namedExportsOrder:()=>v,default:()=>p}),f,p,m,h,g,_,v;function y(){return(y=e((()=>{u(),f=n(),p={title:`コンポーネント/Base/DefinitionRow`,component:a,args:{term:`Label`,children:`Definition value`},decorators:[e=>(0,f.jsx)(`dl`,{className:`max-w-2xl`,children:(0,f.jsx)(e,{})})]},m={args:{}},h={render:()=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{term:`Status`,children:`Ready`}),(0,f.jsx)(a,{term:`Owner`,children:`Shared UI`}),(0,f.jsx)(a,{term:`Updated`,children:`2026-06-20`})]})},g={render:()=>(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{layout:`compact`,term:`Status`,children:`Ready`}),(0,f.jsx)(a,{layout:`compact`,term:`Owner`,children:`Shared UI`})]})},_={args:{term:`事業内容`,children:`産業機械部品の販売、精密機械加工、治具設計、省力化機器の提案など、値が長文になった場合の折り返しと行間を確認するための説明文をここに連ねている。`}},v=[`Default`,`MultipleRows`,`Compact`,`LongValue`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow term="Status">Ready</DefinitionRow>
      <DefinitionRow term="Owner">Shared UI</DefinitionRow>
      <DefinitionRow term="Updated">2026-06-20</DefinitionRow>
    </>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow layout="compact" term="Status">
        Ready
      </DefinitionRow>
      <DefinitionRow layout="compact" term="Owner">
        Shared UI
      </DefinitionRow>
    </>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    term: "事業内容",
    children: "産業機械部品の販売、精密機械加工、治具設計、省力化機器の提案など、値が長文になった場合の折り返しと行間を確認するための説明文をここに連ねている。"
  }
}`,..._.parameters?.docs?.source}}}})))()}export{h as a,u as c,_ as i,m as n,y as o,d as r,a as s,g as t};