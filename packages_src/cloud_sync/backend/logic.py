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
    @staticmethod
    def init() -> None:
        with _db() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS pairs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pair_name TEXT NOT NULL,
                    direction TEXT NOT NULL,                 -- upload | download
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

    # Pairs
    @staticmethod
    def list_pairs() -> List[Dict[str, Any]]:
        with _db() as conn:
            rows = conn.execute("SELECT * FROM pairs ORDER BY id DESC").fetchall()
            return [dict(r) for r in rows]

    @staticmethod
    def create_pair(data: Dict[str, Any]) -> int:
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
        with _db() as conn:
            row = conn.execute("SELECT * FROM oauth_clients WHERE provider = 'google'").fetchone()
            return dict(row) if row else None

    @staticmethod
    def create_oauth_state(remote_name: str, ttl_seconds: int = 1800) -> str:
        import secrets, time

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
        with _db() as conn:
            conn.execute("DELETE FROM oauth_states WHERE state = ?", (state,))

    @staticmethod
    def save_oauth_token(remote_name: str, token: Dict[str, Any]) -> None:
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
        with _db() as conn:
            row = conn.execute(
                "SELECT * FROM oauth_tokens WHERE remote_name = ? AND provider = 'google'", (Store.normalize_remote_name(remote_name),)
            ).fetchone()
            return dict(row) if row else None


class GoogleOAuth:
    AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    TOKEN_URL = "https://oauth2.googleapis.com/token"

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

