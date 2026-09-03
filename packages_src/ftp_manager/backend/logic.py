"""
ftp_manager — connection store + FTP/FTPS/SFTP client operations.
"""
from __future__ import annotations

import ftplib
import os
import posixpath
import sqlite3
import stat
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

def _resolve_config_dir() -> Path:
    if Path("/opt/copanel").exists():
        return Path("/opt/copanel/config/ftp_manager")
    here = Path(__file__).resolve()
    parts = here.parts
    if "packages_src" in parts:
        # Dev/source tree under AppStore packages_src/<id>/backend
        return here.parent.parent / ".data"
    # Symlinked into CoPanel: backend/modules/ftp_manager → repo config/
    return here.parent.parent.parent.parent / "config" / "ftp_manager"


CONFIG_DIR = _resolve_config_dir()
DB_PATH = CONFIG_DIR / "ftp_manager.db"

DEFAULT_PORTS = {"ftp": 21, "ftps": 21, "sftp": 22}


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _db() -> sqlite3.Connection:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH), timeout=30)
    conn.row_factory = sqlite3.Row
    return conn


def _join_remote(*parts: str) -> str:
    clean = []
    for p in parts:
        if not p:
            continue
        clean.append(p.strip("/"))
    if not clean:
        return "/"
    return "/" + "/".join(x for x in clean if x)


def _parent_remote(path: str) -> str:
    path = path if path.startswith("/") else "/" + path
    parent = posixpath.dirname(path.rstrip("/") or "/")
    return parent or "/"


def _basename_remote(path: str) -> str:
    return posixpath.basename(path.rstrip("/") or "/")


