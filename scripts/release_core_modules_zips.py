#!/usr/bin/env python3
"""Rebuild all is_core AppStore ZIPs from copanel with patch bump."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

APPSTORE = Path(__file__).resolve().parent.parent
SCRIPTS = APPSTORE / "scripts"
COPANEL = APPSTORE.parent / "copanel"

CHANGELOG_EN = (
    "Dual UI: ModuleViewport + useAppShellContext — one ZIP for Classic sidebar and Desktop shell."
)
CHANGELOG_VI = (
    "Giao dien song song: ModuleViewport + useAppShellContext — mot ZIP cho Classic va Desktop."
)
SKIP_IDS = frozenset({"appstore_manager"})


def bump_patch(version: str) -> str:
    parts = version.split(".")
    parts[-1] = str(int(parts[-1]) + 1)
    return ".".join(parts)


def main() -> None:
    pkg_path = APPSTORE / "packages.json"
    data = json.loads(pkg_path.read_text(encoding="utf-8"))
    built = 0

    for entry in data:
        if not entry.get("is_core"):
            continue
        mod_id = entry["id"]
        if mod_id in SKIP_IDS:
            print(f"skip {mod_id} (already dual-UI release v{entry['version']})")
            continue

        backend = COPANEL / "backend" / "modules" / mod_id
        frontend = COPANEL / "frontend" / "src" / "modules" / mod_id
        if not backend.is_dir() and not frontend.is_dir():
            print(f"skip {mod_id}: not in copanel tree")
            continue

        version = bump_patch(entry["version"])
        entry["version"] = version
        entry["download_url"] = (
            f"https://raw.githubusercontent.com/phuspeed/CoPanel-Appstore/main/packages/{mod_id}.v{version}.zip"
        )

        prev_en = entry.get("changelog_en", "")
        if not prev_en.startswith("Dual UI:"):
            entry["changelog_en"] = f"{CHANGELOG_EN} " + prev_en
        prev_vi = entry.get("changelog_vi", "")
        if not prev_vi.startswith("Giao dien song song:"):
            entry["changelog_vi"] = f"{CHANGELOG_VI} " + prev_vi

        core_v = backend / "version.txt"
        if core_v.is_file():
            core_v.write_text(version + "\n", encoding="utf-8")

        print(f"build {mod_id} v{version}")
        subprocess.run(
            [sys.executable, str(SCRIPTS / "build_versioned_zip.py"), mod_id, version],
            check=True,
        )
        built += 1

    pkg_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"updated packages.json ({built} core ZIPs built)")


if __name__ == "__main__":
    main()
