import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./target-size-CDXnB7gz.js";import{n as r,t as i}from"./Textarea-SNOX8Ewi.js";var a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),r(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`コンポーネント/Base/Textarea`,component:i,args:{placeholder:`相談内容を入力`}},l={play:async({canvasElement:e})=>{await n(s(e).getByRole(`textbox`))}},u={args:{"aria-invalid":!0,defaultValue:`バリデーションエラー時の表示`}},d={args:{disabled:!0,defaultValue:`編集不可の値`}},f={args:{defaultValue:`複数行の長文が入力されたときの field-sizing による高さ追従を確認する。
加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整する。
材料選定の相談、加工工程の検討、納期と品質の調整、検査観点の整理までを一気通貫で扱う。`}},p={parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},m={play:async({canvasElement:e})=>{await o.tab(),await a(s(e).getByRole(`textbox`)).toHaveFocus(),await new Promise(e=>setTimeout(e,400))}},h=[`Default`,`Invalid`,`Disabled`,`LongValue`,`Hover`,`Focused`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("textbox"));
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "バリデーションエラー時の表示"
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "編集不可の値"
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "複数行の長文が入力されたときの field-sizing による高さ追従を確認する。\\n加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整する。\\n材料選定の相談、加工工程の検討、納期と品質の調整、検査観点の整理までを一気通貫で扱う。"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      hover: true
    }
  },
  // 枠の色の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{l as Default,d as Disabled,m as Focused,p as Hover,u as Invalid,f as LongValue,h as __namedExportsOrder,c as default};