# `packages_src/` — AppStore-only module sources

> **Not shipped by `curl install.sh`.** Fresh VPS installs get modules from the [CoPanel](https://github.com/phuspeed/CoPanel) repo (`backend/modules/`, `frontend/src/modules/`).  
> This folder is for **extension modules** developed and zipped in **CoPanel-AppStore**.

Full policy (core vs AppStore-only, sync rules): **[MODULE_SOURCES.md](../MODULE_SOURCES.md)**.

## Layout

```
packages_src/<module_id>/
  backend/     → panel: /opt/copanel/backend/modules/<module_id>/
    router.py      (required — exports `router`)
    logic.py
    version.txt
  frontend/    → panel: /opt/copanel/frontend/src/modules/<module_id>/
    config.ts
    index.tsx
```

## When to edit here vs CoPanel

| Module type | Edit | ZIP built from |
|-------------|------|----------------|
| **AppStore-only** (`is_core: false`) | **`packages_src/<id>/`** | `packages_src` |
| **Core / built-in** (`is_core: true`) | **`copanel/backend` + `copanel/frontend`** only | sibling `copanel/` |

**Never** add `packages_src/<id>/` for a core module — `build_versioned_zip.py` prefers this folder and would **shadow** CoPanel source.

## Build ZIP

```bash
cd ../scripts
python build_versioned_zip.py <module_id> <version>
# → ../packages/<module_id>.v<version>.zip
```

Update `packages.json` (`version`, `download_url`, changelogs). Commit ZIP + `packages.json` to AppStore `main`.

## Modules in this folder

| id | notes |
|----|--------|
| `cloudflare_ddns` | DDNS + Cloudflare DNS + Tunnel |
| `download_manager` | aria2, yt-dlp, Google Drive |
| `storage_manager` | disks, LVM, RAID, partitions |
| `webdav` | WebDAV + SMB sharing |
| `audio_station` | music library, playlists, streaming |
| `clamav` | ClamAV scanner |
| `web_browser` | Playwright browser (superadmin) |
| `module_redis` | Redis cache dashboard (extension fast-path) |

Stubs: `module_cron`, `module_ping_pro` (not in catalog).

## Local dev

Symlink or copy into CoPanel for `uvicorn` / `npm run dev`:

```bash
# example (Linux)
ln -s "$(pwd)/packages_src/download_manager/backend" ../../copanel/backend/modules/download_manager
ln -s "$(pwd)/packages_src/download_manager/frontend" ../../copanel/frontend/src/modules/download_manager
```

Or install the built ZIP via App Store on a test panel.

## Pre-commit check

```bash
python ../scripts/check_module_sources.py
```
