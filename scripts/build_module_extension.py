#!/usr/bin/env python3
"""Build pre-compiled frontend extension artifact for AppStore ZIP."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

CORE_UI_VERSION = "1.1"


def _copanel_root(workspace_parent: Path) -> Path:
    for name in ("copanel", "CoPanel"):
        cand = workspace_parent / name
        if cand.is_dir():
            return cand
    return workspace_parent / "copanel"


def _resolve_frontend_src(mod_name: str, appstore_root: Path, copanel_root: Path) -> Path:
    src_pkg = appstore_root / "packages_src" / mod_name / "frontend"
    if src_pkg.is_dir():
        return src_pkg
    core = copanel_root / "frontend" / "src" / "modules" / mod_name
    if core.is_dir():
        return core
    raise FileNotFoundError(
        f"frontend source for '{mod_name}' not found in packages_src or copanel modules/"
    )


def _read_catalog_frontend_install(appstore_root: Path, mod_name: str) -> str:
    catalog_path = appstore_root / "packages.json"
    if not catalog_path.is_file():
        return "rebuild"
    try:
        data = json.loads(catalog_path.read_text(encoding="utf-8"))
        packages = data if isinstance(data, list) else (data.get("packages") or [])
        if isinstance(packages, list):
            for entry in packages:
                if isinstance(entry, dict) and entry.get("id") == mod_name:
                    return str(entry.get("frontend_install") or "rebuild").strip().lower()
    except Exception:
        pass
    return "rebuild"


def _run(cmd: list[str], *, cwd: Path | None = None, env: dict | None = None) -> None:
    proc = subprocess.run(
        cmd,
        cwd=str(cwd.resolve()) if cwd else None,
        env=env,
        shell=False,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Command failed ({proc.returncode}): {' '.join(cmd)}")


def _esbuild_bin(frontend_root: Path) -> Path:
    for rel in ("esbuild/bin/esbuild", "esbuild/bin/esbuild.exe"):
        cand = frontend_root / "node_modules" / rel
        if cand.is_file():
            return cand
    raise FileNotFoundError("esbuild not found — run npm install in copanel/frontend")


def _esbuild_build_extension(frontend_root: Path, mod_name: str, out_dir: Path) -> None:
    entry = frontend_root / "src" / "modules" / mod_name / "index.tsx"
    outfile = out_dir / "module.js"
    esbuild = _esbuild_bin(frontend_root)
    cmd = [
        str(esbuild.resolve()),
        str(entry.resolve()),
        "--bundle",
        "--format=esm",
        f"--outfile={outfile.resolve()}",
        "--jsx=automatic",
        "--target=es2020",
        "--log-level=warning",
        "--external:react",
        "--external:react/jsx-runtime",
        "--external:react-dom",
        "--external:react-dom/client",
        "--external:react-router-dom",
        "--external:lucide-react",
    ]
    _run(cmd, cwd=frontend_root)


def build_module_extension(mod_name: str, version: str, out_dir: Path | None = None) -> Path:
    script_dir = Path(__file__).resolve().parent
    appstore_root = script_dir.parent
    copanel_root = _copanel_root(appstore_root.parent)
    frontend_root = copanel_root / "frontend"

    if not (frontend_root / "package.json").is_file():
        raise FileNotFoundError(f"CoPanel frontend not found: {frontend_root}")

    frontend_src = _resolve_frontend_src(mod_name, appstore_root, copanel_root)
    config_ts = frontend_src / "config.ts"
    if not config_ts.is_file():
        raise FileNotFoundError(f"Missing config.ts: {config_ts}")

    module_dest = frontend_root / "src" / "modules" / mod_name
    if frontend_src.resolve() != module_dest.resolve():
        module_dest.parent.mkdir(parents=True, exist_ok=True)
        if module_dest.exists():
            shutil.rmtree(module_dest)
        shutil.copytree(frontend_src, module_dest)

    if out_dir is None:
        out_dir = Path(tempfile.mkdtemp(prefix=f"ext-{mod_name}-"))
    else:
        out_dir = Path(out_dir)
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(parents=True, exist_ok=True)

    node_modules = frontend_root / "node_modules"
    if not node_modules.is_dir():
        print("Running npm install in copanel/frontend...")
        _run(["npm", "install", "--legacy-peer-deps"], cwd=frontend_root)

    print(f"Building extension for {mod_name} v{version} (esbuild)...")
    _esbuild_build_extension(frontend_root, mod_name, out_dir)

    manifest_script = script_dir / "extract_module_manifest.mjs"
    proc = subprocess.run(
        ["node", str(manifest_script.resolve()), str(config_ts.resolve()), mod_name, version],
        capture_output=True,
        text=True,
        cwd=str(script_dir.resolve()),
        shell=False,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr or proc.stdout or "manifest extraction failed")

    manifest = json.loads(proc.stdout)
    manifest["core_ui"] = CORE_UI_VERSION
    manifest["version"] = version
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    module_js = out_dir / "module.js"
    if not module_js.is_file():
        raise FileNotFoundError(f"Extension build did not produce module.js in {out_dir}")

    print(f"Extension built -> {out_dir}")
    return out_dir


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python build_module_extension.py <module_id> <version> [output_dir]")
        sys.exit(1)
    mod_name = sys.argv[1]
    version = sys.argv[2]
    out = Path(sys.argv[3]) if len(sys.argv) > 3 else None
    try:
        build_module_extension(mod_name, version, out)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
