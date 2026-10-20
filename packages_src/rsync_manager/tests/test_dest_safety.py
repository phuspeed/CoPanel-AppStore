"""Unit tests for rsync_manager destination safety guards."""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import logic  # noqa: E402


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
