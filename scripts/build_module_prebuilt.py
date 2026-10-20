#!/usr/bin/env python3
"""Build frontend/dist prebuilt bundle for an AppStore module (Vite extension config)."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def _copanel_root(appstore_root: Path) -> Path:
    env = os.environ.get("COPANEL_DIR", "").strip()
    if env:
        cand = Path(env)
        if (cand / "frontend" / "package.json").is_file():
            return cand
    parent = appstore_root.parent
    for name in ("CoPanel", "copanel"):
        cand = parent / name
        if (cand / "frontend" / "package.json").is_file():
            return cand
    cached = appstore_root / ".copanel-build"
    if (cached / "frontend" / "package.json").is_file():
        return cached
    raise FileNotFoundError(
        "CoPanel checkout not found. Set COPANEL_DIR or run scripts/build-prebuilt.sh "
        "(clones to .copanel-build)."
    )


def _resolve_frontend_src(mod_name: str, appstore_root: Path, copanel_root: Path) -> Path:
    src_pkg = appstore_root / "packages_src" / mod_name / "frontend"
    if src_pkg.is_dir():
        return src_pkg
    core = copanel_root / "frontend" / "src" / "modules" / mod_name
    if core.is_dir():
        return core
    raise FileNotFoundError(f"frontend source for '{mod_name}' not found")


def _run(cmd: list[str], *, cwd: Path, env: dict | None = None) -> None:
    proc = subprocess.run(cmd, cwd=str(cwd), env=env, shell=False)
    if proc.returncode != 0:
        raise RuntimeError(f"Command failed ({proc.returncode}): {' '.join(cmd)}")


def build_module_prebuilt(mod_name: str, version: str) -> Path:
    script_dir = Path(__file__).resolve().parent
    appstore_root = script_dir.parent
    copanel_root = _copanel_root(appstore_root)
    frontend_root = copanel_root / "frontend"

    frontend_src = _resolve_frontend_src(mod_name, appstore_root, copanel_root)
    config_ts = frontend_src / "config.ts"
    if not config_ts.is_file():
        raise FileNotFoundError(f"Missing {config_ts}")

    out_dir = appstore_root / "packages_src" / mod_name / "frontend" / "dist"
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    module_dest = frontend_root / "src" / "modules" / mod_name
    if frontend_src.resolve() != module_dest.resolve():
        module_dest.parent.mkdir(parents=True, exist_ok=True)
        if module_dest.exists():
            shutil.rmtree(module_dest)
        shutil.copytree(frontend_src, module_dest)

    node_modules = frontend_root / "node_modules"
    if not node_modules.is_dir():
        print("Running npm install in CoPanel frontend...")
        _run(["npm", "install", "--legacy-peer-deps"], cwd=frontend_root)

    vite_bin = frontend_root / "node_modules" / "vite" / "bin" / "vite.js"
    if not vite_bin.is_file():
        raise FileNotFoundError(f"Vite not installed in {frontend_root}")

    env = {
        **os.environ,
        "MODULE_ID": mod_name,
        "EXTENSION_OUT_DIR": str(out_dir.resolve()),
    }
    print(f"Building prebuilt frontend for {mod_name} v{version} -> {out_dir}")
    _run(
        ["node", str(vite_bin), "build", "--config", "vite.extension.mjs"],
        cwd=frontend_root,
        env=env,
    )

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
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    module_js = out_dir / "module.js"
    if not module_js.is_file():
        index_js = out_dir / "index.js"
        if index_js.is_file():
            shutil.move(str(index_js), str(module_js))
        else:
            raise FileNotFoundError(f"Build did not emit module.js in {out_dir}")

    print(f"Prebuilt bundle ready: {out_dir}")
    return out_dir


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python build_module_prebuilt.py <module_id> <version>")
        sys.exit(1)
    try:
        build_module_prebuilt(sys.argv[1], sys.argv[2])
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
