import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{n,t as r}from"./target-size-CDXnB7gz.js";import{n as i,t as a}from"./Textarea-Dj9JiUs-.js";var o=t({Default:()=>d,Disabled:()=>p,Focused:()=>g,Hover:()=>h,Invalid:()=>f,LongValue:()=>m,__namedExportsOrder:()=>_,default:()=>u}),s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),i(),{expect:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`コンポーネント/Base/Textarea`,component:a,args:{placeholder:`相談内容を入力`}},d={play:async({canvasElement:e})=>{await r(l(e).getByRole(`textbox`))}},f={args:{"aria-invalid":!0,defaultValue:`バリデーションエラー時の表示`}},p={args:{disabled:!0,defaultValue:`編集不可の値`}},m={args:{defaultValue:`複数行の長文が入力されたときの field-sizing による高さ追従を確認する。
加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整する。
材料選定の相談、加工工程の検討、納期と品質の調整、検査観点の整理までを一気通貫で扱う。`}},h={parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},g={play:async({canvasElement:e})=>{await c.tab(),await s(l(e).getByRole(`textbox`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},_=[`Default`,`Invalid`,`Disabled`,`LongValue`,`Hover`,`Focused`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("textbox"));
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "バリデーションエラー時の表示"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "編集不可の値"
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "複数行の長文が入力されたときの field-sizing による高さ追従を確認する。\\n加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整する。\\n材料選定の相談、加工工程の検討、納期と品質の調整、検査観点の整理までを一気通貫で扱う。"
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      hover: true
    }
  },
  // 枠の色の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...g.parameters?.docs?.source}}}})))()}export{f as a,v as c,h as i,p as n,m as o,g as r,o as s,d as t};