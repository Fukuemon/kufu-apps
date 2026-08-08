import{j as a}from"./jsx-runtime-u17CrQMm.js";import{B as o}from"./badge-e3wypnlT.js";import"./index-LHNt3CwB.js";import"./utils-BQHNewu7.js";import"./useRenderElement-XXmAj0_L.js";import"./iframe-BvNHz319.js";import"./preload-helper-PPVm8Dsz.js";function e(i){return a.jsx(o,{"data-slot":"tag",...i})}e.__docgenInfo={description:"",methods:[],displayName:"Tag"};const u={title:"UI/Tag",component:e,args:{children:"製品カテゴリ"}},r={},s={render:()=>a.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.jsx(e,{children:"製品カテゴリ"}),a.jsx(e,{variant:"secondary",children:"メーカー"}),a.jsx(e,{variant:"destructive",children:"要確認"}),a.jsx(e,{variant:"outline",children:"加工・組立"}),a.jsx(e,{variant:"ghost",children:"補足"}),a.jsx(e,{variant:"link",children:"リンク"})]})},n={render:()=>a.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[a.jsx(e,{size:"sm",children:"必須"}),a.jsx(e,{size:"sm",variant:"secondary",children:"任意"})]})},t={args:{children:"長いタグ表記が崩れないかを確認するためのカテゴリ名の例"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Tag>製品カテゴリ</Tag>
      <Tag variant="secondary">メーカー</Tag>
      <Tag variant="destructive">要確認</Tag>
      <Tag variant="outline">加工・組立</Tag>
      <Tag variant="ghost">補足</Tag>
      <Tag variant="link">リンク</Tag>
    </div>
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-2">
      <Tag size="sm">必須</Tag>
      <Tag size="sm" variant="secondary">
        任意
      </Tag>
    </div>
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "長いタグ表記が崩れないかを確認するためのカテゴリ名の例"
  }
}`,...t.parameters?.docs?.source}}};const v=["Default","Variants","Compact","LongLabel"];export{n as Compact,r as Default,t as LongLabel,s as Variants,v as __namedExportsOrder,u as default};
