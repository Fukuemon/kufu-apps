import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./clsx-DSXoiAHx.js";import{n as i,r as a}from"./button-DQI-06Sx.js";function o({variant:e,size:t,disabled:n=!1,...a}){return(0,s.jsx)(`a`,{"data-slot":`link-button`,"data-disabled":n?``:void 0,"aria-disabled":n,tabIndex:n?-1:a.tabIndex,className:r(i({variant:e,size:t}),n&&`pointer-events-none opacity-50`),...a})}var s;function c(){return(c=e((()=>{n(),a(),s=t(),o.__docgenInfo={description:`ボタンの見た目のリンク。見た目の種類と大きさは Button と同じである。`,methods:[],displayName:`LinkButton`,props:{variant:{required:!1,tsType:{name:`union`,raw:`"default" | "cta"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta"`}]},description:``},size:{required:!1,tsType:{name:`union`,raw:`"default" | "cta-sm" | "cta-md" | "cta-lg" | "cta-hero"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"cta-sm"`},{name:`literal`,value:`"cta-md"`},{name:`literal`,value:`"cta-lg"`},{name:`literal`,value:`"cta-hero"`}]},description:``},disabled:{required:!1,tsType:{name:`boolean`},description:"true なら、押せない見た目にし、`aria-disabled` を付けてタブの順から外す。",defaultValue:{value:`false`,computed:!1}}}}})))()}var l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{c(),l=t(),{expect:u,userEvent:d,within:f}=__STORYBOOK_MODULE_TEST__,p={title:`UI/LinkButton`,component:o,args:{href:`#`,children:`Link button`}},m={},h={args:{disabled:!0,children:`Disabled link`}},g={args:{children:`図面が固まっていない段階の相談も受け付けているリンクボタン`}},_={render:()=>(0,l.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,l.jsx)(o,{href:`#`,variant:`cta`,size:`cta-sm`,children:`cta-sm`}),(0,l.jsx)(o,{href:`#`,variant:`cta`,size:`cta-lg`,children:`cta-lg`}),(0,l.jsx)(o,{href:`#`,variant:`cta`,size:`cta-hero`,children:`cta-hero`})]})},v={play:async({canvasElement:e})=>{await d.tab(),await u(f(e).getByRole(`link`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},y={render:e=>(0,l.jsx)(`div`,{className:`surface-inverse bg-surface-canvas p-8`,children:(0,l.jsx)(o,{...e,variant:`cta`})}),play:async({canvasElement:e})=>{await d.tab(),await u(f(e).getByRole(`link`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},b=[`Default`,`Disabled`,`LongLabel`,`Cta`,`Focused`,`FocusedOnInverse`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled link"
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の相談も受け付けているリンクボタン"
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("link")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}}})))()}x();export{_ as Cta,m as Default,h as Disabled,v as Focused,y as FocusedOnInverse,g as LongLabel,b as __namedExportsOrder,p as default};