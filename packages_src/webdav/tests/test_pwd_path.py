"""Unit tests for webdav admin password path (CoPanel user_model.pwd_path)."""
from __future__ import annotations

import sys
import types
from pathlib import Path
from types import SimpleNamespace

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

# Stub CoPanel core before loading logic
_core = types.ModuleType("core")
_user_model = types.ModuleType("core.user_model")
_core.user_model = _user_model
_security = types.ModuleType("core.security")
_security.verify_password = lambda plain, hashed: plain == hashed
sys.modules.setdefault("core", _core)
sys.modules.setdefault("core.user_model", _user_model)
sys.modules.setdefault("core.security", _security)

for _name in list(sys.modules):
    if _name == "backend" or _name.startswith("backend."):
        del sys.modules[_name]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import logic  # noqa: E402


@pytest.fixture(autouse=True)
def _isolated_store(tmp_path, monkeypatch):
    store = tmp_path / "webdav.json"
    monkeypatch.setattr(logic, "STORE_PATH", store)
    monkeypatch.setattr(logic, "_local_ips", lambda: ["127.0.0.1"])
    monkeypatch.setattr(logic, "_wsgidav_available", lambda: False)


def test_public_config_without_pwd_path_attr(monkeypatch):
    um = SimpleNamespace(
        get_all_users=lambda: [],
        get_user_by_username=lambda _u: None,
    )
    monkeypatch.setattr(logic, "user_model", um)
    cfg = logic.get_public_config()
    assert cfg["admin_password_file_present"] is False


def test_public_config_with_pwd_path_fn(monkeypatch, tmp_path):
    pwd_file = tmp_path / "admin_password.txt"
    pwd_file.write_text("panel-secret", encoding="utf-8")
    um = SimpleNamespace(
        pwd_path=lambda: pwd_file,
        get_all_users=lambda: [{"username": "admin", "role": "superadmin"}],
        get_user_by_username=lambda u: {"username": u, "role": "superadmin"},
    )
    monkeypatch.setattr(logic, "user_model", um)
    assert logic._admin_password_file_present() is True
    assert logic._admin_password_plain() == "panel-secret"
    cfg = logic.get_public_config()
    assert cfg["admin_password_file_present"] is True
