from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path
from typing import Any, Dict, Optional

import logging

from fastapi import APIRouter, Body, Depends, Header, HTTPException, Request
from fastapi.responses import StreamingResponse

from core.api import ApiError, ok
from core.auth import require_admin, require_module

from ._oauth_page import oauth_result_page, safe_error_code

from .logic import Store, GoogleOAuth, build_rclone_cmd
from .schemas import SaveOAuthClientRequest, SavePairRequest, UpdatePairRequest

router = APIRouter()
logger = logging.getLogger(__name__)
MODULE_DIR = Path(__file__).resolve().parent


@router.on_event("startup")
async def on_startup() -> None:
    try:
        Store.init()
    except Exception:
        pass


def _stream_user(request: Request, authorization: str = Header(None)) -> Dict[str, Any]:
    """EventSource auth: Bearer header, or the single-use ``?ticket=`` that the
    core middleware already consumed (CoPanel 1.1.15+ allows it on this path)."""
    try:
        from core.auth import optional_user_sse, user_has_module
    except ImportError:  # pragma: no cover - very old core
        raise ApiError("UNAUTHORIZED", "Authentication required.", http_status=401)
    user = optional_user_sse(request, authorization)
    if not user:
        raise ApiError("UNAUTHORIZED", "Authentication required.", http_status=401)
    if not user_has_module(user, "cloud_sync"):
        raise ApiError("FORBIDDEN", "You do not have access to this module.", http_status=403)
    return user


def _read_version() -> str:
    try:
        return (MODULE_DIR / "version.txt").read_text(encoding="utf-8").strip()
    except Exception:
        return "0.0.0"


