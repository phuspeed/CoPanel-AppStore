"""ClamAV logic: status, signature updates, scans, detections, quarantine."""
from __future__ import annotations

import asyncio
import json
import os
import re
import shutil
import signal
import subprocess
import threading
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from core.jobs import jobs

try:
    from core.jobs import JobCancelled
except ImportError:
    class JobCancelled(Exception):
        """Raised when a job handler stops after cooperative cancel (legacy core fallback)."""

IS_WINDOWS = os.name == "nt"
CONFIG_DIR = Path("./test_nginx/clamav") if IS_WINDOWS else Path("/opt/copanel/config/clamav")
DEFAULT_QUARANTINE_DIR = (
    Path("./test_nginx/clamav/quarantine") if IS_WINDOWS else Path("/opt/copanel/data/clamav/quarantine")
)
SETTINGS_PATH = CONFIG_DIR / "settings.json"
SCANS_PATH = CONFIG_DIR / "scans.json"
_LOCK = threading.Lock()

DEFAULT_SETTINGS: Dict[str, Any] = {
    "quarantine_dir": str(DEFAULT_QUARANTINE_DIR),
    "default_scan_targets": ["/home", "/var/www"] if not IS_WINDOWS else ["./test_nginx"],
    "exclude_paths": ["/proc", "/sys", "/dev", "/run", "/snap"] if not IS_WINDOWS else [],
    "retention_days": 30,
    "max_file_size_mb": 100,
    "include_archives": True,
    "preferred_engine": "auto",
}

SAFE_PRESET_PATHS = frozenset(["/home", "/var/www", "/srv", "/opt"] if not IS_WINDOWS else ["./test_nginx"])
FORBIDDEN_SCAN_ROOTS = frozenset(["/", "/bin", "/boot", "/dev", "/etc", "/lib", "/proc", "/run", "/sys", "/usr"])
CLAMD_SERVICE_NAMES = ("clamav-daemon", "clamd")
FRESHCLAM_SERVICE_NAMES = ("clamav-freshclam", "freshclam")


def _ensure_storage() -> None:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    if not SETTINGS_PATH.exists():
        _write_json(SETTINGS_PATH, DEFAULT_SETTINGS)
    if not SCANS_PATH.exists():
        _write_json(SCANS_PATH, {"items": []})
    settings = _read_json(SETTINGS_PATH, dict(DEFAULT_SETTINGS))
    quarantine_dir = str((settings or {}).get("quarantine_dir") or DEFAULT_SETTINGS["quarantine_dir"])
    Path(quarantine_dir).mkdir(parents=True, exist_ok=True)


def _read_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def _write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=True, indent=2), encoding="utf-8")
    tmp.replace(path)


def _load_scans() -> Dict[str, Any]:
    _ensure_storage()
    data = _read_json(SCANS_PATH, {"items": []})
    if not isinstance(data, dict):
        return {"items": []}
    items = data.get("items")
    if not isinstance(items, list):
        data["items"] = []
    return data


def _save_scans(data: Dict[str, Any]) -> None:
    _write_json(SCANS_PATH, data)


def load_settings() -> Dict[str, Any]:
    _ensure_storage()
    data = _read_json(SETTINGS_PATH, dict(DEFAULT_SETTINGS))
    if not isinstance(data, dict):
        data = dict(DEFAULT_SETTINGS)
    out = dict(DEFAULT_SETTINGS)
    out.update(data)
    validated = validate_settings(out)
    Path(validated["quarantine_dir"]).mkdir(parents=True, exist_ok=True)
    return validated


