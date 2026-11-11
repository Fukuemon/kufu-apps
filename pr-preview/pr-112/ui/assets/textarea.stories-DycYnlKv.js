import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./target-size-CDXnB7gz.js";import{n as r,t as i}from"./textarea-DUXrYzV1.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r(),{within:a}=__STORYBOOK_MODULE_TEST__,o={title:`UI/Textarea`,component:i,args:{placeholder:`相談内容を入力`}},s={play:async({canvasElement:e})=>{await n(a(e).getByRole(`textbox`))}},c={args:{"aria-invalid":!0,defaultValue:`バリデーションエラー時の表示`}},l={args:{disabled:!0,defaultValue:`編集不可の値`}},u={args:{defaultValue:`複数行の長文が入力されたときの field-sizing による高さ追従を確認する。
加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整する。
材料選定の相談、加工工程の検討、納期と品質の調整、検査観点の整理までを一気通貫で扱う。`}},d=[`Default`,`Invalid`,`Disabled`,`LongValue`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("textbox"));
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "バリデーションエラー時の表示"
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "編集不可の値"
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "複数行の長文が入力されたときの field-sizing による高さ追従を確認する。\\n加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整する。\\n材料選定の相談、加工工程の検討、納期と品質の調整、検査観点の整理までを一気通貫で扱う。"
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{s as Default,l as Disabled,c as Invalid,u as LongValue,d as __namedExportsOrder,o as default};