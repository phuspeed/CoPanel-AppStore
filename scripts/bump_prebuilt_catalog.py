#!/usr/bin/env python3
"""Bump patch version for prebuilt modules in packages.json and backend/version.txt."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def bump_patch(ver: str) -> str:
    m = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)", ver.strip())
    if not m:
        raise ValueError(f"Not semver x.y.z: {ver}")
    return f"{m.group(1)}.{m.group(2)}.{int(m.group(3)) + 1}"


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: bump_prebuilt_catalog.py <module_id> [module_id ...]")
        return 1

    appstore = Path(__file__).resolve().parent.parent
    catalog_path = appstore / "packages.json"
    catalog: list[dict] = json.loads(catalog_path.read_text(encoding="utf-8"))
    module_ids = set(sys.argv[1:])

    for entry in catalog:
        mod_id = entry.get("id")
        if mod_id not in module_ids:
            continue
        old = str(entry.get("version") or "1.0.0")
        new = bump_patch(old)
        entry["version"] = new
        entry["frontend_install"] = "prebuilt"
        entry["download_url"] = (
            f"https://raw.githubusercontent.com/phuspeed/CoPanel-Appstore/main/packages/{mod_id}.v{new}.zip"
        )
        note_en = (
            f"v{new}: Ship prebuilt frontend/dist bundle (frontend_install=prebuilt) for no-AVX panels "
            "without Vite; frontend source remains in ZIP for rebuild on AVX hosts."
        )
        note_vi = (
            f"v{new}: Dong goi frontend/dist san (frontend_install=prebuilt) cho panel no-AVX khong chay Vite; "
            "van giu frontend source trong ZIP de rebuild tren may co AVX."
        )
        entry["changelog_en"] = f"{note_en} {entry.get('changelog_en', '')}".strip()
        entry["changelog_vi"] = f"{note_vi} {entry.get('changelog_vi', '')}".strip()

        vfile = appstore / "packages_src" / mod_id / "backend" / "version.txt"
        if vfile.is_file():
            vfile.write_text(new + "\n", encoding="utf-8")
        print(f"{mod_id}: {old} -> {new}")

    catalog_path.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