class Store:
    _initialized = False

    @staticmethod
    def init() -> None:
        if Store._initialized and DB_PATH.is_file():
            return
        with _db() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS connections (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    label TEXT NOT NULL,
                    protocol TEXT NOT NULL,
                    host TEXT NOT NULL,
                    port INTEGER NOT NULL,
                    username TEXT NOT NULL,
                    auth_type TEXT NOT NULL DEFAULT 'password',
                    password TEXT,
                    key_path TEXT,
                    key_blob TEXT,
                    remote_root TEXT NOT NULL DEFAULT '/',
                    passive INTEGER NOT NULL DEFAULT 1,
                    timeout INTEGER NOT NULL DEFAULT 30,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                """
            )
        Store._initialized = True

    @staticmethod
    def _public_row(row: sqlite3.Row | Dict[str, Any]) -> Dict[str, Any]:
        d = dict(row)
        password = d.pop("password", None)
        key_blob = d.pop("key_blob", None)
        key_path = d.get("key_path")
        d["password_set"] = bool(password)
        d["key_set"] = bool(key_blob) or bool(key_path)
        d["passive"] = bool(d.get("passive", 1))
        return d

    @staticmethod
    def list_connections() -> List[Dict[str, Any]]:
        Store.init()
        with _db() as conn:
            rows = conn.execute(
                "SELECT * FROM connections ORDER BY label COLLATE NOCASE ASC, id ASC"
            ).fetchall()
            return [Store._public_row(r) for r in rows]

    @staticmethod
    def get_connection(conn_id: int, *, include_secrets: bool = False) -> Optional[Dict[str, Any]]:
        Store.init()
        with _db() as conn:
            row = conn.execute("SELECT * FROM connections WHERE id = ?", (conn_id,)).fetchone()
            if not row:
                return None
            if include_secrets:
                d = dict(row)
                d["passive"] = bool(d.get("passive", 1))
                return d
            return Store._public_row(row)

    @staticmethod
    def create_connection(data: Dict[str, Any]) -> int:
        Store.init()
        protocol = (data.get("protocol") or "sftp").lower()
        if protocol not in DEFAULT_PORTS:
            raise ValueError(f"Unsupported protocol: {protocol}")
        port = int(data.get("port") or 0) or DEFAULT_PORTS[protocol]
        now = _utc_now()
        with _db() as conn:
            cur = conn.execute(
                """
                INSERT INTO connections (
                    label, protocol, host, port, username, auth_type,
                    password, key_path, key_blob, remote_root, passive, timeout,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    data["label"].strip(),
                    protocol,
                    data["host"].strip(),
                    port,
                    data["username"].strip(),
                    data.get("auth_type") or "password",
                    data.get("password") or None,
                    (data.get("key_path") or "").strip() or None,
                    data.get("key_blob") or None,
                    (data.get("remote_root") or "/").strip() or "/",
                    1 if data.get("passive", True) else 0,
                    int(data.get("timeout") or 30),
                    now,
                    now,
                ),
            )
            return int(cur.lastrowid)

    @staticmethod
    def update_connection(conn_id: int, data: Dict[str, Any]) -> bool:
        Store.init()
        existing = Store.get_connection(conn_id, include_secrets=True)
        if not existing:
            return False

        fields: List[str] = []
        values: List[Any] = []

        def set_field(col: str, val: Any) -> None:
            fields.append(f"{col} = ?")
            values.append(val)

        for key in ("label", "protocol", "host", "username", "auth_type", "remote_root"):
            if key in data and data[key] is not None:
                val = data[key]
                if isinstance(val, str):
                    val = val.strip()
                if key == "protocol":
                    val = str(val).lower()
                    if val not in DEFAULT_PORTS:
                        raise ValueError(f"Unsupported protocol: {val}")
                set_field(key, val)

        if "port" in data and data["port"] is not None:
            port = int(data["port"])
            if port <= 0:
                proto = data.get("protocol") or existing["protocol"]
                port = DEFAULT_PORTS.get(str(proto).lower(), 22)
            set_field("port", port)

        if "passive" in data and data["passive"] is not None:
            set_field("passive", 1 if data["passive"] else 0)
        if "timeout" in data and data["timeout"] is not None:
            set_field("timeout", int(data["timeout"]))

        if data.get("clear_password"):
            set_field("password", None)
        elif "password" in data and data["password"] is not None and data["password"] != "":
            set_field("password", data["password"])

        if data.get("clear_key"):
            set_field("key_path", None)
            set_field("key_blob", None)
        else:
            if "key_path" in data and data["key_path"] is not None:
                set_field("key_path", (data["key_path"] or "").strip() or None)
            if "key_blob" in data and data["key_blob"] is not None:
                if data["key_blob"] == "":
                    set_field("key_blob", None)
                else:
                    set_field("key_blob", data["key_blob"])

        if not fields:
            return True
        set_field("updated_at", _utc_now())
        values.append(conn_id)
        with _db() as conn:
            cur = conn.execute(
                f"UPDATE connections SET {', '.join(fields)} WHERE id = ?",
                values,
            )
            return cur.rowcount > 0

    @staticmethod
    def delete_connection(conn_id: int) -> bool:
        Store.init()
        with _db() as conn:
            cur = conn.execute("DELETE FROM connections WHERE id = ?", (conn_id,))
            return cur.rowcount > 0


def _load_pkey(key_path: Optional[str], key_blob: Optional[str]):
    import io

    import paramiko

    loaders = (
        paramiko.Ed25519Key,
        paramiko.ECDSAKey,
        paramiko.RSAKey,
    )
    if hasattr(paramiko, "DSSKey"):
        loaders = loaders + (paramiko.DSSKey,)
    last_err: Optional[Exception] = None
    if key_blob:
        for cls in loaders:
            try:
                return cls.from_private_key(io.StringIO(key_blob))
            except Exception as exc:  # noqa: BLE001
                last_err = exc
    if key_path:
        path = os.path.expanduser(key_path)
        for cls in loaders:
            try:
                return cls.from_private_key_file(path)
            except Exception as exc:  # noqa: BLE001
                last_err = exc
    if last_err:
        raise ValueError(f"Unable to load SSH private key: {last_err}")
    raise ValueError("SFTP key auth requires key_path or key_blob")