def validate_settings(data: Dict[str, Any]) -> Dict[str, Any]:
    out = dict(DEFAULT_SETTINGS)
    out.update(data or {})

    quarantine_dir = Path(str(out.get("quarantine_dir") or DEFAULT_SETTINGS["quarantine_dir"])).expanduser()
    if not quarantine_dir.is_absolute() and not IS_WINDOWS:
        raise ValueError("Quarantine directory must be an absolute path.")
    out["quarantine_dir"] = str(quarantine_dir)

    targets = out.get("default_scan_targets") or []
    if not isinstance(targets, list):
        raise ValueError("default_scan_targets must be a list.")
    out["default_scan_targets"] = [str(Path(str(x)).expanduser()) if str(x).strip() else "" for x in targets if str(x).strip()]

    excludes = out.get("exclude_paths") or []
    if not isinstance(excludes, list):
        raise ValueError("exclude_paths must be a list.")
    out["exclude_paths"] = [str(Path(str(x)).expanduser()) if str(x).strip() else "" for x in excludes if str(x).strip()]

    retention_days = int(out.get("retention_days") or DEFAULT_SETTINGS["retention_days"])
    if retention_days < 1 or retention_days > 365:
        raise ValueError("retention_days must be between 1 and 365.")
    out["retention_days"] = retention_days

    max_file_size_mb = int(out.get("max_file_size_mb") or DEFAULT_SETTINGS["max_file_size_mb"])
    if max_file_size_mb < 1 or max_file_size_mb > 2048:
        raise ValueError("max_file_size_mb must be between 1 and 2048.")
    out["max_file_size_mb"] = max_file_size_mb

    out["include_archives"] = bool(out.get("include_archives", True))
    preferred_engine = str(out.get("preferred_engine") or "auto").strip().lower()
    if preferred_engine not in {"auto", "clamscan", "clamdscan"}:
        raise ValueError("preferred_engine must be auto, clamscan, or clamdscan.")
    out["preferred_engine"] = preferred_engine
    return out


def save_settings(data: Dict[str, Any]) -> Dict[str, Any]:
    settings = validate_settings(data)
    Path(settings["quarantine_dir"]).mkdir(parents=True, exist_ok=True)
    _write_json(SETTINGS_PATH, settings)
    return settings


def get_module_version() -> Dict[str, str]:
    vf = Path(__file__).resolve().parent / "version.txt"
    version = vf.read_text(encoding="utf-8").strip() if vf.is_file() else "1.0.0"
    return {"module": "clamav", "version": version}


def _run(cmd: List[str], *, timeout: int = 120) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, check=False)


def _terminate_subprocess(proc: subprocess.Popen) -> None:
    if proc.poll() is not None:
        return
    try:
        proc.send_signal(signal.SIGINT)
    except (ProcessLookupError, OSError):
        return
    try:
        proc.wait(timeout=5)
        return
    except subprocess.TimeoutExpired:
        pass
    proc.terminate()
    try:
        proc.wait(timeout=8)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.wait(timeout=5)


def _stream_command_output(job: Any, cmd: List[str]) -> Tuple[List[str], int]:
    job.log(" ".join(cmd))
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    lines: List[str] = []
    try:
        while True:
            if job.cancel_requested():
                _terminate_subprocess(proc)
                job.update(message="Operation cancelled")
                raise JobCancelled()
            line = proc.stdout.readline() if proc.stdout else ""
            if not line:
                if proc.poll() is not None:
                    break
                time.sleep(0.1)
                continue
            clean = line.rstrip()
            lines.append(clean)
            if clean:
                job.log(clean)
    finally:
        if proc.stdout:
            proc.stdout.close()
    return lines, proc.wait(timeout=10)


def _freshclam_standalone_cmd() -> List[str]:
    freshclam = _which("freshclam")
    if not freshclam:
        raise RuntimeError("freshclam not installed.")
    return [freshclam, "--stdout"]


def _systemctl_action(action: str, service_name: str, *, timeout: int = 120) -> subprocess.CompletedProcess:
    return _run(["systemctl", action, service_name], timeout=timeout)


def _exit_code_detail(code: int, lines: List[str]) -> str:
    tail = "\n".join(lines[-8:]).strip()
    detail = f" Exit output: {tail}" if tail else ""
    if code < 0:
        sig = -code
        if sig == signal.SIGSEGV:
            return f" Process crashed (segmentation fault).{detail}"
        return f" Process terminated by signal {sig}.{detail}"
    return detail


