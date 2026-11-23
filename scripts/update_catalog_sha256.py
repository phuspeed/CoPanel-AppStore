#!/usr/bin/env python3
"""Write the SHA-256 of every package ZIP into packages.json.

CoPanel 1.1.15+ refuses to install a package whose catalog entry has no
``sha256`` or whose download does not match it. Run after building ZIPs
(build-prebuilt.sh and CI do this automatically).

    python3 scripts/update_catalog_sha256.py [--check]
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "packages.json"
OFFICIAL_PREFIX = "https://raw.githubusercontent.com/phuspeed/copanel-appstore/main/packages/"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main(argv: list[str]) -> int:
    check = "--check" in argv
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    errors, changed = [], 0
    for entry in data:
        url = str(entry.get("download_url") or "")
        if not url.lower().startswith(OFFICIAL_PREFIX):
            errors.append(f"{entry.get('id')}: download_url is not in the official packages/ folder: {url}")
            continue
        zip_path = ROOT / "packages" / Path(urlparse(url).path).name
        if not zip_path.is_file():
            errors.append(f"{entry.get('id')}: {zip_path.relative_to(ROOT)} is missing")
            continue
        digest = sha256_file(zip_path)
        if entry.get("sha256") != digest:
            if check:
                errors.append(f"{entry.get('id')}: sha256 is stale ({entry.get('sha256')} != {digest})")
            entry["sha256"] = digest
            changed += 1
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    if not check:
        CATALOG.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"packages.json: {changed} sha256 value(s) updated, {len(data)} packages.")
    else:
        print(f"packages.json: all {len(data)} sha256 values match.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
