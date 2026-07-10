"""GParted-style operation queue: validate then apply disk mutations in order."""
from __future__ import annotations

import re
import uuid
from typing import Any, Dict, List, Optional, TYPE_CHECKING

from .logic import StorageManagerError, _SHRINKABLE_FSTYPES

if TYPE_CHECKING:
    from .logic import StorageService

_VALID_OPS = frozenset({
    "initialize",
    "create",
    "delete",
    "resize",
    "format",
    "label",
    "set_boot",
})

_MIB_RE = re.compile(r"^([\d.]+)\s*(MiB|GiB|MB|GB|KiB|KB)?$", re.IGNORECASE)


def _parse_mib(value: str) -> Optional[float]:
    raw = (value or "").strip()
    if not raw or raw.endswith("%"):
        return None
    match = _MIB_RE.match(raw)
    if not match:
        return None
    num = float(match.group(1))
    unit = (match.group(2) or "MiB").lower()
    if unit in ("gib", "gb"):
        return num * 1024.0
    if unit in ("kib", "kb"):
        return num / 1024.0
    return num


def _preview_command(op: str, payload: Dict[str, Any]) -> str:
    disk = payload.get("disk_name") or ""
    device = payload.get("device") or ""
    params = payload.get("params") or {}
    if op == "initialize":
        table = params.get("table_type") or "gpt"
        return f"parted /dev/{disk} mklabel {table}"
    if op == "create":
        ptype = params.get("partition_type") or "linux"
        return (
            f"parted /dev/{disk} mkpart primary "
            f"({ptype}) {params.get('start', '?')} {params.get('end', '?')}"
        )
    if op == "delete":
        return f"parted rm {device}"
    if op == "resize":
        return f"parted resizepart {device} {params.get('end', '?')}"
    if op == "format":
        return f"mkfs.{params.get('fstype', 'ext4')} {device}"
    if op == "label":
        return f"label {device} → {params.get('label', '')}"
    if op == "set_boot":
        state = "on" if params.get("active", True) else "off"
        return f"parted set boot {state} {device}"
    return op


def _validate_create_range(service: "StorageService", disk_name: str, start: str, end: str) -> Optional[str]:
    try:
        detail = service.get_disk_partitions_detail(disk_name)
    except StorageManagerError as exc:
        return str(exc)
    gaps = detail.get("unallocated") or []
    if not gaps:
        return "No unallocated space on this disk."
    start_mib = _parse_mib(start)
    end_mib = _parse_mib(end)
    if start_mib is None or end_mib is None:
        if end.strip().endswith("%"):
            return None
        return "Use MiB/GiB values (e.g. 1024MiB) for validation."
    if end_mib <= start_mib:
        return "End must be greater than start."
    for gap in gaps:
        gs = float(gap.get("start_mib") or 0)
        ge = float(gap.get("end_mib") or 0)
        if start_mib >= gs - 1 and end_mib <= ge + 1:
            return None
    return "Start/end do not fit in an unallocated region."


def _validate_single(service: "StorageService", index: int, raw: Dict[str, Any]) -> Dict[str, Any]:
    op = str(raw.get("op") or "").strip().lower()
    entry: Dict[str, Any] = {
        "index": index,
        "op": op,
        "status": "ok",
        "message": "",
        "preview": _preview_command(op, raw),
    }
    if op not in _VALID_OPS:
        entry["status"] = "error"
        entry["message"] = f"Unknown operation: {op}"
        return entry

    disk_name = (raw.get("disk_name") or "").strip()
    device = (raw.get("device") or "").strip()
    confirm = (raw.get("confirm_token") or "").strip()
    params = raw.get("params") or {}

    try:
        if op == "initialize":
            if not disk_name:
                raise StorageManagerError("disk_name required.", code="invalid_target")
            if confirm != disk_name:
                raise StorageManagerError("confirm_token must match disk name.", code="confirm_mismatch")
            disk = service._disk_record(disk_name)
            if disk.get("is_system_disk"):
                raise StorageManagerError("Operation blocked on the system disk.", code="protected_disk")

        elif op == "create":
            if not disk_name:
                raise StorageManagerError("disk_name required.", code="invalid_target")
            if confirm != disk_name:
                raise StorageManagerError("confirm_token must match disk name.", code="confirm_mismatch")
            disk = service._disk_record(disk_name)
            if disk.get("is_system_disk"):
                raise StorageManagerError("Cannot partition the system disk.", code="protected_disk")
            start = str(params.get("start") or "1MiB")
            end = str(params.get("end") or "100%")
            ptype = str(params.get("partition_type") or "linux").lower()
            range_err = _validate_create_range(service, disk_name, start, end)
            if range_err:
                entry["status"] = "warning" if end.endswith("%") else "error"
                entry["message"] = range_err
            if ptype == "efi":
                start_mib = _parse_mib(start)
                end_mib = _parse_mib(end)
                if start_mib is not None and end_mib is not None and (end_mib - start_mib) < 100:
                    note = "EFI partition should be at least 100 MiB."
                    if entry["message"]:
                        entry["message"] = f"{entry['message']} {note}"
                    else:
                        entry["status"] = "warning"
                        entry["message"] = note

        elif op in {"delete", "resize", "format", "label", "set_boot"}:
            if not device:
                raise StorageManagerError("device required.", code="invalid_device")
            _, name = service._normalize_device(device)
            if confirm and confirm != name:
                raise StorageManagerError("confirm_token must match partition name.", code="confirm_mismatch")
            row = service._find_block(name)
            if not row and op != "delete":
                raise StorageManagerError("Device not found.", code="device_not_found")
            parent = service._parent_disk_name(name)
            if parent:
                disk = service._disk_record(parent)
                if disk.get("is_system_disk"):
                    raise StorageManagerError("Operation blocked on the system disk.", code="protected_disk")
            if op == "delete" and row and row.get("mountpoint"):
                entry["status"] = "error"
                entry["message"] = "Partition is mounted. Unmount before delete."
            if op == "format" and row and row.get("mountpoint"):
                entry["status"] = "error"
                entry["message"] = "Partition is mounted. Unmount before format."
            if op == "resize":
                end_val = str(params.get("end") or "").strip()
                if not end_val:
                    entry["status"] = "error"
                    entry["message"] = "Resize requires params.end."
                elif row and parent and not end_val.endswith("%"):
                    try:
                        num = service._parted_partition_number(parent, name)
                        _, cur_end = service._partition_start_end_mib(parent, num)
                        target = service._parse_mib_token(end_val)
                        if target is not None and cur_end is not None and target < cur_end - 0.5:
                            if row.get("mountpoint"):
                                entry["status"] = "error"
                                entry["message"] = "Unmount partition before shrink."
                            else:
                                fstype = service._normalize_fstype(row.get("fstype")) or ""
                                if fstype and fstype not in _SHRINKABLE_FSTYPES:
                                    entry["status"] = "error"
                                    entry["message"] = (
                                        f"Shrink not supported for {fstype}. "
                                        "Supported filesystems: ext4, ntfs."
                                    )
                                elif fstype == "xfs":
                                    entry["status"] = "error"
                                    entry["message"] = "XFS cannot shrink."
                    except StorageManagerError:
                        pass

    except StorageManagerError as exc:
        entry["status"] = "error"
        entry["message"] = str(exc)
        entry["code"] = exc.code

    return entry


