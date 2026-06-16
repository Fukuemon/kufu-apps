#!/usr/bin/env bash
# Normalize .cursor/cli.json so the cursor-agent CLI accepts it.
#
# Why: `rulesync generate` (>=8.x) always writes top-level `version` / `editor`
# keys and only emits `permissions.deny` when at least one deny entry exists.
# The current cursor-agent CLI rejects `version` / `editor` as unrecognized keys
# and requires `permissions.deny` to be an array. rulesync has no option to
# suppress those keys, so we normalize the generated file here.
#
# Run this AFTER `npx rulesync@latest generate`. Idempotent.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI_JSON="$ROOT/.cursor/cli.json"

[ -f "$CLI_JSON" ] || { echo "no $CLI_JSON; skip"; exit 0; }

python3 - "$CLI_JSON" <<'PY'
import json
import os
import sys
import tempfile

cli_json = sys.argv[1]
with open(cli_json, "r", encoding="utf-8") as f:
    data = json.load(f)

data.pop("version", None)
data.pop("editor", None)

permissions = data.get("permissions")
if not isinstance(permissions, dict):
    permissions = {}

allow = permissions.get("allow")
deny = permissions.get("deny")
permissions["allow"] = allow if isinstance(allow, list) else []
permissions["deny"] = deny if isinstance(deny, list) else []
data["permissions"] = permissions

fd, tmp_path = tempfile.mkstemp(prefix="cursor-cli-", suffix=".json", dir=os.path.dirname(cli_json))
os.close(fd)
with open(tmp_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

os.replace(tmp_path, cli_json)
PY

echo "normalized $CLI_JSON for cursor-agent"
