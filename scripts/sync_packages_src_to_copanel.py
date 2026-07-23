#!/usr/bin/env python3
"""Copy packages_src/<id> backend+frontend into sibling copanel/ (windowMode sync path)."""
from __future__ import annotations

import argparse
import shutil
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
        "cloud_sync",
        "rsync_manager",
    }
)


def sync_module(mod_id: str, dry_run: bool = False) -> None:
    src = PACKAGES_SRC / mod_id
    if not src.is_dir():
        raise SystemExit(f"Missing packages_src/{mod_id}/")

    be_src = src / "backend"
    fe_src = src / "frontend"
    be_dst = COPANEL / "backend" / "modules" / mod_id
    fe_dst = COPANEL / "frontend" / "src" / "modules" / mod_id

    if mod_id in APPSTORE_ONLY:
        print(f"Note: {mod_id} is AppStore-only — copy is for local dev or if you intentionally bundle in CoPanel.")

    for label, s, d in (
        ("backend", be_src, be_dst),
        ("frontend", fe_src, fe_dst),
    ):
        if not s.is_dir():
            print(f"skip {label}: no {s}")
            continue
        if dry_run:
            print(f"would copy {s} -> {d}")
            continue
        if d.exists():
            shutil.rmtree(d)
        shutil.copytree(s, d)
        print(f"copied {label} -> {d}")

    if not dry_run:
        print(f"Done. Rebuild copanel frontend if UI changed: cd copanel/frontend && npm run build")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("module_id", help="e.g. download_manager")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    if not COPANEL.is_dir():
        raise SystemExit(f"copanel not found at {COPANEL}")

    sync_module(args.module_id.strip(), dry_run=args.dry_run)


if __name__ == "__main__":
    main()
