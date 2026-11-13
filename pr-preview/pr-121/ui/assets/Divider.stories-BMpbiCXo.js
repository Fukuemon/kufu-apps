import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./clsx-DSXoiAHx.js";function a({orientation:e=`horizontal`,...t}){return(0,o.jsx)(`hr`,{"data-slot":`divider`,"aria-orientation":e,className:i(`shrink-0 overflow-visible border-0 bg-divider`,e===`horizontal`?`h-px w-full`:`h-auto w-px self-stretch`),...t})}var o;function s(){return(s=e((()=>{r(),o=n(),a.__docgenInfo={description:`内容の区切りの線。`,methods:[],displayName:`Divider`,props:{orientation:{required:!1,tsType:{name:`union`,raw:`"horizontal" | "vertical"`,elements:[{name:`literal`,value:`"horizontal"`},{name:`literal`,value:`"vertical"`}]},description:`線の向き。vertical は、横に並べた要素の間に、親の高さの縦の線を引く。`,defaultValue:{value:`"horizontal"`,computed:!1}}}}})))()}var c=t({Default:()=>d,Vertical:()=>f,__namedExportsOrder:()=>p,default:()=>u}),l,u,d,f,p;function m(){return(m=e((()=>{s(),l=n(),u={title:`コンポーネント/Base/Divider`,component:a},d={render:()=>(0,l.jsxs)(`div`,{className:`grid max-w-md gap-4`,children:[(0,l.jsx)(`p`,{className:`text-body text-text-secondary`,children:`Content above the separator.`}),(0,l.jsx)(a,{}),(0,l.jsx)(`p`,{className:`text-body text-text-secondary`,children:`Content below the separator.`})]})},f={render:()=>(0,l.jsxs)(`div`,{className:`flex h-12 items-center gap-4 text-body text-text-secondary`,children:[(0,l.jsx)(`span`,{children:`First`}),(0,l.jsx)(a,{orientation:`vertical`}),(0,l.jsx)(`span`,{children:`Second`})]})},p=[`Default`,`Vertical`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-md gap-4">
      <p className="text-body text-text-secondary">
        Content above the separator.
      </p>
      <Divider />
      <p className="text-body text-text-secondary">
        Content below the separator.
      </p>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-12 items-center gap-4 text-body text-text-secondary">
      <span>First</span>
      <Divider orientation="vertical" />
      <span>Second</span>
    </div>
}`,...f.parameters?.docs?.source}}}})))()}export{a,m as i,c as n,s as o,f as r,d as t};