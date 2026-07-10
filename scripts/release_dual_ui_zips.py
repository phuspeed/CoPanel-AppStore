#!/usr/bin/env python3
"""Bump patch versions and rebuild AppStore ZIPs for dual-UI release."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

APPSTORE = Path(__file__).resolve().parent.parent
SCRIPTS = APPSTORE / "scripts"
COPANEL = APPSTORE.parent / "copanel"

RELEASES = {
    "download_manager": "0.2.13",
    "audio_station": "0.3.4",
    "storage_manager": "1.4.22",
    "clamav": "1.0.5",
    "cloudflare_ddns": "1.0.7",
    "webdav": "1.0.10",
    "web_browser": "1.0.7",
    "module_redis": "1.0.1",
}

CHANGELOG_EN = (
    "Wave C Desktop UI: windowMode, WindowModal overlays, viewport height fixes — Classic + Desktop from one ZIP."
)
CHANGELOG_VI = (
    "Wave C Desktop UI: windowMode, WindowModal, sua chieu cao viewport — mot ZIP cho Classic va Desktop."
)


def write_version(mod_id: str, version: str) -> None:
    for base in (
        APPSTORE / "packages_src" / mod_id / "backend" / "version.txt",
        COPANEL / "backend" / "modules" / mod_id / "version.txt",
    ):
        if base.parent.parent.name == mod_id or base.parent.parent.parent.name == mod_id:
            if base.is_file() or (APPSTORE / "packages_src" / mod_id).is_dir():
                if (APPSTORE / "packages_src" / mod_id / "backend").is_dir():
                    if "packages_src" in str(base):
                        base.parent.mkdir(parents=True, exist_ok=True)
                        base.write_text(version + "\n", encoding="utf-8")
                elif (COPANEL / "backend" / "modules" / mod_id).is_dir():
                    if "copanel" in str(base):
                        base.write_text(version + "\n", encoding="utf-8")


def main() -> None:
    pkg_path = APPSTORE / "packages.json"
    data = json.loads(pkg_path.read_text(encoding="utf-8"))
    by_id = {e["id"]: e for e in data}

    for mod_id, version in RELEASES.items():
        if mod_id not in by_id:
            print(f"skip catalog {mod_id}")
            continue
        entry = by_id[mod_id]
        entry["version"] = version
        entry["download_url"] = (
            f"https://raw.githubusercontent.com/phuspeed/CoPanel-Appstore/main/packages/{mod_id}.v{version}.zip"
        )
        prev_en = entry.get("changelog_en", "")
        entry["changelog_en"] = f"{CHANGELOG_EN} " + (prev_en if prev_en else "")
        prev_vi = entry.get("changelog_vi", "")
        entry["changelog_vi"] = f"{CHANGELOG_VI} " + (prev_vi if prev_vi else "")

        src_v = APPSTORE / "packages_src" / mod_id / "backend" / "version.txt"
        if src_v.parent.is_dir():
            src_v.write_text(version + "\n", encoding="utf-8")
        core_v = COPANEL / "backend" / "modules" / mod_id / "version.txt"
        if core_v.is_file():
            core_v.write_text(version + "\n", encoding="utf-8")

        print(f"build {mod_id} v{version}")
        subprocess.run(
            [sys.executable, str(SCRIPTS / "build_versioned_zip.py"), mod_id, version],
            check=True,
        )

    pkg_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("updated packages.json")


if __name__ == "__main__":
    main()
