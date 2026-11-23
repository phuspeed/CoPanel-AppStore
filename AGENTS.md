# AGENTS.md

Durable notes for agents working in **CoPanel-AppStore** (catalog + ZIPs).
For panel runtime / Cloud env, see the sibling **CoPanel** repo `AGENTS.md`.

## Skills

| Skill | Use when |
|-------|----------|
| [`.cursor/skills/appstore-module-packaging/SKILL.md`](.cursor/skills/appstore-module-packaging/SKILL.md) | Packaging AppStore modules; choosing `frontend_install`; **installed app has no launcher icon** |

Read that skill **before** setting `frontend_install: extension` or debugging a missing icon after a successful install.

## Source of truth

| Topic | Doc |
|-------|-----|
| Core vs AppStore-only edit paths | [MODULE_SOURCES.md](MODULE_SOURCES.md) |
| ZIP layout / release | [README.md](README.md) |
| AppStore-only folder | [packages_src/README.md](packages_src/README.md) |

## Non-obvious: missing icon after install

If install logs look successful but the app never appears in the launcher/dock:

1. Suspect `frontend_install: "extension"` on a panel **without** React import map / `react-vendor` chunks.
2. Default fix: republish with `"frontend_install": "rebuild"` (same fix used for CoAgent and Speedtest).
3. Details and diagnosis commands → the skill above.

Do **not** assume a bad Lucide `icon` string — that still shows a `Grid` fallback; a completely missing entry means the module never registered.

## Build / check

```bash
python scripts/check_module_sources.py
python scripts/build_versioned_zip.py <module_id> <semver>
python scripts/update_catalog_sha256.py      # required: CoPanel 1.1.15+ refuses ZIPs without a matching sha256
```

`packages.json` entries must have `sha256` of the ZIP and a `download_url` under
`https://raw.githubusercontent.com/phuspeed/CoPanel-Appstore/main/packages/`. CI
(`build-prebuilt.sh`) recomputes them; ZIPs are deterministic (fixed timestamps,
sorted entries), so rebuilding unchanged sources keeps the same hash.

New AppStore-only modules: add id to `scripts/check_module_sources.py` `APPSTORE_ONLY` and to `packages.json` with `is_core: false`. Prefer `frontend_install: rebuild`.
