# AppStore-only module sources

Modules here are **not** shipped with `CoPanel/scripts/install.sh`. Users install them from **AppStore Manager**.

## Layout

```
packages_src/<module_id>/
  backend/     → /opt/copanel/backend/modules/<module_id>/
  frontend/    → /opt/copanel/frontend/src/modules/<module_id>/
```

## Build ZIP

From `CoPanel-AppStore/scripts/`:

```bash
python build_versioned_zip.py <module_id> <version>
```

Reads `packages_src/<module_id>/` first, then falls back to sibling `CoPanel/` if missing.

Update `packages.json` (`version`, `download_url`, changelogs) and commit the new file under `packages/`.

## AppStore-only modules (current)

| id | notes |
|----|--------|
| `cloudflare_ddns` | DDNS + Cloudflare DNS + Tunnel |
| `download_manager` | aria2, yt-dlp, Google Drive |
| `storage_manager` | disks, LVM, RAID, partitions |
| `webdav` | WebDAV + SMB sharing |

## Local dev (optional)

Symlink or copy into `CoPanel/backend/modules/<id>` and `CoPanel/frontend/src/modules/<id>` for `uvicorn` / `npm run dev`, or install the built ZIP via AppStore on a test panel.
