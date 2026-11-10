#!/usr/bin/env node
// story 側 VRT。Storybook を撮影し、reg-cli で baseline と比べる。
// 手順と設計の理由は README.md の VRT 節、判断は docs/adr/0018。
//
//   node scripts/vrt-story.mjs [--update] [--target=ui|corporate-site]
//
// baseline は CI (ubuntu-latest / amd64) で撮ったものを正とするため、ローカル実行では
// ホストの描画差で差分が出る。ローカルは撮影が通ることの確認に使う。

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// corporate-site の test-runner は起動済みの Storybook を開く。
const CORPORATE_PORT = 6012;

const TARGETS = {
  ui: { capture: captureUi },
  "corporate-site": { capture: captureCorporate },
};

const args = process.argv.slice(2);
const update = args.includes("--update");
const targetArg = args
  .find((a) => a.startsWith("--target="))
  ?.slice("--target=".length);

if (targetArg && !(targetArg in TARGETS)) {
  fail(
    `渡せない target です: ${targetArg}`,
    `使えるのは ${Object.keys(TARGETS).join(" / ")} だけです。`,
  );
}
const targets = targetArg ? [targetArg] : Object.keys(TARGETS);

function fail(message, hint) {
  console.error(`\n[vrt] ${message}`);
  if (hint) console.error(`      ${hint}`);
  process.exit(1);
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    stdio: "inherit",
    ...options,
  });
  if (result.error) {
    fail(`${command} を起動できませんでした: ${result.error.message}`);
  }
  if (result.status !== 0 && !options.allowFailure) {
    fail(
      `${command} ${commandArgs.join(" ")} が失敗しました (exit ${result.status})`,
    );
  }
  return result.status ?? 1;
}

async function waitForPort(port, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/index.json`)).ok) return;
    } catch {
      // 起動待ち
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  fail(
    `Storybook の配信が ${timeoutMs / 1000} 秒で起動しませんでした (port ${port})`,
  );
}

// addon-vitest は Vite で story を変換して描画するため、静的ビルドを使わない。
function captureUi() {
  run("pnpm", ["--filter", "@kufu/ui", "vrt:capture"]);
}

async function captureCorporate() {
  run("pnpm", ["--filter", "@kufu/corporate-site", "storybook:build"]);
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
}

// 許容 diff は 0 (docs/adr/0015)。matchingThreshold だけ 0.02 にしているのは、角丸の
// アンチエイリアスが 1 チャンネルあたり ±1 で揺れるため。差分ピクセル数は 0 のまま。
function compare(target) {
  const actual = join(repoRoot, ".vrt/actual", target);
  const baseline = join(repoRoot, "vrt/baseline", target);
  if (update) {
    mkdirSync(baseline, { recursive: true });
  } else if (!existsSync(baseline)) {
    fail(
      `baseline がありません: ${baseline}`,
      "pnpm vrt:story:update で作成してください。",
    );
  }
  const cliArgs = [
    actual,
    baseline,
    join(repoRoot, ".vrt/diff", target),
    "-R",
    join(repoRoot, ".vrt", `report-${target}.html`),
    "--json",
    join(repoRoot, ".vrt", `out-${target}.json`),
    "--matchingThreshold",
    "0.02",
    "--thresholdPixel",
    "0",
  ];
  if (update) cliArgs.push("--update");
  return run("pnpm", ["exec", "reg-cli", ...cliArgs], { allowFailure: true });
}

let failed = 0;
for (const target of targets) {
  console.log(`\n[vrt] capture: ${target}`);
  rmSync(join(repoRoot, ".vrt/actual", target), {
    force: true,
    recursive: true,
  });
  await TARGETS[target].capture();

  console.log(`\n[vrt] compare: ${target}`);
  if (compare(target) !== 0) failed += 1;
}

if (update) {
  console.log(
    "\n[vrt] baseline を更新しました。差分を確認して commit してください。",
  );
  process.exit(0);
}
if (failed > 0) {
  console.error(
    `\n[vrt] 差分を検出しました。レポート: .vrt/report-<target>.html`,
  );
}
process.exit(failed > 0 ? 1 : 0);
