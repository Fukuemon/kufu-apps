import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as l,a as o,b as s,c as i,d as t}from"./select-sWJgcLJ7.js";import"./utils-BQHNewu7.js";import"./iframe-DSON_Uwq.js";import"./preload-helper-PPVm8Dsz.js";import"./useRenderElement-DtGOCEBs.js";import"./createBaseUIEventDetails-BbONZXbD.js";import"./useIsoLayoutEffect-DIcOxsuu.js";import"./index-DMyM-u5q.js";import"./index-C0zvrzMk.js";import"./useButton-CUf85DSg.js";const f={title:"UI/Select",component:l},n={render:()=>e.jsxs(l,{defaultValue:"option-a",children:[e.jsx(o,{className:"w-72",children:e.jsx(s,{placeholder:"選択してください"})}),e.jsxs(i,{children:[e.jsx(t,{value:"option-a",children:"Option A"}),e.jsx(t,{value:"option-b",children:"Option B"}),e.jsx(t,{value:"option-c",children:"Option C"})]})]})},r={render:()=>e.jsxs(l,{children:[e.jsx(o,{className:"w-72",children:e.jsx(s,{placeholder:"未選択 (placeholder 表示)"})}),e.jsx(i,{children:e.jsx(t,{value:"option-a",children:"Option A"})})]})},a={render:()=>e.jsxs(l,{defaultValue:"option-a",disabled:!0,children:[e.jsx(o,{className:"w-72",children:e.jsx(s,{})}),e.jsx(i,{children:e.jsx(t,{value:"option-a",children:"Option A"})})]})},c={render:()=>e.jsxs(l,{defaultValue:"long-a",children:[e.jsx(o,{className:"w-72",children:e.jsx(s,{})}),e.jsxs(i,{children:[e.jsx(t,{value:"long-a",children:"空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式"}),e.jsx(t,{value:"long-b",children:"駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)"})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a">
      <SelectTrigger className="w-72">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
        <SelectItem value="option-b">Option B</SelectItem>
        <SelectItem value="option-c">Option C</SelectItem>
      </SelectContent>
    </Select>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Select>
      <SelectTrigger className="w-72">
        <SelectValue placeholder="未選択 (placeholder 表示)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
      </SelectContent>
    </Select>
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled>
      <SelectTrigger className="w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
      </SelectContent>
    </Select>
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="long-a">
      <SelectTrigger className="w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="long-a">
          空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式
        </SelectItem>
        <SelectItem value="long-b">
          駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)
        </SelectItem>
      </SelectContent>
    </Select>
}`,...c.parameters?.docs?.source}}};const C=["Default","Placeholder","Disabled","LongItems"];export{n as Default,a as Disabled,c as LongItems,r as Placeholder,C as __namedExportsOrder,f as default};
