// e2e-authoring-rule を oxlint の JS プラグインとして読ませる。規則のファイルは配布元から写したまま変えない（ADR-0029）
import { rule } from "./e2e-authoring-rule.mjs";

export default {
  meta: { name: "e2e" },
  rules: { "e2e-authoring-rule": rule },
};
