import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./target-size-CDXnB7gz.js";import{n as a,t as o}from"./Select-tAxs2c1T.js";var s=t({Default:()=>p,Disabled:()=>g,Focused:()=>y,Hover:()=>v,Invalid:()=>h,LongItems:()=>_,Placeholder:()=>m,__namedExportsOrder:()=>b,default:()=>f}),c,l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{a(),r(),c=n(),{expect:l,userEvent:u,within:d}=__STORYBOOK_MODULE_TEST__,f={title:`コンポーネント/Base/Select`,component:o,decorators:[e=>(0,c.jsx)(`div`,{className:`w-72`,children:(0,c.jsx)(e,{})})]},p={render:()=>(0,c.jsxs)(o,{defaultValue:`option-a`,"aria-label":`選択肢`,children:[(0,c.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,c.jsx)(`option`,{value:`option-b`,children:`Option B`}),(0,c.jsx)(`option`,{value:`option-c`,children:`Option C`})]}),play:async({canvasElement:e})=>{await i(d(e).getByRole(`combobox`))}},m={render:()=>(0,c.jsxs)(o,{defaultValue:``,"aria-label":`選択肢`,children:[(0,c.jsx)(`option`,{value:``,disabled:!0,children:`未選択 (placeholder 表示)`}),(0,c.jsx)(`option`,{value:`option-a`,children:`Option A`})]})},h={render:()=>(0,c.jsxs)(o,{defaultValue:`option-a`,"aria-invalid":!0,"aria-label":`選択肢`,children:[(0,c.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,c.jsx)(`option`,{value:`option-b`,children:`Option B`})]})},g={render:()=>(0,c.jsx)(o,{defaultValue:`option-a`,disabled:!0,"aria-label":`選択肢`,children:(0,c.jsx)(`option`,{value:`option-a`,children:`Option A`})})},_={render:()=>(0,c.jsxs)(o,{defaultValue:`long-a`,"aria-label":`選択肢`,children:[(0,c.jsx)(`option`,{value:`long-a`,children:`空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式`}),(0,c.jsx)(`option`,{value:`long-b`,children:`駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)`})]})},v={render:()=>(0,c.jsxs)(o,{defaultValue:`option-a`,"aria-label":`選択肢`,children:[(0,c.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,c.jsx)(`option`,{value:`option-b`,children:`Option B`})]}),parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},y={render:()=>(0,c.jsxs)(o,{defaultValue:`option-a`,"aria-label":`選択肢`,children:[(0,c.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,c.jsx)(`option`,{value:`option-b`,children:`Option B`})]}),play:async({canvasElement:e})=>{await u.tab(),await l(d(e).getByRole(`combobox`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},b=[`Default`,`Placeholder`,`Invalid`,`Disabled`,`LongItems`,`Hover`,`Focused`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
      <option value="option-c">Option C</option>
    </Select>,
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("combobox"));
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="" aria-label="選択肢">
      <option value="" disabled>
        未選択 (placeholder 表示)
      </option>
      <option value="option-a">Option A</option>
    </Select>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-invalid aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled aria-label="選択肢">
      <option value="option-a">Option A</option>
    </Select>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="long-a" aria-label="選択肢">
      <option value="long-a">
        空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式
      </option>
      <option value="long-b">
        駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)
      </option>
    </Select>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>,
  parameters: {
    pseudo: {
      hover: true
    }
  },
  // 枠の色の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>,
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("combobox")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...y.parameters?.docs?.source}}}})))()}export{h as a,s as c,v as i,x as l,g as n,_ as o,y as r,m as s,p as t};