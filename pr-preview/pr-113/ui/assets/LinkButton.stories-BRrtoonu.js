import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./clsx-DSXoiAHx.js";import{n as i,r as a}from"./Button-WX5SvVDr.js";import{n as o,t as s}from"./target-size-CDXnB7gz.js";function c({variant:e,size:t,disabled:n=!1,...a}){return(0,l.jsx)(`a`,{"data-slot":`link-button`,"data-disabled":n?``:void 0,"aria-disabled":n,tabIndex:n?-1:a.tabIndex,className:r(i({variant:e,size:t}),n&&`pointer-events-none opacity-50`),...a})}var l;function u(){return(u=e((()=>{n(),a(),l=t(),c.__docgenInfo={description:`ボタンの見た目のリンク。見た目の種類と大きさは Button と同じである。`,methods:[],displayName:`LinkButton`,props:{variant:{required:!1,tsType:{name:`union`,raw:`"default" | "cta"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta"`}]},description:``},size:{required:!1,tsType:{name:`union`,raw:`"default" | "cta-sm" | "cta-md" | "cta-lg" | "cta-hero"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta-sm"`},{name:`literal`,value:`"cta-md"`},{name:`literal`,value:`"cta-lg"`},{name:`literal`,value:`"cta-hero"`}]},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:"true なら、押せない見た目にし、`aria-disabled` を付けてタブの順から外す。",defaultValue:{value:`false`,computed:!1}}}}})))()}var d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{u(),o(),d=t(),{expect:f,userEvent:p,within:m}=__STORYBOOK_MODULE_TEST__,h={title:`コンポーネント/Base/LinkButton`,component:c,args:{href:`#`,children:`Link button`}},g={play:async({canvasElement:e})=>{await s(m(e).getByRole(`link`))}},_={args:{disabled:!0,children:`Disabled link`}},v={args:{children:`図面が固まっていない段階の相談も受け付けているリンクボタン`}},y={render:()=>(0,d.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,d.jsx)(c,{href:`#`,variant:`cta`,size:`cta-sm`,children:`cta-sm`}),(0,d.jsx)(c,{href:`#`,variant:`cta`,size:`cta-lg`,children:`cta-lg`}),(0,d.jsx)(c,{href:`#`,variant:`cta`,size:`cta-hero`,children:`cta-hero`})]}),play:async({canvasElement:e})=>{for(let t of m(e).getAllByRole(`link`))await s(t)}},b={play:async({canvasElement:e})=>{await p.tab(),await f(m(e).getByRole(`link`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},x={render:e=>(0,d.jsx)(`div`,{className:`surface-inverse bg-surface-canvas p-8`,children:(0,d.jsx)(c,{...e,variant:`cta`})}),play:async({canvasElement:e})=>{await p.tab(),await f(m(e).getByRole(`link`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},S=[`Default`,`Disabled`,`LongLabel`,`Cta`,`Focused`,`FocusedOnInverse`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("link"));
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled link"
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の相談も受け付けているリンクボタン"
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("link")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}}})))()}C();export{y as Cta,g as Default,_ as Disabled,b as Focused,x as FocusedOnInverse,v as LongLabel,S as __namedExportsOrder,h as default};