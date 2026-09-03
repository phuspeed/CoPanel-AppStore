"""
ftp_manager — external FTP / FTPS / SFTP connection manager (AppStore module).
"""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import APIRouter, Body, Depends, Query

from core.api import ApiError, ok
from core.audit import record_audit
from core.auth import require_admin, require_module
from core.jobs import jobs

from . import logic
from .schemas import (
    ConnectionCreate,
    ConnectionTestBody,
    ConnectionUpdate,
    DeleteBody,
    MkdirBody,
    RenameBody,
    TransferBody,
)

router = APIRouter()
MODULE_DIR = Path(__file__).resolve().parent


def _read_version() -> str:
    try:
        return (MODULE_DIR / "version.txt").read_text(encoding="utf-8").strip()
    except Exception:
        return "0.0.0"


def _require_conn(conn_id: int, *, secrets: bool = False) -> Dict[str, Any]:
    row = logic.Store.get_connection(conn_id, include_secrets=secrets)
    if not row:
        raise ApiError("NOT_FOUND", f"Connection {conn_id} not found", http_status=404)
    return row


@router.on_event("startup")
async def on_startup() -> None:
    try:
        logic.Store.init()
    except Exception:
        pass


@router.get("/version")
def get_version(user: Dict[str, Any] = Depends(require_module("ftp_manager"))):
    return ok({"module": "ftp_manager", "version": _read_version()})


@router.get("/connections")
def list_connections(user: Dict[str, Any] = Depends(require_module("ftp_manager"))):
    try:
        logic.Store.init()
        return ok(logic.Store.list_connections())
    except Exception as exc:
        raise ApiError("FTP_MANAGER_ERROR", f"Failed to list connections: {exc}", http_status=500)


@router.post("/connections")
def create_connection(
    body: ConnectionCreate,
    user: Dict[str, Any] = Depends(require_admin),
):
    try:
        cid = logic.Store.create_connection(body.model_dump())
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit(
        "ftp_manager.connection_create",
        module="ftp_manager",
        target=f"{body.protocol}://{body.username}@{body.host}",
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"id": cid, "label": body.label},
    )
    return ok(logic.Store.get_connection(cid))


@router.get("/connections/{conn_id}")
def get_connection(
    conn_id: int,
    user: Dict[str, Any] = Depends(require_module("ftp_manager")),
):
    return ok(_require_conn(conn_id))


@router.patch("/connections/{conn_id}")
def update_connection(
    conn_id: int,
    body: ConnectionUpdate,
    user: Dict[str, Any] = Depends(require_admin),
):
    _require_conn(conn_id)
    try:
        ok_ = logic.Store.update_connection(conn_id, body.model_dump(exclude_unset=True))
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    if not ok_:
        raise ApiError("NOT_FOUND", f"Connection {conn_id} not found", http_status=404)
    record_audit(
        "ftp_manager.connection_update",
        module="ftp_manager",
        target=str(conn_id),
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok(logic.Store.get_connection(conn_id))


@router.delete("/connections/{conn_id}")
def delete_connection(
    conn_id: int,
    user: Dict[str, Any] = Depends(require_admin),
):
    _require_conn(conn_id)
    logic.Store.delete_connection(conn_id)
    record_audit(
        "ftp_manager.connection_delete",
        module="ftp_manager",
        target=str(conn_id),
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok(True)


@router.post("/connections/test")
def test_adhoc(
    body: ConnectionTestBody,
    user: Dict[str, Any] = Depends(require_module("ftp_manager")),
):
    """Test credentials without requiring a saved connection."""
    data = body.model_dump(exclude_unset=True)
    if not data.get("host") or not data.get("username"):
        raise ApiError("VALIDATION_ERROR", "host and username are required", http_status=400)
    cfg = logic.merge_connection_cfg(
        {
            "protocol": data.get("protocol") or "sftp",
            "host": data["host"],
            "port": data.get("port") or 0,
            "username": data["username"],
            "auth_type": data.get("auth_type") or "password",
            "password": data.get("password"),
            "key_path": data.get("key_path"),
            "key_blob": data.get("key_blob"),
            "remote_root": data.get("remote_root") or "/",
            "passive": data.get("passive", True),
            "timeout": data.get("timeout") or 30,
        }
    )
    try:
        return ok(logic.test_connection(cfg))
    except Exception as exc:
        raise ApiError("CONNECTION_FAILED", str(exc), http_status=400)


@router.post("/connections/{conn_id}/test")
def test_saved(
    conn_id: int,
    body: Optional[ConnectionTestBody] = Body(default=None),
    user: Dict[str, Any] = Depends(require_module("ftp_manager")),
):
    base = _require_conn(conn_id, secrets=True)
    override = body.model_dump(exclude_unset=True) if body else None
    cfg = logic.merge_connection_cfg(base, override)
    try:
        return ok(logic.test_connection(cfg))
    except Exception as exc:
        raise ApiError("CONNECTION_FAILED", str(exc), http_status=400)


@router.get("/connections/{conn_id}/list")
def list_remote(
    conn_id: int,
    path: str = Query("", max_length=4096),
    user: Dict[str, Any] = Depends(require_module("ftp_manager")),
):
    cfg = _require_conn(conn_id, secrets=True)
    try:
        with logic.RemoteClient(cfg) as client:
            target = client.resolve_path(path or None)
            items = client.list_dir(target)
            return ok({"path": target, "items": items})
    except Exception as exc:
        raise ApiError("REMOTE_LIST_FAILED", str(exc), http_status=400)


@router.post("/connections/{conn_id}/mkdir")
def mkdir_remote(
    conn_id: int,
    body: MkdirBody,
    user: Dict[str, Any] = Depends(require_admin),
):
    cfg = _require_conn(conn_id, secrets=True)
    try:
        with logic.RemoteClient(cfg) as client:
            client.mkdir(body.path)
    except Exception as exc:
        raise ApiError("REMOTE_MKDIR_FAILED", str(exc), http_status=400)
    record_audit(
        "ftp_manager.mkdir",
        module="ftp_manager",
        target=body.path,
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"connection_id": conn_id},
    )
    return ok(True)


@router.post("/connections/{conn_id}/rename")
def rename_remote(
    conn_id: int,
    body: RenameBody,
    user: Dict[str, Any] = Depends(require_admin),
):
    cfg = _require_conn(conn_id, secrets=True)
    try:
        with logic.RemoteClient(cfg) as client:
            dest = client.rename(body.path, body.new_name)
    except Exception as exc:
        raise ApiError("REMOTE_RENAME_FAILED", str(exc), http_status=400)
    record_audit(
        "ftp_manager.rename",
        module="ftp_manager",
        target=body.path,
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"connection_id": conn_id, "new_path": dest},
    )
    return ok({"path": dest})


