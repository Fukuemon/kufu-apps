import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{f as t}from"./iframe-BMWM_Fuo.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./utils-BXDUjCpB.js";import{n as a,t as o}from"./label-DojAFrGw.js";import{a as s,i as c,n as l,o as u,r as d,t as f}from"./select-Dvor7nt9.js";import{n as p,t as m}from"./input-DQR1pl7k.js";import{n as h,t as g}from"./textarea-DnbzWNSn.js";function _({className:e,label:t,htmlFor:n,description:r,error:a,children:s,...c}){return(0,v.jsxs)(`div`,{"data-slot":`form-field`,className:i(`grid gap-2`,e),...c,children:[(0,v.jsx)(o,{htmlFor:n,children:t}),s,r?(0,v.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:r}):null,a?(0,v.jsx)(`p`,{className:`text-sm font-medium text-destructive`,role:`alert`,children:a}):null]})}var v;function y(){return(y=e((()=>{t(),a(),r(),v=n(),_.__docgenInfo={description:``,methods:[],displayName:`FormField`,props:{label:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},htmlFor:{required:!1,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},error:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``}}}})))()}var b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{y(),p(),u(),h(),b=n(),x={title:`UI/FormField`,component:_,args:{label:`Field label`,children:(0,b.jsx)(m,{placeholder:`Input value`})},decorators:[e=>(0,b.jsx)(`div`,{className:`max-w-md`,children:(0,b.jsx)(e,{})})]},S={render:()=>(0,b.jsx)(_,{label:`Field label`,htmlFor:`field-default`,description:`Short help text for the input.`,children:(0,b.jsx)(m,{id:`field-default`,placeholder:`Input value`})})},C={render:()=>(0,b.jsx)(_,{label:`Field label`,htmlFor:`field-error`,error:`Enter a valid value.`,children:(0,b.jsx)(m,{id:`field-error`,"aria-invalid":`true`,defaultValue:`Invalid value`})})},w={render:()=>(0,b.jsx)(_,{label:`Field label`,htmlFor:`field-disabled`,children:(0,b.jsx)(m,{id:`field-disabled`,disabled:!0,placeholder:`Disabled input`})})},T={render:()=>(0,b.jsx)(m,{placeholder:`Input value`})},E={render:()=>(0,b.jsx)(m,{"aria-invalid":`true`,defaultValue:`Invalid value`})},D={render:()=>(0,b.jsxs)(f,{defaultValue:`option-a`,children:[(0,b.jsx)(c,{className:`w-full`,children:(0,b.jsx)(s,{placeholder:`Select an option`})}),(0,b.jsxs)(l,{children:[(0,b.jsx)(d,{value:`option-a`,children:`Option A`}),(0,b.jsx)(d,{value:`option-b`,children:`Option B`}),(0,b.jsx)(d,{value:`option-c`,children:`Option C`})]})]})},O={render:()=>(0,b.jsxs)(f,{defaultValue:`option-a`,disabled:!0,children:[(0,b.jsx)(c,{className:`w-full`,children:(0,b.jsx)(s,{})}),(0,b.jsxs)(l,{children:[(0,b.jsx)(d,{value:`option-a`,children:`Option A`}),(0,b.jsx)(d,{value:`option-b`,children:`Option B`})]})]})},k={render:()=>(0,b.jsx)(g,{placeholder:`Textarea value`})},A={render:()=>(0,b.jsx)(g,{"aria-invalid":`true`,defaultValue:`Invalid value`})},j=[`Default`,`Error`,`Disabled`,`InputDefault`,`InputError`,`SelectDefault`,`SelectDisabled`,`TextareaDefault`,`TextareaError`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-default" description="Short help text for the input.">
      <Input id="field-default" placeholder="Input value" />
    </FormField>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-error" error="Enter a valid value.">
      <Input id="field-error" aria-invalid="true" defaultValue="Invalid value" />
    </FormField>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-disabled">
      <Input id="field-disabled" disabled placeholder="Disabled input" />
    </FormField>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <Input placeholder="Input value" />
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <Input aria-invalid="true" defaultValue="Invalid value" />
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
        <SelectItem value="option-b">Option B</SelectItem>
        <SelectItem value="option-c">Option C</SelectItem>
      </SelectContent>
    </Select>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
        <SelectItem value="option-b">Option B</SelectItem>
      </SelectContent>
    </Select>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Textarea value" />
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-invalid="true" defaultValue="Invalid value" />
}`,...A.parameters?.docs?.source}}}})))()}M();export{S as Default,w as Disabled,C as Error,T as InputDefault,E as InputError,D as SelectDefault,O as SelectDisabled,k as TextareaDefault,A as TextareaError,j as __namedExportsOrder,x as default};