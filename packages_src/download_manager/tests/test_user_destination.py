"""Restricted users: downloads go only into their permitted folders.

Needs the CoPanel backend (core.*, modules.file_manager) on sys.path: set
COPANEL_DIR or keep a CoPanel checkout next to CoPanel-AppStore. Skipped
otherwise.
"""
from __future__ import annotations

import importlib
import importlib.util
import os
import sys
import tempfile
from pathlib import Path

import pytest

HERE = Path(__file__).resolve()
MODULE_DIR = HERE.parents[1]
APPSTORE = HERE.parents[3]


def _copanel_backend():
    cands = [os.environ.get("COPANEL_DIR", ""), str(APPSTORE / ".copanel-build"), str(APPSTORE.parent / "CoPanel")]
    for c in cands:
        if c and (Path(c) / "backend" / "core" / "auth.py").is_file() and (
            Path(c) / "backend" / "modules" / "file_manager" / "router.py"
        ).is_file():
            return Path(c) / "backend"
    return None


BACKEND = _copanel_backend()
pytestmark = [
    pytest.mark.skipif(BACKEND is None, reason="CoPanel backend not available"),
    # logic.py starts its worker thread on import; off-host it cannot create
    # /opt/copanel/config. Task logic is stubbed below, so that is just noise.
    pytest.mark.filterwarnings("ignore::pytest.PytestUnhandledThreadExceptionWarning"),
]


@pytest.fixture(scope="module")
def dm():
    sys.path.insert(0, str(BACKEND))
    os.environ.setdefault("COPANEL_TEST_CONFIG_DIR", tempfile.mkdtemp(prefix="dm-test-"))
    os.environ.setdefault("COPANEL_DISABLE_AUTH", "0")
    pkg_name = "modules.download_manager_under_test"
    import modules  # noqa: F401  (CoPanel backend package)

    spec = importlib.util.spec_from_file_location(
        pkg_name, MODULE_DIR / "backend" / "__init__.py", submodule_search_locations=[str(MODULE_DIR / "backend")]
    )
    pkg = importlib.util.module_from_spec(spec)
    sys.modules[pkg_name] = pkg
    spec.loader.exec_module(pkg)
    logic_mod = importlib.import_module(pkg_name + ".logic")
    cfg = Path(tempfile.mkdtemp(prefix="dm-cfg-"))
    logic_mod.CONFIG_DIR = cfg
    logic_mod.DB_PATH = cfg / "download_manager.db"
    logic_mod.WATCHED_SEEN_FILE = cfg / "watched_seen.json"
    router_mod = importlib.import_module(pkg_name + ".router")
    return router_mod


@pytest.fixture
def env(dm, tmp_path, monkeypatch):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    import core.auth as auth_mod
    from core.api import install_exception_handlers

    home = tmp_path / "home" / "phutv"
    home.mkdir(parents=True)
    outside = tmp_path / "outside"
    outside.mkdir()
    state = {"user": {
        "id": 9, "username": "phutv", "role": "user",
        "permitted_folders": [str(home)], "permitted_modules": ["download_manager"],
    }}
    monkeypatch.setattr(auth_mod, "_AUTH_DISABLED", False)
    monkeypatch.setattr(auth_mod, "_user_from_token", lambda _a: state["user"])

    tasks = {
        "t-own": {"id": "t-own", "created_by": "phutv", "status": "completed", "destination": str(home)},
        "t-other": {"id": "t-other", "created_by": "admin", "status": "completed", "destination": "/srv"},
    }
    created = {}
    logic = dm.logic
    monkeypatch.setattr(logic, "get_settings", lambda *a, **k: {"destination_folder": "/opt/copanel/downloads", "temp_folder": "/tmp"})
    monkeypatch.setattr(logic, "save_settings", lambda data: data)
    monkeypatch.setattr(logic, "list_tasks", lambda **k: list(tasks.values()))
    monkeypatch.setattr(logic, "get_task", lambda tid: tasks.get(tid))
    monkeypatch.setattr(logic, "delete_task", lambda tid: tasks.pop(tid, None) is not None)
    monkeypatch.setattr(logic, "set_task_status", lambda tid, a: tasks.get(tid))

    def fake_create(data, username=""):
        created["data"] = data
        return {"id": "new", "destination": data["destination"], "created_by": username}

    def fake_torrent(content, filename, username="", destination=None):
        created["torrent_dest"] = destination
        return {"id": "tor", "destination": destination}

    monkeypatch.setattr(logic, "create_task", fake_create)
    monkeypatch.setattr(logic, "create_task_from_torrent_bytes", fake_torrent)
    monkeypatch.setattr(logic, "browse_folders", lambda p: {"current": str(p), "parent": str(Path(p).parent), "entries": [], "volumes": [{"label": "/", "path": "/"}]})

    app = FastAPI()
    install_exception_handlers(app)
    app.include_router(dm.router, prefix="/api/download_manager")
    client = TestClient(app)
    client.headers["Authorization"] = "Bearer x"
    return client, home, outside, created, tasks, state


