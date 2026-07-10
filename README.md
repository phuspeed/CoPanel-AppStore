# CoPanel AppStore

GitHub catalog + versioned ZIP distribution for CoPanel modules.

**One ZIP = Classic + Desktop UI.** Modules ship with `useAppShellContext` + `ModuleViewport`; optional `windowMode` in `config.ts` only affects desktop shell. Classic ignores window fields.

| Doc | What |
|-----|------|
| This file | ZIP layout, build, publish |
| [CoPanel frontend/DESKTOP_UI.md](https://github.com/phuspeed/CoPanel/blob/main/frontend/DESKTOP_UI.md) | Dual-UI module author guide |
| [CoPanel README](https://github.com/phuspeed/CoPanel/blob/main/README.md) | Panel install (classic / desktop) |

## Structure

- `packages.json` — catalog metadata served by AppStore backend
- `packages/` — versioned ZIP archives (`<id>.v<semver>.zip`)
- `packages_src/` — AppStore-only module sources (not in core `install.sh`)
- `scripts/build_versioned_zip.py` — ZIP builder

## Package format

Each ZIP contains backend + frontend trees:

```
my_module.v1.0.0.zip
├── backend/
│   ├── router.py          # must export `router` (APIRouter)
│   ├── logic.py           # optional
│   └── version.txt        # semver string
└── frontend/
    ├── config.ts          # module registry entry
    └── index.tsx          # React component
```

Install target on panel:

| ZIP path | Panel path |
|----------|------------|
| `backend/*` | `backend/modules/<id>/` |
| `frontend/*` | `frontend/src/modules/<id>/` |

## Frontend — dual UI requirements

Every AppStore module **must** follow the unified pattern (Classic sidebar + Desktop windows).

### `config.ts`

```typescript
import MyModule from './index';

export default {
  name: 'My Module',
  icon: 'Box',
  path: '/my-module',
  component: MyModule,
  description: 'Short description',
  // Optional — desktop shell only (classic ignores)
  windowMode: true,
  defaultWindowSize: { width: 960, height: 640 },
  singleton: true,
  pinned: false,
};
```

### `index.tsx`

```typescript
import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import ModuleViewport from '../../core/shell/ModuleViewport';

export default function MyModule() {
  const { theme, language } = useAppShellContext();

  return (
    <ModuleViewport constrained className="p-4 md:p-8">
      {/* content — no min-h-screen / 100vh at root */}
    </ModuleViewport>
  );
}
```

### Rules

- Use `useAppShellContext()` — **not** `useOutletContext()`
- Wrap root in `<ModuleViewport>`
- Dialogs: `<WindowModal>` (desktop) — avoid fixed fullscreen overlays
- **No separate Desktop ZIP** — same archive for both UIs

Full checklist: [DESKTOP_UI.md § AppStore ZIP](https://github.com/phuspeed/CoPanel/blob/main/frontend/DESKTOP_UI.md#appstore-zip--dual-ui-checklist)

## Catalog entry (`packages.json`)

```json
{
  "id": "module_redis",
  "name": "Redis Cache Manager",
  "description": "Visual dashboard for local Redis.",
  "version": "1.0.0",
  "icon": "Database",
  "download_url": "https://raw.githubusercontent.com/phuspeed/CoPanel-AppStore/main/packages/module_redis.v1.0.0.zip",
  "system_packages": ["redis"]
}
```

- `id` = directory name in panel + ZIP stem
- `download_url` → `packages/<id>.v<version>.zip` on this repo `main`
- Bump `version` when publishing new ZIP

## Build packages

`build_versioned_zip.py` resolves sources in order:

1. `packages_src/<module_id>/` (AppStore-only)
2. Sibling `copanel/` tree: `backend/modules/<id>/` + `frontend/src/modules/<id>/`

```bash
cd scripts
python build_versioned_zip.py <module_id> <version>
```

Example:

```bash
python build_versioned_zip.py storage_manager 1.4.20
# → ../packages/storage_manager.v1.4.20.zip
```

AppStore-only sources: see `packages_src/README.md`. Not bundled in `CoPanel/scripts/install.sh`.

## Release workflow

1. Bump `copanel/backend/modules/<id>/version.txt` (core) or version in `packages_src/<id>/`
2. Ensure frontend uses dual-UI pattern (`ModuleViewport`, `useAppShellContext`)
3. Run `build_versioned_zip.py <id> <semver>`
4. Update `packages.json`: `version`, `download_url`, changelog if any
5. **Push two repos:**
   - `copanel` — source + `version.txt`
   - `copanel-appstore` — `packages.json` + new ZIP under `packages/`

Panel install flow: AppStore downloads ZIP → extracts to module dirs → `npm run build:appstore` (with no-AVX retry on low-memory hosts).

## Pre-publish checklist

- [ ] `router.py` exports `router`
- [ ] `config.ts` + `index.tsx` with dual-UI pattern
- [ ] Test Classic: module full-page at `/your-path`
- [ ] Test Desktop: toggle ON; `windowMode` modules open in window
- [ ] Version bumped in `version.txt` and `packages.json`
- [ ] ZIP committed to `packages/` and pushed to `main`
