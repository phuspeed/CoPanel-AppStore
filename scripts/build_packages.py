import zipfile
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src_root = root / 'packages_src'
dst_root = root / 'packages'

dst_root.mkdir(exist_ok=True)

for package_dir in sorted(src_root.iterdir()):
    if not package_dir.is_dir():
        continue

    archive_path = dst_root / f"{package_dir.name}.zip"
    with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as archive:
        for path in package_dir.rglob('*'):
            if path.is_file():
                archive.write(path, path.relative_to(package_dir))
    print(f"Created {archive_path.name}")
