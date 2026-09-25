"""Unit tests for speedtest helpers (no FastAPI / auth required)."""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
sys.path.insert(0, str(BACKEND))


@pytest.fixture()
def logic_mod(tmp_path, monkeypatch):
    import importlib

    import logic as logic_mod

    monkeypatch.setattr(logic_mod, "_data_dir", lambda: tmp_path)
    importlib.reload(logic_mod)
    monkeypatch.setattr(logic_mod, "_data_dir", lambda: tmp_path)
    return logic_mod


def test_server_list_nonempty(logic_mod):
    servers = logic_mod.engine.list_servers()
    assert len(servers) >= 1
    assert servers[0]["id"] == "cloudflare"


def test_server_by_id_fallback(logic_mod):
    s = logic_mod._server_by_id("missing")
    assert s["id"] == "cloudflare"
    s2 = logic_mod._server_by_id("cloudflare_alt")
    assert s2["id"] == "cloudflare_alt"


def test_job_to_dict(logic_mod):
    job = logic_mod.Job(id="st_test", status="done", phase="done", ping_ms=12.3)
    d = job.to_dict()
    assert d["id"] == "st_test"
    assert d["ping_ms"] == 12.3


def test_history_roundtrip(logic_mod, tmp_path):
    logic_mod.engine._append_history(
        {
            "id": "st_a",
            "server_name": "Cloudflare",
            "ping_ms": 10,
            "download_mbps": 100,
            "upload_mbps": 50,
            "finished_at": 1,
        }
    )
    items = logic_mod.engine.history()
    assert len(items) == 1
    assert items[0]["id"] == "st_a"


@pytest.mark.integration
def test_ping_cloudflare(logic_mod):
    """Optional live network check — skipped when offline."""
    server = logic_mod._server_by_id("cloudflare")
    try:
        result = logic_mod.measure_ping(server, samples=2)
    except Exception as exc:
        pytest.skip(f"network unavailable: {exc}")
    assert result["ping_ms"] > 0
    assert result["samples"] >= 1
