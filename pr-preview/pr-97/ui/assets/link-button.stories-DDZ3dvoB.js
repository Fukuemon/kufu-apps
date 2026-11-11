import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./clsx-DSXoiAHx.js";import{n as i,r as a}from"./button-5ABC65JK.js";function o({variant:e,size:t,disabled:n=!1,...a}){return(0,s.jsx)(`a`,{"data-slot":`link-button`,"data-disabled":n?``:void 0,"aria-disabled":n,tabIndex:n?-1:a.tabIndex,className:r(i({variant:e,size:t}),n&&`pointer-events-none opacity-50`),...a})}var s;function c(){return(c=e((()=>{n(),a(),s=t(),o.__docgenInfo={description:`ボタンの見た目のリンク。見た目の種類と大きさは Button と同じである。`,methods:[],displayName:`LinkButton`,props:{variant:{required:!1,tsType:{name:`union`,raw:`"default" | "cta"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta"`}]},description:``},size:{required:!1,tsType:{name:`union`,raw:`"default" | "cta-sm" | "cta-md" | "cta-lg" | "cta-hero"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta-sm"`},{name:`literal`,value:`"cta-md"`},{name:`literal`,value:`"cta-lg"`},{name:`literal`,value:`"cta-hero"`}]},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:"true なら、押せない見た目にし、`aria-disabled` を付けてタブの順から外す。",defaultValue:{value:`false`,computed:!1}}}}})))()}var l,u,d,f,p,m,h;function g(){return(g=e((()=>{c(),l=t(),u={title:`UI/LinkButton`,component:o,args:{href:`#`,children:`Link button`}},d={},f={args:{disabled:!0,children:`Disabled link`}},p={args:{children:`図面が固まっていない段階の相談も受け付けているリンクボタン`}},m={render:()=>(0,l.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,l.jsx)(o,{href:`#`,variant:`cta`,size:`cta-sm`,children:`cta-sm`}),(0,l.jsx)(o,{href:`#`,variant:`cta`,size:`cta-lg`,children:`cta-lg`}),(0,l.jsx)(o,{href:`#`,variant:`cta`,size:`cta-hero`,children:`cta-hero`})]})},h=[`Default`,`Disabled`,`LongLabel`,`Cta`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled link"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の相談も受け付けているリンクボタン"
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-3">
      <LinkButton href="#" variant="cta" size="cta-sm">
        cta-sm
      </LinkButton>
      <LinkButton href="#" variant="cta" size="cta-lg">
        cta-lg
      </LinkButton>
      <LinkButton href="#" variant="cta" size="cta-hero">
        cta-hero
      </LinkButton>
    </div>
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as Cta,d as Default,f as Disabled,p as LongLabel,h as __namedExportsOrder,u as default};