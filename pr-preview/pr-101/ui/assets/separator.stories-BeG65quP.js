import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./clsx-DSXoiAHx.js";function i({orientation:e=`horizontal`,...t}){return(0,a.jsx)(`hr`,{"data-slot":`separator`,"aria-orientation":e,className:r(`shrink-0 overflow-visible border-0 bg-divider`,e===`horizontal`?`h-px w-full`:`h-auto w-px self-stretch`),...t})}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:`内容の区切りの線。`,methods:[],displayName:`Separator`,props:{orientation:{required:!1,tsType:{name:`union`,raw:`"horizontal" | "vertical"`,elements:[{name:`literal`,value:`"horizontal"`},{name:`literal`,value:`"vertical"`}]},description:`線の向き。vertical は、横に並べた要素の間に、親の高さの縦の線を引く。`,defaultValue:{value:`"horizontal"`,computed:!1}}}}})))()}var s,c,l,u,d;function f(){return(f=e((()=>{o(),s=t(),c={title:`UI/Separator`,component:i},l={render:()=>(0,s.jsxs)(`div`,{className:`grid max-w-md gap-4`,children:[(0,s.jsx)(`p`,{className:`text-body text-text-secondary`,children:`Content above the separator.`}),(0,s.jsx)(i,{}),(0,s.jsx)(`p`,{className:`text-body text-text-secondary`,children:`Content below the separator.`})]})},u={render:()=>(0,s.jsxs)(`div`,{className:`flex h-12 items-center gap-4 text-body text-text-secondary`,children:[(0,s.jsx)(`span`,{children:`First`}),(0,s.jsx)(i,{orientation:`vertical`}),(0,s.jsx)(`span`,{children:`Second`})]})},d=[`Default`,`Vertical`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-md gap-4">
      <p className="text-body text-text-secondary">
        Content above the separator.
      </p>
      <Separator />
      <p className="text-body text-text-secondary">
        Content below the separator.
      </p>
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-12 items-center gap-4 text-body text-text-secondary">
      <span>First</span>
      <Separator orientation="vertical" />
      <span>Second</span>
    </div>
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as Default,u as Vertical,d as __namedExportsOrder,c as default};