def _which(*candidates: str) -> Optional[str]:
    for name in candidates:
        path = shutil.which(name)
        if path:
            return path
    return None


def _parse_version_line(raw: str) -> Dict[str, Any]:
    line = (raw or "").strip().splitlines()[0] if (raw or "").strip() else ""
    match = re.search(r"ClamAV\s+([^\s/]+)/(\d+)/(.*)$", line)
    if match:
        return {
            "raw": line,
            "engine_version": match.group(1),
            "signature_version": match.group(2),
            "signature_date": match.group(3).strip(),
        }
    return {
        "raw": line,
        "engine_version": None,
        "signature_version": None,
        "signature_date": None,
    }


def _systemctl_status(names: Tuple[str, ...]) -> Dict[str, Any]:
    if IS_WINDOWS:
        return {"service": None, "status": "unsupported"}
    if not shutil.which("systemctl"):
        return {"service": None, "status": "unavailable"}
    for name in names:
        proc = _run(["systemctl", "is-active", name], timeout=20)
        value = (proc.stdout or proc.stderr or "").strip()
        if proc.returncode == 0:
            return {"service": name, "status": value or "active"}
        if value and value not in {"inactive", "unknown"}:
            return {"service": name, "status": value}
    return {"service": names[0], "status": "inactive"}


def _select_scan_engine(settings: Dict[str, Any]) -> Dict[str, Any]:
    preferred = settings.get("preferred_engine", "auto")
    clamscan = _which("clamscan")
    clamdscan = _which("clamdscan")
    daemon_status = _systemctl_status(CLAMD_SERVICE_NAMES)

    if preferred == "clamscan" and clamscan:
        return {"name": "clamscan", "bin": clamscan}
    if preferred == "clamdscan" and clamdscan and daemon_status.get("status") == "active":
        return {"name": "clamdscan", "bin": clamdscan}
    if preferred == "auto" and clamdscan and daemon_status.get("status") == "active":
        return {"name": "clamdscan", "bin": clamdscan}
    if clamscan:
        return {"name": "clamscan", "bin": clamscan}
    if clamdscan:
        return {"name": "clamdscan", "bin": clamdscan}
    return {"name": None, "bin": None}


def _recent_scans(limit: int = 5) -> List[Dict[str, Any]]:
    items = _load_scans().get("items", [])
    ordered = sorted(items, key=lambda row: row.get("created_at", 0), reverse=True)
    return [
        {
            "id": row.get("id"),
            "status": row.get("status"),
            "path": row.get("path"),
            "engine": row.get("engine"),
            "infected_count": (row.get("summary") or {}).get("infected_count", 0),
            "created_at": row.get("created_at"),
            "finished_at": row.get("finished_at"),
        }
        for row in ordered[:limit]
    ]


def get_overview() -> Dict[str, Any]:
    settings = load_settings()
    clamscan_bin = _which("clamscan")
    engine_info = _parse_version_line((_run([clamscan_bin, "--version"], timeout=20).stdout if clamscan_bin else ""))
    freshclam_bin = _which("freshclam")
    freshclam_info = _parse_version_line((_run([freshclam_bin, "--version"], timeout=20).stdout if freshclam_bin else ""))
    selected_engine = _select_scan_engine(settings)
    detections = list_detections()
    quarantined = [d for d in detections if d.get("status") == "quarantined"]
    return {
        "platform": "windows" if IS_WINDOWS else "linux",
        "installed": bool(_which("clamscan") or _which("clamdscan")),
        "engine": {
            "selected": selected_engine.get("name"),
            "clamscan_available": bool(_which("clamscan")),
            "clamdscan_available": bool(_which("clamdscan")),
            "freshclam_available": bool(freshclam_bin),
            **engine_info,
        },
        "signatures": {
            "version": engine_info.get("signature_version") or freshclam_info.get("signature_version"),
            "updated_at": engine_info.get("signature_date") or freshclam_info.get("signature_date"),
        },
        "services": {
            "clamd": _systemctl_status(CLAMD_SERVICE_NAMES),
            "freshclam": _systemctl_status(FRESHCLAM_SERVICE_NAMES),
        },
        "settings": settings,
        "recent_scans": _recent_scans(),
        "stats": {
            "total_detections": len(detections),
            "quarantined": len(quarantined),
            "pending_actions": len([d for d in detections if d.get("status") in {"detected", "restore_failed", "quarantine_failed"}]),
        },
    }


