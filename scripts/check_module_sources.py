#!/usr/bin/env python3
"""Verify module source layout: core in copanel, AppStore-only in packages_src."""
from __future__ import annotations

import json
import sys
from pathlib import Path

APPSTORE = Path(__file__).resolve().parent.parent
COPANEL = APPSTORE.parent / "copanel"
PACKAGES_SRC = APPSTORE / "packages_src"

APPSTORE_ONLY = frozenset(
    {
        "cloudflare_ddns",
        "download_manager",
        "storage_manager",
        "webdav",
        "audio_station",
        "clamav",
        "web_browser",
        "module_redis",
        "coagent",
        "cloud_sync",
        "rsync_manager",
    }
)
STUB_IDS = frozenset({"module_cron", "module_ping_pro"})


def _has_module_tree(base: Path) -> bool:
    return (base / "backend").is_dir() or (base / "frontend").is_dir()


def _copanel_backend(mod_id: str) -> Path:
    return COPANEL / "backend" / "modules" / mod_id


def _copanel_frontend(mod_id: str) -> Path:
    return COPANEL / "frontend" / "src" / "modules" / mod_id


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    if not COPANEL.is_dir():
        warnings.append(f"copanel sibling not found at {COPANEL} — skipping CoPanel checks")

    catalog_path = APPSTORE / "packages.json"
    catalog: list[dict] = json.loads(catalog_path.read_text(encoding="utf-8"))
    catalog_ids = {e["id"] for e in catalog if e.get("id")}

    # packages_src folders
    if PACKAGES_SRC.is_dir():
        for child in sorted(PACKAGES_SRC.iterdir()):
            if not child.is_dir() or child.name.startswith("."):
                continue
            mod_id = child.name
            if mod_id in STUB_IDS:
                continue
            if not _has_module_tree(child):
                continue

            entry = next((e for e in catalog if e.get("id") == mod_id), None)
            is_core = bool(entry and entry.get("is_core"))

            if is_core:
                errors.append(
                    f"{mod_id}: packages_src/ exists but catalog is_core=true — "
                    "remove packages_src copy; edit copanel only"
                )
            elif mod_id not in APPSTORE_ONLY and mod_id in catalog_ids:
                warnings.append(f"{mod_id}: in packages_src but not in APPSTORE_ONLY list — update script")

            if COPANEL.is_dir():
                if _copanel_backend(mod_id).is_dir() or _copanel_frontend(mod_id).is_dir():
                    if mod_id in APPSTORE_ONLY:
                        warnings.append(
                            f"{mod_id}: AppStore-only but also present under copanel/ — "
                            "remove orphan copanel copy (dev symlink OK locally, do not commit)"
                        )

    # Core catalog entries must exist in copanel
    if COPANEL.is_dir():
        for entry in catalog:
            if not entry.get("is_core"):
                continue
            mod_id = entry["id"]
            if mod_id in STUB_IDS:
                continue
            be = _copanel_backend(mod_id)
            fe = _copanel_frontend(mod_id)
            if not be.is_dir() and not fe.is_dir():
                errors.append(f"{mod_id}: is_core in catalog but missing in copanel backend+frontend")
            src_pkg = PACKAGES_SRC / mod_id
            if _has_module_tree(src_pkg):
                errors.append(f"{mod_id}: is_core but packages_src/{mod_id}/ exists — delete shadow copy")

    # AppStore-only must have packages_src
    for mod_id in APPSTORE_ONLY:
        src = PACKAGES_SRC / mod_id
        if not _has_module_tree(src):
            errors.append(f"{mod_id}: AppStore-only but packages_src/{mod_id}/ missing")

    print("CoPanel-AppStore module source check\n")
    if warnings:
        print("Warnings:")
        for w in warnings:
            print(f"  WARN {w}")
        print()

    if errors:
        print("Errors:")
        for e in errors:
            print(f"  ERR {e}")
        print(f"\n{len(errors)} error(s). See MODULE_SOURCES.md")
        return 1

    print("OK — source layout matches MODULE_SOURCES.md policy")
    if warnings:
        print(f"({len(warnings)} warning(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
