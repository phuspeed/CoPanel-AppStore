"""Unit tests for rsync_manager destination safety guards."""
from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


def _load_logic():
    path = ROOT / "backend" / "logic.py"
    spec = importlib.util.spec_from_file_location("rsync_manager_unit_logic", path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return mod


logic = _load_logic()


def test_remote_dangerous_root_blocked_on_sync_without_delete():
    with pytest.raises(ValueError, match="protected system path"):
        logic.validate_sync_destination("/home", local=False, delete=False, mode="sync")


def test_remote_subdirectory_allowed_on_sync():
    logic.validate_sync_destination("/home/user/backup", local=False, delete=False, mode="sync")


def test_remote_dangerous_root_blocked_when_delete_enabled():
    with pytest.raises(ValueError, match="protected system path"):
        logic.validate_sync_destination("/var", local=False, delete=True, mode="move")


def test_clone_mode_ignores_delete_flag_for_validation():
    logic.validate_sync_destination("/etc", local=False, delete=True, mode="clone")


def test_move_without_delete_allows_dangerous_root():
    logic.validate_sync_destination("/etc", local=False, delete=False, mode="move")


def test_local_resolve_blocks_dangerous_root(tmp_path: Path):
    link = tmp_path / "into_home"
    try:
        link.symlink_to("/home")
    except OSError:
        pytest.skip("symlink not supported")
    with pytest.raises(ValueError, match="protected system path"):
        logic.validate_sync_destination(str(link), local=True, delete=False, mode="sync")


def test_local_resolve_allows_safe_subdir(tmp_path: Path):
    dest = tmp_path / "backup"
    dest.mkdir()
    logic.validate_sync_destination(str(dest), local=True, delete=False, mode="sync")


def test_effective_delete_flag():
    assert logic.effective_delete_flag(True, "clone") is False
    assert logic.effective_delete_flag(True, "sync") is True
    assert logic.effective_delete_flag(False, "sync") is False


def test_sync_job_preflight_blocks_protected_remote_dest():
    """POST /sync_job should reject the same destinations as blocking /sync."""
    pairs = [{"local_path": "/var/www", "remote_path": "/home"}]
    with pytest.raises(ValueError, match="protected system path"):
        for pair in pairs:
            logic.validate_sync_destination_for_target(
                pair["remote_path"],
                "203.0.113.10",
                delete=False,
                mode="sync",
            )