def _find_scan(scan_id: str) -> Optional[Dict[str, Any]]:
    for item in _load_scans().get("items", []):
        if item.get("id") == scan_id:
            return item
    return None


def _update_scan(scan_id: str, mutate: Any) -> Dict[str, Any]:
    with _LOCK:
        data = _load_scans()
        for idx, item in enumerate(data.get("items", [])):
            if item.get("id") == scan_id:
                updated = mutate(dict(item))
                data["items"][idx] = updated
                _save_scans(data)
                return updated
        raise ValueError("Scan not found.")


def _insert_scan(scan: Dict[str, Any]) -> Dict[str, Any]:
    with _LOCK:
        data = _load_scans()
        items = data.setdefault("items", [])
        items.insert(0, scan)
        data["items"] = items[:200]
        _save_scans(data)
    return scan


def _flatten_detections() -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for scan in _load_scans().get("items", []):
        for det in scan.get("detections", []):
            row = dict(det)
            row["scan_id"] = scan.get("id")
            row["scan_path"] = scan.get("path")
            row["scan_created_at"] = scan.get("created_at")
            out.append(row)
    out.sort(key=lambda item: item.get("detected_at", 0), reverse=True)
    return out


def list_detections() -> List[Dict[str, Any]]:
    return _flatten_detections()


def list_quarantine() -> List[Dict[str, Any]]:
    return [item for item in _flatten_detections() if item.get("status") in {"quarantined", "restore_failed"}]


def _assert_scan_path_allowed(path_value: str, settings: Dict[str, Any]) -> str:
    path = Path(path_value).expanduser()
    if not path.is_absolute() and not IS_WINDOWS:
        raise ValueError("Scan path must be absolute.")
    if not path.exists():
        raise ValueError("Scan path does not exist.")
    resolved = str(path.resolve())
    if resolved in FORBIDDEN_SCAN_ROOTS:
        raise ValueError("Refusing to scan a protected system root.")
    quarantine_dir = str(Path(settings["quarantine_dir"]).resolve())
    if resolved == quarantine_dir or resolved.startswith(quarantine_dir + os.sep):
        raise ValueError("Refusing to scan the quarantine directory.")
    return resolved


def _build_scan_command(scan: Dict[str, Any], settings: Dict[str, Any]) -> List[str]:
    engine = _select_scan_engine(settings)
    if not engine.get("bin"):
        raise RuntimeError("ClamAV scan engine not installed (need clamscan or clamdscan).")
    cmd = [engine["bin"]]
    if engine["name"] == "clamdscan":
        cmd.extend(["--fdpass", "--infected"])
    else:
        cmd.extend(["--infected", "--stdout"])
    if scan.get("recursive", True):
        cmd.append("-r")
    if not scan.get("include_archives", True):
        cmd.append("--scan-archive=no")
    max_file_size_mb = int(scan.get("max_file_size_mb") or settings["max_file_size_mb"])
    cmd.append(f"--max-filesize={max_file_size_mb}M")
    for item in settings.get("exclude_paths", []):
        item = str(item).strip()
        if item:
            cmd.append(f"--exclude-dir=^{re.escape(item)}(/|$)")
    cmd.append(scan["path"])
    return cmd


def _parse_summary(lines: List[str]) -> Dict[str, int]:
    summary = {
        "infected_count": 0,
        "scanned_count": 0,
        "error_count": 0,
    }
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("Infected files:"):
            summary["infected_count"] = int(stripped.split(":", 1)[1].strip() or 0)
        elif stripped.startswith("Scanned files:"):
            summary["scanned_count"] = int(stripped.split(":", 1)[1].strip() or 0)
        elif stripped.startswith("Total errors:"):
            summary["error_count"] = int(stripped.split(":", 1)[1].strip() or 0)
    return summary