class RemoteClient:
    """Thin wrapper around ftplib / paramiko for browse + transfer."""

    def __init__(self, cfg: Dict[str, Any]) -> None:
        self.cfg = cfg
        self.protocol = str(cfg.get("protocol") or "sftp").lower()
        self.host = str(cfg["host"]).strip()
        self.port = int(cfg.get("port") or DEFAULT_PORTS.get(self.protocol, 22))
        self.username = str(cfg["username"]).strip()
        self.timeout = int(cfg.get("timeout") or 30)
        self.passive = bool(cfg.get("passive", True))
        self.auth_type = str(cfg.get("auth_type") or "password")
        self.password = cfg.get("password") or None
        self.key_path = cfg.get("key_path") or None
        self.key_blob = cfg.get("key_blob") or None
        self.remote_root = (cfg.get("remote_root") or "/").strip() or "/"
        self._ftp: Optional[ftplib.FTP] = None
        self._sftp = None
        self._ssh = None

    def __enter__(self) -> "RemoteClient":
        self.connect()
        return self

    def __exit__(self, *exc: Any) -> None:
        self.close()

    def connect(self) -> None:
        if self.protocol in ("ftp", "ftps"):
            self._connect_ftp()
        elif self.protocol == "sftp":
            self._connect_sftp()
        else:
            raise ValueError(f"Unsupported protocol: {self.protocol}")

    def _connect_ftp(self) -> None:
        if self.protocol == "ftps":
            ftp: ftplib.FTP = ftplib.FTP_TLS(timeout=self.timeout)
        else:
            ftp = ftplib.FTP(timeout=self.timeout)
        ftp.connect(self.host, self.port, timeout=self.timeout)
        ftp.login(self.username, self.password or "")
        if isinstance(ftp, ftplib.FTP_TLS):
            try:
                ftp.prot_p()
            except Exception:  # noqa: BLE001
                pass
        ftp.set_pasv(self.passive)
        self._ftp = ftp

    def _connect_sftp(self) -> None:
        import paramiko

        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        kwargs: Dict[str, Any] = {
            "hostname": self.host,
            "port": self.port,
            "username": self.username,
            "timeout": self.timeout,
            "allow_agent": False,
            "look_for_keys": False,
        }
        if self.auth_type in ("key_path", "key_blob") or self.key_path or self.key_blob:
            kwargs["pkey"] = _load_pkey(self.key_path, self.key_blob)
            if self.password:
                kwargs["passphrase"] = self.password
        else:
            kwargs["password"] = self.password or ""
        client.connect(**kwargs)
        self._ssh = client
        self._sftp = client.open_sftp()

    def close(self) -> None:
        if self._ftp is not None:
            try:
                self._ftp.quit()
            except Exception:  # noqa: BLE001
                try:
                    self._ftp.close()
                except Exception:  # noqa: BLE001
                    pass
            self._ftp = None
        if self._sftp is not None:
            try:
                self._sftp.close()
            except Exception:  # noqa: BLE001
                pass
            self._sftp = None
        if self._ssh is not None:
            try:
                self._ssh.close()
            except Exception:  # noqa: BLE001
                pass
            self._ssh = None

    def resolve_path(self, path: Optional[str] = None) -> str:
        if not path or path.strip() == "":
            return self.remote_root if self.remote_root.startswith("/") else "/" + self.remote_root
        path = path.strip()
        if path.startswith("/"):
            return path if path != "" else "/"
        return _join_remote(self.remote_root, path)

    def test(self) -> Dict[str, Any]:
        started = time.monotonic()
        pwd = self.pwd()
        items = self.list_dir(pwd)
        elapsed_ms = int((time.monotonic() - started) * 1000)
        return {
            "ok": True,
            "protocol": self.protocol,
            "host": self.host,
            "port": self.port,
            "pwd": pwd,
            "entry_count": len(items),
            "elapsed_ms": elapsed_ms,
        }

    def pwd(self) -> str:
        if self._ftp is not None:
            try:
                return self._ftp.pwd() or "/"
            except Exception:  # noqa: BLE001
                return self.remote_root or "/"
        return self.resolve_path(None)

    def list_dir(self, path: Optional[str] = None) -> List[Dict[str, Any]]:
        target = self.resolve_path(path)
        if self._sftp is not None:
            return self._list_sftp(target)
        assert self._ftp is not None
        return self._list_ftp(target)

    def _list_sftp(self, path: str) -> List[Dict[str, Any]]:
        assert self._sftp is not None
        items: List[Dict[str, Any]] = []
        for attr in self._sftp.listdir_attr(path):
            name = attr.filename
            if name in (".", ".."):
                continue
            is_dir = stat.S_ISDIR(attr.st_mode or 0)
            items.append(
                {
                    "name": name,
                    "path": _join_remote(path, name),
                    "is_dir": is_dir,
                    "size": int(attr.st_size or 0) if not is_dir else 0,
                    "modified": int(attr.st_mtime or 0),
                }
            )
        items.sort(key=lambda x: (not x["is_dir"], x["name"].lower()))
        return items

    def _list_ftp(self, path: str) -> List[Dict[str, Any]]:
        assert self._ftp is not None
        ftp = self._ftp
        try:
            ftp.cwd(path)
        except ftplib.error_perm as exc:
            raise ValueError(f"Cannot open remote path {path}: {exc}") from exc

        entries: List[Tuple[str, Dict[str, Any]]] = []
        # Prefer MLSD when available
        try:
            for name, facts in ftp.mlsd():
                if name in (".", ".."):
                    continue
                is_dir = str(facts.get("type", "")).lower() == "dir"
                size = int(facts.get("size") or 0) if not is_dir else 0
                modified = 0
                modify = facts.get("modify")
                if modify:
                    try:
                        modified = int(
                            datetime.strptime(modify[:14], "%Y%m%d%H%M%S")
                            .replace(tzinfo=timezone.utc)
                            .timestamp()
                        )
                    except Exception:  # noqa: BLE001
                        modified = 0
                entries.append(
                    (
                        name,
                        {
                            "name": name,
                            "path": _join_remote(path, name),
                            "is_dir": is_dir,
                            "size": size,
                            "modified": modified,
                        },
                    )
                )
        except (AttributeError, ftplib.error_perm, OSError):
            names = []
            try:
                names = ftp.nlst()
            except ftplib.error_perm:
                names = []
            for raw in names:
                name = posixpath.basename(raw.rstrip("/"))
                if name in (".", "..") or not name:
                    continue
                is_dir = False
                size = 0
                try:
                    ftp.cwd(_join_remote(path, name))
                    is_dir = True
                    ftp.cwd(path)
                except ftplib.error_perm:
                    try:
                        size = int(ftp.size(_join_remote(path, name)) or 0)
                    except Exception:  # noqa: BLE001
                        size = 0
                entries.append(
                    (
                        name,
                        {
                            "name": name,
                            "path": _join_remote(path, name),
                            "is_dir": is_dir,
                            "size": size,
                            "modified": 0,
                        },
                    )
                )

        items = [e[1] for e in entries]
        items.sort(key=lambda x: (not x["is_dir"], x["name"].lower()))
        return items

    def mkdir(self, path: str) -> None:
        target = self.resolve_path(path)
        if self._sftp is not None:
            self._sftp.mkdir(target)
            return
        assert self._ftp is not None
        self._ftp.mkd(target)

    def rename(self, path: str, new_name: str) -> str:
        target = self.resolve_path(path)
        parent = _parent_remote(target)
        dest = _join_remote(parent, new_name.strip().strip("/"))
        if self._sftp is not None:
            self._sftp.rename(target, dest)
        else:
            assert self._ftp is not None
            self._ftp.rename(target, dest)
        return dest

    def delete(self, path: str, *, recursive: bool = False) -> None:
        target = self.resolve_path(path)
        if self._sftp is not None:
            self._delete_sftp(target, recursive=recursive)
            return
        assert self._ftp is not None
        self._delete_ftp(target, recursive=recursive)

    def _delete_sftp(self, path: str, *, recursive: bool) -> None:
        assert self._sftp is not None
        try:
            attr = self._sftp.stat(path)
            is_dir = stat.S_ISDIR(attr.st_mode or 0)
        except FileNotFoundError as exc:
            raise ValueError(f"Remote path not found: {path}") from exc
        if not is_dir:
            self._sftp.remove(path)
            return
        if not recursive:
            raise ValueError("Directory delete requires recursive=true")
        for attr in self._sftp.listdir_attr(path):
            child = _join_remote(path, attr.filename)
            if stat.S_ISDIR(attr.st_mode or 0):
                self._delete_sftp(child, recursive=True)
            else:
                self._sftp.remove(child)
        self._sftp.rmdir(path)

    def _delete_ftp(self, path: str, *, recursive: bool) -> None:
        assert self._ftp is not None
        # Try file delete first
        try:
            self._ftp.delete(path)
            return
        except ftplib.error_perm:
            pass
        if not recursive:
            try:
                self._ftp.rmd(path)
                return
            except ftplib.error_perm as exc:
                raise ValueError(f"Cannot delete {path}: {exc}") from exc
        for item in self._list_ftp(path):
            if item["is_dir"]:
                self._delete_ftp(item["path"], recursive=True)
            else:
                self._ftp.delete(item["path"])
        self._ftp.rmd(path)

    def download_path(
        self,
        remote_path: str,
        local_path: str,
        *,
        overwrite: bool = True,
        progress=None,
    ) -> Dict[str, Any]:
        remote = self.resolve_path(remote_path)
        local = Path(local_path).expanduser()
        if self._sftp is not None:
            return self._download_sftp(remote, local, overwrite=overwrite, progress=progress)
        return self._download_ftp(remote, local, overwrite=overwrite, progress=progress)

    def upload_path(
        self,
        local_path: str,
        remote_path: str,
        *,
        overwrite: bool = True,
        progress=None,
    ) -> Dict[str, Any]:
        remote = self.resolve_path(remote_path)
        local = Path(local_path).expanduser()
        if not local.exists():
            raise ValueError(f"Local path not found: {local}")
        if self._sftp is not None:
            return self._upload_sftp(local, remote, overwrite=overwrite, progress=progress)
        return self._upload_ftp(local, remote, overwrite=overwrite, progress=progress)

    def _is_remote_dir(self, path: str) -> bool:
        if self._sftp is not None:
            try:
                return stat.S_ISDIR(self._sftp.stat(path).st_mode or 0)
            except FileNotFoundError:
                return False
        assert self._ftp is not None
        cur = self._ftp.pwd()
        try:
            self._ftp.cwd(path)
            self._ftp.cwd(cur)
            return True
        except ftplib.error_perm:
            return False

    def _download_sftp(self, remote: str, local: Path, *, overwrite: bool, progress) -> Dict[str, Any]:
        assert self._sftp is not None
        is_dir = self._is_remote_dir(remote)
        transferred = 0
        bytes_done = 0

        def report(msg: str) -> None:
            if progress:
                progress(transferred, bytes_done, msg)

        if is_dir:
            if local.exists() and not local.is_dir():
                raise ValueError(f"Local path is a file: {local}")
            local.mkdir(parents=True, exist_ok=True)

            def walk(rpath: str, lpath: Path) -> None:
                nonlocal transferred, bytes_done
                for attr in self._sftp.listdir_attr(rpath):
                    name = attr.filename
                    child_r = _join_remote(rpath, name)
                    child_l = lpath / name
                    if stat.S_ISDIR(attr.st_mode or 0):
                        child_l.mkdir(parents=True, exist_ok=True)
                        walk(child_r, child_l)
                    else:
                        if child_l.exists() and not overwrite:
                            continue
                        self._sftp.get(child_r, str(child_l))
                        transferred += 1
                        bytes_done += int(attr.st_size or 0)
                        report(f"Downloaded {child_r}")

            walk(remote, local)
        else:
            if local.exists() and local.is_dir():
                local = local / _basename_remote(remote)
            local.parent.mkdir(parents=True, exist_ok=True)
            if local.exists() and not overwrite:
                raise ValueError(f"Local file exists: {local}")
            self._sftp.get(remote, str(local))
            transferred = 1
            bytes_done = local.stat().st_size if local.exists() else 0
            report(f"Downloaded {remote}")

        return {"ok": True, "files": transferred, "bytes": bytes_done, "local_path": str(local)}

    def _download_ftp(self, remote: str, local: Path, *, overwrite: bool, progress) -> Dict[str, Any]:
        assert self._ftp is not None
        is_dir = self._is_remote_dir(remote)
        transferred = 0
        bytes_done = 0

        def report(msg: str) -> None:
            if progress:
                progress(transferred, bytes_done, msg)

        if is_dir:
            local.mkdir(parents=True, exist_ok=True)

            def walk(rpath: str, lpath: Path) -> None:
                nonlocal transferred, bytes_done
                for item in self._list_ftp(rpath):
                    child_l = lpath / item["name"]
                    if item["is_dir"]:
                        child_l.mkdir(parents=True, exist_ok=True)
                        walk(item["path"], child_l)
                    else:
                        if child_l.exists() and not overwrite:
                            continue
                        with open(child_l, "wb") as fh:
                            self._ftp.retrbinary(f"RETR {item['path']}", fh.write)
                        transferred += 1
                        bytes_done += child_l.stat().st_size
                        report(f"Downloaded {item['path']}")

            walk(remote, local)
        else:
            if local.exists() and local.is_dir():
                local = local / _basename_remote(remote)
            local.parent.mkdir(parents=True, exist_ok=True)
            if local.exists() and not overwrite:
                raise ValueError(f"Local file exists: {local}")
            with open(local, "wb") as fh:
                self._ftp.retrbinary(f"RETR {remote}", fh.write)
            transferred = 1
            bytes_done = local.stat().st_size
            report(f"Downloaded {remote}")

        return {"ok": True, "files": transferred, "bytes": bytes_done, "local_path": str(local)}

    def _upload_sftp(self, local: Path, remote: str, *, overwrite: bool, progress) -> Dict[str, Any]:
        assert self._sftp is not None
        transferred = 0
        bytes_done = 0

        def report(msg: str) -> None:
            if progress:
                progress(transferred, bytes_done, msg)

        def ensure_dir(path: str) -> None:
            parts = [p for p in path.split("/") if p]
            cur = ""
            for part in parts:
                cur = f"{cur}/{part}"
                try:
                    self._sftp.stat(cur)
                except FileNotFoundError:
                    self._sftp.mkdir(cur)

        if local.is_dir():
            ensure_dir(remote)

            def walk(lpath: Path, rpath: str) -> None:
                nonlocal transferred, bytes_done
                for child in sorted(lpath.iterdir(), key=lambda p: (p.is_file(), p.name.lower())):
                    child_r = _join_remote(rpath, child.name)
                    if child.is_dir():
                        ensure_dir(child_r)
                        walk(child, child_r)
                    else:
                        try:
                            self._sftp.stat(child_r)
                            if not overwrite:
                                continue
                        except FileNotFoundError:
                            pass
                        self._sftp.put(str(child), child_r)
                        transferred += 1
                        bytes_done += child.stat().st_size
                        report(f"Uploaded {child}")

            walk(local, remote)
        else:
            # If remote is existing dir, place file inside; else treat as file path
            if self._is_remote_dir(remote):
                remote = _join_remote(remote, local.name)
            else:
                ensure_dir(_parent_remote(remote))
            try:
                self._sftp.stat(remote)
                if not overwrite:
                    raise ValueError(f"Remote file exists: {remote}")
            except FileNotFoundError:
                pass
            self._sftp.put(str(local), remote)
            transferred = 1
            bytes_done = local.stat().st_size
            report(f"Uploaded {local}")

        return {"ok": True, "files": transferred, "bytes": bytes_done, "remote_path": remote}

    def _upload_ftp(self, local: Path, remote: str, *, overwrite: bool, progress) -> Dict[str, Any]:
        assert self._ftp is not None
        transferred = 0
        bytes_done = 0

        def report(msg: str) -> None:
            if progress:
                progress(transferred, bytes_done, msg)

        def ensure_dir(path: str) -> None:
            parts = [p for p in path.split("/") if p]
            cur = ""
            for part in parts:
                cur = f"{cur}/{part}"
                try:
                    self._ftp.mkd(cur)
                except ftplib.error_perm:
                    pass

        if local.is_dir():
            ensure_dir(remote)

            def walk(lpath: Path, rpath: str) -> None:
                nonlocal transferred, bytes_done
                for child in sorted(lpath.iterdir(), key=lambda p: (p.is_file(), p.name.lower())):
                    child_r = _join_remote(rpath, child.name)
                    if child.is_dir():
                        ensure_dir(child_r)
                        walk(child, child_r)
                    else:
                        with open(child, "rb") as fh:
                            self._ftp.storbinary(f"STOR {child_r}", fh)
                        transferred += 1
                        bytes_done += child.stat().st_size
                        report(f"Uploaded {child}")

            walk(local, remote)
        else:
            if self._is_remote_dir(remote):
                remote = _join_remote(remote, local.name)
            else:
                ensure_dir(_parent_remote(remote))
            with open(local, "rb") as fh:
                self._ftp.storbinary(f"STOR {remote}", fh)
            transferred = 1
            bytes_done = local.stat().st_size
            report(f"Uploaded {local}")

        return {"ok": True, "files": transferred, "bytes": bytes_done, "remote_path": remote}


