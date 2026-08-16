#!/usr/bin/env node
// route 側 VRT (Playwright の toHaveScreenshot) を Playwright 公式 container の中で実行する。
//
// Playwright の baseline はファイル名に platform を含み、macOS で撮った `-darwin.png` は
// CI (Linux) では使われない。素の Linux ホストでもフォント資産が違えば一致しないため、撮影と
// 判定は公式 container に固定する (adr/0015 の「撮影環境を固定する」/ spec D8)。
// spec 側は ROUTE_VRT_CONTAINER でこの container 経由かを判定し、外では skip する。
//
// container の中でホストとは別に pnpm install をやり直すのは、ホスト (macOS) の node_modules に
// 入っているネイティブ依存が Linux で動かないため。node_modules は名前付き volume に隔離して
// ホスト側を壊さない。volume は再利用されるので 2 回目以降の install は速い。
//
// baseline の更新は `pnpm vrt:route:update` (--update-snapshots を渡す)。

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// image の版は @playwright/test から導出する。二重管理にすると、依存を上げたときに
// container のブラウザ版だけ取り残されて baseline が黙って無効化される。
const playwrightVersion = JSON.parse(
  readFileSync(
    join(repoRoot, "node_modules/@playwright/test/package.json"),
    "utf8",
  ),
).version;
const image = `mcr.microsoft.com/playwright:v${playwrightVersion}-noble`;

// 3 route × desktop / mobile。spec 側の routes / viewports と一致させる。
const EXPECTED_TESTS = 6;

// 渡せる引数は allowlist に限る。container へは shell 経由で渡すため、任意の文字列を
// 素通しすると語分割とコマンド注入が起きる。
const ALLOWED_ARGS = ["--update-snapshots"];

const REPORT_RELATIVE_PATH = "test-results/route-vrt-report.json";

// worktree ごとに volume を分ける。固定名だと .wt/<branch> の別 worktree と同じ volume を
// 共有し、同時に走らせたときに pnpm install が競合する。
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

// pnpm-workspace.yaml は apps/* / packages/* の glob なので、package を足したときに
// 列挙漏れが起きないよう実ディレクトリから組み立てる。隠し損ねると container の
// pnpm install が Linux 向けの依存をホストの bind mount へ直接書き込む。
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
  // json reporter を足すのは、実行件数をホスト側で検査するため (下の EXPECTED_TESTS)。
  [
    "pnpm",
    "exec",
    "playwright",
    "test",
    "route-vrt",
    "--reporter=list,json",
    ...playwrightArgs,
  ].join(" "),
].join("\n");

const dockerArgs = [
  "run",
  "--rm",
  "--init",
  "-v",
  `${repoRoot}:/work`,
  "-w",
  "/work",
  ...moduleVolumeArgs,
  "-v",
  `kufu-e2e-${volumeScope}-pnpm-store:/pnpm-store`,
  // spec 側の skip 判定。この変数がある実行だけが撮影環境の条件を満たす。
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

// container の外から実行された、image を取り違えた等で 1 件も撮らずに緑になる事故を防ぐ。
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