def test_default_destination_is_home_downloads(env):
    client, home, _, created, _, _ = env
    r = client.post("/api/download_manager/tasks", json={"url": "https://example.com/a.iso"})
    assert r.status_code == 200, r.text
    assert created["data"]["destination"] == str(home / "Downloads")
    assert (home / "Downloads").is_dir()


def test_explicit_destination_inside_home_ok(env):
    client, home, _, created, _, _ = env
    r = client.post("/api/download_manager/tasks", json={"url": "https://example.com/a", "destination": str(home / "iso")})
    assert r.status_code == 200, r.text
    assert created["data"]["destination"] == str(home / "iso")


@pytest.mark.parametrize("dest", ["OUT", "OUT/x", "HOME/../../outside", "/etc"])
def test_destination_outside_home_403(env, dest):
    client, home, outside, created, _, _ = env
    dest = dest.replace("OUT", str(outside)).replace("HOME", str(home))
    r = client.post("/api/download_manager/tasks", json={"url": "https://example.com/a", "destination": dest})
    assert r.status_code == 403
    assert "data" not in created
    assert os.listdir(outside) == []


def test_torrent_upload_goes_to_home(env):
    client, home, _, created, _, _ = env
    r = client.post("/api/download_manager/tasks/upload-torrent", files={"file": ("a.torrent", b"d4:infoe")})
    assert r.status_code == 200, r.text
    assert created["torrent_dest"] == str(home / "Downloads")


def test_settings_show_user_default_and_save_is_admin_only(env):
    client, home, _, _, _, state = env
    r = client.get("/api/download_manager/settings")
    assert r.json()["data"]["destination_folder"] == str(home / "Downloads")
    r = client.put("/api/download_manager/settings", json={"destination_folder": "/"})
    assert r.status_code == 403
    state["user"] = {"id": 1, "username": "admin", "role": "superadmin"}
    r = client.put("/api/download_manager/settings", json={"destination_folder": "/srv"})
    assert r.status_code == 200
    r = client.get("/api/download_manager/settings")
    assert r.json()["data"]["destination_folder"] == "/opt/copanel/downloads"


def test_browse_limited_to_home(env):
    client, home, outside, _, _, _ = env
    r = client.get("/api/download_manager/folders/browse", params={"path": str(outside)})
    assert r.status_code == 403
    r = client.get("/api/download_manager/folders/browse", params={"path": str(home)})
    body = r.json()["data"]
    assert body["current"] == str(home)
    assert body["parent"] is None
    assert body["volumes"] == [{"label": str(home), "path": str(home)}]


def test_tasks_scoped_to_owner(env):
    client, _, _, _, tasks, _ = env
    ids = [t["id"] for t in client.get("/api/download_manager/tasks").json()["data"]]
    assert ids == ["t-own"]
    assert client.get("/api/download_manager/tasks/t-other").status_code == 404
    assert client.delete("/api/download_manager/tasks/t-other").status_code == 404
    assert client.post("/api/download_manager/tasks/t-other/stop").status_code == 404
    assert "t-other" in tasks
    r = client.delete("/api/download_manager/tasks/completed")
    assert r.json()["data"]["deleted"] == 1
    assert list(tasks) == ["t-other"]


