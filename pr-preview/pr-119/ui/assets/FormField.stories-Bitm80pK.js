import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{f as n}from"./iframe-D4VD4Nxf.js";import{t as r}from"./jsx-runtime-MKhVqBIO.js";import{n as i,t as a}from"./FormFieldContext-CNnMlUW5.js";import{n as o,t as s}from"./Tag-BjYNw7uM.js";import{n as c,t as l}from"./TextInput-BQExgRjs.js";import{n as u,t as d}from"./Select-D4EdMcLP.js";import{n as f,t as p}from"./Textarea-fLyB44ZD.js";function m({label:e,htmlFor:t,description:n,error:r,required:i=!1,optional:o=!1,children:c,...l}){let u=(0,h.useId)(),d=t??u,f=n?`${d}-description`:void 0,p=r?`${d}-error`:void 0,m=[f,p].filter(Boolean).join(` `)||void 0;return(0,g.jsx)(a.Provider,{value:{controlId:d,describedBy:m,invalid:!!r,required:i},children:(0,g.jsxs)(`div`,{"data-slot":`form-field`,className:`grid gap-2`,...l,children:[(0,g.jsxs)(`label`,{"data-slot":`label`,htmlFor:d,className:`flex items-center gap-2 text-label font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50`,children:[e,i?(0,g.jsx)(s,{size:`sm`,tone:`required`,children:`必須`}):o?(0,g.jsx)(s,{size:`sm`,tone:`optional`,children:`任意`}):null]}),c,n?(0,g.jsx)(`p`,{id:f,className:`text-caption text-text-secondary`,children:n}):null,r?(0,g.jsx)(`p`,{id:p,className:`text-caption font-medium text-danger`,children:r}):null]})})}var h,g;function _(){return(_=e((()=>{h=n(),i(),o(),g=r(),m.__docgenInfo={description:"入力欄に、見出し、補足の文、誤りの文、必須と任意の印を添える枠。\n欄（`TextInput`、`Select`、`Textarea`）は `children` に渡す。属性は React の context で渡すので、欄は同じ React の木の中に置く。",methods:[],displayName:`FormField`,props:{label:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},htmlFor:{required:!1,tsType:{name:`string`},description:"見出しを結び付ける欄の `id`。省略すると、`FormField` が決めた `id` を欄に付ける。"},description:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:"欄の下に出す補足の文。`aria-describedby` で欄に結び付ける。"},error:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:"欄の下に出す誤りの文。あるとき、欄に `aria-invalid` を付け、`aria-describedby` で結び付ける。"},required:{required:!1,tsType:{name:`boolean`},description:"必須の欄にする。見出しの横に「必須」の印を出し、欄に `required` を付ける。",defaultValue:{value:`false`,computed:!1}},optional:{required:!1,tsType:{name:`boolean`},description:"任意の欄にする。見出しの横に「任意」の印を出す。`required` と同時に渡したときは、`required` を使う。",defaultValue:{value:`false`,computed:!1}}}}})))()}var v=t({Default:()=>w,Disabled:()=>E,Error:()=>T,ErrorWithDescription:()=>D,InputDefault:()=>N,InputError:()=>P,LongLabel:()=>A,Optional:()=>k,Required:()=>O,SelectDefault:()=>F,SelectDisabled:()=>I,SelectRequiredError:()=>j,TextareaDefault:()=>L,TextareaError:()=>R,TextareaRequiredError:()=>M,__namedExportsOrder:()=>z,default:()=>S}),y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{_(),c(),u(),f(),y=r(),{expect:b,within:x}=__STORYBOOK_MODULE_TEST__,S={title:`コンポーネント/Base/FormField`,component:m,args:{label:`Field label`,children:(0,y.jsx)(l,{placeholder:`Input value`})},decorators:[e=>(0,y.jsx)(`div`,{className:`max-w-md`,children:(0,y.jsx)(e,{})})]},C=e=>(0,y.jsx)(`div`,{className:`pb-4`,children:(0,y.jsx)(e,{})}),w={render:()=>(0,y.jsx)(m,{label:`Field label`,htmlFor:`field-default`,description:`Short help text for the input.`,children:(0,y.jsx)(l,{id:`field-default`,placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).toHaveAccessibleDescription(`Short help text for the input.`),await b(t).toBeValid(),await b(t).not.toBeRequired()}},T={render:()=>(0,y.jsx)(m,{label:`Field label`,htmlFor:`field-error`,error:`Enter a valid value.`,children:(0,y.jsx)(l,{id:`field-error`,defaultValue:`Invalid value`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Enter a valid value.`)}},E={render:()=>(0,y.jsx)(m,{label:`Field label`,htmlFor:`field-disabled`,children:(0,y.jsx)(l,{id:`field-disabled`,disabled:!0,placeholder:`Disabled input`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).not.toHaveAttribute(`aria-describedby`),await b(t).not.toHaveAttribute(`aria-invalid`)}},D={decorators:[C],render:()=>(0,y.jsx)(m,{label:`Field label`,description:`Short help text for the input.`,error:`Enter a valid value.`,children:(0,y.jsx)(l,{defaultValue:`Invalid value`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:`Field label`});await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Short help text for the input. Enter a valid value.`)}},O={decorators:[C],render:()=>(0,y.jsx)(m,{label:`Field label`,description:`Short help text for the input.`,required:!0,children:(0,y.jsx)(l,{placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=x(e);await b(t.getByText(`必須`)).toBeVisible();let n=t.getByRole(`textbox`,{name:/Field label/});await b(n).toBeRequired(),await b(n).toHaveAccessibleName(/必須/)}},k={decorators:[C],render:()=>(0,y.jsx)(m,{label:`Field label`,optional:!0,children:(0,y.jsx)(l,{placeholder:`Input value`})}),play:async({canvasElement:e})=>{let t=x(e);await b(t.getByText(`任意`)).toBeVisible(),await b(t.getByRole(`textbox`,{name:/Field label/})).not.toBeRequired()}},A={decorators:[C],render:()=>(0,y.jsx)(m,{label:`ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)`,children:(0,y.jsx)(l,{placeholder:`Input value`})})},j={decorators:[C],render:()=>(0,y.jsx)(m,{label:`Field label`,description:`Choose one option.`,error:`Select an option.`,required:!0,children:(0,y.jsxs)(d,{defaultValue:``,children:[(0,y.jsx)(`option`,{value:``,children:`Select an option`}),(0,y.jsx)(`option`,{value:`option-a`,children:`Option A`})]})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`combobox`,{name:/Field label/});await b(t).toBeRequired(),await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Choose one option. Select an option.`)}},M={decorators:[C],render:()=>(0,y.jsx)(m,{label:`Field label`,description:`Describe the request.`,error:`Enter at least 10 characters.`,required:!0,children:(0,y.jsx)(p,{defaultValue:`Short`})}),play:async({canvasElement:e})=>{let t=x(e).getByRole(`textbox`,{name:/Field label/});await b(t).toBeRequired(),await b(t).toBeInvalid(),await b(t).toHaveAccessibleDescription(`Describe the request. Enter at least 10 characters.`)}},N={render:()=>(0,y.jsx)(l,{placeholder:`Input value`})},P={render:()=>(0,y.jsx)(l,{"aria-invalid":`true`,"aria-label":`Field label`,defaultValue:`Invalid value`})},F={render:()=>(0,y.jsxs)(d,{defaultValue:`option-a`,"aria-label":`Field label`,children:[(0,y.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,y.jsx)(`option`,{value:`option-b`,children:`Option B`}),(0,y.jsx)(`option`,{value:`option-c`,children:`Option C`})]})},I={render:()=>(0,y.jsxs)(d,{defaultValue:`option-a`,disabled:!0,"aria-label":`Field label`,children:[(0,y.jsx)(`option`,{value:`option-a`,children:`Option A`}),(0,y.jsx)(`option`,{value:`option-b`,children:`Option B`})]})},L={render:()=>(0,y.jsx)(p,{placeholder:`Textarea value`})},R={render:()=>(0,y.jsx)(p,{"aria-invalid":`true`,"aria-label":`Field label`,defaultValue:`Invalid value`})},z=[`Default`,`Error`,`Disabled`,`ErrorWithDescription`,`Required`,`Optional`,`LongLabel`,`SelectRequiredError`,`TextareaRequiredError`,`InputDefault`,`InputError`,`SelectDefault`,`SelectDisabled`,`TextareaDefault`,`TextareaError`],w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  decorators: [withBottomSpace],
  render: () => <FormField label="ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)">
      <TextInput placeholder="Input value" />
    </FormField>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <TextInput placeholder="Input value" />
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <TextInput aria-invalid="true" aria-label="Field label" defaultValue="Invalid value" />
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
      <option value="option-c">Option C</option>
    </Select>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <Select defaultValue="option-a" disabled aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea placeholder="Textarea value" />
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-invalid="true" aria-label="Field label" defaultValue="Invalid value" />
}`,...R.parameters?.docs?.source}}}})))()}export{B as _,v as a,A as c,F as d,I as f,M as g,R as h,D as i,k as l,L as m,E as n,N as o,j as p,T as r,P as s,w as t,O as u,m as v,_ as y};