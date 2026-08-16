#!/usr/bin/env node
// story 側 VRT (storycap + reg-suit) の実行入口。
//
// Storybook は @kufu/ui と @kufu/corporate-site の 2 インスタンスあり、storycap は 1 回の実行で
// 1 インスタンスしか撮影できない。そのため順に撮影し、reg-suit の比較対象 1 つ (__screenshots__) へ
// まとめる。story id は Storybook インスタンスをまたぐと衝突しうるので、インスタンス名の
// サブディレクトリ (__screenshots__/<instance>/) で名前空間を分けている。
//
// 撮影対象は Storybook が拾う story だけであり、fixture story
// (apps/corporate-site/scripts/__fixtures__/) は .storybook/main.ts の glob (../src/**) の外にあるため
// 自動的に対象外になる。
//
// storycap / http-server は文字列で組み立てて `pnpm exec` から起動するため、knip は依存として
// 検出できない。knip.json の ignoreDependencies に列挙してあるのはそのため。
//
// 判定方針の正本は adr/0015-visual-regression-testing-policy.md。

import { spawnSync } from "node:child_process";
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// endpoint と資格情報は env でだけ渡す。実値をリポジトリに置かない (spec の Security / Privacy)。
const REQUIRED_ENV = [
  "VRT_S3_ENDPOINT",
  "VRT_S3_ACCESS_KEY_ID",
  "VRT_S3_SECRET_ACCESS_KEY",
];

const SCREENSHOT_DIR = join(repoRoot, "__screenshots__");
const WORKING_DIR = join(repoRoot, ".reg");
const REPORT_JSON = join(WORKING_DIR, "out.json");

// VRT 用に build した Storybook だけに置く目印。--skip-build で通常ビルドを撮ってしまうと、
// 外部地図が遮断されず撮影が終わらないか flake するため、この目印の有無で弾く。
const VRT_BUILD_MARKER = ".vrt-build";

// storycap の既定 viewport を明示的に固定する。story 側は 1 種だけで撮り、
// desktop / mobile の 2 viewport は route 側 (Playwright) に適用する (ADR-0015)。
const VIEWPORT = "800x600";

const TARGETS = [
  {
    name: "ui",
    filter: "@kufu/ui",
    staticDir: join(repoRoot, "packages/ui/storybook-static"),
    port: 6011,
  },
  {
    name: "corporate-site",
    filter: "@kufu/corporate-site",
    staticDir: join(repoRoot, "apps/corporate-site/storybook-static"),
    port: 6012,
  },
];

const KNOWN_FLAGS = ["--skip-build", "--no-fail-on-diff"];

const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
// base branch 上で baseline を撮り直すとき用。差分があっても失敗させない。
// publish は reg-suit run が常に行うため、このフラグは publish の有無を変えない。
const noFailOnDiff = args.includes("--no-fail-on-diff");

const unknownArgs = args.filter((arg) => !KNOWN_FLAGS.includes(arg));
if (unknownArgs.length > 0) {
  fail(
    `unknown argument: ${unknownArgs.join(" ")}`,
    `usage: node scripts/vrt-story.mjs [${KNOWN_FLAGS.join("] [")}]`,
    2,
  );
}

function fail(message, hint, code = 1) {
  console.error(`\n[vrt] ${message}`);
  if (hint) {
    console.error(`      ${hint}`);
  }
  process.exit(code);
}

function countPngs(dir) {
  if (!existsSync(dir)) {
    return 0;
  }
  return readdirSync(dir, { recursive: true, withFileTypes: true }).filter(
    (entry) => entry.isFile() && entry.name.endsWith(".png"),
  ).length;
}

function requireEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    fail(
      `VRT の実行に必要な環境変数が設定されていません: ${missing.join(", ")}`,
      "README.md の「Visual Regression Testing (VRT)」節に従って .env を用意してください。",
      2,
    );
  }
}

function run(command, commandArgs, extraEnv = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.error) {
    fail(
      `${command} を起動できませんでした: ${result.error.message}`,
      "pnpm が PATH にあるかを確認してください。",
    );
  }
  if (result.status !== 0) {
    fail(
      `${command} ${commandArgs.join(" ")} が失敗しました (exit ${result.status})`,
    );
  }
}

