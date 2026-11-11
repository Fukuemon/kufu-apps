#!/usr/bin/env node
// 画面とコンポーネントのコードに、DESIGN.md の「画面を作るときの原則」に反するユーティリティのクラスが書かれていないかを確認する。
// 色の値とプリミティブトークンの名前は check-raw-values.mjs が見る。
// 使い方: node check-utilities.mjs [--doc <デザインシステムの DESIGN.md>] [ファイルかディレクトリ]...
//   --doc を渡すと、コードを読む前に、RULES の各 id が文書の中にコードスパン（`TEXT-MIN-SIZE`）で出るかを見る。出ない id があれば、id を出して終了コード 2 で止める。
//     原則を消すか改名して文書のどこからも ID が消えたのに、RULES が古い ID のまま残るのを見つけるためである。ID が文書の 1 か所（表など）に残っていれば通る。
//     文書の表の形は読まない。逆向き（文書がこのチェックで見ると書いた原則が RULES に無い）は見ない。
//   引数のパスを省くと TARGETS を読む。ディレクトリは、EXTENSIONS の拡張子のファイルを再帰で読む。node_modules と、. で始まるディレクトリは読まない。
// クラスの名前は、変種を : でつなぎ（focus-visible:ring-2）、任意値を [ ] か ( ) で書く（p-[13px]、gap-(--gap)）形として読む。
//   空白と引用符で区切り、[ ] と ( ) の外では波括弧、カンマ、セミコロン、=、<、> でも区切った語を、クラスの名前として読む。コメントの中の語も読む。
//   言語の構文は読まず、語の区切りを近似で見分ける。
// 見つけないもの: クラスの名前を文字列の連結で組み立てた書き方と、任意の変種の中に引用符を書いた書き方（[&[data-state='open']]:text-xs）。それらはレビューで見る。
//   引用符は、配列（["text-xs"]）と関数の引数（cn("text-xs")）の区切りと見分けられないので、いつでも区切りにする。
//   ALLOW_MARK を含む行は見ず、外した行の数を出す。外す理由は、同じ行のコメントに書く。
// 違反の行には、RULES の id（デザインシステムの文書の原則の ID）を出す。
// 終了コード: 0 は見つからなかった、1 は見つかった、2 はパスが読めないか、引数が正しくないか、RULES の id が文書に無い
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

// 画面とコンポーネントのコードの置き場
const TARGETS = ["./apps/corporate-site/src", "./packages/ui/src"];
// トークンの層のファイルと生成物のように、原則の外にある置き場
const EXCLUDES = ["./packages/ui/src/tokens"];
const EXTENSIONS = [
  ".css",
  ".scss",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",
  ".astro",
  ".html",
  ".mdx",
];
const ALLOW_MARK = "design-system-allow";

