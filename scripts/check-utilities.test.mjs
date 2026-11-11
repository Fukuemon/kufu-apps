// check-utilities.mjs が、原則に反するユーティリティで 1 を、原則に沿ったユーティリティだけのコードで 0 を返すことを確認する。
// 実行: node --test scripts/check-utilities.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./check-utilities.mjs", import.meta.url));
const UI = "packages/ui/src";
const SITE = "apps/corporate-site/src";

// files の { 相対パス: 中身 } を一時のディレクトリに書き、そこで script を流す。TARGETS の 2 つの置き場は、いつも作る
const run = (files, args = []) => {
  const dir = mkdtempSync(join(tmpdir(), "check-utilities-"));
  for (const target of [UI, SITE])
    mkdirSync(join(dir, target), { recursive: true });
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), body);
  }
  return spawnSync(process.execPath, [script, ...args], {
    cwd: dir,
    encoding: "utf8",
  });
};

await test("文字のスタイルと色のユーティリティだけなら 0", () => {
  const r = run({
    [`${UI}/Card.tsx`]:
      '<p className="text-body text-text text-text-secondary text-caption md:text-heading-36 lg:text-heading-45 xl:text-display-57 text-eyebrow text-watermark-120 text-label/6" />\n',
    [`${SITE}/A.astro`]:
      '<p class="text-body-dense text-primary-soft text-[var(--x)]">x</p>\n',
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /2 個のファイル/);
});

await test("小さすぎる文字を、原則の ID と一緒に出して 1", () => {
  const r = run({
    [`${UI}/a.tsx`]:
      '<p className="text-xs" />\n<p className="md:text-sm/6 text-[10px] text-[length:0.75rem]" />\n',
  });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(
    r.stdout,
    /packages\/ui\/src\/a\.tsx:1: TEXT-MIN-SIZE .* text-xs$/m,
  );
  assert.match(
    r.stdout,
    /packages\/ui\/src\/a\.tsx:2: TEXT-MIN-SIZE .* md:text-sm\/6$/m,
  );
  assert.match(
    r.stdout,
    /packages\/ui\/src\/a\.tsx:2: TEXT-MIN-SIZE .* text-\[10px\]$/m,
  );
  assert.match(
    r.stdout,
    /packages\/ui\/src\/a\.tsx:2: TEXT-MIN-SIZE .* text-\[length:0\.75rem\]$/m,
  );
  assert.match(r.stdout, /4 か所/);
});

await test("Tailwind のデフォルトの大きさと、大きさの関数の任意値を出して 1", () => {
  const r = run({
    [`${SITE}/b.astro`]:
      '<h1 class="text-base md:text-lg text-xl lg:text-2xl xl:text-5xl text-[clamp(2rem,5vw,2.625rem)] text-[calc(1rem+1vw)]">x</h1>\n',
  });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  for (const token of [
    "text-base",
    "md:text-lg",
    "text-xl",
    "lg:text-2xl",
    "xl:text-5xl",
    "text-[clamp(2rem,5vw,2.625rem)]",
    "text-[calc(1rem+1vw)]",
  ]) {
    assert.ok(
      r.stdout.includes(
        `TEXT-MIN-SIZE 14px より小さい文字か、テーマ変数に無い文字の大きさ ${token}`,
      ),
      token,
    );
  }
  assert.match(r.stdout, /7 か所/);
});

await test("length: で文字の大きさと示した任意値は、関数でも出す。length: の無い var() は出さない", () => {
  const r = run({
    [`${UI}/a.tsx`]:
      '<p className="text-[length:calc(1rem/2)] text-[length:var(--tiny)] text-(length:--tiny) text-[var(--app-color-text)]" />\n',
  });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  for (const token of [
    "text-[length:calc(1rem/2)]",
    "text-[length:var(--tiny)]",
    "text-(length:--tiny)",
  ]) {
    assert.ok(
      r.stdout.includes(
        `TEXT-MIN-SIZE 14px より小さい文字か、テーマ変数に無い文字の大きさ ${token}`,
      ),
      token,
    );
  }
  assert.doesNotMatch(r.stdout, /text-\[var\(--app-color-text\)\]/);
  assert.match(r.stdout, /3 か所/);
});

await test("属性の値の前の = と、関数の引数の引用符で、語を分ける", () => {
  const r = run({
    [`${SITE}/g.svelte`]: "<p class:text-xs={small}>Text</p>\n",
    [`${SITE}/h.tsx`]: 'const c = clsx("text-body", small && "text-sm");\n',
    [`${SITE}/i.html`]: "<p class=text-xs>small</p>\n",
  });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /g\.svelte:1: TEXT-MIN-SIZE .* class:text-xs$/m);
  assert.match(r.stdout, /h\.tsx:1: TEXT-MIN-SIZE .* text-sm$/m);
  assert.match(r.stdout, /i\.html:1: TEXT-MIN-SIZE .* text-xs$/m);
  assert.match(r.stdout, /3 か所/);
});

