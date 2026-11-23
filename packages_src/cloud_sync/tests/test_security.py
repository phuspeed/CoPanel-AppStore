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
def cs():
    return _load("cloud_sync")


@pytest.fixture
def client(cs, monkeypatch):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    import core.auth as auth_mod
    from core.api import install_exception_handlers

    state = {"user": None}
    monkeypatch.setattr(auth_mod, "_AUTH_DISABLED", False)
    monkeypatch.setattr(auth_mod, "_user_from_token", lambda a: state["user"] if a else None)
    monkeypatch.setattr(cs.Store, "init", staticmethod(lambda: None))
    app = FastAPI()
    install_exception_handlers(app)
    app.middleware("http")(auth_mod.api_auth_middleware)
    app.include_router(cs.router, prefix="/api/cloud_sync")
    return TestClient(app), state


def _safe(text):
    # Escaped JSON may contain the words, never live markup.
    return "</script><script>" not in text and "<img" not in text and text.count("<script") == 1


def test_oauth_callback_escapes_error(cs):
    resp = cs.oauth_callback(error=XSS)
    body = resp.body.decode()
    assert _safe(body)
    assert "nonce-" in resp.headers["content-security-policy"]
    assert "'*'" not in body


def test_oauth_callback_hides_exception_text(cs, monkeypatch):
    def boom(**_k):
        raise RuntimeError(XSS)

    monkeypatch.setattr(cs.GoogleOAuth, "exchange", staticmethod(boom))
    assert _safe(cs.oauth_callback(code="c", state="s").body.decode())
    monkeypatch.setattr(cs.GoogleOAuth, "exchange", staticmethod(lambda **_k: {"remote_name": XSS}))
    assert _safe(cs.oauth_callback(code="c", state="s").body.decode())


def test_stream_pair_accepts_ticket_not_jwt(client, cs, monkeypatch):
    c, state = client
    import core.stream_tickets as st

    st.clear_tickets()
    monkeypatch.setattr(cs.Store, "list_pairs", staticmethod(lambda: []))
    r = c.get("/api/cloud_sync/stream_pair/1?access_token=x.y.z")
    assert r.status_code == 401
    user = {"id": 1, "username": "admin", "role": "superadmin", "token_version": 0}
    monkeypatch.setattr(st, "session_still_valid", lambda _u: True, raising=False)
    t = st.issue_ticket(user)
    r = c.get(f"/api/cloud_sync/stream_pair/1?ticket={t}")
    assert r.status_code == 404  # authenticated; pair does not exist
    r = c.get(f"/api/cloud_sync/stream_pair/1?ticket={t}")
    assert r.status_code == 401  # single use


def test_oauth_status_never_returns_token(client, cs, monkeypatch):
    c, state = client
    state["user"] = {"id": 1, "username": "admin", "role": "superadmin"}
    monkeypatch.setattr(cs.Store, "_get_token", staticmethod(lambda _n: {"access_token": "SECRET", "refresh_token": "R", "expiry": "e"}))
    r = c.get("/api/cloud_sync/oauth/google/status", params={"remote_name": "gd"}, headers={"Authorization": "Bearer x"})
    assert r.status_code == 200, r.text
    assert "SECRET" not in r.text and '"R"' not in r.text
