#!/usr/bin/env node
// story 側 VRT の実行入口。Storybook を build して撮影し、reg-cli で baseline と比べる。
//
// **撮影と判定は CI に一本化する** (spec D8)。baseline は CI (ubuntu-latest / amd64) で撮った
// ものを Git 管理し、ローカル実行はホストの描画差で差分が出る。ローカルは撮影の確認用と考える。
// container へ寄せないのは、@storybook/addon-vitest が撮影時に Vite のバンドルを回すためで、
// Apple Silicon 上の amd64 エミュレーションでは Storybook の build だけで 25 分以上かかる (実測)。
//
// Storybook は 2 インスタンスあり、撮影の載せ方が違う。
//   packages/ui        : @storybook/addon-vitest + @storycap-testrun/browser
//   apps/corporate-site: @storybook/test-runner  + @storycap-testrun/node (Astro は addon-vitest 非対応)

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const actualDir = join(repoRoot, ".vrt/actual");
const baselineDir = join(repoRoot, "vrt/baseline");
const diffDir = join(repoRoot, ".vrt/diff");
const reportPath = join(repoRoot, ".vrt/report.html");

// corporate-site の test-runner は起動済みの Storybook を開く。
const CORPORATE_PORT = 6012;

const update = process.argv.slice(2).includes("--update");

function fail(message, hint) {
  console.error(`\n[vrt] ${message}`);
  if (hint) console.error(`      ${hint}`);
  process.exit(1);
}

async function waitForPort(port, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/index.json`);
      if (res.ok) return;
    } catch {
      // 起動待ち
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  fail(
    `Storybook の配信が ${timeoutMs / 1000} 秒で起動しませんでした (port ${port})`,
  );
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    ...options,
  });
  if (result.error)
    fail(`${command} を起動できませんでした: ${result.error.message}`);
  if (result.status !== 0 && !options.allowFailure) {
    fail(`${command} ${args.join(" ")} が失敗しました (exit ${result.status})`);
  }
  return result.status ?? 1;
}

console.log("\n[vrt] build storybook");
run("pnpm", ["storybook:build"]);

rmSync(actualDir, { force: true, recursive: true });
rmSync(diffDir, { force: true, recursive: true });

console.log("\n[vrt] capture: @kufu/ui");
run("pnpm", ["--filter", "@kufu/ui", "vrt:capture"]);

console.log("\n[vrt] capture: @kufu/corporate-site");
// test-runner は起動済みの Storybook を開く。配信はこの script が抱えて確実に落とす。
const server = spawn(
  "pnpm",
  [
    "exec",
    "http-server",
    "apps/corporate-site/storybook-static",
    "-p",
    String(CORPORATE_PORT),
    "-c-1",
    "--silent",
  ],
  { cwd: repoRoot, stdio: "ignore" },
);
try {
  await waitForPort(CORPORATE_PORT);
  run("pnpm", ["--filter", "@kufu/corporate-site", "vrt:capture"]);
} finally {
  server.kill();
}

if (update) {
  mkdirSync(baselineDir, { recursive: true });
} else if (!existsSync(baselineDir)) {
  fail(
    `baseline がありません: ${baselineDir}`,
    "pnpm vrt:story:update で作成してください。",
  );
}

console.log("\n[vrt] compare");
// 許容 diff は 0 (ADR-0015)。matchingThreshold だけ 0.02 にしているのは、角丸の
// アンチエイリアスが 1 チャンネルあたり ±1 で揺れるため (実測)。差分ピクセル数は 0 のまま。
const args = [
  actualDir,
  baselineDir,
  diffDir,
  "-R",
  reportPath,
  "--json",
  join(repoRoot, ".vrt/out.json"),
  "--matchingThreshold",
  "0.02",
  "--thresholdPixel",
  "0",
];
if (update) args.push("--update");
const status = run("pnpm", ["exec", "reg-cli", ...args], {
  allowFailure: true,
});

if (update) {
  console.log(
    "\n[vrt] baseline を更新しました。差分を確認して commit してください。",
  );
  process.exit(0);
}
if (status !== 0) {
  console.error(`\n[vrt] 差分を検出しました。レポート: .vrt/report.html`);
}
process.exit(status);