def _parse_detection_line(line: str) -> Optional[Tuple[str, str]]:
    if not line.rstrip().endswith(" FOUND"):
        return None
    body = line.rstrip()[:-6]
    path_part, sep, sig_part = body.rpartition(": ")
    if not sep:
        return None
    return path_part.strip(), sig_part.strip()


def _move_detection_to_quarantine(scan_id: str, detection_id: str) -> Dict[str, Any]:
    settings = load_settings()
    quarantine_root = Path(settings["quarantine_dir"])
    quarantine_root.mkdir(parents=True, exist_ok=True)

    def mutate(scan: Dict[str, Any]) -> Dict[str, Any]:
        for detection in scan.get("detections", []):
            if detection.get("id") != detection_id:
                continue
            source = Path(str(detection.get("path") or "")).expanduser()
            if detection.get("status") == "quarantined":
                return scan
            if not source.exists():
                detection["status"] = "quarantine_failed"
                detection["action_error"] = "Source file no longer exists."
                return scan
            target = quarantine_root / f"{detection_id}__{source.name}"
            if target.exists():
                target = quarantine_root / f"{detection_id}__{int(time.time())}__{source.name}"
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(source), str(target))
            detection["status"] = "quarantined"
            detection["quarantine_path"] = str(target)
            detection["quarantined_at"] = time.time()
            detection["action_error"] = None
            return scan
        raise ValueError("Detection not found.")

    return _update_scan(scan_id, mutate)


def quarantine_detection(detection_id: str) -> Dict[str, Any]:
    for item in _flatten_detections():
        if item.get("id") == detection_id:
            updated = _move_detection_to_quarantine(item["scan_id"], detection_id)
            return next(det for det in updated.get("detections", []) if det.get("id") == detection_id)
    raise ValueError("Detection not found.")


def restore_quarantine(detection_id: str) -> Dict[str, Any]:
    def mutate(scan: Dict[str, Any]) -> Dict[str, Any]:
        for detection in scan.get("detections", []):
            if detection.get("id") != detection_id:
                continue
            qpath = Path(str(detection.get("quarantine_path") or ""))
            original = Path(str(detection.get("original_path") or detection.get("path") or ""))
            if detection.get("status") != "quarantined":
                raise ValueError("Detection is not in quarantine.")
            if not qpath.exists():
                raise ValueError("Quarantine file missing.")
            original.parent.mkdir(parents=True, exist_ok=True)
            target = original
            if target.exists():
                target = target.with_name(f"{target.name}.restored-{int(time.time())}")
            shutil.move(str(qpath), str(target))
            detection["status"] = "restored"
            detection["restored_to"] = str(target)
            detection["restored_at"] = time.time()
            detection["action_error"] = None
            return scan
        raise ValueError("Detection not found.")

    for item in _flatten_detections():
        if item.get("id") == detection_id:
            updated = _update_scan(item["scan_id"], mutate)
            return next(det for det in updated.get("detections", []) if det.get("id") == detection_id)
    raise ValueError("Detection not found.")


def delete_quarantine(detection_id: str) -> Dict[str, Any]:
    def mutate(scan: Dict[str, Any]) -> Dict[str, Any]:
        for detection in scan.get("detections", []):
            if detection.get("id") != detection_id:
                continue
            qpath = Path(str(detection.get("quarantine_path") or ""))
            if detection.get("status") != "quarantined":
                raise ValueError("Detection is not in quarantine.")
            if qpath.is_dir():
                shutil.rmtree(qpath)
            elif qpath.exists():
                qpath.unlink()
            detection["status"] = "deleted"
            detection["deleted_at"] = time.time()
            detection["action_error"] = None
            return scan
        raise ValueError("Detection not found.")

    for item in _flatten_detections():
        if item.get("id") == detection_id:
            updated = _update_scan(item["scan_id"], mutate)
            return next(det for det in updated.get("detections", []) if det.get("id") == detection_id)
    raise ValueError("Detection not found.")


