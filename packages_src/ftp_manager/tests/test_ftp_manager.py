"""Unit tests for ftp_manager Store + path helpers + FTP smoke (pyftpdlib optional)."""
from __future__ import annotations

import os
import socket
import sys
import tempfile
import threading
import time
from pathlib import Path

import pytest

# Allow importing the module package when tests live beside packages_src
ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
sys.path.insert(0, str(BACKEND.parent))

# Point DB at a temp dir before importing logic
os.environ.setdefault("FTP_MANAGER_TEST", "1")


@pytest.fixture()
def store(tmp_path, monkeypatch):
    import importlib

    # Load logic with patched config dir
    sys.path.insert(0, str(BACKEND))
    import logic as logic_mod

    monkeypatch.setattr(logic_mod, "CONFIG_DIR", tmp_path / "cfg")
    monkeypatch.setattr(logic_mod, "DB_PATH", tmp_path / "cfg" / "ftp_manager.db")
    logic_mod.Store._initialized = False
    logic_mod.Store.init()
    return logic_mod


def test_join_and_parent(store):
    assert store._join_remote("/", "a", "b") == "/a/b"
    assert store._join_remote("a", "b") == "/a/b"
    assert store._parent_remote("/a/b/c") == "/a/b"
    assert store._basename_remote("/a/b/c.txt") == "c.txt"


def test_connection_crud_masks_secrets(store):
    cid = store.Store.create_connection(
        {
            "label": "Demo",
            "protocol": "sftp",
            "host": "example.com",
            "port": 22,
            "username": "u",
            "auth_type": "password",
            "password": "secret",
            "remote_root": "/home",
        }
    )
    pub = store.Store.get_connection(cid)
    assert pub is not None
    assert "password" not in pub
    assert pub["password_set"] is True
    assert pub["label"] == "Demo"

    secret = store.Store.get_connection(cid, include_secrets=True)
    assert secret["password"] == "secret"

    assert store.Store.update_connection(cid, {"label": "Demo2", "password": "new"})
    assert store.Store.get_connection(cid, include_secrets=True)["password"] == "new"
    assert store.Store.get_connection(cid)["label"] == "Demo2"

    assert store.Store.delete_connection(cid)
    assert store.Store.get_connection(cid) is None


def test_default_ports(store):
    cid = store.Store.create_connection(
        {
            "label": "ftp",
            "protocol": "ftp",
            "host": "127.0.0.1",
            "port": 0,
            "username": "a",
            "password": "b",
        }
    )
    row = store.Store.get_connection(cid)
    assert row["port"] == 21


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return int(s.getsockname()[1])


@pytest.mark.skipif(
    __import__("importlib").util.find_spec("pyftpdlib") is None,
    reason="pyftpdlib not installed",
)
def test_ftp_browse_upload_download(store, tmp_path):
    from pyftpdlib.authorizers import DummyAuthorizer
    from pyftpdlib.handlers import FTPHandler
    from pyftpdlib.servers import FTPServer

    home = tmp_path / "ftp_home"
    home.mkdir()
    (home / "hello.txt").write_text("hello-remote", encoding="utf-8")

    authorizer = DummyAuthorizer()
    authorizer.add_user("test", "test", str(home), perm="elradfmw")

    handler = FTPHandler
    handler.authorizer = authorizer
    port = _free_port()
    server = FTPServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    time.sleep(0.3)

    try:
        cfg = {
            "protocol": "ftp",
            "host": "127.0.0.1",
            "port": port,
            "username": "test",
            "password": "test",
            "auth_type": "password",
            "remote_root": "/",
            "passive": True,
            "timeout": 10,
        }
        with store.RemoteClient(cfg) as client:
            result = client.test()
            assert result["ok"] is True
            items = client.list_dir("/")
            names = {i["name"] for i in items}
            assert "hello.txt" in names

            local_down = tmp_path / "down.txt"
            client.download_path("/hello.txt", str(local_down))
            assert local_down.read_text(encoding="utf-8") == "hello-remote"

            local_up = tmp_path / "up.txt"
            local_up.write_text("from-local", encoding="utf-8")
            client.upload_path(str(local_up), "/up.txt")
            items2 = {i["name"] for i in client.list_dir("/")}
            assert "up.txt" in items2
            assert (home / "up.txt").read_text(encoding="utf-8") == "from-local"

            client.mkdir("/subdir")
            client.rename("/up.txt", "up2.txt")
            names3 = {i["name"] for i in client.list_dir("/")}
            assert "up2.txt" in names3
            assert "subdir" in names3
    finally:
        server.close_all()
