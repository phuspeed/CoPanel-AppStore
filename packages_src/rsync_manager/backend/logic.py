"""rsync_manager: SSH target detection, CoPanel awareness, and rsync orchestration."""
from __future__ import annotations

import asyncio
import os
import re
import shlex
import shutil
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional, Tuple

Severity = Literal["ok", "warn", "block"]
Mode = Literal["move", "clone", "sync"]
Scenario = Literal["both_copanel", "target_rsync", "need_rsync", "blocked"]

# Align with install.sh + live panel safety (do not clobber remote config/data by default).
PRESET_EXCLUDES_COPANEL: List[str] = [
    "venv/",
    "**/__pycache__/",
    "*.pyc",
    ".git/",
    "frontend/node_modules/",
    "node_modules/",
    "config/",
    "backend/data/",
    "website/",
    ".github/",
    "*.md",
    "*.MD",
]

PRESET_EXCLUDES_WEB: List[str] = [
    "**/node_modules/",
    "**/vendor/bin/",
    "**/.git/",
    "**/cache/",
    "**/tmp/",
    "**/*.log",
]

PRESET_EXCLUDES_MIRROR: List[str] = [
    "venv/",
    "**/__pycache__/",
    "*.pyc",
    ".git/",
    "frontend/node_modules/",
    "node_modules/",
]

# Host: hostname, IPv4, or IPv6 (optional brackets). No shell metacharacters.
_HOST_RE = re.compile(r"^[a-zA-Z0-9._:\-\[\]]+$")
_USER_RE = re.compile(r"^[a-zA-Z0-9._\-]+$")
_REMOTE_PATH_RE = re.compile(r"^/[a-zA-Z0-9/_.~+\-]*$")
_PROGRESS_RE = re.compile(
    r"(?P<bytes>[\d,]+)\s+(?P<pct>\d+)%\s+(?P<speed>\S+)\s+(?P<eta>\S+)"
)


def _is_windows() -> bool:
    return os.name == "nt"


def _item(
    item_id: str,
    severity: Severity,
    message: str,
    source: str = "",
    target: str = "",
) -> Dict[str, Any]:
    return {
        "id": item_id,
        "severity": severity,
        "message": message,
        "source": source,
        "target": target,
    }


def validate_ssh_target(host: str, port: int, user: str, identity_file: Optional[str]) -> None:
    h = (host or "").strip()
    if not h or len(h) > 253 or not _HOST_RE.match(h):
        raise ValueError("Invalid SSH host.")
    if any(c in h for c in (";", "|", "&", "$", "`", " ", "\n", "\t")):
        raise ValueError("Invalid SSH host.")
    if not (1 <= port <= 65535):
        raise ValueError("Invalid SSH port.")
    if not user or len(user) > 64 or not _USER_RE.match(user):
        raise ValueError("Invalid SSH user.")
    if identity_file:
        p = Path(identity_file).expanduser().resolve()
        if not p.is_file():
            raise ValueError("SSH identity file not found.")


def validate_local_path(local_path: str) -> Path:
    p = Path(local_path).expanduser().resolve()
    if not p.exists():
        raise ValueError(f"Local path does not exist: {local_path}")
    return p


def validate_remote_path(remote_path: str) -> str:
    rp = (remote_path or "").strip()
    if not rp or len(rp) > 2048 or not _REMOTE_PATH_RE.match(rp):
        raise ValueError("Remote path must be an absolute path (e.g. /opt/copanel).")
    return rp


def validate_excludes(excludes: List[str]) -> List[str]:
    out: List[str] = []
    for raw in excludes[:500]:
        s = (raw or "").strip()
        if not s or "\n" in s or "\x00" in s or ".." in s:
            raise ValueError("Invalid exclude pattern.")
        if len(s) > 512:
            s = s[:512]
        out.append(s)
    return out


def validate_mode(mode: str) -> Mode:
    m = (mode or "clone").strip().lower()
    if m not in ("move", "clone", "sync"):
        raise ValueError("mode must be move, clone, or sync.")
    return m  # type: ignore[return-value]


