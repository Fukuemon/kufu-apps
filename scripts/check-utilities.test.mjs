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
      "docs/d.md":
        "- `TEXT-MIN-SIZE`: 小さい文字\n- `FOCUS-ONE`: フォーカス\n- `MOTION-REDUCE`: 動き\n",
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
      "docs/d.md":
        "- `FOCUS-ONE`\n- `MOTION-REDUCE`\n- TEXT-MIN-SIZE は小さい文字\n",
      [`${UI}/a.tsx`]: '<p className="text-body" />\n',
    },
    ["--doc", "docs/d.md"],
  );
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stderr, /文書に無い原則の ID: TEXT-MIN-SIZE/);
  assert.doesNotMatch(r.stderr, /文書に無い原則の ID: FOCUS-ONE/);
  assert.equal(r.stdout, "");
});

await test("--doc はパスの前でも後でも効き、文書のファイルをコードとして読まない", () => {
  const files = {
    "docs/d.md":
      "- `TEXT-MIN-SIZE`\n- `FOCUS-ONE`\n- `MOTION-REDUCE`\n\n`text-xs` は使わない\n",
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

await test("focus-ring だけなら FOCUS-ONE は 0。変種の無い ring と focusin は見ない", () => {
  const r = run({
    [`${UI}/a.tsx`]: '<input className="focus-ring ring-1 ring-divider" />\n',
    [`${SITE}/a.astro`]:
      '<a class="focus-ring hover:text-primary" href="/">x</a>\n<script>carousel.addEventListener("focusin", () => el.focus());</script>\n',
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

await test("focus-ring のほかのフォーカスの書き方を、FOCUS-ONE と一緒に出して 1", () => {
  const r = run({
    [`${UI}/a.tsx`]:
      '<button className="focus-visible:ring-3 focus:outline-none outline-none" />\n<input className="focus-visible:border-focus-outline ring-focus-halo/50 outline-2 outline-offset-2" />\n<a className="group-focus-visible:underline focus-within:bg-surface has-[:focus-visible]:block" />\n',
    [`${SITE}/b.css`]:
      ".a:focus-visible {\n  color: red;\n}\n.b:focus,\n.c:focus-within::after {\n  color: red;\n}\n",
  });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  for (const [file, line, token] of [
    ["packages/ui/src/a.tsx", 1, "focus-visible:ring-3"],
    ["packages/ui/src/a.tsx", 1, "focus:outline-none"],
    ["packages/ui/src/a.tsx", 1, "outline-none"],
    ["packages/ui/src/a.tsx", 2, "focus-visible:border-focus-outline"],
    ["packages/ui/src/a.tsx", 2, "ring-focus-halo/50"],
    ["packages/ui/src/a.tsx", 2, "outline-2"],
    ["packages/ui/src/a.tsx", 2, "outline-offset-2"],
    ["packages/ui/src/a.tsx", 3, "group-focus-visible:underline"],
    ["packages/ui/src/a.tsx", 3, "focus-within:bg-surface"],
    ["packages/ui/src/a.tsx", 3, "has-[:focus-visible]:block"],
    ["apps/corporate-site/src/b.css", 1, ".a:focus-visible"],
    ["apps/corporate-site/src/b.css", 4, ".b:focus"],
    ["apps/corporate-site/src/b.css", 5, ".c:focus-within::after"],
  ]) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      r.stdout,
      new RegExp(
        `${file.replace(/\./g, "\\.")}:${line}: FOCUS-ONE .* ${escaped}$`,
        "m",
      ),
      token,
    );
  }
  assert.match(r.stdout, /13 か所/);
});

await test("動きを減らす設定の条件を、MOTION-REDUCE と一緒に出して 1", () => {
  const r = run({
    [`${UI}/a.tsx`]:
      '<div className="motion-reduce:animate-none motion-safe:transition md:motion-reduce:hidden" />\n',
    [`${SITE}/b.css`]:
      "@media (prefers-reduced-motion: reduce) {\n  .a {\n    animation: none;\n  }\n}\n",
    [`${SITE}/c.astro`]:
      '<script>\n  const q = window.matchMedia("(prefers-reduced-motion: reduce)");\n</script>\n',
  });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  for (const [file, line, token] of [
    ["packages/ui/src/a.tsx", 1, "motion-reduce:animate-none"],
    ["packages/ui/src/a.tsx", 1, "motion-safe:transition"],
    ["packages/ui/src/a.tsx", 1, "md:motion-reduce:hidden"],
    ["apps/corporate-site/src/b.css", 1, "(prefers-reduced-motion:"],
    ["apps/corporate-site/src/c.astro", 2, "(prefers-reduced-motion:"],
  ]) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      r.stdout,
      new RegExp(
        `${file.replace(/\./g, "\\.")}:${line}: MOTION-REDUCE .* ${escaped}$`,
        "m",
      ),
      token,
    );
  }
  assert.match(r.stdout, /5 か所/);
});

await test("トークンの層の動きの止め方と、動きのユーティリティは MOTION-REDUCE で 0", () => {
  const r = run({
    "packages/ui/src/tokens/theme.css":
      "@media (prefers-reduced-motion: reduce) {\n  * {\n    animation: none !important;\n  }\n}\n",
    [`${UI}/a.tsx`]: '<div className="transition-opacity animate-none" />\n',
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
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