// 見つけるユーティリティ。id はデザインシステムの文書の原則の ID、label は違反の行に出す説明。
// test は、変種の配列（focus-visible:ring-2 なら ["focus-visible"]）と、変種を除いたユーティリティ（ring-2）を受け取る。
// SPACING-SCALE と MOTION-TOKEN は、DESIGN.md の確認の方法を決めるまで足さない
// TARGET-SIZE は、描画した大きさを見ないと分からないので足さない。packages/ui の story の play で見る
const RULES = [
  {
    id: "MOTION-REDUCE",
    label: "画面とコンポーネントのコードの、動きを減らす設定の条件",
    // 止め方は theme.css（EXCLUDES の tokens の下）の 1 か所に置く。次の 2 つを見る。
    //   motion-reduce: と motion-safe: の変種の付いたユーティリティ
    //   CSS の @media と JavaScript の matchMedia に書いた prefers-reduced-motion の条件（( の後ろの 1 語として読む）
    test: (variants, utility) =>
      variants.some((v) => /^motion-(?:reduce|safe)$/.test(v)) ||
      /prefers-reduced-motion/.test(utility),
  },
  {
    id: "FOCUS-ONE",
    label: "focus-ring のほかのフォーカスの書き方",
    // 次の 4 つを見る。focus-ring は通す。
    //   フォーカスの変種（focus:、focus-visible:、focus-within:、group-focus:、has-[:focus-visible]: など）の付いたユーティリティ
    //   CSS のセレクタの :focus、:focus-visible、:focus-within（変種を除くと、この名前だけが残る）
    //   outline のユーティリティ（outline-none、outline-2、outline-offset-2、outline-focus-outline など）。outline はフォーカスの表示にだけ使う
    //   フォーカスのセマンティックトークンの色（border-focus-outline、ring-focus-halo/50 など）。この色は focus-ring だけが使う
    // 見ないもの: フォーカスの変種の無い ring-*（名前では、フォーカスの表示かを見分けられない）と、JavaScript の focusin、.focus() の呼び出し
    test: (variants, utility) =>
      utility !== "focus-ring" &&
      (variants.some((v) => /\bfocus(?:-visible|-within)?\b/.test(v)) ||
        /^focus(?:-visible|-within)?$/.test(utility) ||
        /^-?outline(?:-|$)/.test(utility) ||
        /(?:^|-)focus-(?:outline|halo)(?:\/|$)/.test(utility)),
  },
  {
    id: "TEXT-MIN-SIZE",
    label: "14px より小さい文字か、テーマ変数に無い文字の大きさ",
    // text-sm/6 のように / の後に行高を付けた書き方も見る。text-smoke のような色の名前は見ない
    // Tailwind のデフォルトの大きさ（text-base、text-xl など）は、theme.css で消したので CSS にならず、親の大きさで描かれる
    // 任意値は、数字か大きさの関数で始まる値と、length: で文字の大きさと示した値（calc() と var() を含む）を見る。text-[var(--x)] は色の任意値にもなるので見ない
    test: (variants, utility) =>
      /^text-(?:(?:xs|sm|base|lg|[2-9]?xl)(?:\/|$)|\[(?:length:|[\d.]|(?:clamp|calc|min|max)\()|\(length:)/.test(
        utility,
      ),
  },
];

const excluded = EXCLUDES.map((p) => resolve(p));
const isExcluded = (abs) =>
  excluded.some((e) => abs === e || abs.startsWith(e + sep));

// 読めないパス（壊れたシンボリックリンクを含む）は、読めなかったファイルを通ったことにしないよう、終了コード 2 で止める
const statOrExit = (p) => {
  try {
    return statSync(p);
  } catch (e) {
    console.error(`読めない: ${relative(".", p) || p}\n${e.message}`);
    process.exit(2);
  }
};

const files = [];
const collect = (p) => {
  const abs = resolve(p);
  if (isExcluded(abs)) return;
  const stat = statOrExit(abs);
  if (stat.isDirectory()) {
    for (const name of readdirSync(abs).sort()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      const child = join(abs, name);
      if (statOrExit(child).isDirectory() || EXTENSIONS.includes(extname(name)))
        collect(child);
    }
  } else files.push(abs);
};
let doc;
const paths = [];
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === "--doc") {
    doc = process.argv[++i];
    if (doc === undefined || doc === "") {
      console.error(`${arg} の次に値が要る`);
      process.exit(2);
    }
  } else paths.push(arg);
}

if (doc !== undefined) {
  let text;
  try {
    text = readFileSync(resolve(doc), "utf8");
  } catch (e) {
    console.error(`読めない: ${doc}\n${e.message}`);
    process.exit(2);
  }
  const missing = RULES.map((r) => r.id).filter(
    (id) => !text.includes(`\`${id}\``),
  );
  if (missing.length) {
    for (const id of missing)
      console.error(`文書に無い原則の ID: ${id}（${doc}）`);
    console.error(
      "RULES の id を、デザインシステムの文書の原則の ID に合わせる。原則を消したなら、RULES の規則も消す",
    );
    process.exit(2);
  }
}

for (const p of paths.length ? paths : TARGETS) collect(p);

// 任意値は空白を含まないので、空白と引用符はいつでも区切りにする。関数の呼び出し（cn("text-xs", x)）の ( の後ろを 1 語にまとめないためである。
// [ ] と ( ) の中のカンマと =（has-[:is(:focus,:focus-visible)]:、[&[data-state=open]]:）は区切りにしない。
// = と < と > は、属性の値の前と後（class:text-xs={small}、<p class=text-xs>）で区切るために足す。
const tokenize = (line) => {
  const tokens = [];
  let depth = 0;
  let current = "";
  const flush = () => {
    if (current) tokens.push(current);
    current = "";
    depth = 0;
  };
  for (const c of line) {
    if (/[\s"'`]/.test(c) || (depth === 0 && /[{},;=<>]/.test(c))) {
      flush();
      continue;
    }
    if (c === "[" || c === "(") depth++;
    else if ((c === "]" || c === ")") && depth > 0) depth--;
    current += c;
  }
  flush();
  return tokens;
};

// 任意値の [ ] と ( ) の中の :（has-[:focus-visible]:、text-[length:12px]、text-(length:--x)）では分けない
const splitVariants = (token) => {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i++) {
    if (token[i] === "[" || token[i] === "(") depth++;
    else if (token[i] === "]" || token[i] === ")") depth--;
    else if (token[i] === ":" && depth === 0) {
      parts.push(token.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(token.slice(start));
  return parts;
};

let found = 0;
let allowed = 0;
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (e) {
    console.error(`読めない: ${relative(".", file)}\n${e.message}`);
    process.exit(2);
  }
  text.split("\n").forEach((line, i) => {
    if (line.includes(ALLOW_MARK)) {
      allowed++;
      return;
    }
    for (const token of tokenize(line)) {
      const parts = splitVariants(token);
      // 末尾の ! は重要度の印（text-xs!）、先頭の ! は古い書き方（!text-xs）
      const utility = parts.pop().replace(/^!|!$/g, "");
      for (const { id, label, test } of RULES) {
        if (!test(parts, utility)) continue;
        found++;
        console.log(`${relative(".", file)}:${i + 1}: ${id} ${label} ${token}`);
      }
    }
  });
}

if (allowed) console.log(`${ALLOW_MARK} で外した行: ${allowed}`);
if (found) {
  console.log(
    `${found} か所に、画面を作るときの原則に反するユーティリティがある。デザインシステムの文書の、行の ID の原則に沿って直す`,
  );
  process.exit(1);
}
console.log(
  `${files.length} 個のファイルに、画面を作るときの原則に反するユーティリティはなかった`,
);
