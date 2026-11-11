import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./label-RuJKZ9k6.js";import{n as i,t as a}from"./input-DZOAt54d.js";import{n as o,t as s}from"./select-TiGy3ABX.js";import{n as c,t as l}from"./textarea-D5zXV2zv.js";function u({label:e,htmlFor:t,description:n,error:i,children:a,...o}){return(0,d.jsxs)(`div`,{"data-slot":`form-field`,className:`grid gap-2`,...o,children:[(0,d.jsx)(r,{htmlFor:t,children:e}),a,n?(0,d.jsx)(`p`,{className:`text-sm text-text-secondary`,children:n}):null,i?(0,d.jsx)(`p`,{className:`text-sm font-medium text-danger`,role:`alert`,children:i}):null]})}var d;function f(){return(f=e((()=>{n(),d=t(),u.__docgenInfo={description:"入力欄に、見出し、補足の文、誤りの文を添える枠。欄は `children` に渡す。",methods:[],displayName:`FormField`,props:{label:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},htmlFor:{required:!1,tsType:{name:`string`},description:"見出しを結び付ける欄の `id`。"},description:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:`欄の下に出す補足の文。`},error:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:'欄の下に出す誤りの文。`role="alert"` で読み上げる。'}}}})))()}var p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{f(),i(),o(),c(),p=t(),m={title:`UI/FormField`,component:u,args:{label:`Field label`,children:(0,p.jsx)(a,{placeholder:`Input value`})},decorators:[e=>(0,p.jsx)(`div`,{className:`max-w-md`,children:(0,p.jsx)(e,{})})]},h={render:()=>(0,p.jsx)(u,{label:`Field label`,htmlFor:`field-default`,description:`Short help text for the input.`,children:(0,p.jsx)(a,{id:`field-default`,placeholder:`Input value`})})},g={render:()=>(0,p.jsx)(u,{label:`Field label`,htmlFor:`field-error`,error:`Enter a valid value.`,children:(0,p.jsx)(a,{id:`field-error`,"aria-invalid":`true`,defaultValue:`Invalid value`})})},_={render:()=>(0,p.jsx)(u,{label:`Field label`,htmlFor:`field-disabled`,children:(0,p.jsx)(a,{id:`field-disabled`,disabled:!0,placeholder:`Disabled input`})})},v={render:()=>(0,p.jsx)(a,{placeholder:`Input value`})},y={render:()=>(0,p.jsx)(a,{"aria-invalid":`true`,defaultValue:`Invalid value`})},b={render:()=>(0,p.jsxs)(s,{defaultValue:`option-a`,"aria-label":`Field label`,children:[(0,p.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,p.jsx)(`option`,{value:`option-b`,children:`Option B`}),(0,p.jsx)(`option`,{value:`option-c`,children:`Option C`})]})},x={render:()=>(0,p.jsxs)(s,{defaultValue:`option-a`,disabled:!0,"aria-label":`Field label`,children:[(0,p.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,p.jsx)(`option`,{value:`option-b`,children:`Option B`})]})},S={render:()=>(0,p.jsx)(l,{placeholder:`Textarea value`})},C={render:()=>(0,p.jsx)(l,{"aria-invalid":`true`,defaultValue:`Invalid value`})},w=[`Default`,`Error`,`Disabled`,`InputDefault`,`InputError`,`SelectDefault`,`SelectDisabled`,`TextareaDefault`,`TextareaError`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-default" description="Short help text for the input.">
      <Input id="field-default" placeholder="Input value" />
    </FormField>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-error" error="Enter a valid value.">
      <Input id="field-error" aria-invalid="true" defaultValue="Invalid value" />
    </FormField>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-disabled">
      <Input id="field-disabled" disabled placeholder="Disabled input" />
    </FormField>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Input placeholder="Input value" />
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Input aria-invalid="true" defaultValue="Invalid value" />
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
      <option value="option-c">Option C</option>
    </Select>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Textarea value" />
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-invalid="true" defaultValue="Invalid value" />
}`,...C.parameters?.docs?.source}}}})))()}T();export{h as Default,_ as Disabled,g as Error,v as InputDefault,y as InputError,b as SelectDefault,x as SelectDisabled,S as TextareaDefault,C as TextareaError,w as __namedExportsOrder,m as default};