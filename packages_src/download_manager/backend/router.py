"""Download Manager API."""
from __future__ import annotations

import json
import logging
import os
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, File, Query, UploadFile

from core.api import ApiError, ok
from core.audit import record_audit
from core.auth import require_module

from . import logic
from ._oauth_page import oauth_result_page, safe_error_code
from .google_oauth import GoogleOAuthService, GoogleOAuthStore
from .schemas import (
    CreateHostingAccountRequest,
    CreateHostingProfileRequest,
    CreateTaskRequest,
    DetectUrlRequest,
    GoogleOAuthStartRequest,
    SaveSettingsRequest,
    UpdateHostingAccountRequest,
    UpdateHostingProfileRequest,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ----- Restricted users ----------------------------------------------------
# Superadmin keeps the global settings / any destination. Other users may only
# download into their own permitted folders (default: <home>/Downloads), see
# only their own tasks, and cannot change the global settings.

def _is_admin(user: Dict[str, Any]) -> bool:
    return user.get("role") == "superadmin"


def _check_path(path: str, user: Dict[str, Any]) -> str:
    """Validate ``path`` against the user's permitted folders (403 outside)."""
    try:
        from modules.file_manager.router import check_safe_path
    except Exception:  # pragma: no cover - File Manager missing: deny
        raise ApiError("FORBIDDEN", "Folder access check unavailable.", http_status=403)
    return check_safe_path(path, user)


def _ensure_home(user: Dict[str, Any]) -> None:
    try:
        from core.user_home import ensure_permitted_folders
    except Exception:  # older core
        return
    ensure_permitted_folders(user)


def _chown_new(paths: List[str], user: Dict[str, Any]) -> None:
    try:
        from core.user_home import chown_new
    except Exception:  # older core
        return
    chown_new(paths, user)


def _user_default_destination(user: Dict[str, Any]) -> str:
    _ensure_home(user)
    home = _check_path("", user)  # first permitted folder
    dest = os.path.join(home, "Downloads")
    dest = _check_path(dest, user)
    if not os.path.isdir(dest):
        os.makedirs(dest, exist_ok=True)
        _chown_new([dest], user)
    return dest


def _resolve_destination(requested: Optional[str], user: Dict[str, Any]) -> Optional[str]:
    """None for superadmin without a choice (global default); validated path otherwise."""
    if _is_admin(user):
        return requested
    if requested and requested.strip():
        dest = _check_path(requested.strip(), user)
        if not os.path.isdir(dest):
            os.makedirs(dest, exist_ok=True)
            _chown_new([dest], user)
        return dest
    return _user_default_destination(user)


def _owns_task(task: Optional[Dict[str, Any]], user: Dict[str, Any]) -> bool:
    if not task:
        return False
    return _is_admin(user) or (task.get("created_by") or "") == (user.get("username") or "")


def _get_own_task(task_id: str, user: Dict[str, Any]) -> Dict[str, Any]:
    task = logic.get_task(task_id)
    if not _owns_task(task, user):
        raise ApiError("NOT_FOUND", "Task not found", http_status=404)
    return task


@router.get("/settings")
def get_settings(user: Dict[str, Any] = Depends(require_module("download_manager"))) -> Dict[str, Any]:
    settings = logic.get_settings()
    if not _is_admin(user):
        settings = dict(settings)
        settings["destination_folder"] = _user_default_destination(user)
    return ok(settings)


@router.put("/settings")
def save_settings(
    req: SaveSettingsRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    if not _is_admin(user):
        raise ApiError("FORBIDDEN", "Only an administrator can change Download Manager settings.", http_status=403)
    data = req.model_dump(exclude_none=True)
    saved = logic.save_settings(data)
    record_audit("download.settings", module="download_manager", actor=user.get("username"))
    return ok(saved)


@router.get("/tasks")
def list_tasks(
    filter: str = Query("all", alias="filter"),
    search: str = Query(""),
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    tasks = logic.list_tasks(filter_key=filter, search=search)
    if not _is_admin(user):
        tasks = [t for t in tasks if _owns_task(t, user)]
    return ok(tasks)


@router.post("/tasks")
def create_task(
    req: CreateTaskRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    data = req.model_dump()
    data["destination"] = _resolve_destination(data.get("destination"), user)
    try:
        task = logic.create_task(data, username=user.get("username") or "")
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit(
        "download.add",
        module="download_manager",
        target=task.get("id"),
        actor=user.get("username"),
        meta={"url": req.url},
    )
    return ok(task)


@router.post("/tasks/upload-torrent")
async def upload_torrent(
    file: UploadFile = File(...),
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    content = await file.read()
    destination = _resolve_destination(None, user)
    try:
        task = logic.create_task_from_torrent_bytes(
            content,
            file.filename or "upload.torrent",
            username=user.get("username") or "",
            destination=destination,
        )
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit(
        "download.torrent_upload",
        module="download_manager",
        target=task.get("id"),
        actor=user.get("username"),
    )
    return ok(task)


@router.delete("/tasks/completed")
def clear_completed(
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    if _is_admin(user):
        count = logic.clear_completed()
    else:
        count = 0
        for t in logic.list_tasks(filter_key="completed", limit=10000):
            if _owns_task(t, user) and logic.delete_task(t["id"]):
                count += 1
    record_audit("download.clear_completed", module="download_manager", actor=user.get("username"), meta={"count": count})
    return ok({"deleted": count})


@router.get("/tasks/{task_id}")
def get_task(
    task_id: str,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    return ok(_get_own_task(task_id, user))


@router.get("/engine/status")
def engine_status(
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    return ok(logic.get_engine_status())


@router.post("/tasks/{task_id}/{action}")
def task_action(
    task_id: str,
    action: str,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    if action not in ("pause", "resume", "stop"):
        raise ApiError("VALIDATION_ERROR", f"Unknown action: {action}", http_status=400)
    _get_own_task(task_id, user)
    try:
        task = logic.set_task_status(task_id, action)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    if not task:
        raise ApiError("NOT_FOUND", "Task not found", http_status=404)
    record_audit(
        f"download.{action}",
        module="download_manager",
        target=task_id,
        actor=user.get("username"),
    )
    return ok(task)


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    _get_own_task(task_id, user)
    if not logic.delete_task(task_id):
        raise ApiError("NOT_FOUND", "Task not found", http_status=404)
    record_audit("download.delete", module="download_manager", target=task_id, actor=user.get("username"))
    return ok({"deleted": True})


@router.post("/detect-url")
def detect_url(
    req: DetectUrlRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    return ok(logic.detect_url(req.url))


@router.get("/folders/browse")
def browse_folders(
    path: str = Query(""),
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    if _is_admin(user):
        return ok(logic.browse_folders(path))
    base = _check_path(path, user) if path else _user_default_destination(user)
    if not os.path.isdir(base):
        raise ApiError("NOT_FOUND", "Folder not found", http_status=404)
    data = logic.browse_folders(base)
    parent = data.get("parent")
    if parent:
        try:
            _check_path(parent, user)
        except Exception:
            parent = None
    data["parent"] = parent
    home = _check_path("", user)
    data["volumes"] = [{"label": home, "path": home}]
    return ok(data)


@router.get("/file-hosting")
def list_hosting(
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    profiles = logic.list_hosting_profiles()
    detailed = []
    for p in profiles:
        detailed.append({**p, "accounts": logic.list_hosting_accounts(p["id"])})
    return ok(detailed)


@router.post("/file-hosting")
def create_hosting(
    req: CreateHostingProfileRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    payload = req.model_dump()
    if payload.get("api_config"):
        payload["api_config"] = payload["api_config"]
    profile = logic.create_hosting_profile(payload)
    record_audit("download.hosting.create", module="download_manager", target=profile.get("id"), actor=user.get("username"))
    return ok(profile)


@router.put("/file-hosting/{profile_id}")
def update_hosting(
    profile_id: str,
    req: UpdateHostingProfileRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    profile = logic.update_hosting_profile(profile_id, req.model_dump(exclude_none=True))
    if not profile:
        raise ApiError("NOT_FOUND", "Profile not found", http_status=404)
    return ok(profile)


@router.delete("/file-hosting/{profile_id}")
def delete_hosting(
    profile_id: str,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    if not logic.delete_hosting_profile(profile_id):
        raise ApiError("NOT_FOUND", "Profile not found", http_status=404)
    return ok({"deleted": True})


@router.post("/file-hosting/{profile_id}/accounts")
def create_account(
    profile_id: str,
    req: CreateHostingAccountRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    if not logic.get_hosting_profile(profile_id):
        raise ApiError("NOT_FOUND", "Profile not found", http_status=404)
    account = logic.create_hosting_account(profile_id, req.model_dump())
    return ok(account)


@router.put("/file-hosting/{profile_id}/accounts/{account_id}")
def update_account(
    profile_id: str,
    account_id: str,
    req: UpdateHostingAccountRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    account = logic.update_hosting_account(profile_id, account_id, req.model_dump(exclude_none=True))
    if not account:
        raise ApiError("NOT_FOUND", "Account not found", http_status=404)
    return ok(account)


@router.delete("/file-hosting/{profile_id}/accounts/{account_id}")
def delete_account(
    profile_id: str,
    account_id: str,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    if not logic.delete_hosting_account(profile_id, account_id):
        raise ApiError("NOT_FOUND", "Account not found", http_status=404)
    return ok({"deleted": True})


@router.post("/oauth/google/start")
def oauth_google_start(
    req: GoogleOAuthStartRequest,
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    try:
        result = GoogleOAuthService.start_oauth(
            req.client_id, req.client_secret, req.redirect_uri, req.account_name
        )
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    return ok(result)


@router.get("/oauth/google/callback")
def oauth_google_callback(code: str = "", state: str = "", error: str = ""):
    """Public OAuth popup callback. Never reflects request text as HTML."""
    kind = "copanel_dm_google_oauth"
    if error:
        return oauth_result_page(
            {"type": kind, "ok": False, "error": safe_error_code(error)},
            "Authorization failed. You can close this window.",
            400,
        )
    try:
        result = GoogleOAuthService.exchange_code(code=code, state=state)
        return oauth_result_page(
            {"type": kind, "ok": True, "account_name": str(result["account_name"])},
            "Google connected. You can close this window.",
        )
    except ValueError:
        logger.warning("Download Manager OAuth callback rejected (invalid code/state)")
        return oauth_result_page(
            {"type": kind, "ok": False, "error": "invalid_request"},
            "Authorization failed: the request was invalid or has expired.",
            400,
        )
    except Exception:
        logger.exception("Download Manager OAuth callback failed")
        return oauth_result_page(
            {"type": kind, "ok": False, "error": "server_error"},
            "OAuth callback failed. Check the CoPanel log.",
            500,
        )


@router.get("/oauth/google/status")
def oauth_google_status(
    user: Dict[str, Any] = Depends(require_module("download_manager")),
) -> Dict[str, Any]:
    return ok({
        "configured": GoogleOAuthService.oauth_configured(),
        "connected": GoogleOAuthService.get_access_token() is not None,
        "accounts": GoogleOAuthStore.list_status(),
    })
