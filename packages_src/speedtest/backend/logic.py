"""
VPS-side network speed tests (ping / download / upload).

Runs on the CoPanel host so results reflect the VPS uplink, not the admin's browser.
Primary target: Cloudflare speed endpoints (no API key). Fallbacks for download only.
"""
from __future__ import annotations

import json
import os
import random
import string
import threading
import time
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional

HISTORY_LIMIT = 20
DEFAULT_DOWNLOAD_BYTES = 25_000_000  # 25 MiB
DEFAULT_UPLOAD_BYTES = 10_000_000  # 10 MiB
CHUNK = 256 * 1024
USER_AGENT = "CoPanel-Speedtest/1.0 (+https://github.com/phuspeed/CoPanel)"

SERVERS: List[Dict[str, Any]] = [
    {
        "id": "cloudflare",
        "name": "Cloudflare",
        "region": "Anycast / global edge",
        "ping_url": "https://speed.cloudflare.com/__down?bytes=0",
        "download_url": "https://speed.cloudflare.com/__down?bytes={bytes}",
        "upload_url": "https://speed.cloudflare.com/__up",
        "meta_url": "https://speed.cloudflare.com/meta",
    },
    {
        "id": "cloudflare_alt",
        "name": "Cloudflare (alt path)",
        "region": "Anycast / global edge",
        "ping_url": "https://speed.cloudflare.com/__down?bytes=1000",
        "download_url": "https://speed.cloudflare.com/__down?bytes={bytes}",
        "upload_url": "https://speed.cloudflare.com/__up",
        "meta_url": "https://speed.cloudflare.com/meta",
    },
]

DOWNLOAD_FALLBACKS = [
    ("https://proof.ovh.net/files/10Mb.dat", 10 * 1024 * 1024),
    ("https://proof.ovh.net/files/100Mb.dat", 100 * 1024 * 1024),
]


def _data_dir() -> Path:
    """Prefer panel config dir; fall back next to this module."""
    here = Path(__file__).resolve()
    candidates = [
        Path("/opt/copanel/config"),
        # CoPanel/backend/modules/speedtest → parents[3] = CoPanel root
        here.parents[3] / "config",
        here.parent / "data",
    ]
    for candidate in candidates:
        try:
            candidate.mkdir(parents=True, exist_ok=True)
            return candidate
        except OSError:
            continue
    d = here.parent / "data"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _history_path() -> Path:
    return _data_dir() / "speedtest_history.json"


def _server_by_id(server_id: Optional[str]) -> Dict[str, Any]:
    sid = (server_id or "cloudflare").strip().lower()
    for s in SERVERS:
        if s["id"] == sid:
            return s
    return SERVERS[0]


def _open(url: str, *, data: Optional[bytes] = None, method: Optional[str] = None, timeout: float = 60.0):
    headers = {"User-Agent": USER_AGENT, "Accept": "*/*", "Cache-Control": "no-cache"}
    if data is not None:
        headers["Content-Type"] = "application/octet-stream"
        headers["Content-Length"] = str(len(data))
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    return urllib.request.urlopen(req, timeout=timeout)


def measure_ping(server: Dict[str, Any], samples: int = 5) -> Dict[str, Any]:
    url = server["ping_url"]
    rtts: List[float] = []
    last_err: Optional[str] = None
    for _ in range(max(1, samples)):
        t0 = time.perf_counter()
        try:
            with _open(url, timeout=10.0) as resp:
                resp.read(64)
            rtts.append((time.perf_counter() - t0) * 1000.0)
        except Exception as exc:  # noqa: BLE001
            last_err = str(exc)
            time.sleep(0.05)
            continue
        time.sleep(0.05)
    if not rtts:
        raise RuntimeError(last_err or "Ping failed")
    avg = sum(rtts) / len(rtts)
    jitter = 0.0
    if len(rtts) > 1:
        jitter = sum(abs(rtts[i] - rtts[i - 1]) for i in range(1, len(rtts))) / (len(rtts) - 1)
    return {
        "ping_ms": round(avg, 2),
        "jitter_ms": round(jitter, 2),
        "samples": len(rtts),
        "min_ms": round(min(rtts), 2),
        "max_ms": round(max(rtts), 2),
    }


def fetch_meta(server: Dict[str, Any]) -> Dict[str, Any]:
    url = server.get("meta_url")
    if not url:
        return {}
    try:
        with _open(url, timeout=8.0) as resp:
            raw = resp.read(4096).decode("utf-8", errors="replace")
        data = json.loads(raw)
        if isinstance(data, dict):
            return {
                "client_ip": data.get("clientIp") or data.get("ip"),
                "asn": data.get("asn"),
                "colo": data.get("colo") or data.get("airport"),
                "city": data.get("city"),
                "country": data.get("country"),
            }
    except Exception:  # noqa: BLE001
        return {}
    return {}


