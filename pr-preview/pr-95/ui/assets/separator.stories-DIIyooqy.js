import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./utils-BXDUjCpB.js";import{n as i,t as a}from"./Separator-DvLuvkqe.js";function o({className:e,orientation:t=`horizontal`,...n}){return(0,s.jsx)(a,{"data-slot":`separator`,orientation:t,className:r(`shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`,e),...n})}var s;function c(){return(c=e((()=>{i(),n(),s=t(),o.__docgenInfo={description:``,methods:[],displayName:`Separator`,props:{orientation:{defaultValue:{value:`"horizontal"`,computed:!1},required:!1}}}})))()}var l,u,d,f,p;function m(){return(m=e((()=>{c(),l=t(),u={title:`UI/Separator`,component:o},d={render:()=>(0,l.jsxs)(`div`,{className:`grid max-w-md gap-4`,children:[(0,l.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Content above the separator.`}),(0,l.jsx)(o,{}),(0,l.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Content below the separator.`})]})},f={render:()=>(0,l.jsxs)(`div`,{className:`flex h-12 items-center gap-4 text-sm text-muted-foreground`,children:[(0,l.jsx)(`span`,{children:`First`}),(0,l.jsx)(o,{orientation:`vertical`}),(0,l.jsx)(`span`,{children:`Second`})]})},p=[`Default`,`Vertical`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-md gap-4">
      <p className="text-sm text-muted-foreground">
        Content above the separator.
      </p>
      <Separator />
      <p className="text-sm text-muted-foreground">
        Content below the separator.
      </p>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-12 items-center gap-4 text-sm text-muted-foreground">
      <span>First</span>
      <Separator orientation="vertical" />
      <span>Second</span>
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{d as Default,f as Vertical,p as __namedExportsOrder,u as default};