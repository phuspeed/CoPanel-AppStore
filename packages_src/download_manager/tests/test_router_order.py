"""Ensure static /tasks/* routes are declared before /tasks/{task_id} in router.py."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROUTER = ROOT / "backend" / "router.py"


def _decorator_paths() -> list[str]:
    return re.findall(r'@router\.\w+\("([^"]+)"\)', ROUTER.read_text(encoding="utf-8"))


def test_static_task_routes_before_param_route():
    paths = _decorator_paths()
    param_idx = paths.index("/tasks/{task_id}")
    upload_idx = paths.index("/tasks/upload-torrent")
    completed_idx = paths.index("/tasks/completed")
    assert upload_idx < param_idx
    assert completed_idx < param_idx
