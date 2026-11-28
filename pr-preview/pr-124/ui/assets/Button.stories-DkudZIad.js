import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{r,t as i}from"./Button-D9ruGoYz.js";import{n as a,t as o}from"./target-size-CDXnB7gz.js";var s=t({Active:()=>v,Cta:()=>g,Default:()=>p,Disabled:()=>m,Focused:()=>_,Hover:()=>y,LongLabel:()=>h,__namedExportsOrder:()=>b,default:()=>f}),c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),a(),c=n(),{expect:l,userEvent:u,within:d}=__STORYBOOK_MODULE_TEST__,f={title:`コンポーネント/Base/Button`,component:i,args:{children:`Button`}},p={play:async({canvasElement:e})=>{await o(d(e).getByRole(`button`))}},m={args:{disabled:!0,children:`Disabled`}},h={args:{children:`図面が固まっていない段階の加工・部品調達の相談をする`}},g={render:()=>(0,c.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,c.jsx)(i,{variant:`cta`,size:`cta-sm`,children:`cta-sm`}),(0,c.jsx)(i,{variant:`cta`,size:`cta-md`,children:`cta-md`}),(0,c.jsx)(i,{variant:`cta`,size:`cta-lg`,children:`cta-lg`}),(0,c.jsx)(i,{variant:`cta`,size:`cta-hero`,children:`cta-hero`})]}),play:async({canvasElement:e})=>{for(let t of d(e).getAllByRole(`button`))await o(t)}},_={play:async({canvasElement:e})=>{await u.tab(),await l(d(e).getByRole(`button`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},v={parameters:{pseudo:{active:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},y={parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},b=[`Default`,`Disabled`,`LongLabel`,`Cta`,`Focused`,`Active`,`Hover`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("button"));
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled"
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の加工・部品調達の相談をする"
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      active: true
    }
  },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      hover: true
    }
  },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...y.parameters?.docs?.source}}}})))()}export{m as a,h as c,p as i,x as l,s as n,_ as o,g as r,y as s,v as t};