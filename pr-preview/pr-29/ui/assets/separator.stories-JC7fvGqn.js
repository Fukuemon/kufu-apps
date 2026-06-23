import{i as e}from"./preload-helper-xPQekRTU.js";import{n as t,r as n,t as r}from"./jsx-runtime-DBo2vq09.js";import{n as i,t as a}from"./Separator-DHuzagAn.js";var o=e((()=>{i()}));function s({className:e,orientation:n=`horizontal`,...r}){return(0,c.jsx)(a,{"data-slot":`separator`,orientation:n,className:t(`shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`,e),...r})}var c,l=e((()=>{o(),n(),c=r(),s.__docgenInfo={description:``,methods:[],displayName:`Separator`,props:{orientation:{defaultValue:{value:`"horizontal"`,computed:!1},required:!1}}}})),u,d,f,p,m;e((()=>{l(),u=r(),d={title:`Primitives/Separator`,component:s},f={render:()=>(0,u.jsxs)(`div`,{className:`grid max-w-md gap-4`,children:[(0,u.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Content above the separator.`}),(0,u.jsx)(s,{}),(0,u.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Content below the separator.`})]})},p={render:()=>(0,u.jsxs)(`div`,{className:`flex h-12 items-center gap-4 text-sm text-muted-foreground`,children:[(0,u.jsx)(`span`,{children:`First`}),(0,u.jsx)(s,{orientation:`vertical`}),(0,u.jsx)(`span`,{children:`Second`})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-md gap-4">
      <p className="text-sm text-muted-foreground">
        Content above the separator.
      </p>
      <Separator />
      <p className="text-sm text-muted-foreground">
        Content below the separator.
      </p>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-12 items-center gap-4 text-sm text-muted-foreground">
      <span>First</span>
      <Separator orientation="vertical" />
      <span>Second</span>
    </div>
}`,...p.parameters?.docs?.source}}},m=[`Default`,`Vertical`]}))();export{f as Default,p as Vertical,m as __namedExportsOrder,d as default};