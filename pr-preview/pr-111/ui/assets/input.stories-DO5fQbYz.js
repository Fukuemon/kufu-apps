import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./input-DElN59Hr.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),{expect:r,userEvent:i,within:a}=__STORYBOOK_MODULE_TEST__,o={title:`UI/Input`,component:n,args:{placeholder:`会社名を入力`}},s={},c={args:{"aria-invalid":!0,defaultValue:`invalid@value`}},l={play:async({canvasElement:e})=>{await i.tab(),await r(a(e).getByRole(`textbox`)).toHaveFocus()}},u={args:{"aria-invalid":!0,defaultValue:`invalid@value`},play:async({canvasElement:e})=>{await i.tab(),await r(a(e).getByRole(`textbox`)).toHaveFocus()}},d={args:{disabled:!0,defaultValue:`編集不可の値`}},f={args:{defaultValue:`入力値が入力欄の幅を超えたときのスクロールと省略の挙動を確認するための長い文字列を入れている`}},p=[`Default`,`Invalid`,`Focused`,`InvalidFocused`,`Disabled`,`LongValue`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value"
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value"
  },
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "編集不可の値"
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "入力値が入力欄の幅を超えたときのスクロールと省略の挙動を確認するための長い文字列を入れている"
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{s as Default,d as Disabled,l as Focused,c as Invalid,u as InvalidFocused,f as LongValue,p as __namedExportsOrder,o as default};