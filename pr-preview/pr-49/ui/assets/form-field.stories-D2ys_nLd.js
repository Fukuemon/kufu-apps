import{j as e}from"./jsx-runtime-u17CrQMm.js";import{L as N}from"./label-D2aBq809.js";import{c as D}from"./utils-BQHNewu7.js";import{I as r}from"./input-8nmCA-51.js";import{S,a as h,b as v,c as b,d as a}from"./select-sWJgcLJ7.js";import{T as I}from"./textarea-oytfaW6t.js";import"./iframe-DSON_Uwq.js";import"./preload-helper-PPVm8Dsz.js";import"./createBaseUIEventDetails-BbONZXbD.js";import"./useRenderElement-DtGOCEBs.js";import"./useIsoLayoutEffect-DIcOxsuu.js";import"./index-DMyM-u5q.js";import"./index-C0zvrzMk.js";import"./useButton-CUf85DSg.js";function l({className:m,label:j,htmlFor:F,description:f,error:x,children:g,...T}){return e.jsxs("div",{"data-slot":"form-field",className:D("grid gap-2",m),...T,children:[e.jsx(N,{htmlFor:F,children:j}),g,f?e.jsx("p",{className:"text-sm text-muted-foreground",children:f}):null,x?e.jsx("p",{className:"text-sm font-medium text-destructive",role:"alert",children:x}):null]})}l.__docgenInfo={description:"",methods:[],displayName:"FormField",props:{label:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},htmlFor:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},error:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const z={title:"UI/FormField",component:l,args:{label:"Field label",children:e.jsx(r,{placeholder:"Input value"})},decorators:[m=>e.jsx("div",{className:"max-w-md",children:e.jsx(m,{})})]},t={render:()=>e.jsx(l,{label:"Field label",htmlFor:"field-default",description:"Short help text for the input.",children:e.jsx(r,{id:"field-default",placeholder:"Input value"})})},o={render:()=>e.jsx(l,{label:"Field label",htmlFor:"field-error",error:"Enter a valid value.",children:e.jsx(r,{id:"field-error","aria-invalid":"true",defaultValue:"Invalid value"})})},n={render:()=>e.jsx(l,{label:"Field label",htmlFor:"field-disabled",children:e.jsx(r,{id:"field-disabled",disabled:!0,placeholder:"Disabled input"})})},d={render:()=>e.jsx(r,{placeholder:"Input value"})},s={render:()=>e.jsx(r,{"aria-invalid":"true",defaultValue:"Invalid value"})},i={render:()=>e.jsxs(S,{defaultValue:"option-a",children:[e.jsx(h,{className:"w-full",children:e.jsx(v,{placeholder:"Select an option"})}),e.jsxs(b,{children:[e.jsx(a,{value:"option-a",children:"Option A"}),e.jsx(a,{value:"option-b",children:"Option B"}),e.jsx(a,{value:"option-c",children:"Option C"})]})]})},c={render:()=>e.jsxs(S,{defaultValue:"option-a",disabled:!0,children:[e.jsx(h,{className:"w-full",children:e.jsx(v,{})}),e.jsxs(b,{children:[e.jsx(a,{value:"option-a",children:"Option A"}),e.jsx(a,{value:"option-b",children:"Option B"})]})]})},u={render:()=>e.jsx(I,{placeholder:"Textarea value"})},p={render:()=>e.jsx(I,{"aria-invalid":"true",defaultValue:"Invalid value"})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-default" description="Short help text for the input.">
      <Input id="field-default" placeholder="Input value" />
    </FormField>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-error" error="Enter a valid value.">
      <Input id="field-error" aria-invalid="true" defaultValue="Invalid value" />
    </FormField>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-disabled">
      <Input id="field-disabled" disabled placeholder="Disabled input" />
    </FormField>
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Input placeholder="Input value" />
}`,...d.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Input aria-invalid="true" defaultValue="Invalid value" />
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
        <SelectItem value="option-b">Option B</SelectItem>
      </SelectContent>
    </Select>
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Textarea value" />
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-invalid="true" defaultValue="Invalid value" />
}`,...p.parameters?.docs?.source}}};const G=["Default","Error","Disabled","InputDefault","InputError","SelectDefault","SelectDisabled","TextareaDefault","TextareaError"];export{t as Default,n as Disabled,o as Error,d as InputDefault,s as InputError,i as SelectDefault,c as SelectDisabled,u as TextareaDefault,p as TextareaError,G as __namedExportsOrder,z as default};
