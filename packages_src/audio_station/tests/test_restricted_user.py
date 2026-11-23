"""Audio Station: restricted users cannot change server-wide settings and the
folder picker stays inside their permitted folders.

Needs the CoPanel backend (core.*, modules.file_manager) on sys.path: set
COPANEL_DIR or keep a CoPanel checkout next to CoPanel-AppStore. Skipped
otherwise.
"""
from __future__ import annotations

import importlib
import importlib.util
import os
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve()
MODULE_DIR = HERE.parents[1]
APPSTORE = HERE.parents[3]


def _copanel_backend():
    cands = [os.environ.get("COPANEL_DIR", ""), str(APPSTORE / ".copanel-build"), str(APPSTORE.parent / "CoPanel")]
    for c in cands:
        if c and (Path(c) / "backend" / "core" / "user_home.py").is_file():
            return Path(c) / "backend"
    return None


BACKEND = _copanel_backend()
pytestmark = pytest.mark.skipif(BACKEND is None, reason="CoPanel backend (1.1.12+) not available")


@pytest.fixture(scope="module")
def audio():
    sys.path.insert(0, str(BACKEND))
    import modules  # noqa: F401  (CoPanel backend package)

    pkg_name = "modules.audio_station_under_test"
    spec = importlib.util.spec_from_file_location(
        pkg_name, MODULE_DIR / "backend" / "__init__.py", submodule_search_locations=[str(MODULE_DIR / "backend")]
    )
    pkg = importlib.util.module_from_spec(spec)
    sys.modules[pkg_name] = pkg
    spec.loader.exec_module(pkg)
    return importlib.import_module(pkg_name + ".router")


@pytest.fixture
def env(audio, tmp_path, monkeypatch):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    import core.auth as auth_mod
    from core.api import install_exception_handlers

    home = tmp_path / "home" / "phutv"
    (home / "Music" / "Rock").mkdir(parents=True)
    outside = tmp_path / "outside"
    (outside / "secret").mkdir(parents=True)
    state = {"user": {
        "id": 9, "username": "phutv", "role": "user",
        "permitted_folders": [str(home)], "permitted_modules": ["audio_station"],
    }}
    monkeypatch.setattr(auth_mod, "_AUTH_DISABLED", False)
    monkeypatch.setattr(auth_mod, "_user_from_token", lambda _a: state["user"])
    logic = audio.logic
    saved = {}
    monkeypatch.setattr(logic, "save_settings", lambda data: saved.update(data) or data)
    monkeypatch.setattr(logic, "get_library_roots", lambda: ["/srv/music"])
    monkeypatch.setattr(logic, "browse_folders_picker", lambda p: {"current": p or "/home", "admin": True})
    monkeypatch.setattr(audio, "record_audit", lambda *a, **k: None)

    app = FastAPI()
    install_exception_handlers(app)
    app.include_router(audio.router, prefix="/api/audio_station")
    client = TestClient(app)
    client.headers["Authorization"] = "Bearer x"
    return client, home, outside, saved, state


def test_settings_change_is_admin_only(env):
    client, _, _, saved, state = env
    r = client.put("/api/audio_station/settings", json={"library_roots": ["/"]})
    assert r.status_code == 403
    assert saved == {}
    state["user"] = {"id": 1, "username": "admin", "role": "superadmin"}
    r = client.put("/api/audio_station/settings", json={"library_roots": ["/srv/music"]})
    assert r.status_code == 200, r.text
    assert saved.get("library_roots") == ["/srv/music"]


def test_picker_defaults_to_home(env):
    client, home, _, _, _ = env
    r = client.get("/api/audio_station/folders/browse")
    assert r.status_code == 200, r.text
    data = r.json()["data"]
    assert data["current"] == str(home)
    assert data["parent"] is None
    assert [e["name"] for e in data["entries"]] == ["Music"]
    assert data["volumes"] == [{"label": str(home), "path": str(home)}]


def test_picker_inside_home(env):
    client, home, _, _, _ = env
    r = client.get("/api/audio_station/folders/browse", params={"path": str(home / "Music")})
    assert r.status_code == 200, r.text
    data = r.json()["data"]
    assert data["parent"] == str(home)
    assert [e["name"] for e in data["entries"]] == ["Rock"]


@pytest.mark.parametrize("path", ["OUT", "OUT/secret", "HOME/../../outside", "/etc", "/"])
def test_picker_outside_home_403(env, path):
    client, home, outside, _, _ = env
    path = path.replace("OUT", str(outside)).replace("HOME", str(home))
    r = client.get("/api/audio_station/folders/browse", params={"path": path})
    assert r.status_code == 403, r.text


def test_picker_missing_folder_not_created(env):
    client, home, _, _, _ = env
    r = client.get("/api/audio_station/folders/browse", params={"path": str(home / "nope")})
    assert r.status_code == 404
    assert not (home / "nope").exists()


def test_superadmin_picker_unchanged(env):
    client, _, _, _, state = env
    state["user"] = {"id": 1, "username": "admin", "role": "superadmin"}
    r = client.get("/api/audio_station/folders/browse", params={"path": "/srv"})
    assert r.status_code == 200
    assert r.json()["data"] == {"current": "/srv", "admin": True}
