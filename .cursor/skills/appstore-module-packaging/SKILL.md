---
name: appstore-module-packaging
description: >-
  Package and debug CoPanel AppStore modules (packages_src, ZIP, frontend_install).
  Use when building/releasing AppStore ZIPs, choosing rebuild vs extension install,
  or when an installed AppStore app does not show an icon in the launcher / dock /
  App Store UI after a successful install.
---

# CoPanel AppStore — module packaging

## When to use

- Creating or releasing an AppStore-only module under `packages_src/<id>/`
- Choosing `frontend_install` in `packages.json`
- User reports: **install succeeded but app icon / launcher entry is missing**

Canonical layout policy: [MODULE_SOURCES.md](../../../MODULE_SOURCES.md).

## Symptom: installed app, no icon

**Recognize this:**

| Observation | Meaning |
|-------------|---------|
| App Store install finishes (logs OK / “success”) | ZIP extracted; backend may be live |
| No icon in desktop launcher, dock, Start menu, or classic sidebar | Frontend never registered with `moduleRegistry` |
| `/api/<module_id>/…` may still work | Backend was installed; UI path failed |
| Install logs mention extension + optional import-map warning | Almost certainly `frontend_install: extension` on a panel without React import map |

**Do not treat as:** wrong Lucide icon name alone (missing icon name falls back to `Grid` — the *module still appears*). “No icon at all” means the **module entry is missing**, not a bad glyph.

### Root cause (extension mode)

`frontend_install: "extension"`:

1. Copies `extension/module.js` + `manifest.json` → `frontend/dist/extensions/<id>/`
2. Registers in `config/frontend_extensions.json` + `dist/extensions/index.json`
3. **Skips** copying into `frontend/src/modules/` and **skips** `npm run build:appstore`
4. Launcher loads extensions only if the live panel `dist/` has a React **import map** + `react-vendor*.js` chunks (`appstore_manager.logic._extension_runtime_ready`)

If the panel was never rebuilt with the import-map Vite plugin, `import(/* @vite-ignore */ '/extensions/<id>/module.js')` fails silently in the browser → **no launcher entry**.

Proven cases:

- **CoAgent** → switched to `rebuild` in v1.0.2 for the same reason
- **Speedtest** v1.0.0 (`extension`) → no icon after install → fixed in v1.0.1 with `rebuild`

### Fix

1. Set `"frontend_install": "rebuild"` in `packages.json` (default path for most modules).
2. Bump `packages_src/<id>/backend/version.txt` + catalog `version` / `download_url`.
3. Rebuild ZIP: `python scripts/build_versioned_zip.py <id> <version>` (rebuild mode does **not** require `extension/`).
4. User: update/reinstall from App Store, wait for Vite build, hard-refresh.

Optional check on the panel: install logs containing  
`Panel frontend is missing React import map / vendor chunks` → confirm extension path will not show UI.

## `frontend_install` cheat sheet

| Mode | ZIP contents | On install | Launcher registration | Prefer when |
|------|--------------|------------|----------------------|-------------|
| `rebuild` (default) | `backend/` + `frontend/` source | Copy → `src/modules/<id>/` + `npm run build:appstore` | Vite glob of `config.ts` — **reliable** | Almost all modules (speedtest, coagent, ftp_manager, …) |
| `extension` | + pre-built `extension/module.js` + `manifest.json` | Copy → `dist/extensions/<id>/` only (no npm build) | Runtime `/extensions/` load — **needs import map** | Only when panel is known to ship import map (`appstore_manager` ≥ ~1.0.32 **and** frontend rebuilt with vendor chunks) |
| `none` | Usually backend-only | No frontend step | N/A | Backend-only packages |

**Default for new AppStore modules: `rebuild`.**  
Do not choose `extension` only to “avoid npm build” unless you have verified the target panel’s import map — otherwise users get a silent missing-icon failure.

## Release checklist (AppStore-only)

1. Edit `packages_src/<id>/` only (`is_core: false`).
2. Dual UI: `ModuleViewport` + `useAppShellContext` (+ `windowMode` if needed).
3. Bump `backend/version.txt` to match `packages.json` `version`.
4. Prefer `"frontend_install": "rebuild"` unless extension is explicitly required and validated.
5. `python scripts/check_module_sources.py`
6. `python scripts/build_versioned_zip.py <id> <semver>`
7. Commit `packages/<id>.v<semver>.zip` + `packages.json` (+ docs).

## Quick diagnosis commands (on panel)

```bash
# Backend present?
ls /opt/copanel/backend/modules/<id>/

# Rebuild path (expected for rebuild installs)
ls /opt/copanel/frontend/src/modules/<id>/config.ts

# Extension path (extension installs)
ls /opt/copanel/frontend/dist/extensions/<id>/
cat /opt/copanel/config/frontend_extensions.json
grep -n importmap /opt/copanel/frontend/dist/index.html || true
ls /opt/copanel/frontend/dist/assets/react-vendor*.js 2>/dev/null || echo "no react-vendor → extension UI will not load"
```

If backend exists, extension dir exists, but no `react-vendor` / import map → switch module to `rebuild` and republish.
