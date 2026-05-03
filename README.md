# CoPanel AppStore

This repository serves as the GitHub AppStore catalog and package distribution for CoPanel.

## Structure

- `packages.json` — catalog metadata served by the AppStore backend.
- `packages/` — distributable ZIP archives for each module.
- `packages_src/` — source files used to build package archives.

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
  "download_url": "https://raw.githubusercontent.com/phuspeed/CoPanel-AppStore/main/packages/module_redis.zip"
}
```

## Build packages

Run `python scripts/build_packages.py` to regenerate ZIP archives from `packages_src/`.
