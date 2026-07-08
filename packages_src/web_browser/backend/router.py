"""Web Browser router — REST control + WebSocket screencast stream."""
from __future__ import annotations

import json
import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

from core.api import ApiError, ok
from core.audit import record_audit
from core.auth import require_admin
from core.jobs import jobs
from core.security import verify_token
from core import user_model

from . import logic

logger = logging.getLogger(__name__)

router = APIRouter()

_INSTALL_KIND = "web_browser.install_chromium"


class NavigateRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048)


class StartRequest(BaseModel):
    width: int = Field(default=1280, ge=320, le=1920)
    height: int = Field(default=720, ge=240, le=1080)
    url: Optional[str] = Field(default=None, max_length=2048)


async def _install_chromium_handler(job) -> Dict[str, Any]:
    return await logic.install_chromium(job)


jobs.register(_INSTALL_KIND, _install_chromium_handler)


@router.get("/status")
def get_status(_user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    return ok(logic.get_status())


@router.post("/start")
async def start_browser(
    req: StartRequest,
    user: Dict[str, Any] = Depends(require_admin),
) -> Dict[str, Any]:
    try:
        await logic.session.ensure_started(req.width, req.height)
        current_url = logic.session.current_url()
        if req.url:
            current_url = await logic.session.navigate(req.url)
            record_audit(
                "web_browser.navigate",
                module="web_browser",
                target=current_url,
                actor=user.get("username"),
                actor_id=user.get("id"),
            )
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    except RuntimeError as exc:
        raise ApiError("SERVICE_ERROR", str(exc), http_status=503)
    record_audit(
        "web_browser.start",
        module="web_browser",
        target="chromium",
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok({"running": True, "current_url": current_url})


@router.post("/stop")
async def stop_browser(user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    await logic.session.stop()
    record_audit(
        "web_browser.stop",
        module="web_browser",
        target="chromium",
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok({"running": False})


@router.post("/navigate")
async def navigate(req: NavigateRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    try:
        url = await logic.session.navigate(req.url)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    except RuntimeError as exc:
        raise ApiError("SERVICE_ERROR", str(exc), http_status=503)
    record_audit(
        "web_browser.navigate",
        module="web_browser",
        target=url,
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok({"url": url})


@router.post("/back")
async def go_back(user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    await logic.session.go_back()
    return ok({"url": logic.session.current_url()})


@router.post("/forward")
async def go_forward(user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    await logic.session.go_forward()
    return ok({"url": logic.session.current_url()})


@router.post("/reload")
async def reload_page(user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    await logic.session.reload()
    return ok({"url": logic.session.current_url()})


@router.post("/install")
def start_chromium_install(user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    if not logic.is_playwright_installed():
        raise ApiError(
            "SERVICE_ERROR",
            "Playwright Python package is missing. Reinstall the module from App Store.",
            http_status=503,
        )
    existing = logic.session.get_install_job_id()
    if existing:
        job = jobs.get(existing)
        if job and job.get("status") in ("queued", "running"):
            return ok({"job_id": existing, "already_running": True})

    job = jobs.submit(
        kind=_INSTALL_KIND,
        module="web_browser",
        title="Install Chromium browser",
        actor=user.get("username"),
        handler=_install_chromium_handler,
    )
    logic.session.set_install_job_id(job.id)
    record_audit(
        "web_browser.chromium.install",
        module="web_browser",
        target="chromium",
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok({"job_id": job.id})


@router.get("/install")
def get_chromium_install_status(
    job_id: Optional[str] = None,
    _user: Dict[str, Any] = Depends(require_admin),
) -> Dict[str, Any]:
    jid = job_id or logic.session.get_install_job_id()
    if not jid:
        return ok({"job": None, "chromium_installed": logic.is_chromium_installed()})
    job = jobs.get(jid, include_logs=True)
    return ok({"job": job, "chromium_installed": logic.is_chromium_installed()})


def _ws_user_from_token(token: Optional[str]) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        return None
    user = user_model.get_user_by_username(payload["sub"])
    if not user or user.get("role") != "superadmin":
        return None
    return user


@router.websocket("/ws")
async def browser_websocket(websocket: WebSocket):
    user = _ws_user_from_token(websocket.query_params.get("access_token"))
    if not user:
        await websocket.close(code=4401)
        return

    await websocket.accept()
    conn_id = logic.new_connection_id()
    evicted = logic.session.claim_connection(conn_id)
    if evicted:
        await websocket.send_json({"type": "info", "message": "Took over shared browser session."})

    async def send_event(event: Dict[str, Any]) -> None:
        if logic.session.active_connection != conn_id:
            return
        try:
            await websocket.send_json(event)
        except Exception:
            pass

    logic.session.set_frame_callback(send_event)

    try:
        if not logic.session.is_running():
            await logic.session.ensure_started()
        await websocket.send_json(
            {
                "type": "ready",
                "url": logic.session.current_url(),
                "viewport": {"width": logic.session.width, "height": logic.session.height},
            }
        )

        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Invalid JSON"})
                continue
            try:
                await logic.session.handle_input(msg)
                if msg.get("type") == "navigate":
                    record_audit(
                        "web_browser.navigate",
                        module="web_browser",
                        target=str(msg.get("url", "")),
                        actor=user.get("username"),
                        actor_id=user.get("id"),
                    )
            except ValueError as exc:
                await websocket.send_json({"type": "error", "message": str(exc)})
            except Exception as exc:
                logger.exception("Web browser input error")
                await websocket.send_json({"type": "error", "message": str(exc)})
    except WebSocketDisconnect:
        pass
    finally:
        logic.session.release_connection(conn_id)
        if logic.session.active_connection is None:
            logic.session.set_frame_callback(None)
