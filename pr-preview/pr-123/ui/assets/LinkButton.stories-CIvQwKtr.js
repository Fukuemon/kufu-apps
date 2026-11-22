import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./clsx-DSXoiAHx.js";import{n as a,r as o}from"./Button-D9ruGoYz.js";import{n as s,t as c}from"./target-size-CDXnB7gz.js";function l({variant:e,size:t,disabled:n=!1,...r}){return(0,u.jsx)(`a`,{"data-slot":`link-button`,"data-disabled":n?``:void 0,"aria-disabled":n,tabIndex:n?-1:r.tabIndex,className:i(a({variant:e,size:t}),n&&`pointer-events-none opacity-50`),...r})}var u;function d(){return(d=e((()=>{r(),o(),u=n(),l.__docgenInfo={description:`ボタンの見た目のリンク。見た目の種類と大きさは Button と同じである。`,methods:[],displayName:`LinkButton`,props:{variant:{required:!1,tsType:{name:`union`,raw:`"default" | "cta"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta"`}]},description:``},size:{required:!1,tsType:{name:`union`,raw:`"default" | "cta-sm" | "cta-md" | "cta-lg" | "cta-hero"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta-sm"`},{name:`literal`,value:`"cta-md"`},{name:`literal`,value:`"cta-lg"`},{name:`literal`,value:`"cta-hero"`}]},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:"true なら、押せない見た目にし、`aria-disabled` を付けてタブの順から外す。",defaultValue:{value:`false`,computed:!1}}}}})))()}var f=t({Active:()=>w,Cta:()=>x,Default:()=>v,Disabled:()=>y,Focused:()=>S,FocusedOnInverse:()=>C,Hover:()=>T,LongLabel:()=>b,__namedExportsOrder:()=>E,default:()=>_}),p,m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{d(),s(),p=n(),{expect:m,userEvent:h,within:g}=__STORYBOOK_MODULE_TEST__,_={title:`コンポーネント/Base/LinkButton`,component:l,args:{href:`#`,children:`Link button`}},v={play:async({canvasElement:e})=>{await c(g(e).getByRole(`link`))}},y={args:{disabled:!0,children:`Disabled link`}},b={args:{children:`図面が固まっていない段階の相談も受け付けているリンクボタン`}},x={render:()=>(0,p.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,p.jsx)(l,{href:`#`,variant:`cta`,size:`cta-sm`,children:`cta-sm`}),(0,p.jsx)(l,{href:`#`,variant:`cta`,size:`cta-lg`,children:`cta-lg`}),(0,p.jsx)(l,{href:`#`,variant:`cta`,size:`cta-hero`,children:`cta-hero`})]}),play:async({canvasElement:e})=>{for(let t of g(e).getAllByRole(`link`))await c(t)}},S={play:async({canvasElement:e})=>{await h.tab(),await m(g(e).getByRole(`link`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},C={render:e=>(0,p.jsx)(`div`,{className:`surface-inverse bg-surface-canvas p-8`,children:(0,p.jsx)(l,{...e,variant:`cta`})}),play:async({canvasElement:e})=>{await h.tab(),await m(g(e).getByRole(`link`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},w={parameters:{pseudo:{active:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},T={parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},E=[`Default`,`Disabled`,`LongLabel`,`Cta`,`Focused`,`FocusedOnInverse`,`Active`,`Hover`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("link"));
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled link"
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の相談も受け付けているリンクボタン"
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
    </div>,
  play: async ({
    canvasElement
  }) => {
    for (const link of within(canvasElement).getAllByRole("link")) {
      await expectTargetSize(link);
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("link")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <div className="surface-inverse bg-surface-canvas p-8">
      <LinkButton {...args} variant="cta" />
    </div>,
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("link")).toHaveFocus();
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      active: true
    }
  },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      hover: true
    }
  },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...T.parameters?.docs?.source}}}})))()}export{S as a,f as c,l as d,d as f,y as i,b as l,x as n,C as o,v as r,T as s,w as t,D as u};