await test("重要度の印の付いたユーティリティも見つける", () => {
  const r = run({ [`${UI}/d.tsx`]: '<p className="text-xs! !text-sm" />\n' });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /2 か所/);
});

await test("ALLOW_MARK の行は見ず、外した行の数を出す", () => {
  const r = run({
    [`${UI}/e.tsx`]:
      '<p className="text-xs" /> {/* design-system-allow: 法令の表記の注記 */}\n',
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /design-system-allow で外した行: 1/);
});

await test("EXCLUDES の置き場と、拡張子の違うファイルと、node_modules は読まない", () => {
  const r = run({
    [`${UI}/tokens/theme.css`]: ".x { @apply text-xs; }\n",
    [`${UI}/notes.md`]: "text-xs\n",
    [`${UI}/node_modules/pkg/index.js`]: '"text-xs"\n',
    [`${UI}/ok.tsx`]: '<p className="text-body" />\n',
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /1 個のファイル/);
});

await test("引数のパスだけを読む", () => {
  const r = run(
    { [`${UI}/a.tsx`]: '"text-xs"\n', "app/b.tsx": '"text-body"\n' },
    ["app"],
  );
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

const design = fileURLToPath(
  new URL("../packages/ui/DESIGN.md", import.meta.url),
);

await test("--doc に packages/ui の DESIGN.md を渡すと、RULES の id が全て文書にあり 2 で止まらない", () => {
  const r = run({ [`${UI}/a.tsx`]: '<p className="text-body" />\n' }, [
    "--doc",
    design,
  ]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.doesNotMatch(r.stderr, /文書に無い原則の ID/);
});

await test("--doc の文書に RULES の id がコードスパンで出れば、コードを読んで結果を返す", () => {
  const r = run(
    {
      "docs/d.md": "- `TEXT-MIN-SIZE`: 小さい文字\n",
      [`${UI}/a.tsx`]: '<p className="text-xs" />\n',
    },
    ["--doc", "docs/d.md"],
  );
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /a\.tsx:1: TEXT-MIN-SIZE /);
});

await test("--doc の文書に無い id を出して 2。コードスパンでない語は数えない", () => {
  const r = run(
    {
      "docs/d.md": "- TEXT-MIN-SIZE は小さい文字\n",
      [`${UI}/a.tsx`]: '<p className="text-body" />\n',
    },
    ["--doc", "docs/d.md"],
  );
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stderr, /文書に無い原則の ID: TEXT-MIN-SIZE/);
  assert.equal(r.stdout, "");
});

await test("--doc はパスの前でも後でも効き、文書のファイルをコードとして読まない", () => {
  const files = {
    "docs/d.md": "- `TEXT-MIN-SIZE`\n\n`text-xs` は使わない\n",
    [`${UI}/a.tsx`]: '<p className="text-xs" />\n',
  };
  for (const args of [
    [`${UI}/a.tsx`, "--doc", "docs/d.md"],
    ["--doc", "docs/d.md", `${UI}/a.tsx`],
  ]) {
    const r = run(files, args);
    assert.equal(r.status, 1, args.join(" ") + "\n" + r.stdout + r.stderr);
    assert.match(r.stdout, /a\.tsx:1: TEXT-MIN-SIZE /);
    assert.doesNotMatch(r.stdout, /d\.md/);
  }
});

await test("--doc の文書が読めないか、値が無いときは 2", () => {
  const missing = run({}, ["--doc", "missing.md"]);
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /読めない: missing\.md/);
  for (const args of [["--doc"], ["--doc", ""]]) {
    const r = run({}, args);
    assert.equal(r.status, 2);
    assert.match(r.stderr, /--doc の次に値が要る/);
  }
});

await test("読めないパスは 2", () => {
  const r = run({}, ["missing"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /読めない: missing/);
});

await test("壊れたシンボリックリンクは 2", () => {
  const dir = mkdtempSync(join(tmpdir(), "check-utilities-"));
  mkdirSync(join(dir, UI), { recursive: true });
  mkdirSync(join(dir, SITE), { recursive: true });
  symlinkSync(join(dir, "nowhere.tsx"), join(dir, UI, "broken.tsx"));
  const r = spawnSync(process.execPath, [script], {
    cwd: dir,
    encoding: "utf8",
  });
  assert.equal(r.status, 2, r.stdout + r.stderr);
});
