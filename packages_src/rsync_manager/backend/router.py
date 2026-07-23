"""
rsync_manager — VPS move / clone / sync wizard APIs (optional AppStore module).
"""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from core.api import ApiError, ok
from core.audit import record_audit
from core.auth import require_module
from core.jobs import jobs

from . import logic

router = APIRouter()


class SshTarget(BaseModel):
    host: str = Field(..., min_length=1, max_length=253)
    port: int = Field(22, ge=1, le=65535)
    user: str = Field(..., min_length=1, max_length=64)
    identity_file: Optional[str] = Field(None, max_length=4096)


class CompatibilityBody(SshTarget):
    estimated_bytes: int = Field(0, ge=0, le=2**50)
    remote_path: Optional[str] = Field(None, max_length=2048)


class PathPair(BaseModel):
    local_path: str = Field(..., min_length=1, max_length=4096)
    remote_path: str = Field(..., min_length=1, max_length=2048)


class SyncBody(SshTarget):
    local_path: Optional[str] = Field(None, min_length=1, max_length=4096)
    remote_path: Optional[str] = Field(None, min_length=1, max_length=2048)
    paths: List[PathPair] = Field(default_factory=list)
    excludes: List[str] = Field(default_factory=list)
    dry_run: bool = True
    delete: bool = False
    mode: str = Field("clone", max_length=16)


class EstimateBody(BaseModel):
    local_path: str = Field(..., min_length=1, max_length=4096)
    excludes: List[str] = Field(default_factory=list)


class ChecklistQuery(BaseModel):
    mode: str = Field("clone", max_length=16)
    scenario: str = Field("target_rsync", max_length=32)


def _identity(body: SshTarget) -> Optional[str]:
    if body.identity_file and body.identity_file.strip():
        return body.identity_file.strip()
    return None


def _normalize_paths(body: SyncBody) -> List[Dict[str, str]]:
    pairs: List[Dict[str, str]] = []
    for p in body.paths:
        pairs.append({"local_path": p.local_path.strip(), "remote_path": p.remote_path.strip()})
    if body.local_path and body.remote_path:
        pairs.insert(
            0,
            {"local_path": body.local_path.strip(), "remote_path": body.remote_path.strip()},
        )
    # de-dupe
    seen = set()
    out: List[Dict[str, str]] = []
    for p in pairs:
        key = (p["local_path"], p["remote_path"])
        if key in seen:
            continue
        seen.add(key)
        out.append(p)
    if not out:
        raise ValueError("Provide local_path/remote_path or paths[].")
    return out


@router.get("/presets")
def get_presets(user: Dict[str, Any] = Depends(require_module("rsync_manager"))):
    return ok(logic.presets())


@router.get("/version")
def get_version(user: Dict[str, Any] = Depends(require_module("rsync_manager"))):
    vfile = Path(__file__).resolve().parent / "version.txt"
    ver = vfile.read_text(encoding="utf-8").strip() if vfile.is_file() else "0"
    return ok({"module": "rsync_manager", "version": ver})


@router.get("/ssh_hints")
def get_ssh_hints(user: Dict[str, Any] = Depends(require_module("rsync_manager"))):
    return ok(logic.list_identity_hints())


@router.get("/local_info")
def get_local_info(user: Dict[str, Any] = Depends(require_module("rsync_manager"))):
    return ok(
        {
            "copanel": logic.local_copanel_info(),
            "rsync": logic.local_rsync_available(),
        }
    )


@router.post("/estimate")
def post_estimate(
    body: EstimateBody,
    user: Dict[str, Any] = Depends(require_module("rsync_manager")),
):
    try:
        return ok(logic.estimate_local_bytes(body.local_path.strip(), body.excludes))
    except ValueError as e:
        raise ApiError("VALIDATION_ERROR", str(e), http_status=400)


@router.post("/compatibility")
def post_compatibility(
    body: CompatibilityBody,
    user: Dict[str, Any] = Depends(require_module("rsync_manager")),
):
    try:
        margin = int(body.estimated_bytes * 1.15) if body.estimated_bytes > 0 else 0
        result = logic.compatibility_check(
            body.host.strip(),
            body.port,
            body.user.strip(),
            _identity(body),
            min_free_bytes=margin,
            remote_path=(body.remote_path.strip() if body.remote_path else None),
        )
    except ValueError as e:
        raise ApiError("VALIDATION_ERROR", str(e), http_status=400)
    return ok(result)