def measure_download(
    server: Dict[str, Any],
    nbytes: int,
    on_progress=None,
) -> Dict[str, Any]:
    url = server["download_url"].format(bytes=nbytes)
    downloaded = 0
    t0 = time.perf_counter()
    last_report = t0
    try:
        with _open(url, timeout=120.0) as resp:
            while True:
                chunk = resp.read(CHUNK)
                if not chunk:
                    break
                downloaded += len(chunk)
                now = time.perf_counter()
                if on_progress and (now - last_report) >= 0.15:
                    elapsed = max(now - t0, 1e-6)
                    mbps = (downloaded * 8) / elapsed / 1_000_000
                    pct = min(100.0, (downloaded / max(nbytes, 1)) * 100.0)
                    on_progress(pct, mbps, downloaded)
                    last_report = now
                if downloaded >= nbytes:
                    break
    except Exception as primary_exc:  # noqa: BLE001
        # Fallback to fixed-size public mirrors if Cloudflare path fails
        fallback_ok = False
        for fb_url, fb_size in DOWNLOAD_FALLBACKS:
            if fb_size < min(nbytes, 5_000_000):
                continue
            downloaded = 0
            t0 = time.perf_counter()
            last_report = t0
            try:
                with _open(fb_url, timeout=120.0) as resp:
                    while True:
                        chunk = resp.read(CHUNK)
                        if not chunk:
                            break
                        downloaded += len(chunk)
                        now = time.perf_counter()
                        if on_progress and (now - last_report) >= 0.15:
                            elapsed = max(now - t0, 1e-6)
                            mbps = (downloaded * 8) / elapsed / 1_000_000
                            pct = min(100.0, (downloaded / max(fb_size, 1)) * 100.0)
                            on_progress(pct, mbps, downloaded)
                            last_report = now
                        if downloaded >= min(nbytes, fb_size):
                            break
                fallback_ok = True
                url = fb_url
                break
            except Exception:  # noqa: BLE001
                continue
        if not fallback_ok:
            raise RuntimeError(f"Download failed: {primary_exc}") from primary_exc

    elapsed = max(time.perf_counter() - t0, 1e-6)
    mbps = (downloaded * 8) / elapsed / 1_000_000
    if on_progress:
        on_progress(100.0, mbps, downloaded)
    return {
        "download_mbps": round(mbps, 2),
        "bytes": downloaded,
        "elapsed_s": round(elapsed, 3),
        "url": url.split("?")[0],
    }


