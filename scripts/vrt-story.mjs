#!/usr/bin/env node
// story 側 VRT (storycap + reg-suit) の実行入口。判定方針の正本は adr/0015。
// 手順は README.md の「story 側 VRT」節。
//
// storycap は 1 回で 1 Storybook しか撮れないため、2 インスタンスを順に撮って
// __screenshots__/<instance>/ へ分ける (story id が衝突しうるため)。

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

// 資格情報の実値はリポジトリに置かない。
const REQUIRED_ENV = [
  "VRT_S3_ENDPOINT",
  "VRT_S3_ACCESS_KEY_ID",
  "VRT_S3_SECRET_ACCESS_KEY",
];

const SCREENSHOT_DIR = join(repoRoot, "__screenshots__");
const WORKING_DIR = join(repoRoot, ".reg");
const REPORT_JSON = join(WORKING_DIR, "out.json");

// VRT 用ビルドだけに置く目印。通常ビルドを --skip-build で撮ると外部地図が遮断されない。
const VRT_BUILD_MARKER = ".vrt-build";

// story あたり 1 viewport で撮る (ADR-0015)。幅と高さの決め方は次のとおり。
//
// - 幅は固定する。内容に合わせると w-full のコンポーネントが潰れ、レイアウト情報が落ちる。
//   corporate-site は 800px だと lg: 未満の狭い並びになるので実サイトと同じ desktop 幅にする。
// - 高さは最小にする。fullPage が内容の高さまで伸ばすため、余白が残らない。
//
// 高さを viewport から算出するコンポーネント (calc(100vh - ...) 等) は最小の高さだと潰れる。
// storycap の per-story parameters は addon 登録が要り、その addon は Storybook 7/8 向けで
// 本リポジトリの 10 と合わない。そのため exceptions に列挙し、CLI の include / exclude で
// パスを分けて撮る。同じ outDir へ追記されるので比較対象は 1 つのまま。
const TARGETS = [
  {
    name: "ui",
    filter: "@kufu/ui",
    staticDir: join(repoRoot, "packages/ui/storybook-static"),
    port: 6011,
    viewport: "800x10",
  },
  {
    name: "corporate-site",
    filter: "@kufu/corporate-site",
    staticDir: join(repoRoot, "apps/corporate-site/storybook-static"),
    port: 6012,
    viewport: "1280x10",
    // ProductsSidebarNav は lg:max-h-[calc(100vh-18rem)] で一覧の高さを決める。
    exceptions: [
      {
        viewport: "1280x800",
        stories: [
          "Sections/ProductsDetail/ProductsSidebarNav/*",
          "Sections/ProductsDetail/ProductsDetailSection/*",
        ],
      },
    ],
  },
];

const KNOWN_FLAGS = ["--skip-build", "--no-fail-on-diff"];

const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
// base branch で baseline を撮り直すとき用。publish は両モードで行われる。
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
  // VITE_VRT=1 のときだけ外部地図の埋め込みを遮断する (README.md の「撮影の安定化」)。
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

function storycap(target, outDir, viewport, storyFilters) {
  const serverCmd = `pnpm exec http-server ${target.staticDir} -p ${target.port} -c-1 --silent`;
  // --viewport は配列オプション。URL を先頭に置かないと viewport 値として読まれる。
  run("pnpm", [
    "exec",
    "storycap",
    `http://127.0.0.1:${target.port}`,
    "--serverCmd",
    serverCmd,
    "--outDir",
    outDir,
    "--viewport",
    viewport,
    ...storyFilters,
  ]);
}

function capture(target) {
  console.log(`\n[vrt] capture: ${target.name}`);
  const outDir = join(SCREENSHOT_DIR, target.name);
  const exceptions = target.exceptions ?? [];
  const excluded = exceptions.flatMap((e) =>
    e.stories.flatMap((s) => ["--exclude", s]),
  );

  storycap(target, outDir, target.viewport, excluded);
  for (const exception of exceptions) {
    // 対象が数件なので並列数を 1 に落とす。ブラウザの起動回数が実行時間を決める。
    storycap(target, outDir, exception.viewport, [
      "--parallel",
      "1",
      ...exception.stories.flatMap((s) => ["--include", s]),
    ]);
  }

  // storycap は 0 枚でも正常終了しうる。そのまま進むと欠損が snapshot として publish される。
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

  // 許容 diff は 0 (ADR-0015)。deleted は撮影欠損でも出るため失敗させる。
  // new は story 追加と baseline 不在の初回で必ず出るので報告だけにする。
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

// 前回の比較結果を読み違えないよう消す。
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
