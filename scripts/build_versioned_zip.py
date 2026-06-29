import os
import sys
import zipfile
from pathlib import Path


def _copanel_root(workspace_parent: Path) -> Path:
    for name in ("CoPanel", "copanel"):
        cand = workspace_parent / name
        if cand.is_dir():
            return cand
    return workspace_parent / "CoPanel"


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


def create_versioned_zip(mod_name, version):
    script_dir = Path(__file__).resolve().parent
    appstore_root = script_dir.parent
    workspace_parent = appstore_root.parent
    copanel_root = _copanel_root(workspace_parent)
    appstore_packages_dir = appstore_root / "packages"
    appstore_packages_dir.mkdir(parents=True, exist_ok=True)

    backend_src, frontend_src = _resolve_sources(mod_name, appstore_root, copanel_root)

    if not backend_src.is_dir() and not frontend_src.is_dir():
        print(
            f"ERROR: module '{mod_name}' not found in packages_src/{mod_name}/ "
            f"or {copanel_root}/backend|frontend modules/",
            file=sys.stderr,
        )
        sys.exit(1)

    zip_path = appstore_packages_dir / f"{mod_name}.v{version}.zip"
    source_label = "packages_src" if (appstore_root / "packages_src" / mod_name).is_dir() else "CoPanel"

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

    print(f"Successfully zipped {mod_name} v{version} from {source_label} -> {zip_path}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python build_versioned_zip.py <module_id> <version>")
        print("Example: python build_versioned_zip.py storage_manager 1.4.20")
        sys.exit(1)
    create_versioned_zip(sys.argv[1], sys.argv[2])