def measure_upload(
    server: Dict[str, Any],
    nbytes: int,
    on_progress=None,
) -> Dict[str, Any]:
    url = server["upload_url"]
    # Send in a few progressive posts so we can report live Mbps (urllib is all-or-nothing per request).
    remaining = nbytes
    uploaded = 0
    t0 = time.perf_counter()
    piece = max(512 * 1024, min(2 * 1024 * 1024, nbytes // 4 or nbytes))
    while remaining > 0:
        size = min(piece, remaining)
        payload = os.urandom(size)
        try:
            with _open(url, data=payload, method="POST", timeout=120.0) as resp:
                resp.read(256)
        except Exception as exc:  # noqa: BLE001
            if uploaded == 0:
                raise RuntimeError(f"Upload failed: {exc}") from exc
            break
        uploaded += size
        remaining -= size
        elapsed = max(time.perf_counter() - t0, 1e-6)
        mbps = (uploaded * 8) / elapsed / 1_000_000
        pct = min(100.0, (uploaded / max(nbytes, 1)) * 100.0)
        if on_progress:
            on_progress(pct, mbps, uploaded)

    elapsed = max(time.perf_counter() - t0, 1e-6)
    mbps = (uploaded * 8) / elapsed / 1_000_000 if uploaded else 0.0
    if on_progress:
        on_progress(100.0, mbps, uploaded)
    return {
        "upload_mbps": round(mbps, 2),
        "bytes": uploaded,
        "elapsed_s": round(elapsed, 3),
        "url": url,
    }


@dataclass
class Job:
    id: str
    status: str = "queued"  # queued | running | done | error
    phase: str = "idle"  # idle | ping | download | upload | done
    server_id: str = "cloudflare"
    server_name: str = "Cloudflare"
    ping_ms: Optional[float] = None
    jitter_ms: Optional[float] = None
    download_mbps: Optional[float] = None
    upload_mbps: Optional[float] = None
    download_progress: float = 0.0
    upload_progress: float = 0.0
    live_mbps: Optional[float] = None
    meta: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    started_at: Optional[float] = None
    finished_at: Optional[float] = None
    download_bytes: int = DEFAULT_DOWNLOAD_BYTES
    upload_bytes: int = DEFAULT_UPLOAD_BYTES

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class SpeedtestEngine:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._jobs: Dict[str, Job] = {}
        self._thread: Optional[threading.Thread] = None

    def list_servers(self) -> List[Dict[str, Any]]:
        return [
            {"id": s["id"], "name": s["name"], "region": s["region"]}
            for s in SERVERS
        ]

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            job = self._jobs.get(job_id)
            return job.to_dict() if job else None

    def active_job(self) -> Optional[Dict[str, Any]]:
        with self._lock:
            for job in reversed(list(self._jobs.values())):
                if job.status in ("queued", "running"):
                    return job.to_dict()
            return None

    def history(self) -> List[Dict[str, Any]]:
        path = _history_path()
        if not path.is_file():
            return []
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            return data if isinstance(data, list) else []
        except Exception:  # noqa: BLE001
            return []

    def _append_history(self, entry: Dict[str, Any]) -> None:
        items = self.history()
        items.insert(0, entry)
        items = items[:HISTORY_LIMIT]
        try:
            _history_path().write_text(json.dumps(items, indent=2), encoding="utf-8")
        except Exception:  # noqa: BLE001
            pass

    def start(
        self,
        *,
        server_id: Optional[str] = None,
        download_bytes: Optional[int] = None,
        upload_bytes: Optional[int] = None,
    ) -> Dict[str, Any]:
        with self._lock:
            for job in self._jobs.values():
                if job.status in ("queued", "running"):
                    raise RuntimeError("A speed test is already running")

            server = _server_by_id(server_id)
            job_id = "st_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
            job = Job(
                id=job_id,
                status="queued",
                phase="idle",
                server_id=server["id"],
                server_name=server["name"],
                download_bytes=int(download_bytes or DEFAULT_DOWNLOAD_BYTES),
                upload_bytes=int(upload_bytes or DEFAULT_UPLOAD_BYTES),
            )
            self._jobs[job_id] = job
            # Keep only recent jobs in memory
            if len(self._jobs) > 30:
                old = [k for k, v in self._jobs.items() if v.status in ("done", "error")]
                for k in old[: max(0, len(self._jobs) - 20)]:
                    self._jobs.pop(k, None)

        t = threading.Thread(target=self._run_job, args=(job_id,), daemon=True, name=f"speedtest-{job_id}")
        self._thread = t
        t.start()
        return self.get_job(job_id) or {"id": job_id}

    def _update(self, job_id: str, **kwargs: Any) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return
            for k, v in kwargs.items():
                setattr(job, k, v)

    def _run_job(self, job_id: str) -> None:
        job = self._jobs.get(job_id)
        if not job:
            return
        server = _server_by_id(job.server_id)
        self._update(job_id, status="running", started_at=time.time(), phase="ping", live_mbps=None)

        try:
            meta = fetch_meta(server)
            if meta:
                self._update(job_id, meta=meta)

            ping = measure_ping(server)
            self._update(
                job_id,
                ping_ms=ping["ping_ms"],
                jitter_ms=ping["jitter_ms"],
                phase="download",
                download_progress=0.0,
                live_mbps=None,
            )

            def on_dl(pct: float, mbps: float, _n: int) -> None:
                self._update(job_id, download_progress=round(pct, 1), live_mbps=round(mbps, 2), download_mbps=round(mbps, 2))

            dl = measure_download(server, job.download_bytes, on_progress=on_dl)
            self._update(
                job_id,
                download_mbps=dl["download_mbps"],
                download_progress=100.0,
                phase="upload",
                upload_progress=0.0,
                live_mbps=None,
            )

            def on_ul(pct: float, mbps: float, _n: int) -> None:
                self._update(job_id, upload_progress=round(pct, 1), live_mbps=round(mbps, 2), upload_mbps=round(mbps, 2))

            ul = measure_upload(server, job.upload_bytes, on_progress=on_ul)
            finished = time.time()
            self._update(
                job_id,
                upload_mbps=ul["upload_mbps"],
                upload_progress=100.0,
                phase="done",
                status="done",
                live_mbps=None,
                finished_at=finished,
            )

            snap = self.get_job(job_id) or {}
            self._append_history(
                {
                    "id": job_id,
                    "server_id": snap.get("server_id"),
                    "server_name": snap.get("server_name"),
                    "ping_ms": snap.get("ping_ms"),
                    "jitter_ms": snap.get("jitter_ms"),
                    "download_mbps": snap.get("download_mbps"),
                    "upload_mbps": snap.get("upload_mbps"),
                    "meta": snap.get("meta") or {},
                    "finished_at": finished,
                }
            )
        except Exception as exc:  # noqa: BLE001
            self._update(
                job_id,
                status="error",
                phase="done",
                error=str(exc),
                finished_at=time.time(),
                live_mbps=None,
            )


engine = SpeedtestEngine()
