#!/bin/bash

set -euo pipefail

STAGED_FILES=()

while IFS= read -r file; do
  case "$file" in
    *.js|*.cjs|*.mjs|*.jsx|*.ts|*.tsx|*.json|*.md|*.css|*.yml|*.yaml)
      STAGED_FILES+=("$file")
      ;;
  esac
done < <(git diff --cached --name-only --diff-filter=ACMR)

if [ "${#STAGED_FILES[@]}" -eq 0 ]; then
  exit 0
fi

pnpm exec oxfmt --write "${STAGED_FILES[@]}"
git add -- "${STAGED_FILES[@]}"
