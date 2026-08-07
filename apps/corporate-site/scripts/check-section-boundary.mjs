// section 境界の検査 (context/architecture.md「App 内依存方向」の機械検査)。
// 検出する違反は 4 方向:
//   1. pages → section 内部 (ディレクトリ指定以外。明示 index import も違反)
//   2. section 間 import (index 経由も違反)
//   3. common → sections の逆依存
//   4. sections/<section>/index.ts の公開面違反 (Section component 以外の再輸出)
// 検査対象: 静的 import / 動的 import() / export ... from。相対パス指定のみを
// 解決する (path alias は存在しない前提。導入時は本スクリプトを拡張する)。
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_EXTENSIONS = new Set([
  ".astro",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
]);

// sections/<section>/index.ts が再輸出してよい唯一のファイル (公開面 — D9)
export const SECTION_PUBLIC_FILES = {
  hero: "Hero.astro",
  business: "BusinessSection.astro",
  company: "CompanySection.astro",
  consultation: "ConsultationSection.astro",
  "products-category": "ProductsCategorySection.astro",
  "products-detail": "ProductsDetailSection.astro",
  contact: "ContactSection.astro",
};

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const IMPORT_PATTERNS = [
  /\bfrom\s+["']([^"']+)["']/g, // 静的 import / export ... from (複数行 import も from 行で捕捉)
  /\bimport\(\s*["']([^"']+)["']\s*\)/g, // 動的 import
  /^import\s+["']([^"']+)["']/gm, // side-effect import
];

function importSpecifiers(source) {
  const specs = [];
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      specs.push(match[1]);
    }
  }
  return specs;
}

// 相対 specifier を srcDir からの相対パス (posix 区切り) へ解決する。
// パッケージ import (相対でないもの) は null を返し検査対象外とする。
function resolveRelative(fromFile, spec, srcDir) {
  if (!spec.startsWith(".")) return null;
  const abs = path.resolve(path.dirname(fromFile), spec);
  const rel = path.relative(srcDir, abs);
  if (rel.startsWith("..")) return null;
  return rel.split(path.sep).join("/");
}

function sectionOf(relPath) {
  const match = relPath.match(/^components\/sections\/([^/]+)(\/|$)/);
  return match
    ? { name: match[1], rest: relPath.slice(match[0].length) }
    : null;
}

/**
 * @param {string} srcDir
 * @param {Record<string, string>} sectionPublicFiles section 名 → 公開してよいファイル
 * @returns {string[]} 違反メッセージ
 */
export function checkSectionBoundaries(
  srcDir,
  sectionPublicFiles = SECTION_PUBLIC_FILES,
) {
  const violations = [];
  for (const file of walk(srcDir)) {
    const relFile = path.relative(srcDir, file).split(path.sep).join("/");
    const source = readFileSync(file, "utf8");
    const fromSection = sectionOf(relFile);
    const isPage = relFile.startsWith("pages/");
    const isCommon = relFile.startsWith("components/common/");
    const isSectionIndex =
      fromSection !== null && fromSection.rest === "index.ts";

    for (const spec of importSpecifiers(source)) {
      const target = resolveRelative(file, spec, srcDir);
      if (target === null) continue;
      const targetSection = sectionOf(target);

      if (isPage && targetSection) {
        // ディレクトリ指定 (rest が空) のみ許可。個別ファイル・明示 index は違反
        if (targetSection.rest !== "") {
          violations.push(
            `${relFile}: pages から section 内部への直接 import (${spec})。` +
              `sections/${targetSection.name} のディレクトリ指定に統一する`,
          );
        }
        continue;
      }

      if (
        fromSection &&
        targetSection &&
        fromSection.name !== targetSection.name
      ) {
        violations.push(
          `${relFile}: section 間 import (${spec} → sections/${targetSection.name})。` +
            "共有する部品は components/common か packages/ui へ昇格する",
        );
        continue;
      }

      if (isCommon && targetSection) {
        violations.push(
          `${relFile}: common から sections への逆依存 (${spec})。` +
            "依存方向は pages → sections → common → @kufu/ui の一方向",
        );
        continue;
      }

      if (isSectionIndex && fromSection) {
        const allowed = sectionPublicFiles[fromSection.name];
        if (allowed !== undefined && spec !== `./${allowed}`) {
          violations.push(
            `${relFile}: 公開面違反 (${spec})。` +
              `sections/${fromSection.name} の index.ts が再輸出してよいのは ./${allowed} のみ`,
          );
        }
      }
    }
  }
  return violations;
}

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const srcDir = fileURLToPath(new URL("../src", import.meta.url));
  const violations = checkSectionBoundaries(srcDir);
  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(`${violation}\n`);
    }
    process.stderr.write(
      "Section boundary violations found (see context/architecture.md).\n",
    );
    process.exit(1);
  }
}
