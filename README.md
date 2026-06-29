# CoPanel AppStore

This repository serves as the GitHub AppStore catalog and package distribution for CoPanel.

## Structure

- `packages.json` — catalog metadata served by the AppStore backend.
- `packages/` — distributable versioned ZIP archives for each module.
- `packages_src/` — source files used to build package archives.
- `scripts/` — automation tools and utility scripts.

## Package format

Each app package is a ZIP archive containing:

- `backend/` — Python module files to install under `backend/modules/{package_id}`
- `frontend/` — TypeScript React module files to install under `frontend/src/modules/{package_id}`

Example catalog item:

```json
{
  "id": "module_redis",
  "name": "Redis Cache Manager",
  "description": "Visual dashboard to view keys, monitor memory, and restart local Redis instance.",
  "version": "1.0.0",
  "icon": "Database",
  "download_url": "https://raw.githubusercontent.com/phuspeed/CoPanel-AppStore/main/packages/module_redis.v1.0.0.zip",
  "system_packages": ["redis"]
}
```

## Build packages with Versioning

`build_versioned_zip.py` reads **`packages_src/<module_id>/`** first (AppStore-only modules), then falls back to the sibling **CoPanel** tree for core modules.

```bash
cd scripts
python build_versioned_zip.py <module_id> <version>
```

Example — `storage_manager` from `packages_src/`:

```bash
python build_versioned_zip.py storage_manager 1.4.20
```

Produces `packages/storage_manager.v1.4.20.zip`.

AppStore-only sources live under `packages_src/` (see `packages_src/README.md`). They are **not** bundled in `CoPanel/scripts/install.sh`.
