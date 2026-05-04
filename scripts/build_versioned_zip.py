import os
import sys
import zipfile
from pathlib import Path

def create_versioned_zip(mod_name, version):
    # Dynamically derive sibling directory CoPanel and the current packages folder
    script_dir = Path(__file__).resolve().parent
    base_dir = script_dir.parent.parent / "CoPanel"
    appstore_packages_dir = script_dir.parent / "packages"
    appstore_packages_dir.mkdir(parents=True, exist_ok=True)
    
    backend_src = base_dir / "backend" / "modules" / mod_name
    frontend_src = base_dir / "frontend" / "src" / "modules" / mod_name
    
    zip_path = appstore_packages_dir / f"{mod_name}.v{version}.zip"
    
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
                    
    print(f"Successfully zipped {mod_name} version {version} to {zip_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python build_versioned_zip.py <module_id> <version>")
        print("Example: python build_versioned_zip.py appstore_manager 1.0.1")
        sys.exit(1)
    create_versioned_zip(sys.argv[1], sys.argv[2])