@router.get("/version")
def get_version(user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    return ok({"version": _read_version()})


@router.get("/accounts")
def list_accounts(user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    try:
        Store.init()
        return ok(Store.list_accounts())
    except Exception as exc:
        raise ApiError("CLOUD_SYNC_ERROR", f"Failed to list accounts: {exc}", http_status=500)


@router.get("/pairs")
def list_pairs(user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    try:
        Store.init()
        return ok(Store.list_pairs())
    except Exception as exc:
        raise ApiError("CLOUD_SYNC_ERROR", f"Failed to list pairs: {exc}", http_status=500)


@router.post("/pairs")
def create_pair(req: SavePairRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    try:
        pid = Store.create_pair(req.model_dump(mode="json"))
        return ok({"id": pid})
    except Exception as exc:
        raise ApiError("CLOUD_SYNC_ERROR", f"Failed to create pair: {exc}", http_status=500)


@router.put("/pairs/{pair_id}")
def update_pair(pair_id: int, req: UpdatePairRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    ok_ = Store.update_pair(pair_id, req.model_dump(exclude_unset=True, mode="json"))
    if not ok_:
        raise HTTPException(status_code=400, detail="Failed to update pair")
    return ok(True)


@router.delete("/pairs/{pair_id}")
def delete_pair(pair_id: int, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    Store.delete_pair(pair_id)
    return ok(True)


@router.get("/remotes")
def list_remotes(user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    return ok({"data": Store.get_rclone_remotes_detail(), "config_path": str(Store.get_rclone_config_path())})


@router.get("/explore")
def explore_files(path: str = "/", user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    if os.name == "nt" and path == "/":
        current_file_dir = Path(__file__).parent.resolve()
        path = str(current_file_dir.parent.parent.parent.resolve())
    target = Path(path)
    if not target.exists() or not target.is_dir():
        return ok({"data": [], "current_path": str(target)})
    items = []
    try:
        for entry in sorted(target.iterdir(), key=lambda e: (e.is_file(), e.name.lower())):
            if entry.is_dir():
                items.append({"name": entry.name, "path": str(entry), "type": "folder"})
            else:
                items.append({"name": entry.name, "path": str(entry), "type": "file"})
    except PermissionError:
        return ok({"data": [], "current_path": str(target), "message": "Permission denied"})
    return ok({"data": items, "current_path": str(target)})


@router.get("/oauth/google/config")
def oauth_config_get(
    request: Request,
    redirect_origin: str = "",
    user: Dict[str, Any] = Depends(require_module("cloud_sync")),
) -> Dict[str, Any]:
    Store.init()
    origin = (redirect_origin or "").strip().rstrip("/") or str(request.base_url).rstrip("/")
    redirect_uri = f"{origin}/api/cloud_sync/oauth/google/callback"
    return ok(Store.google_oauth_config_status(redirect_uri))


@router.post("/oauth/google/config")
def oauth_config_save(
    request: Request,
    req: SaveOAuthClientRequest,
    user: Dict[str, Any] = Depends(require_admin),
) -> Dict[str, Any]:
    """One-time Google Cloud OAuth app credentials for this panel."""
    try:
        Store.init()
        origin = (req.redirect_origin or "").strip().rstrip("/") or str(request.base_url).rstrip("/")
        redirect_uri = (req.redirect_uri or "").strip() or f"{origin}/api/cloud_sync/oauth/google/callback"
        return ok(Store.configure_google_oauth_client(req.client_id, req.client_secret, redirect_uri))
    except ValueError as exc:
        raise ApiError("OAUTH_CONFIG_INVALID", str(exc), http_status=400)
    except Exception as exc:
        raise ApiError("OAUTH_ERROR", f"Failed to save Google OAuth config: {exc}", http_status=500)


@router.post("/oauth/google/connect")
def oauth_connect(
    request: Request,
    data: Optional[Dict[str, Any]] = Body(default=None),
    user: Dict[str, Any] = Depends(require_admin),
) -> Dict[str, Any]:
    """One-click connect after panel OAuth app credentials are configured."""
    payload = data or {}
    origin = str(payload.get("redirect_origin") or "").strip().rstrip("/")
    if not origin:
        origin = str(request.base_url).rstrip("/")
    redirect_uri = f"{origin}/api/cloud_sync/oauth/google/callback"
    remote_name = str(payload.get("remote_name") or "").strip()
    try:
        Store.init()
        result = GoogleOAuth.connect(redirect_uri=redirect_uri, remote_name=remote_name)
        return ok(result)
    except ValueError as exc:
        raise ApiError("OAUTH_NOT_CONFIGURED", str(exc), http_status=503)
    except Exception as exc:
        raise ApiError("OAUTH_ERROR", f"Failed to start Google OAuth: {exc}", http_status=500)


@router.post("/oauth/google/start")
def oauth_start(
    data: Optional[Dict[str, Any]] = Body(default=None),
    user: Dict[str, Any] = Depends(require_admin),
) -> Dict[str, Any]:
    payload = data or {}
    origin = str(payload.get("redirect_origin") or payload.get("redirect_uri") or "").strip().rstrip("/")
    if origin and not origin.endswith("/callback"):
        redirect_uri = f"{origin}/api/cloud_sync/oauth/google/callback" if "/api/" not in origin else origin
    else:
        redirect_uri = origin
    try:
        Store.init()
        if payload.get("client_id") and payload.get("client_secret"):
            result = GoogleOAuth.start(
                remote_name=str(payload.get("remote_name") or "").strip() or Store.suggest_remote_name(),
                client_id=str(payload.get("client_id") or "").strip(),
                client_secret=str(payload.get("client_secret") or "").strip(),
                redirect_uri=redirect_uri,
            )
        else:
            result = GoogleOAuth.connect(redirect_uri=redirect_uri, remote_name=str(payload.get("remote_name") or "").strip())
        return ok(result)
    except ValueError as exc:
        raise ApiError("OAUTH_ERROR", str(exc), http_status=400)
    except Exception as exc:
        raise ApiError("OAUTH_ERROR", f"Failed to start Google OAuth: {exc}", http_status=500)


@router.get("/oauth/google/callback")
def oauth_callback(code: str = "", state: str = "", error: str = ""):
    """Public OAuth popup callback. Never reflects request text as HTML."""
    kind = "copanel_google_oauth"
    if error:
        return oauth_result_page(
            {"type": kind, "ok": False, "error": safe_error_code(error)},
            "Authorization failed. You can close this window.",
            400,
        )
    try:
        result = GoogleOAuth.exchange(code=code, state=state)
        return oauth_result_page(
            {"type": kind, "ok": True, "remote_name": str(result["remote_name"])},
            "Authorization completed. You can close this window.",
        )
    except ValueError:
        logger.warning("Cloud Sync OAuth callback rejected (invalid code/state)")
        return oauth_result_page(
            {"type": kind, "ok": False, "error": "invalid_request"},
            "Authorization failed: the request was invalid or has expired.",
            400,
        )
    except Exception:
        logger.exception("Cloud Sync OAuth callback failed")
        return oauth_result_page(
            {"type": kind, "ok": False, "error": "server_error"},
            "OAuth callback failed. Check the CoPanel log.",
            500,
        )


@router.get("/oauth/google/status")
def oauth_status(remote_name: str = "", user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    Store.init()
    if remote_name:
        row = Store._get_token(remote_name)
        # Never return the OAuth access/refresh token to the browser.
        expiry = row.get("expiry") if isinstance(row, dict) else None
        return ok({"remote_name": remote_name, "connected": bool(row), "expiry": expiry})
    return ok(Store.list_oauth_status())


@router.get("/stream_pair/{pair_id}")
async def stream_pair(
    pair_id: int,
    user: Dict[str, Any] = Depends(_stream_user),
):
    Store.init()
    pairs = [p for p in Store.list_pairs() if p["id"] == pair_id]
    if not pairs:
        raise HTTPException(status_code=404, detail="Pair not found")
    pair = pairs[0]

    rclone_config = str(Store.get_rclone_config_path())
    remote = f"{pair['remote_name']}:{pair['remote_path']}"
    flags = {"sync_deletions": bool(pair.get("sync_deletions")), "transfers": int(pair.get("transfers") or 4)}

    async def event_gen():
        cmd = build_rclone_cmd(pair["direction"], pair["local_path"], remote, flags, rclone_config)
        if os.name == "nt":
            yield f"data: {json.dumps({'msg': '[Mock] rclone ' + ' '.join(cmd[1:3]), 'progress': 20})}\n\n"
            await asyncio.sleep(1)
            yield f"data: {json.dumps({'msg': 'Syncing files...', 'progress': 60})}\n\n"
            await asyncio.sleep(1)
            yield f"data: {json.dumps({'msg': 'Sync complete!', 'progress': 100, 'done': True})}\n\n"
            return
        try:
            proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)
            while True:
                line = await proc.stdout.readline()
                if not line:
                    break
                text = line.decode("utf-8", errors="replace").strip()
                payload = {"msg": text}
                yield f"data: {json.dumps(payload)}\n\n"
            code = await proc.wait()
            if code == 0:
                yield f"data: {json.dumps({'msg': 'Done', 'done': True, 'progress': 100})}\n\n"
            else:
                yield f"data: {json.dumps({'error': 'rclone exited with code ' + str(code), 'done': True})}\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc), 'done': True})}\n\n"

    return StreamingResponse(event_gen(), media_type="text/event-stream")
