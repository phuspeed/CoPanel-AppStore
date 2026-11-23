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
def dm():
    return _load("download_manager")


def test_oauth_callback_escaped(dm, monkeypatch):
    body = dm.oauth_google_callback(error=XSS).body.decode()
    assert "</script><script>" not in body and "<img" not in body

    def boom(**_k):
        raise RuntimeError(XSS)

    monkeypatch.setattr(dm.GoogleOAuthService, "exchange_code", staticmethod(boom))
    resp = dm.oauth_google_callback(code="c", state="s")
    body = resp.body.decode()
    assert "alert(" not in body and "<img" not in body
    assert "nonce-" in resp.headers["content-security-policy"]
