"""
speedtest — VPS network speed test (AppStore module).
Measures latency, download, and upload from the CoPanel host.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, Depends, Query

from core.api import ApiError, ok
from core.audit import record_audit
from core.auth import require_module

from . import logic
from .schemas import RunBody

router = APIRouter()
MODULE_DIR = Path(__file__).resolve().parent


def _read_version() -> str:
    try:
        return (MODULE_DIR / "version.txt").read_text(encoding="utf-8").strip()
    except Exception:
        return "0.0.0"


@router.get("/version")
def get_version(user: Dict[str, Any] = Depends(require_module("speedtest"))):
    return ok({"module": "speedtest", "version": _read_version()})


@router.get("/servers")
def list_servers(user: Dict[str, Any] = Depends(require_module("speedtest"))):
    return ok(logic.engine.list_servers())


@router.get("/history")
def get_history(
    user: Dict[str, Any] = Depends(require_module("speedtest")),
    limit: int = Query(default=10, ge=1, le=50),
):
    items = logic.engine.history()[:limit]
    return ok(items)


@router.get("/status")
def get_status(
    user: Dict[str, Any] = Depends(require_module("speedtest")),
    job_id: str = Query(default=None),
):
    if job_id:
        job = logic.engine.get_job(job_id)
        if not job:
            raise ApiError("NOT_FOUND", f"Job {job_id} not found", http_status=404)
        return ok(job)
    active = logic.engine.active_job()
    return ok(active)


@router.post("/run")
def run_test(
    body: RunBody = RunBody(),
    user: Dict[str, Any] = Depends(require_module("speedtest")),
):
    try:
        job = logic.engine.start(
            server_id=body.server_id,
            download_bytes=body.download_bytes,
            upload_bytes=body.upload_bytes,
        )
    except RuntimeError as exc:
        raise ApiError("SPEEDTEST_BUSY", str(exc), http_status=409)
    except Exception as exc:
        raise ApiError("SPEEDTEST_ERROR", str(exc), http_status=500)

    record_audit(
        "speedtest.run",
        module="speedtest",
        target=job.get("server_id") or "cloudflare",
        actor=user.get("username"),
        meta={"job_id": job.get("id")},
    )
    return ok(job)