@router.post("/connections/{conn_id}/delete")
def delete_remote(
    conn_id: int,
    body: DeleteBody,
    user: Dict[str, Any] = Depends(require_admin),
):
    cfg = _require_conn(conn_id, secrets=True)
    try:
        with logic.RemoteClient(cfg) as client:
            client.delete(body.path, recursive=body.recursive)
    except Exception as exc:
        raise ApiError("REMOTE_DELETE_FAILED", str(exc), http_status=400)
    record_audit(
        "ftp_manager.delete",
        module="ftp_manager",
        target=body.path,
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"connection_id": conn_id, "recursive": body.recursive},
    )
    return ok(True)


@router.get("/explore")
def explore_local(
    path: str = Query("/", max_length=4096),
    user: Dict[str, Any] = Depends(require_module("ftp_manager")),
):
    return ok(logic.explore_local(path))


@router.post("/transfer")
def transfer_blocking(
    body: TransferBody,
    user: Dict[str, Any] = Depends(require_admin),
):
    """Synchronous transfer — prefer /transfer_job for large payloads."""
    cfg = _require_conn(body.connection_id, secrets=True)
    try:
        with logic.RemoteClient(cfg) as client:
            if body.direction == "download":
                result = client.download_path(
                    body.remote_path, body.local_path, overwrite=body.overwrite
                )
            else:
                result = client.upload_path(
                    body.local_path, body.remote_path, overwrite=body.overwrite
                )
    except Exception as exc:
        raise ApiError("TRANSFER_FAILED", str(exc), http_status=400)
    record_audit(
        "ftp_manager.transfer",
        module="ftp_manager",
        target=f"{body.direction}:{body.remote_path}",
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={
            "connection_id": body.connection_id,
            "local_path": body.local_path,
            "files": result.get("files"),
        },
    )
    return ok(result)


@router.post("/transfer_job")
def transfer_job(
    body: TransferBody,
    user: Dict[str, Any] = Depends(require_admin),
):
    _require_conn(body.connection_id)
    verb = "Download" if body.direction == "download" else "Upload"
    title = f"{verb}: {body.remote_path} ↔ {body.local_path}"

    async def _handler(job):
        return await logic.run_transfer_job(
            job,
            connection_id=body.connection_id,
            direction=body.direction,
            remote_path=body.remote_path,
            local_path=body.local_path,
            overwrite=body.overwrite,
        )

    job = jobs.submit(
        kind="ftp_manager.transfer",
        title=title,
        module="ftp_manager",
        actor=user.get("username"),
        payload={
            "connection_id": body.connection_id,
            "direction": body.direction,
            "remote_path": body.remote_path,
            "local_path": body.local_path,
            "overwrite": body.overwrite,
        },
        handler=_handler,
    )
    record_audit(
        "ftp_manager.transfer_job",
        module="ftp_manager",
        target=f"{body.direction}:{body.remote_path}",
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"job_id": job.id, "connection_id": body.connection_id},
    )
    return ok({"job_id": job.id})
