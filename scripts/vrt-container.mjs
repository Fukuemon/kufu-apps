#!/usr/bin/env node
// 引数で渡した pnpm script を Playwright 公式 container の中で実行する。
// 撮影環境を固定しないとホストと CI で baseline が一致しない (docs/adr/0015、README.md の VRT 節)。
//
//   node scripts/vrt-container.mjs <pnpm script> [追加引数...]

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

// container へは shell 経由で渡すため、素通しすると語分割とコマンド注入が起きる。
const ALLOWED_SCRIPTS = ["vrt:route:run"];
const ALLOWED_ARGS = ["--update-snapshots"];

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

const [script, ...extraArgs] = process.argv.slice(2);
if (!ALLOWED_SCRIPTS.includes(script)) {
  fail(
    `渡せない script です: ${script ?? "(指定なし)"}`,
    `使えるのは ${ALLOWED_SCRIPTS.join(" / ")} だけです。`,
  );
}
const rejected = extraArgs.filter((arg) => !ALLOWED_ARGS.includes(arg));
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
  ["pnpm", script, ...extraArgs].join(" "),
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
  // route VRT の spec 側の skip 判定。
  "-e",
  "ROUTE_VRT_CONTAINER=1",
  image,
  "/bin/bash",
  "-c",
  containerScript,
];

console.log(`[vrt] ${script} を ${image} で実行します`);

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

process.exit(result.status ?? 1);
