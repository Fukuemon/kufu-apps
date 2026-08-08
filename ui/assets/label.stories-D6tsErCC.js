import{j as t}from"./jsx-runtime-u17CrQMm.js";import{I as o}from"./input-COzcwG0V.js";import{L as s}from"./label-D2aBq809.js";import"./utils-BQHNewu7.js";import"./iframe-BvNHz319.js";import"./preload-helper-PPVm8Dsz.js";import"./createBaseUIEventDetails-SBlCwsbn.js";import"./useRenderElement-XXmAj0_L.js";import"./useIsoLayoutEffect-C4wmQpCM.js";const h={title:"UI/Label",component:s,args:{children:"会社名"}},r={},e={render:()=>t.jsxs("div",{className:"grid w-72 gap-2",children:[t.jsx(s,{htmlFor:"label-story-input",children:"会社名"}),t.jsx(o,{id:"label-story-input",placeholder:"株式会社サンプル"})]})},a={args:{children:"ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-72 gap-2">
      <Label htmlFor="label-story-input">会社名</Label>
      <Input id="label-story-input" placeholder="株式会社サンプル" />
    </div>
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)"
  }
}`,...a.parameters?.docs?.source}}};const x=["Default","WithInput","LongText"];export{r as Default,a as LongText,e as WithInput,x as __namedExportsOrder,h as default};