function buildStorybook(target) {
  console.log(`\n[vrt] build storybook: ${target.filter}`);
  // VITE_VRT=1 のときだけ外部地図の埋め込みを遮断する。
  // 地図タイルは内容と読み込み完了時刻が実行ごとに変わり、許容 diff 0 と両立しないため。
  run("pnpm", ["--filter", target.filter, "storybook:build"], {
    VITE_VRT: "1",
  });
  writeFileSync(join(target.staticDir, VRT_BUILD_MARKER), "");
}

function requireVrtBuild(target) {
  if (existsSync(join(target.staticDir, VRT_BUILD_MARKER))) {
    return;
  }
  fail(
    `${target.filter} の Storybook が VRT 用に build されていません: ${target.staticDir}`,
    "--skip-build を外して実行し直してください。",
    2,
  );
}

function capture(target) {
  console.log(`\n[vrt] capture: ${target.name}`);
  const outDir = join(SCREENSHOT_DIR, target.name);
  const serverCmd = `pnpm exec http-server ${target.staticDir} -p ${target.port} -c-1 --silent`;
  // storycap の --viewport は配列オプションなので、URL を先頭に置かないと URL が
  // viewport 値として読み込まれる。
  run("pnpm", [
    "exec",
    "storycap",
    `http://127.0.0.1:${target.port}`,
    "--serverCmd",
    serverCmd,
    "--outDir",
    outDir,
    "--viewport",
    VIEWPORT,
  ]);

  // storycap は 1 枚も撮れなくても正常終了しうる。0 枚のまま比較へ進むと、reg-suit は
  // baseline 側だけが存在する状態 (deleted) を作り、その欠損を当該コミットの snapshot として
  // publish してしまう。ここで止める。
  const captured = countPngs(outDir);
  if (captured === 0) {
    fail(
      `${target.name} の撮影結果が 0 枚です`,
      "Storybook の build 結果と storycap のログを確認してください。",
    );
  }
  console.log(`[vrt] captured ${captured} images: ${target.name}`);
  return captured;
}

function report() {
  if (!existsSync(REPORT_JSON)) {
    fail(`reg-suit の比較結果が見つかりません: ${REPORT_JSON}`);
  }

  let result;
  try {
    result = JSON.parse(readFileSync(REPORT_JSON, "utf8"));
  } catch (error) {
    fail(
      `reg-suit の比較結果を読めません: ${REPORT_JSON}`,
      `${error.message} — .reg を削除して実行し直してください。`,
    );
  }

  const counts = {
    changed: result.failedItems?.length ?? 0,
    new: result.newItems?.length ?? 0,
    deleted: result.deletedItems?.length ?? 0,
    passed: result.passedItems?.length ?? 0,
  };

  console.log("\n[vrt] story 側 VRT の結果");
  console.log(`  changed : ${counts.changed}`);
  console.log(`  new     : ${counts.new}`);
  console.log(`  deleted : ${counts.deleted}`);
  console.log(`  passed  : ${counts.passed}`);

  if (noFailOnDiff) {
    console.log("\n[vrt] --no-fail-on-diff のため差分では失敗させません。");
    return 0;
  }

  // 許容 diff は 0 (完全一致) で、差分が出たら失敗させる (ADR-0015 / spec D10・D12)。
  // deleted も失敗させる。story を消したときだけでなく、撮影が部分的に欠けたときにも出るため。
  // new は story の追加と baseline 不在の初回で必ず出るので、件数だけ報告して失敗させない。
  const blocking = counts.changed + counts.deleted;
  if (blocking > 0) {
    console.error(
      `\n[vrt] 差分を ${blocking} 件検出しました (changed ${counts.changed} / deleted ${counts.deleted})。差分レポート: .reg/index.html`,
    );
    return 1;
  }
  console.log("\n[vrt] 差分はありません。");
  return 0;
}

requireEnv();

if (skipBuild) {
  for (const target of TARGETS) {
    requireVrtBuild(target);
  }
} else {
  for (const target of TARGETS) {
    buildStorybook(target);
  }
}

// 前回実行の比較結果を残さない。読み違えて古い判定を返さないようにする。
rmSync(WORKING_DIR, { force: true, recursive: true });
rmSync(SCREENSHOT_DIR, { force: true, recursive: true });

let total = 0;
for (const target of TARGETS) {
  total += capture(target);
}
console.log(`\n[vrt] 撮影枚数の合計: ${total}`);

console.log("\n[vrt] reg-suit run");
run("pnpm", ["exec", "reg-suit", "run"]);

process.exit(report());
