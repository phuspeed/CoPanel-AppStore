"""ClamAV router."""
from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, Depends

from core.api import ApiError, ok
from core.audit import record_audit
from core.auth import require_admin, require_module

from . import logic
from .schemas import ClamAVSettingsRequest, QuarantineActionRequest, ScanRequest, UpdateSignaturesRequest

router = APIRouter()


@router.get("/version")
def get_version(_user: Dict[str, Any] = Depends(require_module("clamav"))) -> Dict[str, Any]:
    return ok(logic.get_module_version())


@router.get("/overview")
def get_overview(_user: Dict[str, Any] = Depends(require_module("clamav"))) -> Dict[str, Any]:
    return ok(logic.get_overview())


@router.get("/settings")
def get_settings(_user: Dict[str, Any] = Depends(require_module("clamav"))) -> Dict[str, Any]:
    return ok(logic.load_settings())


@router.put("/settings")
def put_settings(req: ClamAVSettingsRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    try:
        result = logic.save_settings(req.model_dump())
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit(
        "clamav.settings.save",
        module="clamav",
        target="settings",
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok(result)


@router.post("/update-signatures")
def update_signatures(
    _req: UpdateSignaturesRequest,
    user: Dict[str, Any] = Depends(require_admin),
) -> Dict[str, Any]:
    try:
        result = logic.start_signature_update(user.get("username"))
    except RuntimeError as exc:
        raise ApiError("SERVICE_ERROR", str(exc), http_status=503)
    record_audit(
        "clamav.signatures.update",
        module="clamav",
        target="freshclam",
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok(result)


@router.post("/scan")
def start_scan(req: ScanRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    try:
        result = logic.create_scan(req.model_dump(), user.get("username"))
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    except RuntimeError as exc:
        raise ApiError("SERVICE_ERROR", str(exc), http_status=503)
    record_audit(
        "clamav.scan.start",
        module="clamav",
        target=req.path,
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"auto_quarantine": req.auto_quarantine, "recursive": req.recursive},
    )
    return ok(result)


@router.get("/scan/{scan_id}")
def get_scan(scan_id: str, _user: Dict[str, Any] = Depends(require_module("clamav"))) -> Dict[str, Any]:
    try:
        return ok(logic.get_scan(scan_id))
    except ValueError as exc:
        raise ApiError("NOT_FOUND", str(exc), http_status=404)


@router.get("/detections")
def get_detections(_user: Dict[str, Any] = Depends(require_module("clamav"))) -> Dict[str, Any]:
    return ok({
        "items": logic.list_detections(),
        "quarantine": logic.list_quarantine(),
    })


@router.post("/detections/quarantine")
def quarantine_detection(req: QuarantineActionRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    try:
        result = logic.quarantine_detection(req.detection_id)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit(
        "clamav.detection.quarantine",
        module="clamav",
        target=req.detection_id,
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"path": result.get("path")},
    )
    return ok(result)


@router.post("/quarantine/restore")
def restore_quarantine(req: QuarantineActionRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    try:
        result = logic.restore_quarantine(req.detection_id)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit(
        "clamav.quarantine.restore",
        module="clamav",
        target=req.detection_id,
        actor=user.get("username"),
        actor_id=user.get("id"),
        meta={"restored_to": result.get("restored_to")},
    )
    return ok(result)


@router.post("/quarantine/delete")
def delete_quarantine(req: QuarantineActionRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    try:
        result = logic.delete_quarantine(req.detection_id)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit(
        "clamav.quarantine.delete",
        module="clamav",
        target=req.detection_id,
        actor=user.get("username"),
        actor_id=user.get("id"),
    )
    return ok(result)
