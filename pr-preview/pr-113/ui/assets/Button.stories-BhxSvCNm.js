import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{r as n,t as r}from"./Button-D9ruGoYz.js";import{n as i,t as a}from"./target-size-CDXnB7gz.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),i(),o=t(),{expect:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`コンポーネント/Base/Button`,component:r,args:{children:`Button`}},d={play:async({canvasElement:e})=>{await a(l(e).getByRole(`button`))}},f={args:{disabled:!0,children:`Disabled`}},p={args:{children:`図面が固まっていない段階の加工・部品調達の相談をする`}},m={render:()=>(0,o.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,o.jsx)(r,{variant:`cta`,size:`cta-sm`,children:`cta-sm`}),(0,o.jsx)(r,{variant:`cta`,size:`cta-md`,children:`cta-md`}),(0,o.jsx)(r,{variant:`cta`,size:`cta-lg`,children:`cta-lg`}),(0,o.jsx)(r,{variant:`cta`,size:`cta-hero`,children:`cta-hero`})]}),play:async({canvasElement:e})=>{for(let t of l(e).getAllByRole(`button`))await a(t)}},h={play:async({canvasElement:e})=>{await c.tab(),await s(l(e).getByRole(`button`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},g={parameters:{pseudo:{active:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},_={parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},v=[`Default`,`Disabled`,`LongLabel`,`Cta`,`Focused`,`Active`,`Hover`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("button"));
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の加工・部品調達の相談をする"
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-3">
      <Button variant="cta" size="cta-sm">
        cta-sm
      </Button>
      <Button variant="cta" size="cta-md">
        cta-md
      </Button>
      <Button variant="cta" size="cta-lg">
        cta-lg
      </Button>
      <Button variant="cta" size="cta-hero">
        cta-hero
      </Button>
    </div>,
  play: async ({
    canvasElement
  }) => {
    for (const button of within(canvasElement).getAllByRole("button")) {
      await expectTargetSize(button);
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      active: true
    }
  },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      hover: true
    }
  },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,..._.parameters?.docs?.source}}}})))()}y();export{g as Active,m as Cta,d as Default,f as Disabled,h as Focused,_ as Hover,p as LongLabel,v as __namedExportsOrder,u as default};