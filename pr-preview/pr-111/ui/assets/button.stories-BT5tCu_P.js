import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{r as n,t as r}from"./button-DQI-06Sx.js";var i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),i=t(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Button`,component:r,args:{children:`Button`}},l={},u={args:{disabled:!0,children:`Disabled`}},d={args:{children:`図面が固まっていない段階の加工・部品調達の相談をする`}},f={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,i.jsx)(r,{variant:`cta`,size:`cta-sm`,children:`cta-sm`}),(0,i.jsx)(r,{variant:`cta`,size:`cta-md`,children:`cta-md`}),(0,i.jsx)(r,{variant:`cta`,size:`cta-lg`,children:`cta-lg`}),(0,i.jsx)(r,{variant:`cta`,size:`cta-hero`,children:`cta-hero`})]})},p={play:async({canvasElement:e})=>{await o.tab(),await a(s(e).getByRole(`button`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},m=[`Default`,`Disabled`,`LongLabel`,`Cta`,`Focused`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled"
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の加工・部品調達の相談をする"
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...p.parameters?.docs?.source}}}})))()}h();export{f as Cta,l as Default,u as Disabled,p as Focused,d as LongLabel,m as __namedExportsOrder,c as default};