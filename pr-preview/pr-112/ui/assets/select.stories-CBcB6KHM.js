import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./target-size-CDXnB7gz.js";import{n as i,t as a}from"./select-CD0Mm2kA.js";var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{i(),n(),o=t(),{within:s}=__STORYBOOK_MODULE_TEST__,c={title:`UI/Select`,component:a,decorators:[e=>(0,o.jsx)(`div`,{className:`w-72`,children:(0,o.jsx)(e,{})})]},l={render:()=>(0,o.jsxs)(a,{defaultValue:`option-a`,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,o.jsx)(`option`,{value:`option-b`,children:`Option B`}),(0,o.jsx)(`option`,{value:`option-c`,children:`Option C`})]}),play:async({canvasElement:e})=>{await r(s(e).getByRole(`combobox`))}},u={render:()=>(0,o.jsxs)(a,{defaultValue:``,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:``,disabled:!0,children:`未選択 (placeholder 表示)`}),(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`})]})},d={render:()=>(0,o.jsxs)(a,{defaultValue:`option-a`,"aria-invalid":!0,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,o.jsx)(`option`,{value:`option-b`,children:`Option B`})]})},f={render:()=>(0,o.jsx)(a,{defaultValue:`option-a`,disabled:!0,"aria-label":`選択肢`,children:(0,o.jsx)(`option`,{value:`option-a`,children:`Option A`})})},p={render:()=>(0,o.jsxs)(a,{defaultValue:`long-a`,"aria-label":`選択肢`,children:[(0,o.jsx)(`option`,{value:`long-a`,children:`空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式`}),(0,o.jsx)(`option`,{value:`long-b`,children:`駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)`})]})},m=[`Default`,`Placeholder`,`Invalid`,`Disabled`,`LongItems`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="" aria-label="選択肢">
      <option value="" disabled>
        未選択 (placeholder 表示)
      </option>
      <option value="option-a">Option A</option>
    </Select>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-invalid aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled aria-label="選択肢">
      <option value="option-a">Option A</option>
    </Select>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="long-a" aria-label="選択肢">
      <option value="long-a">
        空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式
      </option>
      <option value="long-b">
        駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)
      </option>
    </Select>
}`,...p.parameters?.docs?.source}}}})))()}h();export{l as Default,f as Disabled,d as Invalid,p as LongItems,u as Placeholder,m as __namedExportsOrder,c as default};