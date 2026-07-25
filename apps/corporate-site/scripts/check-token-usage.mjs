import { spawnSync } from "node:child_process";

const tokenPattern =
  "#[0-9a-fA-F]{3,8}|(?:text|bg|border|from|to|via|fill|stroke)-\\[#[0-9a-fA-F]{3,8}\\]";

const result = spawnSync(
  "rg",
  ["--pcre2", "--glob", "*.{astro,ts,tsx,css}", tokenPattern, "src"],
  {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  },
);

if (result.status === 0) {
  process.stderr.write(result.stdout);
  process.stderr.write(
    "Raw hex colors and Tailwind color arbitrary values must use semantic tokens instead.\n",
  );
  process.exit(1);
}

if (result.status === 1) {
  process.exit(0);
}

process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
