const n=()=>{throw new Error("Astro components are rendered server-side by Storybook.")};n.isAstroComponentFactory=!0;n.moduleId="/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/common/SectionHeading.astro";const s={title:"Common/SectionHeading",component:n},e={args:{number:"01",eyebrow:"Products",title:"製造現場を支える機器を、用途から探す",description:"駆動・変減速機器から搬送・省力化機器まで、現場の課題に合わせて最適な製品カテゴリを確認できます。"}},r={args:{eyebrow:"Contact",title:"加工や部品調達の相談を受け付けています",description:"図面や仕様が固まりきっていない段階でも、必要な条件整理から相談できます。",align:"center"}},o={args:{title:"タイトルのみの最小構成"}},t={args:{number:"18",eyebrow:"LONG CONTENT EDGE CASE",title:"見出しが複数行に折り返される長さになった場合の行間と字間を確認するための冗長なタイトル",description:"説明文が長文になった場合の折り返しと、見出しとの間隔・最大幅の制約を確認する。図面や仕様が固まりきっていない段階でも、必要な条件整理から相談できることを繰り返し述べて長さを確保している。"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    number: "01",
    eyebrow: "Products",
    title: "製造現場を支える機器を、用途から探す",
    description: "駆動・変減速機器から搬送・省力化機器まで、現場の課題に合わせて最適な製品カテゴリを確認できます。"
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    eyebrow: "Contact",
    title: "加工や部品調達の相談を受け付けています",
    description: "図面や仕様が固まりきっていない段階でも、必要な条件整理から相談できます。",
    align: "center"
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: "タイトルのみの最小構成"
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    number: "18",
    eyebrow: "LONG CONTENT EDGE CASE",
    title: "見出しが複数行に折り返される長さになった場合の行間と字間を確認するための冗長なタイトル",
    description: "説明文が長文になった場合の折り返しと、見出しとの間隔・最大幅の制約を確認する。図面や仕様が固まりきっていない段階でも、必要な条件整理から相談できることを繰り返し述べて長さを確保している。"
  }
}`,...t.parameters?.docs?.source}}};const a=["Default","Center","Minimal","LongText"];export{r as Center,e as Default,t as LongText,o as Minimal,a as __namedExportsOrder,s as default};
