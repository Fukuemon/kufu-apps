import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./target-size-CDXnB7gz.js";import{n as i,t as a}from"./Select-t1qTsuho.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{i(),n(),o=t(),{expect:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`コンポーネント/Base/Select`,component:a,decorators:[e=>(0,o.jsx)(`div`,{className:`w-72`,children:(0,o.jsx)(e,{})})]},d={render:()=>(0,o.jsxs)(a,{defaultValue:`option-a`,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,o.jsx)(`option`,{value:`option-b`,children:`Option B`}),(0,o.jsx)(`option`,{value:`option-c`,children:`Option C`})]}),play:async({canvasElement:e})=>{await r(l(e).getByRole(`combobox`))}},f={render:()=>(0,o.jsxs)(a,{defaultValue:``,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:``,disabled:!0,children:`未選択 (placeholder 表示)`}),(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`})]})},p={render:()=>(0,o.jsxs)(a,{defaultValue:`option-a`,"aria-invalid":!0,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,o.jsx)(`option`,{value:`option-b`,children:`Option B`})]})},m={render:()=>(0,o.jsx)(a,{defaultValue:`option-a`,disabled:!0,"aria-label":`選択肢`,children:(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`})})},h={render:()=>(0,o.jsxs)(a,{defaultValue:`long-a`,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`long-a`,children:`空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式`}),(0,o.jsx)(`option`,{value:`long-b`,children:`駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)`})]})},g={render:()=>(0,o.jsxs)(a,{defaultValue:`option-a`,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,o.jsx)(`option`,{value:`option-b`,children:`Option B`})]}),parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},_={render:()=>(0,o.jsxs)(a,{defaultValue:`option-a`,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,o.jsx)(`option`,{value:`option-b`,children:`Option B`})]}),play:async({canvasElement:e})=>{await c.tab(),await s(l(e).getByRole(`combobox`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},v=[`Default`,`Placeholder`,`Invalid`,`Disabled`,`LongItems`,`Hover`,`Focused`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="" aria-label="選択肢">
      <option value="" disabled>
        未選択 (placeholder 表示)
      </option>
      <option value="option-a">Option A</option>
    </Select>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-invalid aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled aria-label="選択肢">
      <option value="option-a">Option A</option>
    </Select>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="long-a" aria-label="選択肢">
      <option value="long-a">
        空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式
      </option>
      <option value="long-b">
        駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)
      </option>
    </Select>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}}})))()}y();export{d as Default,m as Disabled,_ as Focused,g as Hover,p as Invalid,h as LongItems,f as Placeholder,v as __namedExportsOrder,u as default};