@router.post("/install_rsync")
def post_install_rsync(
    body: SshTarget,
    user: Dict[str, Any] = Depends(require_module("rsync_manager")),
):
    try:
        result = logic.install_rsync_remote(
            body.host.strip(),
            body.port,
            body.user.strip(),
            _identity(body),
        )
    except ValueError as e:
        raise ApiError("VALIDATION_ERROR", str(e), http_status=400)
    record_audit(
        "rsync_manager.install_rsync",
        module="rsync_manager",
        target=f"{body.user}@{body.host}",
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"ok": result.get("ok")},
    )
    return ok(result)


@router.post("/checklist")
def post_checklist(
    body: ChecklistQuery,
    user: Dict[str, Any] = Depends(require_module("rsync_manager")),
):
    try:
        mode = logic.validate_mode(body.mode)
    except ValueError as e:
        raise ApiError("VALIDATION_ERROR", str(e), http_status=400)
    return ok(logic.post_checklist(mode, body.scenario.strip() or "target_rsync"))


@router.post("/sync")
def post_sync(
    body: SyncBody,
    user: Dict[str, Any] = Depends(require_module("rsync_manager")),
):
    """Blocking sync (prefer /sync_job for long transfers). Good for dry-run."""
    try:
        mode = logic.validate_mode(body.mode)
        pairs = _normalize_paths(body)
        # For blocking API, only first path for backward compat if single; else all sequentially
        results = []
        for pair in pairs:
            result = logic.run_rsync(
                body.host.strip(),
                body.port,
                body.user.strip(),
                _identity(body),
                pair["local_path"],
                pair["remote_path"],
                body.excludes,
                dry_run=body.dry_run,
                delete=bool(body.delete) and mode in ("sync", "move"),
            )
            results.append({**pair, **result})
            if not result.get("ok"):
                break
        all_ok = all(r.get("ok") for r in results)
        payload = {
            "ok": all_ok,
            "mode": mode,
            "dry_run": body.dry_run,
            "delete": bool(body.delete),
            "paths": results,
            # legacy single-path fields
            "exit_code": results[-1]["exit_code"] if results else 1,
            "stdout_tail": results[-1].get("stdout_tail", "") if results else "",
            "stderr_tail": results[-1].get("stderr_tail", "") if results else "",
        }
    except ValueError as e:
        raise ApiError("VALIDATION_ERROR", str(e), http_status=400)
    except RuntimeError as e:
        raise ApiError("RUNTIME_ERROR", str(e), http_status=500)
    return ok(payload)


@router.post("/sync_job")
def post_sync_job(
    body: SyncBody,
    user: Dict[str, Any] = Depends(require_module("rsync_manager")),
):
    """Submit rsync as a Task Center job with live progress."""
    try:
        mode = logic.validate_mode(body.mode)
        pairs = _normalize_paths(body)
        # Safety: --delete only for sync/move
        delete = bool(body.delete) and mode in ("sync", "move")
        if body.delete and mode == "clone":
            delete = False
    except ValueError as e:
        raise ApiError("VALIDATION_ERROR", str(e), http_status=400)

    # Preflight for real sync
    if not body.dry_run:
        try:
            check = logic.compatibility_check(
                body.host.strip(),
                body.port,
                body.user.strip(),
                _identity(body),
                min_free_bytes=0,
                remote_path=pairs[0]["remote_path"],
            )
        except ValueError as e:
            raise ApiError("VALIDATION_ERROR", str(e), http_status=400)
        if not check.get("can_proceed"):
            raise ApiError(
                "COMPATIBILITY_BLOCKED",
                "Compatibility check failed — fix blocking items before real sync.",
                http_status=400,
                details=check,
            )

    title_paths = pairs[0]["local_path"] if len(pairs) == 1 else f"{len(pairs)} paths"
    verb = "Dry-run" if body.dry_run else mode.capitalize()
    title = f"{verb} rsync: {title_paths} → {body.host}"

    async def _handler(job):
        return await logic.run_rsync_job(
            job,
            host=body.host.strip(),
            port=body.port,
            user=body.user.strip(),
            identity_file=_identity(body),
            paths=pairs,
            excludes=body.excludes,
            dry_run=body.dry_run,
            delete=delete,
            mode=mode,
        )

    job = jobs.submit(
        kind="rsync_manager.sync",
        title=title,
        module="rsync_manager",
        actor=user.get("username"),
        payload={
            "host": body.host.strip(),
            "port": body.port,
            "user": body.user.strip(),
            "paths": pairs,
            "dry_run": body.dry_run,
            "delete": delete,
            "mode": mode,
        },
        handler=_handler,
    )

    record_audit(
        "rsync_manager.sync_job",
        module="rsync_manager",
        target=f"{body.user}@{body.host}",
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"job_id": job.id, "mode": mode, "dry_run": body.dry_run, "delete": delete},
    )
    return ok({"job_id": job.id})
