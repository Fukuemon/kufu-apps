import{j as e}from"./jsx-runtime-u17CrQMm.js";import{b as c}from"./button-p89GMKx0.js";import{c as f}from"./utils-BQHNewu7.js";import"./index-LHNt3CwB.js";import"./iframe-BvNHz319.js";import"./preload-helper-PPVm8Dsz.js";import"./useButton-Bd47yq57.js";import"./useIsoLayoutEffect-C4wmQpCM.js";import"./useRenderElement-XXmAj0_L.js";function a({className:l,variant:d="default",size:u="default",disabled:n=!1,...o}){return e.jsx("a",{"data-slot":"link-button","data-disabled":n?"":void 0,"aria-disabled":n,tabIndex:n?-1:o.tabIndex,className:f(c({variant:d,size:u}),n&&"pointer-events-none opacity-50",l),...o})}a.__docgenInfo={description:"",methods:[],displayName:"LinkButton",props:{disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},variant:{defaultValue:{value:'"default"',computed:!1},required:!1},size:{defaultValue:{value:'"default"',computed:!1},required:!1}}};const B={title:"UI/LinkButton",component:a,args:{href:"#",children:"Link button"}},r={},t={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(a,{href:"#",children:"Default"}),e.jsx(a,{href:"#",variant:"secondary",children:"Secondary"}),e.jsx(a,{href:"#",variant:"outline",children:"Outline"}),e.jsx(a,{href:"#",variant:"ghost",children:"Ghost"}),e.jsx(a,{href:"#",variant:"destructive",children:"Destructive"}),e.jsx(a,{href:"#",variant:"link",children:"Link"})]})},s={args:{disabled:!0,children:"Disabled link"}},i={args:{children:"図面が固まっていない段階の相談も受け付けているリンクボタン"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-3">
      <LinkButton href="#">Default</LinkButton>
      <LinkButton href="#" variant="secondary">
        Secondary
      </LinkButton>
      <LinkButton href="#" variant="outline">
        Outline
      </LinkButton>
      <LinkButton href="#" variant="ghost">
        Ghost
      </LinkButton>
      <LinkButton href="#" variant="destructive">
        Destructive
      </LinkButton>
      <LinkButton href="#" variant="link">
        Link
      </LinkButton>
    </div>
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled link"
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "図面が固まっていない段階の相談も受け付けているリンクボタン"
  }
}`,...i.parameters?.docs?.source}}};const j=["Default","Variants","Disabled","LongLabel"];export{r as Default,s as Disabled,i as LongLabel,t as Variants,j as __namedExportsOrder,B as default};
