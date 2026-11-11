import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./target-size-CDXnB7gz.js";import{n as r,t as i}from"./input-C6Uad54w.js";function a(e){let t=document.createElement(`span`);t.style.color=`var(${e})`,document.body.append(t);let n=getComputedStyle(t).color;return t.remove(),n}var o,s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{r(),t(),{expect:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`UI/Input`,component:i,args:{placeholder:`会社名を入力`}},u={play:async({canvasElement:e})=>{await n(c(e).getByRole(`textbox`))}},d={args:{"aria-invalid":!0,defaultValue:`invalid@value`}},f={play:async({canvasElement:e})=>{await s.tab(),await o(c(e).getByRole(`textbox`)).toHaveFocus()}},p={args:{"aria-invalid":!0,defaultValue:`invalid@value`},play:async({canvasElement:e})=>{await s.tab();let t=c(e).getByRole(`textbox`);await o(t).toHaveFocus(),await Promise.all(t.getAnimations().map(e=>e.finished));let n=a(`--kufu-color-focus-outline`),r=a(`--kufu-color-focus-halo`),i=getComputedStyle(t);await o(i.outlineStyle).toBe(`solid`),await o(i.outlineWidth).toBe(`4px`),await o(i.outlineColor).toBe(n),await o(i.boxShadow).toContain(r)}},m={args:{disabled:!0,defaultValue:`編集不可の値`}},h={args:{defaultValue:`入力値が入力欄の幅を超えたときのスクロールと省略の挙動を確認するための長い文字列を入れている`}},g=[`Default`,`Invalid`,`Focused`,`InvalidFocused`,`Disabled`,`LongValue`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("textbox"));
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value"
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value"
  },
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    const input = within(canvasElement).getByRole("textbox");
    await expect(input).toHaveFocus();
    // transition-colors が線の色を変える遷移の、終わりの色を見る
    await Promise.all(input.getAnimations().map(a => a.finished));
    const line = resolveColor("--kufu-color-focus-outline"); // design-system-allow: focus-ring が出した色と比べる
    const halo = resolveColor("--kufu-color-focus-halo"); // design-system-allow: focus-ring が出した色と比べる
    const style = getComputedStyle(input);
    await expect(style.outlineStyle).toBe("solid");
    await expect(style.outlineWidth).toBe("4px");
    await expect(style.outlineColor).toBe(line);
    await expect(style.boxShadow).toContain(halo);
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "編集不可の値"
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "入力値が入力欄の幅を超えたときのスクロールと省略の挙動を確認するための長い文字列を入れている"
  }
}`,...h.parameters?.docs?.source}}}})))()}_();export{u as Default,m as Disabled,f as Focused,d as Invalid,p as InvalidFocused,h as LongValue,g as __namedExportsOrder,l as default};