def create_scan(payload: Dict[str, Any], actor: Optional[str]) -> Dict[str, Any]:
    settings = load_settings()
    path = _assert_scan_path_allowed(payload["path"], settings)
    scan_id = str(uuid.uuid4())
    record = {
        "id": scan_id,
        "job_id": None,
        "status": "queued",
        "path": path,
        "recursive": bool(payload.get("recursive", True)),
        "include_archives": bool(payload.get("include_archives", settings["include_archives"])),
        "max_file_size_mb": int(payload.get("max_file_size_mb", settings["max_file_size_mb"])),
        "auto_quarantine": bool(payload.get("auto_quarantine", False)),
        "created_at": time.time(),
        "started_at": None,
        "finished_at": None,
        "engine": None,
        "summary": {"infected_count": 0, "scanned_count": 0, "error_count": 0},
        "detections": [],
    }
    _insert_scan(record)
    job = jobs.submit(
        kind="clamav.scan",
        module="clamav",
        title=f"ClamAV scan: {Path(path).name or path}",
        payload={"scan_id": scan_id, "path": path},
        actor=actor,
        handler=run_scan_job,
        args=(scan_id,),
    )
    updated = _update_scan(scan_id, lambda row: {**row, "job_id": job.id})
    return {"scan_id": scan_id, "job_id": job.id, "scan": updated}


async def run_scan_job(job: Any, scan_id: str) -> Dict[str, Any]:
    return await asyncio.to_thread(_run_scan_job_sync, job, scan_id)


