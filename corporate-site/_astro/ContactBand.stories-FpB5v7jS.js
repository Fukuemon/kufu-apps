import{n as e}from"./rolldown-runtime-sJBDdmOt.js";var t;function n(){return(n=e((()=>{t=()=>{throw Error(`Astro components are rendered server-side by Storybook.`)},t.isAstroComponentFactory=!0,t.moduleId=`/home/runner/work/kufu-apps/kufu-apps/apps/corporate-site/src/components/common/ContactBand.astro`})))()}function r(){return(r=e((()=>{})))()}var i,a,o,s;function c(){return(c=e((()=>{r(),i=`079-492-6465`,a=`079-492-6429`,o=`fukuura@mist.ocn.ne.jp`,`${i.replaceAll(`-`,``)}`,`${o}`,`${i}${a}`,s={breadcrumb:{home:`ホーム`,current:`お問い合わせ`},title:`お問い合わせ・お見積り`,eyebrow:`Contact & Estimate`,lead:`製品のお見積り、加工のご相談、掲載のないメーカー・製品のお取り寄せまで。お電話・FAX・メール・フォームよりお気軽にご連絡ください。`,infoLabels:{tel:`Tel`,fax:`Fax`,email:`E-mail`,address:`所在地`},notice:{hours:`受付時間 / 平日 9:00-18:00`,estimate:`お見積りはお電話・FAX・メールでも承ります。図面がある場合はメール添付いただくとスムーズです。`}},s.notice.hours})))()}var l;function u(){return(u=e((()=>{l={eyebrow:`MAKER SEARCH`,title:`掲載のないメーカー・型番も確認します。`,lead:`メーカー名、型番、数量、希望納期が分かる場合は、問い合わせ時にご記入ください。代替品や別作加工の可否も含めて確認します。`}})))()}var d,f,p,m;function h(){return(h=e((()=>{n(),c(),u(),d={title:`Common/ContactBand`,component:t},f={args:{title:s.title,lead:s.lead,"data-testid":`home-section-contact-band`}},p={args:{eyebrow:l.eyebrow,title:l.title,lead:l.lead,"data-testid":`products-section-contact-band`}},m=[`Home`,`Products`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: contactPageContent.title,
    lead: contactPageContent.lead,
    "data-testid": "home-section-contact-band"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    eyebrow: productsContactBandContent.eyebrow,
    title: productsContactBandContent.title,
    lead: productsContactBandContent.lead,
    "data-testid": "products-section-contact-band"
  }
}`,...p.parameters?.docs?.source}}}})))()}h();export{f as Home,p as Products,m as __namedExportsOrder,d as default};