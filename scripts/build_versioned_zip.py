import os
import sys
import zipfile
import shutil
import subprocess
import tempfile
from pathlib import Path


def _copanel_root(workspace_parent: Path) -> Path:
    for name in ("CoPanel", "copanel"):
        cand = workspace_parent / name
        if cand.is_dir():
            return cand
    return workspace_parent / "CoPanel"


def _read_catalog_entry(appstore_root: Path, mod_name: str) -> dict:
    catalog_path = appstore_root / "packages.json"
    if not catalog_path.is_file():
        return {}
    try:
        import json

        data = json.loads(catalog_path.read_text(encoding="utf-8"))
        packages = data if isinstance(data, list) else (data.get("packages") or [])
        if isinstance(packages, list):
            for entry in packages:
                if isinstance(entry, dict) and entry.get("id") == mod_name:
                    return entry
    except Exception:
        pass
    return {}


def _resolve_sources(mod_name: str, appstore_root: Path, copanel_root: Path) -> tuple[Path, Path]:
    """Prefer packages_src (AppStore-only modules); fall back to CoPanel tree."""
    src_pkg = appstore_root / "packages_src" / mod_name
    backend_src = src_pkg / "backend"
    frontend_src = src_pkg / "frontend"
    if backend_src.is_dir() or frontend_src.is_dir():
        return backend_src, frontend_src
    return (
        copanel_root / "backend" / "modules" / mod_name,
        copanel_root / "frontend" / "src" / "modules" / mod_name,
    )


def _build_extension_dir(mod_name: str, version: str, appstore_root: Path) -> Path:
    script = appstore_root / "scripts" / "build_module_extension.py"
    if not script.is_file():
        raise FileNotFoundError(f"Missing {script}")
    out_dir = Path(tempfile.mkdtemp(prefix=f"zip-ext-{mod_name}-"))
    proc = subprocess.run(
        [sys.executable, str(script.resolve()), mod_name, version, str(out_dir.resolve())],
        cwd=str(appstore_root.resolve()),
        shell=False,
    )
    if proc.returncode != 0:
        shutil.rmtree(out_dir, ignore_errors=True)
        raise RuntimeError(f"build_module_extension.py failed for {mod_name}")
    return out_dir


def create_versioned_zip(mod_name, version):
    script_dir = Path(__file__).resolve().parent
    appstore_root = script_dir.parent
    workspace_parent = appstore_root.parent
    copanel_root = _copanel_root(workspace_parent)
    appstore_packages_dir = appstore_root / "packages"
    appstore_packages_dir.mkdir(parents=True, exist_ok=True)

    catalog_entry = _read_catalog_entry(appstore_root, mod_name)
    frontend_install = str(catalog_entry.get("frontend_install") or "rebuild").strip().lower()

    backend_src, frontend_src = _resolve_sources(mod_name, appstore_root, copanel_root)

    if not backend_src.is_dir() and not frontend_src.is_dir():
        print(
            f"ERROR: module '{mod_name}' not found in packages_src/{mod_name}/ "
            f"or {copanel_root}/backend|frontend modules/",
            file=sys.stderr,
        )
        sys.exit(1)

    extension_dir = None
    if frontend_install == "extension":
        if not frontend_src.is_dir():
            print(f"ERROR: frontend_install=extension but no frontend source for {mod_name}", file=sys.stderr)
            sys.exit(1)
        print(f"Building extension artifact (frontend_install=extension)...")
        extension_dir = _build_extension_dir(mod_name, version, appstore_root)
    elif frontend_install == "none":
        print("frontend_install=none — skipping extension build")
    else:
        print("frontend_install=rebuild (default) — extension/ optional")

    zip_path = appstore_packages_dir / f"{mod_name}.v{version}.zip"
    source_label = "packages_src" if (appstore_root / "packages_src" / mod_name).is_dir() else "CoPanel"

    try:
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_ref:
            if backend_src.exists():
                for root, dirs, files in os.walk(backend_src):
                    if "__pycache__" in root:
                        continue
                    for f in files:
                        file_path = Path(root) / f
                        rel_path = file_path.relative_to(backend_src)
                        zip_ref.write(file_path, Path("backend") / rel_path)

            if frontend_src.exists():
                for root, dirs, files in os.walk(frontend_src):
                    if "node_modules" in root:
                        continue
                    for f in files:
                        file_path = Path(root) / f
                        rel_path = file_path.relative_to(frontend_src)
                        zip_ref.write(file_path, Path("frontend") / rel_path)

            if extension_dir and extension_dir.is_dir():
                for root, dirs, files in os.walk(extension_dir):
                    for f in files:
                        file_path = Path(root) / f
                        rel_path = file_path.relative_to(extension_dir)
                        zip_ref.write(file_path, Path("extension") / rel_path)

        print(f"Successfully zipped {mod_name} v{version} from {source_label} -> {zip_path}")
        if frontend_install == "extension":
            print("  includes extension/ (fast install path)")
    finally:
        if extension_dir and extension_dir.is_dir():
            shutil.rmtree(extension_dir, ignore_errors=True)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python build_versioned_zip.py <module_id> <version>")
        print("Example: python build_versioned_zip.py storage_manager 1.4.20")
        print("Reads packages.json frontend_install: rebuild | extension | none")
        sys.exit(1)
    create_versioned_zip(sys.argv[1], sys.argv[2])