def _run_scan_job_sync(job: Any, scan_id: str) -> Dict[str, Any]:
    settings = load_settings()
    scan = _find_scan(scan_id)
    if not scan:
        raise ValueError("Scan not found.")
    cmd = _build_scan_command(scan, settings)
    engine_name = Path(cmd[0]).name
    started_at = time.time()
    _update_scan(scan_id, lambda row: {**row, "status": "running", "started_at": started_at, "engine": engine_name})
    job.log(f"Using engine: {engine_name}")
    job.log(" ".join(cmd))
    job.update(progress=5, message="Starting malware scan")

    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    lines: List[str] = []
    detections: List[Dict[str, Any]] = []
    last_progress_at = started_at
    try:
        while True:
            if job.cancel_requested():
                _terminate_subprocess(proc)
                _update_scan(
                    scan_id,
                    lambda row: {
                        **row,
                        "status": "cancelled",
                        "finished_at": time.time(),
                        "summary": _parse_summary(lines) if lines else row.get("summary", {}),
                        "detections": detections,
                    },
                )
                job.update(message="Scan cancelled")
                raise JobCancelled()
            line = proc.stdout.readline() if proc.stdout else ""
            if not line:
                if proc.poll() is not None:
                    break
                now = time.time()
                if now - last_progress_at >= 10:
                    elapsed = int(now - started_at)
                    job.update(
                        progress=min(90, 5 + elapsed // 20),
                        message=f"Scanning… {elapsed}s elapsed",
                    )
                    last_progress_at = now
                time.sleep(0.1)
                continue
            clean = line.rstrip()
            lines.append(clean)
            if clean:
                job.log(clean)
            parsed = _parse_detection_line(clean)
            if parsed:
                path, signature = parsed
                detection_id = str(uuid.uuid4())
                detections.append(
                    {
                        "id": detection_id,
                        "path": path,
                        "original_path": path,
                        "signature": signature,
                        "status": "detected",
                        "detected_at": time.time(),
                    }
                )
                job.update(progress=min(95, 10 + len(detections) * 5), message=f"Detected {signature}")
                last_progress_at = time.time()
        code = proc.wait(timeout=10)
    finally:
        if proc.stdout:
            proc.stdout.close()

    summary = _parse_summary(lines)
    if not summary["infected_count"]:
        summary["infected_count"] = len(detections)
    status = "completed" if code in (0, 1) else "failed"
    action_errors: List[str] = []

    _update_scan(
        scan_id,
        lambda row: {
            **row,
            "status": status,
            "finished_at": time.time(),
            "summary": summary,
            "detections": detections,
        },
    )

    if code not in (0, 1):
        raise RuntimeError(f"ClamAV scan failed with exit code {code}.{_exit_code_detail(code, lines)}")

    if scan.get("auto_quarantine"):
        for detection in detections:
            try:
                _move_detection_to_quarantine(scan_id, detection["id"])
                job.log(f"Quarantined: {detection['path']}")
            except Exception as exc:
                action_errors.append(str(exc))
                job.log(f"Quarantine failed for {detection['path']}: {exc}", level="error")

    job.update(progress=100, message="Scan completed")
    return {
        "scan_id": scan_id,
        "status": status,
        "summary": summary,
        "detections": len(detections),
        "action_errors": action_errors,
    }


def get_scan(scan_id: str) -> Dict[str, Any]:
    scan = _find_scan(scan_id)
    if not scan:
        raise ValueError("Scan not found.")
    job_data = jobs.get(scan.get("job_id"), include_logs=True) if scan.get("job_id") else None
    return {
        **scan,
        "job": job_data,
    }


def start_signature_update(actor: Optional[str]) -> Dict[str, Any]:
    job = jobs.submit(
        kind="clamav.update_signatures",
        module="clamav",
        title="ClamAV signature update",
        payload={},
        actor=actor,
        handler=run_signature_update_job,
    )
    return {"job_id": job.id}


async def run_signature_update_job(job: Any) -> Dict[str, Any]:
    return await asyncio.to_thread(_run_signature_update_job_sync, job)


def _current_signature_info() -> Dict[str, Any]:
    clamscan_bin = _which("clamscan")
    raw = (_run([clamscan_bin, "--version"], timeout=20).stdout if clamscan_bin else "")
    return _parse_version_line(raw)


def _run_signature_update_job_sync(job: Any) -> Dict[str, Any]:
    service = _systemctl_status(FRESHCLAM_SERVICE_NAMES)
    service_name = service.get("service")
    service_active = not IS_WINDOWS and service.get("status") == "active" and service_name
    before = _current_signature_info()
    lines: List[str] = []

    if service_active:
        job.log(
            f"Signatures managed by {service_name}; restarting service only (never run second freshclam).",
            level="info",
        )
        job.update(progress=25, message="Restarting freshclam service")
        restart = _systemctl_action("restart", service_name, timeout=120)
        if restart.returncode != 0:
            err = (restart.stderr or restart.stdout or "").strip()
            raise RuntimeError(f"Failed to restart {service_name}: {err or restart.returncode}")
        out = (restart.stdout or restart.stderr or "").strip()
        if out:
            job.log(out)
        job.update(progress=50, message="Waiting for signatures")
        parsed = before
        for i in range(36):
            if job.cancel_requested():
                raise JobCancelled()
            time.sleep(5)
            parsed = _current_signature_info()
            job.update(progress=min(95, 50 + i), message="Checking signature version")
            if (
                parsed.get("signature_version") != before.get("signature_version")
                or parsed.get("signature_date") != before.get("signature_date")
            ):
                job.log("Signature version changed after service restart.")
                break
        else:
            job.log("Service restarted; signature version unchanged (may already be up to date).")
    else:
        job.update(progress=15, message="Updating ClamAV signatures")
        lines, code = _stream_command_output(job, _freshclam_standalone_cmd())
        if code != 0:
            raise RuntimeError(f"freshclam failed with exit code {code}.{_exit_code_detail(code, lines)}")
        parsed = _current_signature_info()

    job.update(progress=100, message="Signatures updated")
    return {
        "updated": True,
        "signature_version": parsed.get("signature_version"),
        "signature_date": parsed.get("signature_date"),
        "lines": lines[-20:],
    }