def validate_operations(service: "StorageService", operations: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not operations:
        raise StorageManagerError("No operations to validate.", code="invalid_target")
    if len(operations) > 32:
        raise StorageManagerError("Too many operations (max 32).", code="invalid_target")

    results = [_validate_single(service, idx, op) for idx, op in enumerate(operations)]
    has_error = any(r["status"] == "error" for r in results)
    return {
        "valid": not has_error,
        "operations": results,
        "summary": f"{sum(1 for r in results if r['status'] == 'ok')} ok, "
        f"{sum(1 for r in results if r['status'] == 'warning')} warnings, "
        f"{sum(1 for r in results if r['status'] == 'error')} errors",
    }


def _execute_one(service: "StorageService", raw: Dict[str, Any]) -> Dict[str, Any]:
    op = str(raw.get("op") or "").strip().lower()
    disk_name = (raw.get("disk_name") or "").strip()
    device = (raw.get("device") or "").strip()
    confirm = (raw.get("confirm_token") or "").strip()
    params = raw.get("params") or {}

    if op == "initialize":
        table = str(params.get("table_type") or "gpt").lower()
        if table == "mbr":
            table = "msdos"
        return service.initialize_disk(disk_name, table, confirm)
    if op == "create":
        return service.create_partition(
            disk_name,
            str(params.get("start") or "1MiB"),
            str(params.get("end") or "100%"),
            confirm,
            bool(params.get("initialize_gpt", False)),
            str(params.get("partition_type") or "linux"),
        )
    if op == "delete":
        return service.delete_partition(
            device,
            confirm,
            params.get("partition_number"),
        )
    if op == "resize":
        return service.resize_partition(
            device,
            str(params.get("end") or "100%"),
            bool(params.get("grow_filesystem", True)),
            confirm,
            bool(params.get("shrink_filesystem", True)),
        )
    if op == "format":
        return service.format_device(
            device,
            str(params.get("fstype") or "ext4"),
            params.get("label"),
            confirm,
        )
    if op == "label":
        return service.change_partition_label(device, str(params.get("label") or ""), confirm)
    if op == "set_boot":
        return service.set_partition_boot(
            device,
            bool(params.get("active", True)),
            confirm,
            params.get("partition_number"),
        )
    raise StorageManagerError(f"Unknown operation: {op}", code="invalid_target")


def apply_operations(service: "StorageService", operations: List[Dict[str, Any]]) -> Dict[str, Any]:
    validation = validate_operations(service, operations)
    if not validation["valid"]:
        raise StorageManagerError(
            "Validation failed. Fix errors before applying.",
            code="validation_failed",
        )

    log: List[Dict[str, Any]] = []
    applied = 0
    for idx, raw in enumerate(operations):
        op = str(raw.get("op") or "").strip().lower()
        preview = _preview_command(op, raw)
        try:
            result = _execute_one(service, raw)
            log.append({
                "index": idx,
                "op": op,
                "status": "success",
                "preview": preview,
                "message": result.get("message") or "OK",
                "result": result,
            })
            applied += 1
        except StorageManagerError as exc:
            log.append({
                "index": idx,
                "op": op,
                "status": "failed",
                "preview": preview,
                "message": str(exc),
                "code": exc.code,
            })
            return {
                "applied": applied,
                "failed_at": idx,
                "completed": False,
                "log": log,
            }
        except Exception as exc:
            log.append({
                "index": idx,
                "op": op,
                "status": "failed",
                "preview": preview,
                "message": str(exc),
                "code": "internal_error",
            })
            return {
                "applied": applied,
                "failed_at": idx,
                "completed": False,
                "log": log,
            }

    return {
        "applied": applied,
        "failed_at": None,
        "completed": True,
        "log": log,
    }


def new_operation_id() -> str:
    return uuid.uuid4().hex[:12]