def _ssh_base(host: str, port: int, user: str, identity_file: Optional[str]) -> List[str]:
    cmd = [
        "ssh",
        "-p",
        str(port),
        "-o",
        "BatchMode=yes",
        "-o",
        "StrictHostKeyChecking=accept-new",
        "-o",
        "ConnectTimeout=20",
    ]
    if identity_file:
        cmd.extend(["-i", identity_file])
    cmd.append(f"{user}@{host}")
    return cmd


def _ssh_cmd(
    host: str, port: int, user: str, identity_file: Optional[str], remote_argv: List[str]
) -> List[str]:
    return _ssh_base(host, port, user, identity_file) + remote_argv


def _ssh_shell(
    host: str, port: int, user: str, identity_file: Optional[str], remote_script: str
) -> List[str]:
    return _ssh_base(host, port, user, identity_file) + [remote_script]


def _run_capture(argv: List[str], timeout: int = 60) -> Tuple[int, str, str]:
    try:
        r = subprocess.run(
            argv,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        return r.returncode, (r.stdout or "").strip(), (r.stderr or "").strip()
    except subprocess.TimeoutExpired:
        return 124, "", "timeout"
    except Exception as e:
        return 1, "", str(e)


def _read_local_os_release() -> Dict[str, str]:
    data: Dict[str, str] = {}
    path = Path("/etc/os-release")
    if not path.is_file():
        return data
    try:
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            if "=" in line:
                k, v = line.split("=", 1)
                data[k.strip()] = v.strip().strip('"')
    except OSError:
        pass
    return data


def _parse_os_release_text(text: str) -> Dict[str, str]:
    data: Dict[str, str] = {}
    for line in text.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            data[k.strip()] = v.strip().strip('"')
    return data


def local_rsync_available() -> bool:
    return shutil.which("rsync") is not None


def local_copanel_info() -> Dict[str, Any]:
    root = Path("/opt/copanel")
    present = root.is_dir()
    version = ""
    vfile = root / "VERSION"
    if vfile.is_file():
        try:
            version = vfile.read_text(encoding="utf-8", errors="replace").strip()[:64]
        except OSError:
            pass
    service = "unknown"
    code, out, _ = _run_capture(["systemctl", "is-active", "copanel"], 10)
    if code == 0 and out:
        service = out.splitlines()[0].strip()
    elif present:
        service = "inactive_or_missing"
    return {"present": present, "version": version, "service": service, "path": str(root)}


def list_identity_hints() -> Dict[str, Any]:
    """Suggest common identity files and public keys for the panel host."""
    home = Path.home()
    candidates = [
        home / ".ssh" / "id_ed25519",
        home / ".ssh" / "id_rsa",
        home / ".ssh" / "id_ecdsa",
        Path("/root/.ssh/id_ed25519"),
        Path("/root/.ssh/id_rsa"),
    ]
    keys: List[Dict[str, str]] = []
    seen = set()
    for priv in candidates:
        try:
            if not priv.is_file():
                continue
            sp = str(priv.resolve())
            if sp in seen:
                continue
            seen.add(sp)
            pub = Path(str(priv) + ".pub")
            pub_text = ""
            if pub.is_file():
                pub_text = pub.read_text(encoding="utf-8", errors="replace").strip()[:800]
            keys.append({"identity_file": sp, "public_key": pub_text})
        except OSError:
            continue
    return {"keys": keys, "hint_en": "Add the public key to target ~/.ssh/authorized_keys (root or chosen user)."}


def estimate_local_bytes(local_path: str, excludes: Optional[List[str]] = None) -> Dict[str, Any]:
    """Rough du -sb of a local tree (excludes applied best-effort via find+du fallback)."""
    lp = validate_local_path(local_path)
    # Simple du; exclude accuracy is approximate for UI estimates.
    code, out, err = _run_capture(["du", "-sb", str(lp)], 120)
    bytes_total = 0
    if code == 0 and out:
        first = out.split()[0]
        if first.isdigit():
            bytes_total = int(first)
    return {
        "path": str(lp),
        "bytes": bytes_total,
        "excludes_note": "Estimate is full tree size; rsync excludes reduce transfer further.",
        "error": "" if code == 0 else (err or "du failed"),
    }


def detect_remote_copanel(
    host: str, port: int, user: str, identity_file: Optional[str]
) -> Dict[str, Any]:
    script = (
        "set -e; "
        "P=/opt/copanel; "
        "if [ -d \"$P\" ]; then echo PRESENT=1; "
        "if [ -f \"$P/VERSION\" ]; then echo VERSION=$(head -c 64 \"$P/VERSION\" | tr -d '\\r\\n'); fi; "
        "else echo PRESENT=0; fi; "
        "if command -v systemctl >/dev/null 2>&1; then "
        "echo SERVICE=$(systemctl is-active copanel 2>/dev/null || echo missing); "
        "else echo SERVICE=no_systemd; fi"
    )
    code, out, err = _run_capture(_ssh_shell(host, port, user, identity_file, script), 45)
    present = False
    version = ""
    service = "unknown"
    if code == 0 and out:
        for line in out.splitlines():
            line = line.strip()
            if line.startswith("PRESENT="):
                present = line.split("=", 1)[1].strip() == "1"
            elif line.startswith("VERSION="):
                version = line.split("=", 1)[1].strip()[:64]
            elif line.startswith("SERVICE="):
                service = line.split("=", 1)[1].strip()[:64]
    return {
        "present": present,
        "version": version,
        "service": service,
        "path": "/opt/copanel",
        "ok": code == 0,
        "error": "" if code == 0 else (err or "remote detect failed"),
    }


def _parse_df_avail(df_out: str) -> int:
    avail = 0
    lines = [ln.strip() for ln in df_out.splitlines() if ln.strip()]
    if len(lines) >= 2:
        last_cell = lines[-1].split()[-1]
        if last_cell.isdigit():
            avail = int(last_cell)
    elif len(lines) == 1:
        cell = lines[0].split()[-1]
        if cell.isdigit():
            avail = int(cell)
    return avail


def compatibility_check(
    host: str,
    port: int,
    user: str,
    identity_file: Optional[str] = None,
    *,
    min_free_bytes: int = 0,
    remote_path: Optional[str] = None,
) -> Dict[str, Any]:
    """Compare local vs remote; detect CoPanel + rsync for wizard scenario."""
    if _is_windows():
        return {
            "items": [_item("platform", "block", "rsync_manager runs on Linux panel hosts only.")],
            "can_proceed": False,
            "scenario": "blocked",
            "local_copanel": local_copanel_info(),
            "remote_copanel": {"present": False},
            "remote_rsync": False,
        }

    validate_ssh_target(host, port, user, identity_file)
    rp_check = validate_remote_path(remote_path) if remote_path else "/"

    items: List[Dict[str, Any]] = []
    blocking = False
    remote_rsync = False

    local_cp = local_copanel_info()
    if local_cp["present"]:
        items.append(
            _item(
                "copanel_local",
                "ok",
                "CoPanel detected on this (source) server.",
                source=local_cp.get("version") or "present",
                target=local_cp.get("service", ""),
            )
        )
    else:
        items.append(
            _item(
                "copanel_local",
                "warn",
                "CoPanel tree not found at /opt/copanel on source — custom paths still work.",
            )
        )

    if not local_rsync_available():
        items.append(_item("rsync_local", "block", "rsync is not installed on this server.", target="missing"))
        blocking = True
    else:
        vcode, vout, _ = _run_capture(["rsync", "--version"], 10)
        ver = (vout.splitlines()[0] if vout else "rsync")[:120]
        items.append(_item("rsync_local", "ok", "rsync available on panel host.", source=ver))

    code, arch_out, _ = _run_capture(["uname", "-m"], 10)
    local_arch = arch_out if code == 0 else "unknown"

    local_os = _read_local_os_release()
    local_id = local_os.get("ID", "unknown")
    local_ver = local_os.get("VERSION_ID", "")

    ssh = _ssh_cmd(host, port, user, identity_file, ["uname", "-m"])
    rcode, remote_arch, rerr = _run_capture(ssh, 45)
    if rcode != 0:
        items.append(
            _item(
                "ssh",
                "block",
                f"Cannot run remote uname via SSH: {rerr or 'connection failed'}",
                source=local_arch,
                target="",
            )
        )
        return {
            "items": items,
            "can_proceed": False,
            "scenario": "blocked",
            "local_copanel": local_cp,
            "remote_copanel": {"present": False, "ok": False},
            "remote_rsync": False,
        }

    items.append(_item("ssh", "ok", "SSH BatchMode connection works.", target=f"{user}@{host}:{port}"))

    if local_arch != remote_arch:
        items.append(
            _item(
                "arch",
                "block",
                "CPU architecture must match between source and target for binary/CoPanel file sync.",
                source=local_arch,
                target=remote_arch,
            )
        )
        blocking = True
    else:
        items.append(_item("arch", "ok", "Architecture matches.", source=local_arch, target=remote_arch))

    ssh_cat = _ssh_cmd(host, port, user, identity_file, ["cat", "/etc/os-release"])
    oc, remote_os_text, _ = _run_capture(ssh_cat, 30)
    remote_os = _parse_os_release_text(remote_os_text) if oc == 0 else {}
    remote_id = remote_os.get("ID", "unknown")
    remote_ver = remote_os.get("VERSION_ID", "")

    if local_id != remote_id:
        items.append(
            _item(
                "os_family",
                "warn",
                f"OS ID differs (source {local_id} vs target {remote_id}). Prefer matching families.",
                source=f"{local_id} {local_ver}".strip(),
                target=f"{remote_id} {remote_ver}".strip(),
            )
        )
    else:
        items.append(
            _item(
                "os_family",
                "ok",
                "Same OS ID.",
                source=f"{local_id} {local_ver}".strip(),
                target=f"{remote_id} {remote_ver}".strip(),
            )
        )

    ssh_rsync = _ssh_cmd(host, port, user, identity_file, ["command", "-v", "rsync"])
    rc_rsync, rsync_path, _ = _run_capture(ssh_rsync, 30)
    if rc_rsync != 0:
        items.append(
            _item(
                "rsync_remote",
                "block",
                "rsync not found on target. Use Install rsync on target, or: dnf/apt install -y rsync.",
            )
        )
        blocking = True
    else:
        remote_rsync = True
        items.append(_item("rsync_remote", "ok", "rsync is available on target.", target=rsync_path or "rsync"))

    remote_cp = detect_remote_copanel(host, port, user, identity_file)
    if remote_cp.get("ok"):
        if remote_cp["present"]:
            items.append(
                _item(
                    "copanel_remote",
                    "ok",
                    "CoPanel detected on target — safe for panel-to-panel clone/sync (use excludes for config/data).",
                    source=local_cp.get("version") or "",
                    target=remote_cp.get("version") or "present",
                )
            )
            if remote_cp.get("service") == "active":
                items.append(
                    _item(
                        "copanel_service",
                        "warn",
                        "Target CoPanel service is active. Prefer syncing with config/ excluded, or stop the service during move.",
                        target=remote_cp.get("service", ""),
                    )
                )
        else:
            items.append(
                _item(
                    "copanel_remote",
                    "ok",
                    "No CoPanel on target yet — rsync-only target is fine for fresh VPS bootstrap of files.",
                    target="absent",
                )
            )
    else:
        items.append(
            _item(
                "copanel_remote",
                "warn",
                f"Could not fully detect CoPanel on target: {remote_cp.get('error') or 'unknown'}",
            )
        )

    df_path = rp_check if rp_check != "/" else "/"
    # Prefer destination path's mount; fall back to /
    ssh_df = _ssh_cmd(
        host,
        port,
        user,
        identity_file,
        ["df", "-B1", "--output=avail", df_path],
    )
    dcode, df_out, _ = _run_capture(ssh_df, 30)
    avail = _parse_df_avail(df_out) if dcode == 0 else 0
    if dcode != 0 and min_free_bytes > 0:
        # retry root
        ssh_df2 = _ssh_cmd(host, port, user, identity_file, ["df", "-B1", "--output=avail", "/"])
        dcode2, df_out2, _ = _run_capture(ssh_df2, 30)
        avail = _parse_df_avail(df_out2) if dcode2 == 0 else 0
        if dcode2 != 0:
            items.append(
                _item(
                    "disk_target",
                    "warn",
                    "Could not read free space on target. Verify disk manually before a large sync.",
                )
            )
    if avail > 0 and min_free_bytes > 0 and avail < min_free_bytes:
        items.append(
            _item(
                "disk_target",
                "block",
                "Not enough free space on target for estimated transfer (+15% margin).",
                target=str(avail),
                source=str(min_free_bytes),
            )
        )
        blocking = True
    elif avail > 0:
        items.append(_item("disk_target", "ok", "Target has free space for estimate.", target=str(avail)))

    if remote_cp.get("present") and local_cp.get("present") and remote_rsync and not blocking:
        scenario: Scenario = "both_copanel"
    elif remote_rsync and not blocking:
        scenario = "target_rsync"
    elif not remote_rsync:
        scenario = "need_rsync"
    else:
        scenario = "blocked"

    can_proceed = not blocking and not any(x["severity"] == "block" for x in items)
    if can_proceed and scenario == "need_rsync":
        can_proceed = False

    return {
        "items": items,
        "can_proceed": can_proceed,
        "scenario": scenario,
        "local_copanel": local_cp,
        "remote_copanel": remote_cp,
        "remote_rsync": remote_rsync,
    }


def install_rsync_remote(
    host: str, port: int, user: str, identity_file: Optional[str] = None
) -> Dict[str, Any]:
    """Best-effort install rsync on target (dnf/yum/apt). Requires passwordless sudo or root SSH."""
    validate_ssh_target(host, port, user, identity_file)
    script = (
        "set -e; "
        "if command -v rsync >/dev/null 2>&1; then echo ALREADY=1; exit 0; fi; "
        "if command -v dnf >/dev/null 2>&1; then "
        "  (dnf install -y rsync || sudo -n dnf install -y rsync); "
        "elif command -v yum >/dev/null 2>&1; then "
        "  (yum install -y rsync || sudo -n yum install -y rsync); "
        "elif command -v apt-get >/dev/null 2>&1; then "
        "  (apt-get update -qq && apt-get install -y rsync) || "
        "  (sudo -n apt-get update -qq && sudo -n apt-get install -y rsync); "
        "else echo NO_PKG_MGR=1; exit 2; fi; "
        "command -v rsync"
    )
    code, out, err = _run_capture(_ssh_shell(host, port, user, identity_file, script), 300)
    # Re-check regardless of install exit (partial success / already present).
    rc2, path2, _ = _run_capture(
        _ssh_cmd(host, port, user, identity_file, ["command", "-v", "rsync"]), 30
    )
    installed = rc2 == 0
    return {
        "ok": installed,
        "exit_code": code,
        "stdout_tail": (out or "")[-4000:],
        "stderr_tail": (err or "")[-4000:],
        "rsync_path": path2 if installed else "",
        "already": "ALREADY=1" in (out or ""),
    }


def presets() -> Dict[str, Any]:
    return {
        "copanel": {
            "id": "copanel",
            "label_en": "CoPanel install tree (/opt/copanel)",
            "label_vi": "Cây cài CoPanel (/opt/copanel)",
            "local_path": "/opt/copanel",
            "remote_path": "/opt/copanel",
            "excludes": PRESET_EXCLUDES_COPANEL,
            "delete_default": False,
        },
        "copanel_mirror": {
            "id": "copanel_mirror",
            "label_en": "CoPanel mirror (includes config; use carefully)",
            "label_vi": "Mirror CoPanel (gồm config; dùng cẩn thận)",
            "local_path": "/opt/copanel",
            "remote_path": "/opt/copanel",
            "excludes": PRESET_EXCLUDES_MIRROR,
            "delete_default": False,
        },
        "web": {
            "id": "web",
            "label_en": "Web roots (/var/www)",
            "label_vi": "Web roots (/var/www)",
            "local_path": "/var/www",
            "remote_path": "/var/www",
            "excludes": PRESET_EXCLUDES_WEB,
            "delete_default": False,
        },
        "custom": {
            "id": "custom",
            "label_en": "Custom paths",
            "label_vi": "Đường dẫn tùy chỉnh",
            "local_path": "",
            "remote_path": "",
            "excludes": [],
            "delete_default": False,
        },
    }


def post_checklist(mode: Mode, scenario: str) -> Dict[str, Any]:
    en = [
        {
            "id": "verify_files",
            "title": "Verify synced paths on target",
            "detail": "Spot-check sizes and key files under the remote destination.",
        },
        {
            "id": "sql",
            "title": "Dump & restore databases",
            "detail": "Use Database Manager or mysqldump/pg_dump on source, restore on target. Not automated by rsync.",
        },
        {
            "id": "docker",
            "title": "Rebuild Docker stacks",
            "detail": "Containers and images are not migrated; rebuild with Docker Manager on the new VPS.",
        },
        {
            "id": "ssl_dns",
            "title": "Point DNS / reissue SSL",
            "detail": "Update A/AAAA records, then issue certificates on the target panel.",
        },
    ]
    if scenario == "both_copanel":
        en.insert(
            1,
            {
                "id": "config",
                "title": "Review CoPanel config on target",
                "detail": "Default excludes skip config/ and backend/data/. Copy secrets intentionally if you need them.",
            },
        )
    if mode == "move":
        en.extend(
            [
                {
                    "id": "cutover",
                    "title": "Cut over traffic",
                    "detail": "After final sync, switch DNS/firewall to VPS2 and keep VPS1 read-only or powered down.",
                },
                {
                    "id": "final_sync",
                    "title": "Optional final incremental sync",
                    "detail": "Run Sync mode once more with --delete only if you intentionally want a mirror.",
                },
                {
                    "id": "decommission",
                    "title": "Decommission source (optional)",
                    "detail": "Only after confirming target is healthy. Do not wipe source until backups exist.",
                },
            ]
        )
    elif mode == "clone":
        en.append(
            {
                "id": "independent",
                "title": "Treat as independent clone",
                "detail": "Source stays online. Change hostnames/IPs and secrets on the clone to avoid conflicts.",
            }
        )
    else:
        en.append(
            {
                "id": "schedule",
                "title": "Repeat sync as needed",
                "detail": "Use Sync for incremental updates. Enable delete only when you want destination to mirror source.",
            }
        )

    vi = [
        {"id": i["id"], "title": i["title"], "detail": i["detail"]} for i in en
    ]
    # Vietnamese titles for main items
    vi_map = {
        "verify_files": ("Kiểm tra file trên máy đích", "Đối chiếu dung lượng và file quan trọng trên đường dẫn remote."),
        "sql": ("Dump & restore database", "Dùng Database Manager hoặc mysqldump trên nguồn, restore trên đích. Rsync không chuyển SQL."),
        "docker": ("Dựng lại Docker", "Container/image không được migrate; dựng lại bằng Docker Manager trên VPS mới."),
        "ssl_dns": ("Trỏ DNS / cấp lại SSL", "Cập nhật A/AAAA rồi cấp chứng chỉ trên panel đích."),
        "config": ("Rà soát config CoPanel trên đích", "Preset mặc định bỏ qua config/ và backend/data/. Copy secret có chủ đích nếu cần."),
        "cutover": ("Chuyển traffic", "Sau sync cuối, chuyển DNS/firewall sang VPS2; giữ VPS1 chỉ đọc hoặc tắt."),
        "final_sync": ("Sync tăng dần lần cuối (tuỳ chọn)", "Chạy Sync thêm lần nữa; chỉ bật --delete khi muốn mirror."),
        "decommission": ("Thu hồi máy nguồn (tuỳ chọn)", "Chỉ khi đích ổn định. Có backup trước khi xoá nguồn."),
        "independent": ("Coi như bản clone độc lập", "Máy nguồn vẫn chạy. Đổi hostname/IP/secret trên clone để tránh xung đột."),
        "schedule": ("Lặp lại sync khi cần", "Dùng Sync cho cập nhật tăng dần. Chỉ bật delete khi muốn đích mirror nguồn."),
    }
    for item in vi:
        if item["id"] in vi_map:
            item["title"], item["detail"] = vi_map[item["id"]]

    return {"mode": mode, "scenario": scenario, "en": en, "vi": vi}


def _ssh_rsync_e(port: int, identity_file: Optional[str]) -> str:
    ssh_part = f"ssh -p {int(port)} -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20"
    if identity_file:
        ssh_part += f" -i {shlex.quote(identity_file)}"
    return ssh_part


def build_rsync_argv(
    host: str,
    port: int,
    user: str,
    identity_file: Optional[str],
    local_path: str,
    remote_path: str,
    excludes: List[str],
    *,
    dry_run: bool,
    delete: bool,
    progress: bool = False,
) -> List[str]:
    lp = validate_local_path(local_path)
    rp = validate_remote_path(remote_path)
    ex = validate_excludes(excludes)

    if not shutil.which("rsync"):
        raise RuntimeError("rsync not installed on panel host.")

    src = str(lp).rstrip("/") + "/"
    dst = f"{user}@{host}:{rp.rstrip('/')}/"

    args = ["rsync", "-a", "--info=stats2"]
    if progress:
        args.append("--info=progress2")
    if dry_run:
        args.append("--dry-run")
    if delete:
        args.append("--delete")
    for pat in ex:
        args.extend(["--exclude", pat])
    args.extend(["-e", _ssh_rsync_e(port, identity_file), src, dst])
    return args


def run_rsync(
    host: str,
    port: int,
    user: str,
    identity_file: Optional[str],
    local_path: str,
    remote_path: str,
    excludes: List[str],
    *,
    dry_run: bool,
    delete: bool,
    timeout_sec: int = 3600,
) -> Dict[str, Any]:
    if _is_windows():
        raise RuntimeError("rsync_manager is Linux-only.")

    validate_ssh_target(host, port, user, identity_file)
    args = build_rsync_argv(
        host,
        port,
        user,
        identity_file,
        local_path,
        remote_path,
        excludes,
        dry_run=dry_run,
        delete=delete,
        progress=False,
    )

    try:
        r = subprocess.run(
            args,
            capture_output=True,
            text=True,
            timeout=max(30, min(timeout_sec, 86400)),
        )
    except subprocess.TimeoutExpired:
        return {
            "ok": False,
            "exit_code": 124,
            "stdout_tail": "",
            "stderr_tail": "rsync timed out",
        }

    out = (r.stdout or "")[-24000:]
    err = (r.stderr or "")[-12000:]
    return {
        "ok": r.returncode == 0,
        "exit_code": r.returncode,
        "stdout_tail": out,
        "stderr_tail": err,
    }


def _parse_progress_line(line: str) -> Optional[Dict[str, Any]]:
    m = _PROGRESS_RE.search(line.replace("\r", " ").strip())
    if not m:
        return None
    try:
        pct = int(m.group("pct"))
    except ValueError:
        return None
    return {
        "percent": max(0, min(99, pct)),
        "bytes": m.group("bytes"),
        "speed": m.group("speed"),
        "eta": m.group("eta"),
        "raw": line.strip()[:200],
    }


async def run_rsync_job(
    job: Any,
    *,
    host: str,
    port: int,
    user: str,
    identity_file: Optional[str],
    paths: List[Dict[str, str]],
    excludes: List[str],
    dry_run: bool,
    delete: bool,
    mode: Mode,
) -> Dict[str, Any]:
    """Async handler for core.jobs — streams progress from rsync progress2."""
    if _is_windows():
        raise RuntimeError("rsync_manager is Linux-only.")

    validate_ssh_target(host, port, user, identity_file)
    if not paths:
        raise ValueError("At least one path pair is required.")

    results: List[Dict[str, Any]] = []
    total = len(paths)
    job.update(progress=1, message=f"Starting {'dry-run ' if dry_run else ''}{mode} ({total} path(s))")
    job.log(f"mode={mode} dry_run={dry_run} delete={delete} paths={total}")

    for idx, pair in enumerate(paths):
        if job.cancel_requested():
            from core.jobs import JobCancelled

            raise JobCancelled()

        local_path = (pair.get("local_path") or "").strip()
        remote_path = (pair.get("remote_path") or "").strip()
        base = int((idx / total) * 90) + 5
        job.update(progress=base, message=f"Syncing {local_path} → {remote_path}")
        job.log(f"[{idx + 1}/{total}] {local_path} -> {remote_path}")

        args = build_rsync_argv(
            host,
            port,
            user,
            identity_file,
            local_path,
            remote_path,
            excludes,
            dry_run=dry_run,
            delete=delete,
            progress=True,
        )

        proc = await asyncio.create_subprocess_exec(
            *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout_chunks: List[str] = []
        stderr_chunks: List[str] = []

        async def _read_stream(stream: asyncio.StreamReader, collect: List[str], is_err: bool) -> None:
            buf = b""
            while True:
                if job.cancel_requested():
                    try:
                        proc.kill()
                    except ProcessLookupError:
                        pass
                    return
                chunk = await stream.read(4096)
                if not chunk:
                    break
                buf += chunk
                # progress2 uses \r
                while b"\r" in buf or b"\n" in buf:
                    if b"\r" in buf and (b"\n" not in buf or buf.find(b"\r") < buf.find(b"\n")):
                        line_b, buf = buf.split(b"\r", 1)
                    else:
                        line_b, buf = buf.split(b"\n", 1)
                    line = line_b.decode("utf-8", errors="replace")
                    if line.strip():
                        collect.append(line)
                        if len(collect) > 400:
                            del collect[:-200]
                        prog = _parse_progress_line(line)
                        if prog:
                            # Map path-local percent into overall job progress
                            local_pct = prog["percent"]
                            overall = base + int((local_pct / 100) * (80 // total))
                            job.update(
                                progress=min(95, overall),
                                message=f"{local_path}: {local_pct}% ({prog['speed']}, ETA {prog['eta']})",
                            )
                        elif is_err and ("error" in line.lower() or "rsync:" in line.lower()):
                            job.log(line[:500], level="warn")

            if buf.strip():
                collect.append(buf.decode("utf-8", errors="replace"))

        assert proc.stdout and proc.stderr
        await asyncio.gather(
            _read_stream(proc.stdout, stdout_chunks, False),
            _read_stream(proc.stderr, stderr_chunks, True),
        )
        code = await proc.wait()

        if job.cancel_requested():
            from core.jobs import JobCancelled

            raise JobCancelled()

        out_tail = "\n".join(stdout_chunks)[-12000:]
        err_tail = "\n".join(stderr_chunks)[-8000:]
        ok = code == 0
        results.append(
            {
                "local_path": local_path,
                "remote_path": remote_path,
                "ok": ok,
                "exit_code": code,
                "stdout_tail": out_tail,
                "stderr_tail": err_tail,
            }
        )
        if not ok:
            job.log(f"rsync failed exit={code} for {local_path}", level="error")
            if err_tail:
                job.log(err_tail[-1500:], level="error")
            raise RuntimeError(f"rsync failed for {local_path} (exit {code})")

        job.log(f"OK {local_path} → {remote_path}")

    job.update(progress=100, message="Completed")
    return {
        "ok": True,
        "mode": mode,
        "dry_run": dry_run,
        "delete": delete,
        "paths": results,
        "summary": f"{'Dry-run' if dry_run else 'Sync'} completed for {len(results)} path(s).",
    }
