# Module sources — CoPanel vs CoPanel-AppStore

Two Git repos, **one module id**. Where you edit depends on whether the module ships with `curl install.sh` (core) or only via App Store (extension).

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CoPanel (github.com/phuspeed/CoPanel)                                  │
│  curl install.sh clones this → fresh VPS gets everything under:         │
│    backend/modules/<id>/          frontend/src/modules/<id>/            │
│  = CANONICAL for core / built-in modules                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    build_versioned_zip.py (ZIP for App Store)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  CoPanel-AppStore (github.com/phuspeed/CoPanel-AppStore)                │
│    packages.json     — catalog (version, download_url, is_core, …)      │
│    packages/*.zip    — distributable archives                           │
│    packages_src/<id>/ — source for AppStore-only modules ONLY           │
│  = PACKAGING + catalog; not cloned by install.sh                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## Golden rules

| Rule | Detail |
|------|--------|
| **Fresh install** | `install.sh` copies **CoPanel repo only**. New servers never pull `packages_src/`. |
| **Core modules** | Edit **`copanel/backend/modules/<id>`** + **`copanel/frontend/src/modules/<id>`**. Bump `version.txt` in backend. |
| **AppStore-only** | Edit **`copanel-appstore/packages_src/<id>/`** (`backend/` + `frontend/`). Not in core install. |
| **No duplicate trees** | Do **not** keep `packages_src/<id>/` for a **core** module — ZIP builder prefers `packages_src` and would shadow CoPanel. |
| **Both backend + frontend** | Every module needs matching `backend/` and `frontend/` in its canonical tree (except UI-only stubs during dev). |
| **Catalog `is_core`** | `packages.json` → `"is_core": true` = ZIP built from **CoPanel**; `false` = built from **`packages_src`**. |

## ZIP source resolution (`build_versioned_zip.py`)

1. If `packages_src/<module_id>/` has `backend/` or `frontend/` → use **packages_src** (AppStore-only path).
2. Else → use sibling **`copanel/backend/modules/<id>`** + **`copanel/frontend/src/modules/<id>`** (core path).

```bash
cd copanel-appstore/scripts
python build_versioned_zip.py <module_id> <version>
```

## Where to edit (quick)

### Core modules (`is_core: true` in `packages.json`)

Ship with install; also published as ZIP for upgrades on existing panels.

| Edit here | Paths |
|-----------|--------|
| **CoPanel only** | `copanel/backend/modules/<id>/`, `copanel/frontend/src/modules/<id>/` |
| **Do not** | `packages_src/<id>/` (would override CoPanel at zip time) |

Release: bump `version.txt` → `build_versioned_zip.py` → update `packages.json` → push **both** repos.

Bulk core ZIP rebuild: `python scripts/release_core_modules_zips.py`.

### AppStore-only modules (`is_core: false`)

Not in `install.sh`; users install from App Store Manager.

| Edit here | Paths |
|-----------|--------|
| **AppStore only** | `copanel-appstore/packages_src/<id>/backend/`, `.../frontend/` |
| **Do not** | Leave orphan copies in `copanel/` (e.g. stale `frontend/src/modules/module_redis` without backend) |

Local dev: symlink or copy `packages_src/<id>/` into CoPanel module dirs, or install ZIP on a test panel.

Release: bump `packages_src/<id>/backend/version.txt` → `build_versioned_zip.py` → `packages.json` → push **AppStore** repo (+ CoPanel if you changed shared core shell code).

## Sync checklist (before merge / release)

- [ ] Core module: changes in **CoPanel** `backend/` + `frontend/`; **no** `packages_src/<id>/` folder
- [ ] AppStore-only: changes in **`packages_src/<id>/`** only; `is_core: false` in catalog
- [ ] `version.txt` semver matches `packages.json` `version` for that id
- [ ] Frontend: `ModuleViewport`, `useAppShellContext`, `WindowModal` where needed ([DESKTOP_UI.md](https://github.com/phuspeed/CoPanel/blob/main/frontend/DESKTOP_UI.md))
- [ ] Run `python scripts/check_module_sources.py` — no errors

## Current inventory

### AppStore-only (`packages_src/` — edit here)

| id | notes |
|----|--------|
| `cloudflare_ddns` | DDNS + DNS + Tunnel |
| `download_manager` | aria2, yt-dlp, file hosting |
| `storage_manager` | disks, LVM, RAID, partitions |
| `webdav` | WebDAV + SMB |
| `audio_station` | music library, playlists |
| `clamav` | antivirus scanner |
| `web_browser` | Playwright remote browser |
| `module_redis` | Redis dashboard (`frontend_install: extension`) |
| `coagent` | AI SysAdmin assistant — OpenAI-compatible ReAct + HITL (`frontend_install: extension`) |
| `cloud_sync` | Google Drive folder sync |
| `rsync_manager` | VPS move/clone/sync wizard over SSH |

Stubs (not in catalog): `module_cron`, `module_ping_pro`.

### Core (CoPanel only — `is_core: true` in catalog)

Examples: `file_manager`, `web_manager` (includes PHP Manager tab), `site_wizard`, `database_manager`, `docker_manager`, `ssl_manager`, `terminal`, `backup_manager`, `system_monitor`, `firewall`, `dns_manager`, `cron_manager`, `package_manager`, `appstore_manager`, `system_cleaner`, `panel_settings` (core, not always in App Store catalog).

Also in CoPanel but may be core-only (no App Store entry): `auth`, `platform`, `users`, `panel_settings`.

## Desktop UI upgrade status (2026-07-10)

See full grades in [CoPanel DESKTOP_UI.md](https://github.com/phuspeed/CoPanel/blob/main/frontend/DESKTOP_UI.md#desktop-ui-status-2026-07-10).

| Module | Repo | Desktop grade | `windowMode` |
|--------|------|---------------|--------------|
| `panel_settings` | core | **A** Full window | ✓ |
| `file_manager` | core | **A** | ✓ |
| `appstore_manager` | core | **A** | ✓ |
| `firewall` | core | **B** Ready (no popup) | — |
| `web_manager` | core | **B** | — |
| `cron_manager` | core | **C** `dark:` only — Wave A | — |
| `dns_manager` | core | **C** | — |
| `database_manager` | core | **C** | — |
| `site_wizard` | core | **C** | — |
| `terminal`, `system_monitor`, … | core | **B** | — |
| `download_manager`, `audio_station`, … | AppStore | **A** Wave C | ✓ |
| `web_browser` | **AppStore-only** | **A** | ✓ (not in `install.sh`) |

**Grade A** = floating window + theme context. **B** = works on Desktop sidebar/full workspace. **C** = needs `useAppShellContext` migration (Wave A).

## Sync AppStore → CoPanel (windowMode workflow)

When Desktop UI is implemented in **`packages_src/<id>/`** first, copy into CoPanel for core bundles or local dev:

```bash
cd copanel-appstore/scripts
python sync_packages_src_to_copanel.py <module_id>
```

Copies `packages_src/<id>/backend` → `copanel/backend/modules/<id>` and `frontend` → `copanel/frontend/src/modules/<id>`.

- **AppStore-only** modules: usually **do not** copy into CoPanel (install via App Store).
- **Core** modules: edit **CoPanel directly**; use sync only when prototyping in `packages_src` first.

## Related docs

| File | Audience |
|------|----------|
| [packages_src/README.md](packages_src/README.md) | Short pointer for AppStore-only authors |
| [README.md](README.md) | ZIP format, catalog, publish flow |
| [CoPanel backend/README.md](https://github.com/phuspeed/CoPanel/blob/main/backend/README.md) | API modules |
| [CoPanel frontend/README.md](https://github.com/phuspeed/CoPanel/blob/main/frontend/README.md) | UI modules |
| [CoPanel frontend/DESKTOP_UI.md](https://github.com/phuspeed/CoPanel/blob/main/frontend/DESKTOP_UI.md) | Classic + Desktop dual UI |
