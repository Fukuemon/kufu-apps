import{j as e}from"./jsx-runtime-u17CrQMm.js";import{c as m}from"./utils-BQHNewu7.js";import{r as p}from"./iframe-DSON_Uwq.js";import{u as c}from"./useRenderElement-DtGOCEBs.js";import"./preload-helper-PPVm8Dsz.js";const l=p.forwardRef(function(t,s){const{className:u,render:x,orientation:d="horizontal",style:f,...i}=t;return c("div",t,{state:{orientation:d},ref:s,props:[{role:"separator","aria-orientation":d},i]})});function o({className:n,orientation:t="horizontal",...s}){return e.jsx(l,{"data-slot":"separator",orientation:t,className:m("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",n),...s})}o.__docgenInfo={description:"",methods:[],displayName:"Separator",props:{orientation:{defaultValue:{value:'"horizontal"',computed:!1},required:!1}}};const b={title:"UI/Separator",component:o},r={render:()=>e.jsxs("div",{className:"grid max-w-md gap-4",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Content above the separator."}),e.jsx(o,{}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Content below the separator."})]})},a={render:()=>e.jsxs("div",{className:"flex h-12 items-center gap-4 text-sm text-muted-foreground",children:[e.jsx("span",{children:"First"}),e.jsx(o,{orientation:"vertical"}),e.jsx("span",{children:"Second"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-md gap-4">
      <p className="text-sm text-muted-foreground">
        Content above the separator.
      </p>
      <Separator />
      <p className="text-sm text-muted-foreground">
        Content below the separator.
      </p>
    </div>
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-12 items-center gap-4 text-sm text-muted-foreground">
      <span>First</span>
      <Separator orientation="vertical" />
      <span>Second</span>
    </div>
}`,...a.parameters?.docs?.source}}};const z=["Default","Vertical"];export{r as Default,a as Vertical,z as __namedExportsOrder,b as default};
