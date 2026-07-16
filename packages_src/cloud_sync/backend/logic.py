from __future__ import annotations

import configparser
import json
import os
import re
import shlex
import shutil
import sqlite3
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

CONFIG_DIR = Path("/opt/copanel/config/cloud_sync")
DB_PATH = CONFIG_DIR / "cloud_sync.db"
LOG_DIR = Path("/opt/copanel/logs")
PANEL_OAUTH_PATH = Path("/opt/copanel/config/google_oauth.json")
BACKUP_MANAGER_DB = Path("/opt/copanel/config/backup_manager.db")
DOWNLOAD_MANAGER_DB = Path("/opt/copanel/config/download_manager/download_manager.db")


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _db() -> sqlite3.Connection:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def _resolve_rclone_bin() -> str:
    for candidate in (shutil.which("rclone"), "/usr/bin/rclone", "/usr/local/bin/rclone"):
        if candidate and os.path.isfile(candidate) and os.access(candidate, os.X_OK):
            return candidate
    return "rclone"


class Store:
    _initialized = False

    @staticmethod
    def init() -> None:
        """Idempotent schema bootstrap — safe to call on every request."""
        if Store._initialized and DB_PATH.is_file():
            return
        with _db() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS pairs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pair_name TEXT NOT NULL,
                    direction TEXT NOT NULL,
                    local_path TEXT NOT NULL,
                    remote_name TEXT NOT NULL,
                    remote_path TEXT NOT NULL,
                    sync_deletions INTEGER DEFAULT 1,
                    transfers INTEGER DEFAULT 4,
                    active INTEGER DEFAULT 1
                );
                CREATE TABLE IF NOT EXISTS oauth_clients (
                    provider TEXT PRIMARY KEY,
                    client_id TEXT NOT NULL,
                    client_secret TEXT NOT NULL,
                    redirect_uri TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS oauth_tokens (
                    remote_name TEXT PRIMARY KEY,
                    provider TEXT NOT NULL,
                    access_token TEXT NOT NULL,
                    refresh_token TEXT,
                    token_type TEXT,
                    expiry TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS oauth_states (
                    state TEXT PRIMARY KEY,
                    provider TEXT NOT NULL,
                    remote_name TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    expires_at TEXT NOT NULL
                );
                """
            )
        Store._initialized = True

    # Pairs
    @staticmethod
    def list_pairs() -> List[Dict[str, Any]]:
        Store.init()
        with _db() as conn:
            rows = conn.execute("SELECT * FROM pairs ORDER BY id DESC").fetchall()
            return [dict(r) for r in rows]

    @staticmethod
    def create_pair(data: Dict[str, Any]) -> int:
        Store.init()
        with _db() as conn:
            cur = conn.execute(
                """
                INSERT INTO pairs (pair_name, direction, local_path, remote_name, remote_path, sync_deletions, transfers, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    data["pair_name"].strip(),
                    data.get("direction", "upload"),
                    data["local_path"].strip(),
                    Store.normalize_remote_name(data["remote_name"]),
                    data["remote_path"].strip(),
                    1 if data.get("sync_deletions", True) else 0,
                    int(data.get("transfers", 4)) or 4,
                    1 if data.get("active", True) else 0,
                ),
            )
            return int(cur.lastrowid)

    @staticmethod
    def update_pair(pair_id: int, data: Dict[str, Any]) -> bool:
        Store.init()
        fields: List[str] = []
        values: List[Any] = []
        mapping = {
            "pair_name": "pair_name",
            "direction": "direction",
            "local_path": "local_path",
            "remote_name": "remote_name",
            "remote_path": "remote_path",
            "sync_deletions": "sync_deletions",
            "transfers": "transfers",
            "active": "active",
        }
        for k, col in mapping.items():
            if k in data and data[k] is not None:
                val = data[k]
                if k == "remote_name":
                    val = Store.normalize_remote_name(str(val))
                if k in {"sync_deletions", "active"}:
                    val = 1 if bool(val) else 0
                if k == "transfers":
                    val = int(val) or 4
                fields.append(f"{col} = ?")
                values.append(val)
        if not fields:
            return True
        values.append(pair_id)
        with _db() as conn:
            cur = conn.execute(f"UPDATE pairs SET {', '.join(fields)} WHERE id = ?", values)
            return cur.rowcount > 0

    @staticmethod
    def delete_pair(pair_id: int) -> None:
        Store.init()
        with _db() as conn:
            conn.execute("DELETE FROM pairs WHERE id = ?", (pair_id,))

    # rclone config / remotes
    @staticmethod
    def get_rclone_config_path() -> Path:
        # prefer user config if present, else CoPanel config dir
        candidates = [
            Path(os.path.expanduser("~/.config/rclone/rclone.conf")),
            Path("/root/.config/rclone/rclone.conf"),
            Path("/opt/copanel/config/rclone.conf"),
        ]
        for p in candidates:
            if p.exists():
                return p
        # fallback under CoPanel config
        p = Path("/opt/copanel/config/rclone.conf")
        p.parent.mkdir(parents=True, exist_ok=True)
        return p

    @staticmethod
    def get_rclone_remotes_detail() -> List[Dict[str, str]]:
        cfg_path = Store.get_rclone_config_path()
        # first try `rclone listremotes --long`
        try:
            out = subprocess.check_output(
                [_resolve_rclone_bin(), "listremotes", "--long", "--config", str(cfg_path)],
                text=True,
                stderr=subprocess.DEVNULL,
            )
            remotes: List[Dict[str, str]] = []
            for line in out.splitlines():
                line = line.strip()
                if not line or ":" not in line:
                    continue
                # format: name: type
                name, rest = line.split(":", 1)
                type_ = rest.strip()
                if " " in type_:
                    type_ = type_.split(" ", 1)[0]
                remotes.append({"name": name.strip(), "type": type_.strip()})
            if remotes:
                return remotes
        except Exception:
            pass
        # fallback parse config file
        result: List[Dict[str, str]] = []
        if cfg_path.exists():
            cp = configparser.ConfigParser()
            cp.read(str(cfg_path), encoding="utf-8")
            for section in cp.sections():
                type_ = cp.get(section, "type", fallback="unknown")
                result.append({"name": section, "type": type_})
        return result

    @staticmethod
    def normalize_remote_name(name: str) -> str:
        raw = (name or "").strip()
        safe = re.sub(r"[^A-Za-z0-9_-]", "_", raw)
        safe = re.sub(r"_+", "_", safe).strip("_")
        return safe

    # OAuth storage helpers (Google)
    @staticmethod
    def save_oauth_client(client_id: str, client_secret: str, redirect_uri: str) -> None:
        Store.init()
        now = _utc_now()
        with _db() as conn:
            conn.execute(
                """
                INSERT INTO oauth_clients (provider, client_id, client_secret, redirect_uri, created_at, updated_at)
                VALUES ('google', ?, ?, ?, ?, ?)
                ON CONFLICT(provider) DO UPDATE SET
                    client_id = excluded.client_id,
                    client_secret = excluded.client_secret,
                    redirect_uri = excluded.redirect_uri,
                    updated_at = excluded.updated_at
                """,
                (client_id, client_secret, redirect_uri, now, now),
            )

    @staticmethod
    def get_oauth_client() -> Optional[Dict[str, Any]]:
        Store.init()
        with _db() as conn:
            row = conn.execute("SELECT * FROM oauth_clients WHERE provider = 'google'").fetchone()
            return dict(row) if row else None

    @staticmethod
    def create_oauth_state(remote_name: str, ttl_seconds: int = 1800) -> str:
        import secrets, time

        Store.init()
        state = secrets.token_urlsafe(24)
        expires = str(time.time() + ttl_seconds)
        with _db() as conn:
            conn.execute(
                "INSERT INTO oauth_states (state, provider, remote_name, created_at, expires_at) VALUES (?, 'google', ?, ?, ?)",
                (state, remote_name, _utc_now(), expires),
            )
        return state

    @staticmethod
    def get_oauth_state(state: str) -> Optional[Dict[str, Any]]:
        import time

        Store.init()
        with _db() as conn:
            row = conn.execute("SELECT * FROM oauth_states WHERE state = ? AND provider = 'google'", (state,)).fetchone()
        if not row:
            return None
        data = dict(row)
        try:
            if time.time() > float(data["expires_at"]):
                return None
        except Exception:
            pass
        return data

    @staticmethod
    def delete_oauth_state(state: str) -> None:
        Store.init()
        with _db() as conn:
            conn.execute("DELETE FROM oauth_states WHERE state = ?", (state,))

    @staticmethod
    def save_oauth_token(remote_name: str, token: Dict[str, Any]) -> None:
        Store.init()
        now = _utc_now()
        with _db() as conn:
            conn.execute(
                """
                INSERT INTO oauth_tokens (remote_name, provider, access_token, refresh_token, token_type, expiry, created_at, updated_at)
                VALUES (?, 'google', ?, ?, ?, ?, ?, ?)
                ON CONFLICT(remote_name) DO UPDATE SET
                    access_token = excluded.access_token,
                    refresh_token = excluded.refresh_token,
                    token_type = excluded.token_type,
                    expiry = excluded.expiry,
                    updated_at = excluded.updated_at
                """,
                (
                    Store.normalize_remote_name(remote_name),
                    token.get("access_token", ""),
                    token.get("refresh_token", ""),
                    token.get("token_type", "Bearer"),
                    token.get("expiry", ""),
                    now,
                    now,
                ),
            )

    @staticmethod
    def list_oauth_status() -> List[Dict[str, Any]]:
        Store.init()
        with _db() as conn:
            rows = conn.execute(
                "SELECT remote_name, provider, expiry, updated_at FROM oauth_tokens WHERE provider = 'google' ORDER BY updated_at DESC"
            ).fetchall()
            return [dict(r) for r in rows]

    @staticmethod
    def sync_google_remote_to_rclone(remote_name: str) -> str:
        token = Store._get_token(remote_name)
        client = Store.get_oauth_client()
        if not token or not client:
            raise ValueError("Missing OAuth token or Google OAuth client settings")
        cfg_path = Store.get_rclone_config_path()
        cfg_path.parent.mkdir(parents=True, exist_ok=True)
        cp = configparser.ConfigParser()
        if cfg_path.exists():
            cp.read(str(cfg_path), encoding="utf-8")
        if not cp.has_section(remote_name):
            cp.add_section(remote_name)
        cp.set(remote_name, "type", "drive")
        cp.set(remote_name, "scope", "drive")
        cp.set(remote_name, "client_id", client["client_id"])
        cp.set(remote_name, "client_secret", client["client_secret"])
        token_json = json.dumps(
            {
                "access_token": token.get("access_token", ""),
                "token_type": token.get("token_type", "Bearer"),
                "refresh_token": token.get("refresh_token", ""),
                "expiry": token.get("expiry", ""),
            },
            separators=(",", ":"),
        )
        cp.set(remote_name, "token", token_json)
        with cfg_path.open("w", encoding="utf-8") as f:
            cp.write(f)
        return str(cfg_path)

    @staticmethod
    def _get_token(remote_name: str) -> Optional[Dict[str, Any]]:
        Store.init()
        with _db() as conn:
            row = conn.execute(
                "SELECT * FROM oauth_tokens WHERE remote_name = ? AND provider = 'google'", (Store.normalize_remote_name(remote_name),)
            ).fetchone()
            return dict(row) if row else None

    @staticmethod
    def list_accounts() -> List[Dict[str, Any]]:
        """Connected Google Drive accounts (oauth token + rclone remote if present)."""
        Store.init()
        tokens = {t["remote_name"]: t for t in Store.list_oauth_status()}
        remotes = {r["name"]: r for r in Store.get_rclone_remotes_detail() if r.get("type") == "drive"}
        names = sorted(set(tokens.keys()) | set(remotes.keys()))
        out: List[Dict[str, Any]] = []
        for name in names:
            tok = tokens.get(name, {})
            out.append(
                {
                    "remote_name": name,
                    "provider": "google",
                    "type": "drive",
                    "connected": name in tokens,
                    "expiry": tok.get("expiry"),
                    "updated_at": tok.get("updated_at"),
                }
            )
        return out

    @staticmethod
    def suggest_remote_name() -> str:
        existing = {a["remote_name"] for a in Store.list_accounts()}
        for candidate in ("google_drive", "gdrive", "drive"):
            if candidate not in existing:
                return candidate
        n = 2
        while f"google_drive_{n}" in existing:
            n += 1
        return f"google_drive_{n}"

    @staticmethod
    def _read_oauth_from_sqlite(db_path: Path) -> Optional[Dict[str, str]]:
        if not db_path.is_file():
            return None
        try:
            conn = sqlite3.connect(str(db_path))
            conn.row_factory = sqlite3.Row
            row = conn.execute("SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE provider = 'google'").fetchone()
            conn.close()
            if not row:
                return None
            return {"client_id": row["client_id"], "client_secret": row["client_secret"], "redirect_uri": row["redirect_uri"]}
        except Exception:
            return None

    @staticmethod
    def is_google_oauth_configured() -> bool:
        try:
            Store.resolve_google_oauth_client("https://placeholder.local/callback")
            return True
        except ValueError:
            return False

    @staticmethod
    def google_oauth_config_status(redirect_uri: str = "") -> Dict[str, Any]:
        """Public status for UI — never returns client_secret."""
        configured = Store.is_google_oauth_configured()
        stored = Store.get_oauth_client()
        client_id = ""
        if stored and stored.get("client_id"):
            client_id = str(stored["client_id"])
        elif configured:
            try:
                creds = Store.resolve_google_oauth_client(redirect_uri or "https://placeholder.local/callback")
                client_id = creds.get("client_id") or ""
            except ValueError:
                pass
        hint = ""
        if client_id:
            hint = client_id[:8] + "…" if len(client_id) > 10 else client_id
        return {
            "configured": configured,
            "redirect_uri": redirect_uri,
            "client_id_hint": hint,
        }

    @staticmethod
    def configure_google_oauth_client(client_id: str, client_secret: str, redirect_uri: str) -> Dict[str, Any]:
        cid = (client_id or "").strip()
        secret = (client_secret or "").strip()
        uri = (redirect_uri or "").strip()
        if not cid or not secret:
            raise ValueError("client_id and client_secret are required")
        if not uri:
            raise ValueError("redirect_uri is required")
        Store.save_oauth_client(cid, secret, uri)
        # Share with sibling modules when the panel config dir is writable.
        try:
            PANEL_OAUTH_PATH.parent.mkdir(parents=True, exist_ok=True)
            PANEL_OAUTH_PATH.write_text(
                json.dumps({"client_id": cid, "client_secret": secret}, indent=2) + "\n",
                encoding="utf-8",
            )
        except Exception:
            pass
        return Store.google_oauth_config_status(uri)

    @staticmethod
    def resolve_google_oauth_client(redirect_uri: str) -> Dict[str, str]:
        """Resolve OAuth app credentials without user input (panel / sibling modules / env)."""
        stored = Store.get_oauth_client()
        if stored and stored.get("client_id") and stored.get("client_secret"):
            return {
                "client_id": stored["client_id"],
                "client_secret": stored["client_secret"],
                "redirect_uri": redirect_uri,
            }

        if PANEL_OAUTH_PATH.is_file():
            try:
                data = json.loads(PANEL_OAUTH_PATH.read_text(encoding="utf-8"))
                cid = (data.get("client_id") or "").strip()
                secret = (data.get("client_secret") or "").strip()
                if cid and secret:
                    return {"client_id": cid, "client_secret": secret, "redirect_uri": redirect_uri}
            except Exception:
                pass

        for db_path in (BACKUP_MANAGER_DB, DOWNLOAD_MANAGER_DB):
            imported = Store._read_oauth_from_sqlite(db_path)
            if imported and imported.get("client_id") and imported.get("client_secret"):
                return {
                    "client_id": imported["client_id"],
                    "client_secret": imported["client_secret"],
                    "redirect_uri": redirect_uri,
                }

        cid = (os.environ.get("COPANEL_GOOGLE_OAUTH_CLIENT_ID") or os.environ.get("GOOGLE_OAUTH_CLIENT_ID") or "").strip()
        secret = (os.environ.get("COPANEL_GOOGLE_OAUTH_CLIENT_SECRET") or os.environ.get("GOOGLE_OAUTH_CLIENT_SECRET") or "").strip()
        if cid and secret:
            return {"client_id": cid, "client_secret": secret, "redirect_uri": redirect_uri}

        raise ValueError(
            "Google OAuth is not configured on this panel. "
            "Save your Google Cloud Client ID and Client Secret once in Cloud Sync, "
            "or set /opt/copanel/config/google_oauth.json."
        )


class GoogleOAuth:
    AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    TOKEN_URL = "https://oauth2.googleapis.com/token"

    @staticmethod
    def connect(redirect_uri: str, remote_name: str = "") -> Dict[str, Any]:
        """One-click connect: resolve panel OAuth creds, open Google consent popup."""
        creds = Store.resolve_google_oauth_client(redirect_uri)
        normalized = Store.normalize_remote_name(remote_name) or Store.suggest_remote_name()
        return GoogleOAuth.start(
            remote_name=normalized,
            client_id=creds["client_id"],
            client_secret=creds["client_secret"],
            redirect_uri=creds["redirect_uri"],
        )

    @staticmethod
    def start(remote_name: str, client_id: str, client_secret: str, redirect_uri: str) -> Dict[str, Any]:
        normalized = Store.normalize_remote_name(remote_name)
        if not normalized:
            raise ValueError("remote_name is required")
        if not client_id.strip() or not client_secret.strip() or not redirect_uri.strip():
            raise ValueError("client_id, client_secret, redirect_uri are required")
        Store.save_oauth_client(client_id.strip(), client_secret.strip(), redirect_uri.strip())
        state = Store.create_oauth_state(normalized, ttl_seconds=1800)
        query = urlencode(
            {
                "client_id": client_id.strip(),
                "redirect_uri": redirect_uri.strip(),
                "response_type": "code",
                "scope": "https://www.googleapis.com/auth/drive",
                "access_type": "offline",
                "prompt": "consent",
                "state": state,
            }
        )
        return {"state": state, "auth_url": f"{GoogleOAuth.AUTH_URL}?{query}", "remote_name": normalized}

    @staticmethod
    def exchange(code: str, state: str) -> Dict[str, Any]:
        if not code:
            raise ValueError("Missing OAuth authorization code")
        if not state:
            raise ValueError("Missing OAuth state")
        s = Store.get_oauth_state(state)
        if not s:
            raise ValueError("Invalid or expired OAuth state")
        client = Store.get_oauth_client()
        if not client:
            raise ValueError("Google OAuth client is not configured")
        body = urlencode(
            {
                "code": code,
                "client_id": client["client_id"],
                "client_secret": client["client_secret"],
                "redirect_uri": client["redirect_uri"],
                "grant_type": "authorization_code",
            }
        ).encode("utf-8")
        req = Request(GoogleOAuth.TOKEN_URL, data=body, headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
        try:
            with urlopen(req, timeout=20) as resp:
                token_data = json.loads(resp.read().decode("utf-8"))
        except HTTPError as e:
            detail = e.read().decode("utf-8", errors="replace")
            raise ValueError(f"Google token exchange failed: {detail}") from e
        except Exception as e:
            raise ValueError(f"Google token exchange failed: {e}") from e
        if "access_token" not in token_data:
            raise ValueError("Google token response did not include access_token")
        Store.save_oauth_token(s["remote_name"], token_data)
        cfg = Store.sync_google_remote_to_rclone(s["remote_name"])
        Store.delete_oauth_state(state)
        return {"remote_name": s["remote_name"], "config_path": cfg}

    @staticmethod
    def apply_manual(remote_name: str, token_json: str, client_id: str = "", client_secret: str = "", redirect_uri: str = "") -> Dict[str, Any]:
        normalized = Store.normalize_remote_name(remote_name)
        if not normalized:
            raise ValueError("remote_name is required")
        if not token_json.strip():
            raise ValueError("token_json is required")
        try:
            token = json.loads(token_json)
        except Exception:
            raise ValueError("token_json must be valid JSON")
        if not isinstance(token, dict) or not token.get("access_token"):
            raise ValueError("token_json must include access_token")
        if client_id.strip() and client_secret.strip() and redirect_uri.strip():
            Store.save_oauth_client(client_id.strip(), client_secret.strip(), redirect_uri.strip())
        elif not Store.get_oauth_client():
            raise ValueError("Google OAuth client is missing. Provide client_id, client_secret, and redirect_uri.")
        Store.save_oauth_token(normalized, token)
        cfg = Store.sync_google_remote_to_rclone(normalized)
        return {"remote_name": normalized, "config_path": cfg}


def build_rclone_cmd(direction: str, local_path: str, remote: str, flags: Dict[str, Any], rclone_config: str) -> list[str]:
    src = local_path if direction == "upload" else remote
    dst = remote if direction == "upload" else local_path
    cmd = [_resolve_rclone_bin(), "sync" if flags.get("sync_deletions") else "copy", src, dst, "--config", rclone_config]
    cmd.extend(["--use-json-log", "-v", "--stats", "1s"])
    cmd.extend(["--transfers", str(int(flags.get("transfers", 4)) or 4)])
    return cmd


# Sub-router startup events are unreliable after AppStore install — bootstrap at import.
try:
    Store.init()
except Exception:
    pass

