#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "${SCRIPT_DIR}/../lib/tool_use_input.sh"

FILE_PATH="$(resolve_tool_use_file_path || true)"

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

if ! echo "$FILE_PATH" | grep -qE 'specs/[^/]+/index\.md$'; then
  exit 0
fi

ERRORS=()

REQUIRED_SECTIONS=(
  "## メタ情報"
  "## 設計フェーズ状況"
  "## 上位ドキュメント確認"
  "## 関連資料"
  "## 背景"
  "## スコープ"
  "## 要件の解釈"
  "## 論点一覧"
  "## 実装対象"
  "## 機能仕様"
  "## Interface 設計"
  "## Content / Data 設計"
  "## Performance / Security 設計"
  "## Error / Fallback 設計"
  "## テスト / 評価方針"
  "## 実装分割"
  "## 既存資料からの変更点"
  "## 変更履歴"
)

for section in "${REQUIRED_SECTIONS[@]}"; do
  if ! grep -qF "$section" "$FILE_PATH" 2>/dev/null; then
    ERRORS+=("必須セクション欠落: $section")
  fi
done

PHASE_COUNT=$(grep -cE '^\|\s*[0-9]+\s*\|' "$FILE_PATH" 2>/dev/null || echo "0")
if [ "$PHASE_COUNT" -lt 11 ]; then
  ERRORS+=("設計フェーズ状況に 11 フェーズ必要ですが ${PHASE_COUNT} 件しかありません")
fi

if grep -qF "## スコープ" "$FILE_PATH" 2>/dev/null; then
  if ! grep -qF '### やること' "$FILE_PATH" 2>/dev/null; then
    ERRORS+=("スコープに「やること」がありません")
  fi
  if ! grep -qF '### やらないこと' "$FILE_PATH" 2>/dev/null; then
    ERRORS+=("スコープに「やらないこと」がありません")
  fi
fi

KUFU_MONOREPO_TOPICS=(
  "### Performance"
  "### Routing / URL State"
  "### Content / Assets"
  "### UI Reuse"
  "### React Compiler"
  "### Testing"
)

for topic in "${KUFU_MONOREPO_TOPICS[@]}"; do
  if ! grep -qF "$topic" "$FILE_PATH" 2>/dev/null; then
    ERRORS+=("Kufu Monorepo 固有論点の節がありません: $topic")
  fi
done

if [ ${#ERRORS[@]} -gt 0 ]; then
  echo "" >&2
  echo "============================================================" >&2
  echo "[BLOCKED] spec 文書品質ゲート不合格" >&2
  echo "ファイル: $FILE_PATH" >&2
  echo "============================================================" >&2
  for err in "${ERRORS[@]}"; do
    echo "- $err" >&2
  done
  echo "specs/TEMPLATE.md に沿って補完してください。" >&2
  echo "============================================================" >&2
  exit 2
fi

exit 0
