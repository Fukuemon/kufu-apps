import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{n,t as r}from"./target-size-CDXnB7gz.js";import{n as i,t as a}from"./TextInput-W9RAezTw.js";var o=t({Default:()=>f,Disabled:()=>g,Focused:()=>m,Hover:()=>v,Invalid:()=>p,InvalidFocused:()=>h,LongValue:()=>_,__namedExportsOrder:()=>y,default:()=>d});function s(e){let t=document.createElement(`span`);t.style.color=`var(${e})`,document.body.append(t);let n=getComputedStyle(t).color;return t.remove(),n}var c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{i(),n(),{expect:c,userEvent:l,within:u}=__STORYBOOK_MODULE_TEST__,d={title:`コンポーネント/Base/TextInput`,component:a,args:{placeholder:`会社名を入力`}},f={play:async({canvasElement:e})=>{await r(u(e).getByRole(`textbox`))}},p={args:{"aria-invalid":!0,defaultValue:`invalid@value`}},m={play:async({canvasElement:e})=>{await l.tab(),await c(u(e).getByRole(`textbox`)).toHaveFocus()}},h={args:{"aria-invalid":!0,defaultValue:`invalid@value`},play:async({canvasElement:e})=>{await l.tab();let t=u(e).getByRole(`textbox`);await c(t).toHaveFocus(),await Promise.all(t.getAnimations().map(e=>e.finished));let n=s(`--kufu-color-focus-outline`),r=s(`--kufu-color-focus-halo`),i=getComputedStyle(t);await c(i.outlineStyle).toBe(`solid`),await c(i.outlineWidth).toBe(`4px`),await c(i.outlineColor).toBe(n),await c(i.boxShadow).toContain(r)}},g={args:{disabled:!0,defaultValue:`編集不可の値`}},_={args:{defaultValue:`入力値が入力欄の幅を超えたときのスクロールと省略の挙動を確認するための長い文字列を入れている`}},v={parameters:{pseudo:{hover:!0}},play:async()=>{await new Promise(e=>setTimeout(e,400))}},y=[`Default`,`Invalid`,`Focused`,`InvalidFocused`,`Disabled`,`LongValue`,`Hover`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expectTargetSize(within(canvasElement).getByRole("textbox"));
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value"
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "編集不可の値"
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "入力値が入力欄の幅を超えたときのスクロールと省略の挙動を確認するための長い文字列を入れている"
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      hover: true
    }
  },
  // 枠の色の transition が終わるのを待つ
  play: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
  }
}`,...v.parameters?.docs?.source}}}})))()}export{p as a,o as c,v as i,b as l,g as n,h as o,m as r,_ as s,f as t};