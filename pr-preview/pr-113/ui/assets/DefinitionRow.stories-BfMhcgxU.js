import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./clsx-DSXoiAHx.js";function i({term:e,children:t,layout:n=`default`,...i}){return(0,a.jsxs)(`div`,{"data-slot":`definition-row`,className:r(`grid border-divider text-body`,o[n]),...i,children:[(0,a.jsx)(`dt`,{className:s[n],children:e}),(0,a.jsx)(`dd`,{className:c[n],children:t})]})}var a,o,s,c;function l(){return(l=e((()=>{n(),a=t(),o={default:`gap-1 border-b py-3 sm:grid-cols-[12rem_1fr] sm:gap-6`,compact:`gap-3 border-t py-3.5 md:grid-cols-[6.5rem_1fr] md:gap-5`},s={default:`font-medium text-text-secondary`,compact:`font-mono text-caption font-normal leading-6 tracking-[0.12em] text-text-secondary`},c={default:`text-text`,compact:`text-text leading-6`},i.__docgenInfo={description:"説明リストの 1 行。`dl` の中に置き、見出しを `dt`、値を `dd` で出す。",methods:[],displayName:`DefinitionRow`,props:{term:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},layout:{required:!1,tsType:{name:`union`,raw:`"default" | "compact"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"compact"`}]},description:``,defaultValue:{value:`"default"`,computed:!1}}}}})))()}var u,d,f,p,m,h,g;function _(){return(_=e((()=>{l(),u=t(),d={title:`コンポーネント/Base/DefinitionRow`,component:i,args:{term:`Label`,children:`Definition value`},decorators:[e=>(0,u.jsx)(`dl`,{className:`max-w-2xl`,children:(0,u.jsx)(e,{})})]},f={args:{}},p={render:()=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{term:`Status`,children:`Ready`}),(0,u.jsx)(i,{term:`Owner`,children:`Shared UI`}),(0,u.jsx)(i,{term:`Updated`,children:`2026-06-20`})]})},m={render:()=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{layout:`compact`,term:`Status`,children:`Ready`}),(0,u.jsx)(i,{layout:`compact`,term:`Owner`,children:`Shared UI`})]})},h={args:{term:`事業内容`,children:`産業機械部品の販売、精密機械加工、治具設計、省力化機器の提案など、値が長文になった場合の折り返しと行間を確認するための説明文をここに連ねている。`}},g=[`Default`,`MultipleRows`,`Compact`,`LongValue`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow term="Status">Ready</DefinitionRow>
      <DefinitionRow term="Owner">Shared UI</DefinitionRow>
      <DefinitionRow term="Updated">2026-06-20</DefinitionRow>
    </>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <DefinitionRow layout="compact" term="Status">
        Ready
      </DefinitionRow>
      <DefinitionRow layout="compact" term="Owner">
        Shared UI
      </DefinitionRow>
    </>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    term: "事業内容",
    children: "産業機械部品の販売、精密機械加工、治具設計、省力化機器の提案など、値が長文になった場合の折り返しと行間を確認するための説明文をここに連ねている。"
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{m as Compact,f as Default,h as LongValue,p as MultipleRows,g as __namedExportsOrder,d as default};