def test_superadmin_keeps_global_default(env):
    client, _, _, created, _, state = env
    state["user"] = {"id": 1, "username": "admin", "role": "superadmin"}
    r = client.post("/api/download_manager/tasks", json={"url": "https://example.com/a"})
    assert r.status_code == 200
    assert created["data"]["destination"] is None
    ids = sorted(t["id"] for t in client.get("/api/download_manager/tasks").json()["data"])
    assert ids == ["t-other", "t-own"]


def _ownership_env(dm, tmp_path, monkeypatch, role="user"):
    import core.user_model as user_model

    logic = dm.logic
    home = tmp_path / "home" / "phutv"
    (home / "Downloads" / "album").mkdir(parents=True)
    (home / "Downloads" / "a.iso").write_bytes(b"x")
    (home / "Downloads" / "album" / "t.mp3").write_bytes(b"y")
    user = {"id": 9, "username": "phutv", "role": role, "permitted_folders": [str(home)]}
    task = {"id": "t1", "created_by": "phutv", "destination": str(home / "Downloads")}
    monkeypatch.setattr(logic, "get_task", lambda tid: task if tid == "t1" else None)
    monkeypatch.setattr(user_model, "get_user_by_username", lambda name: user if name == "phutv" else None)

    real_lstat = os.lstat

    def fake_lstat(p, *a, **k):
        # Pretend everything the download wrote is root-owned (panel runs as root).
        st = real_lstat(p, *a, **k)
        if str(p).startswith(str(home / "Downloads")):
            fields = list(st)
            fields[4] = fields[5] = 0  # st_uid, st_gid
            return os.stat_result(fields)
        return st

    calls = []
    monkeypatch.setattr(logic.os, "lstat", fake_lstat)
    monkeypatch.setattr(logic.os, "chown", lambda p, u, g, **kw: calls.append((str(p), u, g)))
    return logic, home, calls


def test_finished_download_gets_home_owner(dm, tmp_path, monkeypatch):
    logic, home, calls = _ownership_env(dm, tmp_path, monkeypatch)
    st = home.stat()
    if st.st_uid == 0:
        pytest.skip("tmp home owned by root")
    logic._fix_download_ownership("t1")
    dl = home / "Downloads"
    assert {c[0] for c in calls} == {str(dl), str(dl / "a.iso"), str(dl / "album"), str(dl / "album" / "t.mp3")}
    assert all(c[1:] == (st.st_uid, st.st_gid) for c in calls)


def test_superadmin_download_ownership_untouched(dm, tmp_path, monkeypatch):
    logic, _, calls = _ownership_env(dm, tmp_path, monkeypatch, role="superadmin")
    logic._fix_download_ownership("t1")
    assert calls == []


def test_ownership_skips_destination_outside_home(dm, tmp_path, monkeypatch):
    logic, home, calls = _ownership_env(dm, tmp_path, monkeypatch)
    other = tmp_path / "srv"
    other.mkdir()
    task = {"id": "t1", "created_by": "phutv", "destination": str(other)}
    monkeypatch.setattr(logic, "get_task", lambda tid: task)
    logic._fix_download_ownership("t1")
    assert calls == []


def test_completed_status_triggers_ownership_fix(dm, monkeypatch):
    logic = dm.logic
    seen = []
    monkeypatch.setattr(logic, "_fix_download_ownership", lambda tid: seen.append(tid))

    class Conn:
        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

        def execute(self, *a):
            return None

    monkeypatch.setattr(logic, "_db", lambda: Conn())
    logic._update_task("a", status="downloading", progress=5.0)
    logic._update_task("b", status="completed", progress=100.0)
    assert seen == ["b"]