def merge_connection_cfg(base: Dict[str, Any], override: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    cfg = dict(base)
    if not override:
        return cfg
    for key in (
        "label",
        "protocol",
        "host",
        "port",
        "username",
        "auth_type",
        "password",
        "key_path",
        "key_blob",
        "remote_root",
        "passive",
        "timeout",
    ):
        if key in override and override[key] is not None:
            if key == "password" and override[key] == "":
                continue
            if key in ("key_path", "key_blob") and override[key] == "":
                continue
            cfg[key] = override[key]
    protocol = str(cfg.get("protocol") or "sftp").lower()
    port = int(cfg.get("port") or 0)
    if port <= 0:
        cfg["port"] = DEFAULT_PORTS.get(protocol, 22)
    return cfg


def test_connection(cfg: Dict[str, Any]) -> Dict[str, Any]:
    with RemoteClient(cfg) as client:
        return client.test()


def explore_local(path: str) -> Dict[str, Any]:
    if os.name == "nt" and path == "/":
        path = str(Path.cwd())
    target = Path(path).expanduser()
    if not target.exists() or not target.is_dir():
        return {"data": [], "current_path": str(target)}
    items = []
    try:
        for entry in sorted(target.iterdir(), key=lambda e: (e.is_file(), e.name.lower())):
            try:
                items.append(
                    {
                        "name": entry.name,
                        "path": str(entry),
                        "is_dir": entry.is_dir(),
                        "size": entry.stat().st_size if entry.is_file() else 0,
                    }
                )
            except OSError:
                continue
    except PermissionError:
        return {"data": [], "current_path": str(target), "message": "Permission denied"}
    return {"data": items, "current_path": str(target.resolve())}


async def run_transfer_job(
    job,
    *,
    connection_id: int,
    direction: str,
    remote_path: str,
    local_path: str,
    overwrite: bool,
) -> Dict[str, Any]:
    cfg = Store.get_connection(connection_id, include_secrets=True)
    if not cfg:
        raise RuntimeError(f"Connection {connection_id} not found")

    job.update(progress=5, message="Connecting…")

    def progress(files: int, nbytes: int, msg: str) -> None:
        pct = min(95, 10 + files * 3)
        try:
            job.update(progress=pct, message=msg)
        except Exception:  # noqa: BLE001
            pass

    import asyncio

    def _do() -> Dict[str, Any]:
        with RemoteClient(cfg) as client:
            if direction == "download":
                return client.download_path(
                    remote_path, local_path, overwrite=overwrite, progress=progress
                )
            if direction == "upload":
                return client.upload_path(
                    local_path, remote_path, overwrite=overwrite, progress=progress
                )
            raise ValueError(f"Unknown direction: {direction}")

    result = await asyncio.to_thread(_do)
    job.update(progress=100, message="Transfer complete")
    return result
