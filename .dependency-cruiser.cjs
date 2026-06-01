/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies make the monorepo harder to evolve.",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment:
        "Orphan modules are often dead code or missing public entrypoints.",
      from: {
        orphan: true,
        pathNot:
          "(^|/)(astro\\.config\\.mjs|index\\.(ts|tsx)|README\\.md|package\\.json|playwright\\.config\\.ts)$|^e2e/|\\.d\\.ts$|\\.astro$",
      },
      to: {},
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "Every external dependency should be declared in the nearest package.json.",
      from: {},
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "Application and package runtime code should not depend on devDependencies.",
      from: {
        path: "^(apps|packages)/",
        pathNot:
          "(^|/)(vitest\\.config\\.ts|.*\\.test\\.(ts|tsx)|.*\\.spec\\.(ts|tsx))$",
      },
      to: {
        dependencyTypes: ["npm-dev"],
      },
    },
    {
      name: "lp-site-no-cross-app-imports",
      severity: "error",
      comment:
        "Apps should depend on shared packages, not on other apps' internals.",
      from: {
        path: "^apps/lp-site/",
      },
      to: {
        path: "^apps/(?!lp-site/)",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: "(^|/)(node_modules|dist|coverage|\\.astro|\\.turbo|\\.pnpm-store)(/|$)",
    },
    includeOnly: "^((apps|packages)/|e2e/|playwright\\.config\\.ts$)",
    enhancedResolveOptions: {
      conditionNames: ["import", "require", "node", "default"],
      exportsFields: ["exports"],
    },
    tsConfig: {
      fileName: "tsconfig.json",
    },
  },
};
