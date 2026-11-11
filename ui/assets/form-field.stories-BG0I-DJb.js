import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{f as t}from"./iframe-Coc62OSd.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{n as r,t as i}from"./form-field-context-BXhhVdBi.js";import{n as a,t as o}from"./label-CqwCH3lW.js";import{n as s,t as c}from"./tag-_wzj_dhb.js";import{n as l,t as u}from"./input-DElN59Hr.js";import{n as d,t as f}from"./select-Dki6yqIS.js";import{n as p,t as m}from"./textarea-CKLAJ4cW.js";function h({label:e,htmlFor:t,description:n,error:r,required:a=!1,optional:s=!1,children:l,...u}){let d=(0,g.useId)(),f=t??d,p=n?`${f}-description`:void 0,m=r?`${f}-error`:void 0,h=[p,m].filter(Boolean).join(` `)||void 0;return(0,_.jsx)(i.Provider,{value:{controlId:f,describedBy:h,invalid:!!r,required:a},children:(0,_.jsxs)(`div`,{"data-slot":`form-field`,className:`grid gap-2`,...u,children:[(0,_.jsxs)(o,{htmlFor:f,children:[e,a?(0,_.jsx)(c,{size:`sm`,tone:`required`,children:`必須`}):s?(0,_.jsx)(c,{size:`sm`,tone:`optional`,children:`任意`}):null]}),l,n?(0,_.jsx)(`p`,{id:p,className:`text-caption text-text-secondary`,children:n}):null,r?(0,_.jsx)(`p`,{id:m,className:`text-caption font-medium text-danger`,children:r}):null]})})}var g,_;function v(){return(v=e((()=>{g=t(),r(),a(),s(),_=n(),h.__docgenInfo={description:"入力欄に、見出し、補足の文、誤りの文、必須と任意の印を添える枠。\n欄（`Input`、`Select`、`Textarea`）は `children` に渡す。属性は React の context で渡すので、欄は同じ React の木の中に置く。",methods:[],displayName:`FormField`,props:{label:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},htmlFor:{required:!1,tsType:{name:`string`},description:"見出しを結び付ける欄の `id`。省略すると、`FormField` が決めた `id` を欄に付ける。"},description:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:"欄の下に出す補足の文。`aria-describedby` で欄に結び付ける。"},error:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:"欄の下に出す誤りの文。あるとき、欄に `aria-invalid` を付け、`aria-describedby` で結び付ける。"},required:{required:!1,tsType:{name:`boolean`},description:"必須の欄にする。見出しの横に「必須」の印を出し、欄に `required` を付ける。",defaultValue:{value:`false`,computed:!1}},optional:{required:!1,tsType:{name:`boolean`},description:"任意の欄にする。見出しの横に「任意」の印を出す。`required` と同時に渡したときは、`required` を使う。",defaultValue:{value:`false`,computed:!1}}}}})))()}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{v(),l(),d(),p(),y=n(),{expect:b,within:x}=__STORYBOOK_MODULE_TEST__,S={title:`UI/FormField`,component:h,args:{label:`Field label`,children:(0,y.jsx)(u,{placeholder:`Input value`})},decorators:[e=>(0,y.jsx)(`div`,{className:`max-w-md`,children:(0,y.jsx)(e,{})})]},C=e=>(0,y.jsx)(`div`,{className:`pb-4`,children:(0,y.jsx)(e,{})}),w={render:()=>(0,y.jsx)(h,{label:`Field label`,htmlFor:`field-default`,description:`Short help text for the input.`,children:(0,y.jsx)(u,{id:`field-default`,placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).toHaveAccessibleDescription(`Short help text for the input.`),await b(t).toBeValid(),await b(t).not.toBeRequired()}},T={render:()=>(0,y.jsx)(h,{label:`Field label`,htmlFor:`field-error`,error:`Enter a valid value.`,children:(0,y.jsx)(u,{id:`field-error`,defaultValue:`Invalid value`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Enter a valid value.`)}},E={render:()=>(0,y.jsx)(h,{label:`Field label`,htmlFor:`field-disabled`,children:(0,y.jsx)(u,{id:`field-disabled`,disabled:!0,placeholder:`Disabled input`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).not.toHaveAttribute(`aria-describedby`),await b(t).not.toHaveAttribute(`aria-invalid`)}},D={decorators:[C],render:()=>(0,y.jsx)(h,{label:`Field label`,description:`Short help text for the input.`,error:`Enter a valid value.`,children:(0,y.jsx)(u,{defaultValue:`Invalid value`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Short help text for the input. Enter a valid value.`)}},O={decorators:[C],render:()=>(0,y.jsx)(h,{label:`Field label`,description:`Short help text for the input.`,required:!0,children:(0,y.jsx)(u,{placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=x(e);await b(t.getByText(`必須`)).toBeVisible();let n=t.getByRole(`textbox`,{name:/Field label/});await b(n).toBeRequired(),await b(n).toHaveAccessibleName(/必須/)}},k={decorators:[C],render:()=>(0,y.jsx)(h,{label:`Field label`,optional:!0,children:(0,y.jsx)(u,{placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=x(e);await b(t.getByText(`任意`)).toBeVisible(),await b(t.getByRole(`textbox`,{name:/Field label/})).not.toBeRequired()}},A={decorators:[C],render:()=>(0,y.jsx)(h,{label:`Field label`,description:`Choose one option.`,error:`Select an option.`,required:!0,children:(0,y.jsxs)(f,{defaultValue:``,children:[(0,y.jsx)(`option`,{value:``,children:`Select an option`}),(0,y.jsx)(`option`,{value:`option-a`,children:`Option A`})]})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`combobox`,{name:/Field label/});await b(t).toBeRequired(),await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Choose one option. Select an option.`)}},j={decorators:[C],render:()=>(0,y.jsx)(h,{label:`Field label`,description:`Describe the request.`,error:`Enter at least 10 characters.`,required:!0,children:(0,y.jsx)(m,{defaultValue:`Short`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:/Field label/});await b(t).toBeRequired(),await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Describe the request. Enter at least 10 characters.`)}},M={render:()=>(0,y.jsx)(u,{placeholder:`Input value`})},N={render:()=>(0,y.jsx)(u,{"aria-invalid":`true`,defaultValue:`Invalid value`})},P={render:()=>(0,y.jsxs)(f,{defaultValue:`option-a`,"aria-label":`Field label`,children:[(0,y.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,y.jsx)(`option`,{value:`option-b`,children:`Option B`}),(0,y.jsx)(`option`,{value:`option-c`,children:`Option C`})]})},F={render:()=>(0,y.jsxs)(f,{defaultValue:`option-a`,disabled:!0,"aria-label":`Field label`,children:[(0,y.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,y.jsx)(`option`,{value:`option-b`,children:`Option B`})]})},I={render:()=>(0,y.jsx)(m,{placeholder:`Textarea value`})},L={render:()=>(0,y.jsx)(m,{"aria-invalid":`true`,defaultValue:`Invalid value`})},R=[`Default`,`Error`,`Disabled`,`ErrorWithDescription`,`Required`,`Optional`,`SelectRequiredError`,`TextareaRequiredError`,`InputDefault`,`InputError`,`SelectDefault`,`SelectDisabled`,`TextareaDefault`,`TextareaError`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-default" description="Short help text for the input.">
      <Input id="field-default" placeholder="Input value" />
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-error" error="Enter a valid value.">
      <Input id="field-error" defaultValue="Invalid value" />
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <FormField label="Field label" htmlFor="field-disabled">
      <Input id="field-disabled" disabled placeholder="Disabled input" />
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" description="Short help text for the input." error="Enter a valid value.">
      <Input defaultValue="Invalid value" />
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" description="Short help text for the input." required>
      <Input placeholder="Input value" />
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="Field label" optional>
      <Input placeholder="Input value" />
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <Input placeholder="Input value" />
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <Input aria-invalid="true" defaultValue="Invalid value" />
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
      <option value="option-c">Option C</option>
    </Select>
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Textarea value" />
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-invalid="true" defaultValue="Invalid value" />
}`,...L.parameters?.docs?.source}}}})))()}z();export{w as Default,E as Disabled,T as Error,D as ErrorWithDescription,M as InputDefault,N as InputError,k as Optional,O as Required,P as SelectDefault,F as SelectDisabled,A as SelectRequiredError,I as TextareaDefault,L as TextareaError,j as TextareaRequiredError,R as __namedExportsOrder,S as default};