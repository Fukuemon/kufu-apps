// section 境界の機械検査 (規約: context/codebase.md「Dependency Rules」)。
// 相対パス指定のみを解決する (path alias 導入時は要拡張)。
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

// 各 section の index.ts が再輸出してよい唯一のファイル
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
  /\bfrom\s+["']([^"']+)["']/g, // 静的 import / export ... from
  /\bimport\(\s*["']([^"']+)["']\s*\)/g, // 動的 import
  /^import\s+["']([^"']+)["']/gm, // side-effect import
];

function importSpecifiers(source) {
  const code = source.replace(/^\s*(\/\/|\*).*$/gm, ""); // 行コメントへの誤一致を防ぐ
  const specs = [];
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of code.matchAll(pattern)) {
      specs.push(match[1]);
    }
  }
  return specs;
}

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

      if ((fromSection || isCommon) && target.startsWith("pages/")) {
        violations.push(
          `${relFile}: pages への逆流 import (${spec})。` +
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

  // 対応表と実ディレクトリの同期漏れは公開面検査の素通りになるため違反にする
  const sectionsDir = path.join(srcDir, "components", "sections");
  let actualSections = [];
  try {
    actualSections = readdirSync(sectionsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    // sections が無い構成 (fixture 等) では突合しない
  }
  for (const name of actualSections) {
    if (!(name in sectionPublicFiles)) {
      violations.push(
        `components/sections/${name}: SECTION_PUBLIC_FILES に未登録。` +
          "公開面検査が素通りになるため、対応表へ公開ファイルを追加する",
      );
    }
  }
  for (const name of Object.keys(sectionPublicFiles)) {
    if (actualSections.length > 0 && !actualSections.includes(name)) {
      violations.push(
        `SECTION_PUBLIC_FILES の "${name}" に対応する section ディレクトリが無い (対応表の残骸)`,
      );
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
      "Section boundary violations found (see context/codebase.md).\n",
    );
    process.exit(1);
  }
}
