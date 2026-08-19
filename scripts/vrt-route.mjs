#!/usr/bin/env node
// route 側 VRT を Playwright 公式 container で実行する。手順と理由は
// README.md の「route 側 VRT」節。baseline の更新は pnpm vrt:route:update。

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// image の版は @playwright/test から導出する。二重管理だとブラウザ版だけ取り残される。
const playwrightVersion = JSON.parse(
  readFileSync(
    join(repoRoot, "node_modules/@playwright/test/package.json"),
    "utf8",
  ),
).version;
const image = `mcr.microsoft.com/playwright:v${playwrightVersion}-noble`;

// 3 route × desktop / mobile。spec 側の routes / viewports と一致させる。
const EXPECTED_TESTS = 6;

// container へは shell 経由で渡すため、素通しすると語分割とコマンド注入が起きる。
const ALLOWED_ARGS = ["--update-snapshots"];

const REPORT_RELATIVE_PATH = "test-results/route-vrt-report.json";

// worktree ごとに分ける。固定名だと別 worktree と install が競合する。
const volumeScope = createHash("sha256")
  .update(repoRoot)
  .digest("hex")
  .slice(0, 10);

function fail(message, hint) {
  console.error(`\n[vrt] ${message}`);
  if (hint) {
    console.error(`      ${hint}`);
  }
  process.exit(1);
}

// workspace は glob 指定のため実ディレクトリから組み立てる。隠し損ねると container の
// install が Linux 向けの依存をホストの bind mount へ書き込む。
function workspaceModulePaths() {
  const paths = ["/work/node_modules"];
  for (const group of ["apps", "packages"]) {
    const groupDir = join(repoRoot, group);
    if (!existsSync(groupDir)) {
      continue;
    }
    for (const entry of readdirSync(groupDir, { withFileTypes: true })) {
      if (
        entry.isDirectory() &&
        existsSync(join(groupDir, entry.name, "package.json"))
      ) {
        paths.push(`/work/${group}/${entry.name}/node_modules`);
      }
    }
  }
  return paths;
}

const playwrightArgs = process.argv.slice(2);
const rejected = playwrightArgs.filter((arg) => !ALLOWED_ARGS.includes(arg));
if (rejected.length > 0) {
  fail(
    `渡せない引数です: ${rejected.join(" ")}`,
    `使えるのは ${ALLOWED_ARGS.join(" / ")} だけです。`,
  );
}

const moduleVolumeArgs = workspaceModulePaths().flatMap((path, index) => [
  "-v",
  `kufu-e2e-${volumeScope}-modules-${index}:${path}`,
]);

const containerScript = [
  "set -e",
  "corepack enable",
  "pnpm install --frozen-lockfile --store-dir /pnpm-store",
  // json reporter は実行件数の検査用。--retries=0 は、許容 diff 0 の VRT で
  // 再試行すると flake を緑で握り潰すため (config は CI で retries: 2 を与える)。
  [
    "pnpm",
    "exec",
    "playwright",
    "test",
    "route-vrt",
    "--reporter=list,json",
    "--retries=0",
    ...playwrightArgs,
  ].join(" "),
].join("\n");

const dockerArgs = [
  "run",
  "--rm",
  "--init",
  // CI の runner に合わせる。Apple Silicon では Rosetta で動くため遅くなる。
  "--platform",
  "linux/amd64",
  // 既定の小さい /dev/shm では Chromium が落ちる (Playwright の推奨設定)。
  "--ipc=host",
  "-v",
  `${repoRoot}:/work`,
  "-w",
  "/work",
  ...moduleVolumeArgs,
  "-v",
  `kufu-e2e-${volumeScope}-pnpm-store:/pnpm-store`,
  // spec 側の skip 判定。
  "-e",
  "ROUTE_VRT_CONTAINER=1",
  "-e",
  `PLAYWRIGHT_JSON_OUTPUT_NAME=${REPORT_RELATIVE_PATH}`,
  image,
  "/bin/bash",
  "-c",
  containerScript,
];

const reportPath = join(repoRoot, REPORT_RELATIVE_PATH);
rmSync(reportPath, { force: true });

console.log(`[vrt] route VRT を ${image} で実行します`);

const result = spawnSync("docker", dockerArgs, {
  cwd: repoRoot,
  stdio: "inherit",
});

if (result.error) {
  fail(
    `docker コマンドを実行できませんでした: ${result.error.message}`,
    "docker が PATH にあるかを確認してください。",
  );
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// 1 件も撮らずに緑になる事故を防ぐ。
if (!existsSync(reportPath)) {
  fail(`Playwright のレポートが見つかりません: ${REPORT_RELATIVE_PATH}`);
}

let stats;
try {
  ({ stats } = JSON.parse(readFileSync(reportPath, "utf8")));
} catch (error) {
  fail(
    `Playwright のレポートを読めません: ${REPORT_RELATIVE_PATH}`,
    error.message,
  );
}

if (stats?.expected !== EXPECTED_TESTS) {
  fail(
    `期待した ${EXPECTED_TESTS} 件が実行されていません (passed ${stats?.expected ?? 0} / skipped ${stats?.skipped ?? 0})`,
    "撮影環境の条件を満たさず skip された可能性があります。",
  );
}

console.log(
  `\n[vrt] route VRT: ${stats.expected} 件すべて baseline と一致しました。`,
);
