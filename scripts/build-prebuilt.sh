#!/usr/bin/env bash
# Build frontend/dist prebuilt bundles for AppStore modules and repackage ZIPs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COPANEL_DIR="${COPANEL_DIR:-}"
COPANEL_REF="${COPANEL_REF:-main}"
COPANEL_REPO="${COPANEL_REPO:-https://github.com/phuspeed/CoPanel.git}"
SKIP_ZIP="${SKIP_ZIP:-0}"
BUMP_PATCH="${BUMP_PATCH:-0}"

if [[ -z "$COPANEL_DIR" ]]; then
  COPANEL_DIR="$ROOT/.copanel-build"
fi

ensure_copanel() {
  if [[ -f "$COPANEL_DIR/frontend/package.json" ]]; then
    return 0
  fi
  echo "Cloning CoPanel ($COPANEL_REF) into $COPANEL_DIR ..."
  mkdir -p "$(dirname "$COPANEL_DIR")"
  git clone --depth 1 --branch "$COPANEL_REF" "$COPANEL_REPO" "$COPANEL_DIR"
}

ensure_copanel
export COPANEL_DIR

echo "CoPanel root: $COPANEL_DIR"
if [[ ! -d "$COPANEL_DIR/frontend/node_modules" ]]; then
  echo "npm install in CoPanel frontend..."
  (cd "$COPANEL_DIR/frontend" && npm install --legacy-peer-deps)
fi

# Modules with packages_src frontend (exclude stub ids)
STUBS="module_cron module_ping_pro"
MODULES=()
for cfg in "$ROOT"/packages_src/*/frontend/config.ts; do
  [[ -f "$cfg" ]] || continue
  mod="$(basename "$(dirname "$(dirname "$cfg")")")"
  if [[ " $STUBS " == *" $mod "* ]]; then
    continue
  fi
  MODULES+=("$mod")
done

IFS=$'\n' MODULES=($(printf '%s\n' "${MODULES[@]}" | sort))
echo "Prebuilt modules: ${MODULES[*]}"

read_version() {
  local mod="$1"
  local vfile="$ROOT/packages_src/$mod/backend/version.txt"
  if [[ -f "$vfile" ]]; then
    tr -d ' \n\r' < "$vfile"
    return 0
  fi
  python3 - "$ROOT/packages.json" "$mod" <<'PY'
import json, sys
from pathlib import Path
data = json.loads(Path(sys.argv[1]).read_text())
for e in data:
    if e.get("id") == sys.argv[2]:
        print(e.get("version", "1.0.0"))
        raise SystemExit(0)
raise SystemExit(f"no catalog version for {sys.argv[2]}")
PY
}

if [[ "$BUMP_PATCH" == "1" ]]; then
  echo "Bumping patch versions in packages.json and backend/version.txt ..."
  python3 "$ROOT/scripts/bump_prebuilt_catalog.py" "${MODULES[@]}"
fi

for mod in "${MODULES[@]}"; do
  ver="$(read_version "$mod")"
  echo "=== $mod v$ver ==="
  python3 "$ROOT/scripts/build_module_prebuilt.py" "$mod" "$ver"
done

if [[ "$SKIP_ZIP" != "1" ]]; then
  for mod in "${MODULES[@]}"; do
    ver="$(read_version "$mod")"
    COPANEL_DIR="$COPANEL_DIR" python3 "$ROOT/scripts/build_versioned_zip.py" "$mod" "$ver"
  done
fi

echo "Prebuilt build complete."
