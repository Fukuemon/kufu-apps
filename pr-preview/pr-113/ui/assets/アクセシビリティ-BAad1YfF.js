import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{i as t,r as n}from"./react-ulw0kEkw.js";import{t as r}from"./jsx-runtime-MKhVqBIO.js";import{c as i,s as a}from"./blocks-DfzLIqix.js";function o(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...t(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(a,{title:`はじめに/アクセシビリティ`}),`
`,(0,c.jsx)(n.h1,{id:`アクセシビリティ`,children:`アクセシビリティ`}),`
`,(0,c.jsx)(n.p,{children:`基準と確認の方法は、DESIGN.md の「アクセシビリティ」の表にある。表は次の項目を持つ。`}),`
`,(0,c.jsxs)(n.ul,{children:[`
`,(0,c.jsx)(n.li,{children:`文字のコントラスト`}),`
`,(0,c.jsx)(n.li,{children:`文字でないもののコントラスト`}),`
`,(0,c.jsx)(n.li,{children:`フォーカスの見え方`}),`
`,(0,c.jsx)(n.li,{children:`ターゲットの大きさ`}),`
`,(0,c.jsx)(n.li,{children:`キーボードの操作`}),`
`,(0,c.jsx)(n.li,{children:`入力の誤りの伝え方`}),`
`,(0,c.jsx)(n.li,{children:`動きを減らす設定`}),`
`]}),`
`,(0,c.jsx)(n.h2,{id:`カタログでの確認`,children:`カタログでの確認`}),`
`,(0,c.jsxs)(n.p,{children:[`コンポーネントの story は、Vitest のブラウザのテストとして動き、a11y のアドオンが見つけた違反でテストが失敗する。
a11y のアドオンは、押せる領域の大きさを確認しない。押せる領域の大きさは、story の play が確認する（`,(0,c.jsx)(n.code,{children:`TARGET-SIZE`}),`）。`]}),`
`,(0,c.jsx)(n.p,{children:`画面のカタログ（corporate-site の Storybook）の story は、a11y のアドオンのテストに載らない。`})]})}function s(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),n(),i()})))()}l();export{s as default};