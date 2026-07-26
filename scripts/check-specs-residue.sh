#!/usr/bin/env bash
# Detect spec directories left behind after their issue was closed.
#
# Why: SDD の closeout 契約 (spec は issue close 時に削除) が守られたかを機械検査する。
# 判断根拠は adr/0011-specs-closeout-enforcement.md。CI 常設化は issue #12 へ委譲。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SPECS_DIR="$ROOT/specs"
REPO="${SPECS_CHECK_REPO:-Fukuemon/kufu-apps}"

[ -d "$SPECS_DIR" ] || { echo "no $SPECS_DIR; skip"; exit 0; }

command -v gh >/dev/null || { echo "gh CLI が必要です" >&2; exit 2; }

residue=()
unresolved=()
for dir in "$SPECS_DIR"/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  issue="${name%%-*}"
  case "$issue" in
    ''|*[!0-9]*) echo "skip: $name (issue 番号を抽出できない)"; continue ;;
  esac

  if err="$(gh issue view "$issue" --repo "$REPO" --json state --jq .state 2>&1)"; then
    [ "$err" = CLOSED ] && residue+=("$name (issue #$issue: CLOSED)")
  else
    unresolved+=("$name (issue #$issue): $err")
  fi
done

# state を引けないまま合格させると closeout 未実施を見逃すため、検査不能として失敗させる
if [ ${#unresolved[@]} -gt 0 ]; then
  echo "issue の state を取得できませんでした (gh の認証 / ネットワーク / 権限を確認してください):" >&2
  printf '  - %s\n' "${unresolved[@]}" >&2
  exit 2
fi

if [ ${#residue[@]} -gt 0 ]; then
  echo "closed issue の spec が残存しています (closeout 未実施):"
  printf '  - %s\n' "${residue[@]}"
  echo "清算手順: specs/README.md の closeout 清算手順"
  exit 1
fi

echo "OK: closed issue の spec 残存なし"
