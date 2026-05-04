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

We provide a specialized tool `build_versioned_zip.py` inside the `scripts/` folder to build versioned ZIP files for any module directly from the main CoPanel source directory.

### Usage:

To bundle a versioned package into the `packages/` directory, use the following syntax:

```bash
python scripts/build_versioned_zip.py <module_id> <version>
```

### Example:

To build version `1.0.1` for the `ssl_manager` module:

```bash
python scripts/build_versioned_zip.py ssl_manager 1.0.1
```
This will automatically generate a new ZIP file named `ssl_manager.v1.0.1.zip` in the `packages/` folder.
