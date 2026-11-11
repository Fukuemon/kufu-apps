import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{f as t}from"./iframe-lYA-jfbb.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./FormFieldContext-C8tf57DR.js";import{n as a,t as o}from"./Tag-BjYNw7uM.js";import{n as s,t as c}from"./TextInput-D0V14sRe.js";import{n as l,t as u}from"./Select-t1qTsuho.js";import{n as d,t as f}from"./Textarea-Duj8YvlP.js";function p({label:e,htmlFor:t,description:n,error:r,required:a=!1,optional:s=!1,children:c,...l}){let u=(0,m.useId)(),d=t??u,f=n?`${d}-description`:void 0,p=r?`${d}-error`:void 0,g=[f,p].filter(Boolean).join(` `)||void 0;return(0,h.jsx)(i.Provider,{value:{controlId:d,describedBy:g,invalid:!!r,required:a},children:(0,h.jsxs)(`div`,{"data-slot":`form-field`,className:`grid gap-2`,...l,children:[(0,h.jsxs)(`label`,{"data-slot":`label`,htmlFor:d,className:`flex items-center gap-2 text-label font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50`,children:[e,a?(0,h.jsx)(o,{size:`sm`,tone:`required`,children:`必須`}):s?(0,h.jsx)(o,{size:`sm`,tone:`optional`,children:`任意`}):null]}),c,n?(0,h.jsx)(`p`,{id:f,className:`text-caption text-text-secondary`,children:n}):null,r?(0,h.jsx)(`p`,{id:p,className:`text-caption font-medium text-danger`,children:r}):null]})})}var m,h;function g(){return(g=e((()=>{m=t(),r(),a(),h=n(),p.__docgenInfo={description:"入力欄に、見出し、補足の文、誤りの文、必須と任意の印を添える枠。\n欄（`TextInput`、`Select`、`Textarea`）は `children` に渡す。属性は React の context で渡すので、欄は同じ React の木の中に置く。",methods:[],displayName:`FormField`,props:{label:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},htmlFor:{required:!1,tsType:{name:`string`},description:"見出しを結び付ける欄の `id`。省略すると、`FormField` が決めた `id` を欄に付ける。"},description:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:"欄の下に出す補足の文。`aria-describedby` で欄に結び付ける。"},error:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:"欄の下に出す誤りの文。あるとき、欄に `aria-invalid` を付け、`aria-describedby` で結び付ける。"},required:{required:!1,tsType:{name:`boolean`},description:"必須の欄にする。見出しの横に「必須」の印を出し、欄に `required` を付ける。",defaultValue:{value:`false`,computed:!1}},optional:{required:!1,tsType:{name:`boolean`},description:"任意の欄にする。見出しの横に「任意」の印を出す。`required` と同時に渡したときは、`required` を使う。",defaultValue:{value:`false`,computed:!1}}}}})))()}var _,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{g(),s(),l(),d(),_=n(),{expect:v,within:y}=__STORYBOOK_MODULE_TEST__,b={title:`コンポーネント/Base/FormField`,component:p,args:{label:`Field label`,children:(0,_.jsx)(c,{placeholder:`Input value`})},decorators:[e=>(0,_.jsx)(`div`,{className:`max-w-md`,children:(0,_.jsx)(e,{})})]},x=e=>(0,_.jsx)(`div`,{className:`pb-4`,children:(0,_.jsx)(e,{})}),S={render:()=>(0,_.jsx)(p,{label:`Field label`,htmlFor:`field-default`,description:`Short help text for the input.`,children:(0,_.jsx)(c,{id:`field-default`,placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=y(e).getByRole(`textbox`,{name:`Field label`});await v(t).toHaveAccessibleDescription(`Short help text for the input.`),await v(t).toBeValid(),await v(t).not.toBeRequired()}},C={render:()=>(0,_.jsx)(p,{label:`Field label`,htmlFor:`field-error`,error:`Enter a valid value.`,children:(0,_.jsx)(c,{id:`field-error`,defaultValue:`Invalid value`})}),play:async({canvasElement:e})=>{let t=y(e).getByRole(`textbox`,{name:`Field label`});await v(t).toBeInvalid(),await v(t).toHaveAccessibleDescription(`Enter a valid value.`)}},w={render:()=>(0,_.jsx)(p,{label:`Field label`,htmlFor:`field-disabled`,children:(0,_.jsx)(c,{id:`field-disabled`,disabled:!0,placeholder:`Disabled input`})}),play:async({canvasElement:e})=>{let t=y(e).getByRole(`textbox`,{name:`Field label`});await v(t).not.toHaveAttribute(`aria-describedby`),await v(t).not.toHaveAttribute(`aria-invalid`)}},T={decorators:[x],render:()=>(0,_.jsx)(p,{label:`Field label`,description:`Short help text for the input.`,error:`Enter a valid value.`,children:(0,_.jsx)(c,{defaultValue:`Invalid value`})}),play:async({canvasElement:e})=>{let t=y(e).getByRole(`textbox`,{name:`Field label`});await v(t).toBeInvalid(),await v(t).toHaveAccessibleDescription(`Short help text for the input. Enter a valid value.`)}},E={decorators:[x],render:()=>(0,_.jsx)(p,{label:`Field label`,description:`Short help text for the input.`,required:!0,children:(0,_.jsx)(c,{placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=y(e);await v(t.getByText(`必須`)).toBeVisible();let n=t.getByRole(`textbox`,{name:/Field label/});await v(n).toBeRequired(),await v(n).toHaveAccessibleName(/必須/)}},D={decorators:[x],render:()=>(0,_.jsx)(p,{label:`Field label`,optional:!0,children:(0,_.jsx)(c,{placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=y(e);await v(t.getByText(`任意`)).toBeVisible(),await v(t.getByRole(`textbox`,{name:/Field label/})).not.toBeRequired()}},O={decorators:[x],render:()=>(0,_.jsx)(p,{label:`ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)`,children:(0,_.jsx)(c,{placeholder:`Input value`})})},k={decorators:[x],render:()=>(0,_.jsx)(p,{label:`Field label`,description:`Choose one option.`,error:`Select an option.`,required:!0,children:(0,_.jsxs)(u,{defaultValue:``,children:[(0,_.jsx)(`option`,{value:``,children:`Select an option`}),(0,_.jsx)(`option`,{value:`option-a`,children:`Option A`})]})}),play:async({canvasElement:e})=>{let t=y(e).getByRole(`combobox`,{name:/Field label/});await v(t).toBeRequired(),await v(t).toBeInvalid(),await v(t).toHaveAccessibleDescription(`Choose one option. Select an option.`)}},A={decorators:[x],render:()=>(0,_.jsx)(p,{label:`Field label`,description:`Describe the request.`,error:`Enter at least 10 characters.`,required:!0,children:(0,_.jsx)(f,{defaultValue:`Short`})}),play:async({canvasElement:e})=>{let t=y(e).getByRole(`textbox`,{name:/Field label/});await v(t).toBeRequired(),await v(t).toBeInvalid(),await v(t).toHaveAccessibleDescription(`Describe the request. Enter at least 10 characters.`)}},j={render:()=>(0,_.jsx)(c,{placeholder:`Input value`})},M={render:()=>(0,_.jsx)(c,{"aria-invalid":`true`,"aria-label":`Field label`,defaultValue:`Invalid value`})},N={render:()=>(0,_.jsxs)(u,{defaultValue:`option-a`,"aria-label":`Field label`,children:[(0,_.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,_.jsx)(`option`,{value:`option-b`,children:`Option B`}),(0,_.jsx)(`option`,{value:`option-c`,children:`Option C`})]})},P={render:()=>(0,_.jsxs)(u,{defaultValue:`option-a`,disabled:!0,"aria-label":`Field label`,children:[(0,_.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,_.jsx)(`option`,{value:`option-b`,children:`Option B`})]})},F={render:()=>(0,_.jsx)(f,{placeholder:`Textarea value`})},I={render:()=>(0,_.jsx)(f,{"aria-invalid":`true`,"aria-label":`Field label`,defaultValue:`Invalid value`})},L=[`Default`,`Error`,`Disabled`,`ErrorWithDescription`,`Required`,`Optional`,`LongLabel`,`SelectRequiredError`,`TextareaRequiredError`,`InputDefault`,`InputError`,`SelectDefault`,`SelectDisabled`,`TextareaDefault`,`TextareaError`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-default" description="Short help text for the input.">
      <TextInput id="field-default" placeholder="Input value" />
    </FormField>,
  // 補足だけがあるとき、欄の説明は補足の文になり、誤りと必須の状態は付かない。
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label"
    });
    await expect(input).toHaveAccessibleDescription("Short help text for the input.");
    await expect(input).toBeValid();
    await expect(input).not.toBeRequired();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-error" error="Enter a valid value.">
      <TextInput id="field-error" defaultValue="Invalid value" />
    </FormField>,
  // 誤りだけがあるとき、欄に aria-invalid が付き、欄の説明は誤りの文になる。
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label"
    });
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription("Enter a valid value.");
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-disabled">
      <TextInput id="field-disabled" disabled placeholder="Disabled input" />
    </FormField>,
  // 補足も誤りも無いとき、aria-describedby を出さない。
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label"
    });
    await expect(input).not.toHaveAttribute("aria-describedby");
    await expect(input).not.toHaveAttribute("aria-invalid");
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" description="Short help text for the input." error="Enter a valid value.">
      <TextInput defaultValue="Invalid value" />
    </FormField>,
  // 補足と誤りの両方があるとき、欄の説明は補足の文に続けて誤りの文を読む。htmlFor を渡さなくても結ばれる。
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label"
    });
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription("Short help text for the input. Enter a valid value.");
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" description="Short help text for the input." required>
      <TextInput placeholder="Input value" />
    </FormField>,
  // 必須は「必須」の文字で示し、欄に required を付ける。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("必須")).toBeVisible();
    const input = canvas.getByRole("textbox", {
      name: /Field label/
    });
    await expect(input).toBeRequired();
    await expect(input).toHaveAccessibleName(/必須/);
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" optional>
      <TextInput placeholder="Input value" />
    </FormField>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("任意")).toBeVisible();
    await expect(canvas.getByRole("textbox", {
      name: /Field label/
    })).not.toBeRequired();
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)">
      <TextInput placeholder="Input value" />
    </FormField>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" description="Choose one option." error="Select an option." required>
      <Select defaultValue="">
        <option value="">Select an option</option>
        <option value="option-a">Option A</option>
      </Select>
    </FormField>,
  play: async ({
    canvasElement
  }) => {
    const select = within(canvasElement).getByRole("combobox", {
      name: /Field label/
    });
    await expect(select).toBeRequired();
    await expect(select).toBeInvalid();
    await expect(select).toHaveAccessibleDescription("Choose one option. Select an option.");
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" description="Describe the request." error="Enter at least 10 characters." required>
      <Textarea defaultValue="Short" />
    </FormField>,
  play: async ({
    canvasElement
  }) => {
    const textarea = within(canvasElement).getByRole("textbox", {
      name: /Field label/
    });
    await expect(textarea).toBeRequired();
    await expect(textarea).toBeInvalid();
    await expect(textarea).toHaveAccessibleDescription("Describe the request. Enter at least 10 characters.");
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <TextInput placeholder="Input value" />
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <TextInput aria-invalid="true" aria-label="Field label" defaultValue="Invalid value" />
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
      <option value="option-c">Option C</option>
    </Select>
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Textarea value" />
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-invalid="true" aria-label="Field label" defaultValue="Invalid value" />
}`,...I.parameters?.docs?.source}}}})))()}R();export{S as Default,w as Disabled,C as Error,T as ErrorWithDescription,j as InputDefault,M as InputError,O as LongLabel,D as Optional,E as Required,N as SelectDefault,P as SelectDisabled,k as SelectRequiredError,F as TextareaDefault,I as TextareaError,A as TextareaRequiredError,L as __namedExportsOrder,b as default};