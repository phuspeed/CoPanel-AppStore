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
        if c and (Path(c) / "backend" / "core" / "oauth_popup.py").is_file():
            return Path(c) / "backend"
    return None


BACKEND = _copanel_backend()
pytestmark = pytest.mark.skipif(BACKEND is None, reason="CoPanel backend 1.1.15+ not available")


def _load(name):
    sys.path.insert(0, str(BACKEND))
    import modules  # noqa: F401

    pkg_name = f"modules.{name}_sec_under_test"
    spec = importlib.util.spec_from_file_location(
        pkg_name, MODULE_DIR / "backend" / "__init__.py", submodule_search_locations=[str(MODULE_DIR / "backend")]
    )
    pkg = importlib.util.module_from_spec(spec)
    sys.modules[pkg_name] = pkg
    spec.loader.exec_module(pkg)
    return importlib.import_module(pkg_name + ".router")


XSS = "</script><script>alert(document.domain)</script><img src=x onerror=alert(1)>"


@pytest.fixture(scope="module")
def wb():
    return _load("web_browser")


@pytest.fixture
def client(wb, monkeypatch):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    import core.stream_tickets as st

    st.clear_tickets()
    app = FastAPI()
    app.include_router(wb.router, prefix="/api/web_browser")
    return TestClient(app), st


def _closed_4401(client, url):
    from starlette.websockets import WebSocketDisconnect

    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect(url) as ws:
            ws.receive_text()
    return exc.value.code == 4401


def test_ws_rejects_jwt_in_url(client, monkeypatch):
    c, st = client
    import core.security as sec

    monkeypatch.setattr(sec, "verify_token", lambda _t: {"sub": "admin"})
    assert _closed_4401(c, "/api/web_browser/ws?access_token=any.jwt.value")
    assert _closed_4401(c, "/api/web_browser/ws")


def test_ws_ticket_single_use_and_superadmin_only(client, wb, monkeypatch):
    c, st = client
    admin = {"id": 1, "username": "admin", "role": "superadmin", "token_version": 0}
    user = {"id": 2, "username": "u", "role": "user", "token_version": 0}
    t_user = st.issue_ticket(user)
    assert _closed_4401(c, f"/api/web_browser/ws?ticket={t_user}")
    t = st.issue_ticket(admin)
    assert wb._ws_user_from_ticket(t)["username"] == "admin"
    assert wb._ws_user_from_ticket(t) is None  # consumed
