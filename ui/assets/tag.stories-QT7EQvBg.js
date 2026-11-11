import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{n,t as r}from"./badge-CHfrlmad.js";function i(e){return(0,a.jsx)(r,{"data-slot":`tag`,...e})}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:`事業の分類や入力の項目に添える印。見た目は Badge と同じである。`,methods:[],displayName:`Tag`,props:{size:{required:!1,tsType:{name:`union`,raw:`"default" | "sm"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"sm"`}]},description:``},tone:{required:!1,tsType:{name:`union`,raw:`"default" | "required" | "optional"`,elements:[{name:`literal`,value:`"default"`},{name:`literal`,value:`"required"`},{name:`literal`,value:`"optional"`}]},description:``}}}})))()}var s,c,l,u,d,f;function p(){return(p=e((()=>{o(),s=t(),c={title:`UI/Tag`,component:i,args:{children:`製品カテゴリ`}},l={},u={render:()=>(0,s.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,s.jsx)(i,{size:`sm`,children:`既定`}),(0,s.jsx)(i,{size:`sm`,tone:`required`,children:`必須`}),(0,s.jsx)(i,{size:`sm`,tone:`optional`,children:`任意`})]})},d={args:{children:`長いタグ表記が崩れないかを確認するためのカテゴリ名の例`}},f=[`Default`,`Tones`,`LongLabel`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-2">
      <Tag size="sm">既定</Tag>
      <Tag size="sm" tone="required">
        必須
      </Tag>
      <Tag size="sm" tone="optional">
        任意
      </Tag>
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "長いタグ表記が崩れないかを確認するためのカテゴリ名の例"
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{l as Default,d as LongLabel,u as Tones,f as __namedExportsOrder,c as default};