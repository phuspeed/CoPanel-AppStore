from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse

from core.api import ok
from core.auth import require_admin, require_module

from .logic import Store, GoogleOAuth, build_rclone_cmd
from .schemas import SavePairRequest, UpdatePairRequest
import asyncio

router = APIRouter()


@router.on_event("startup")
async def on_startup() -> None:
    Store.init()


@router.get("/version")
def get_version(user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    from importlib.resources import files
    ver = (files(__package__) / "version.txt").read_text(encoding="utf-8").strip()
    return ok({"version": ver})


@router.get("/pairs")
def list_pairs(user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    return ok(Store.list_pairs())


@router.post("/pairs")
def create_pair(req: SavePairRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    pid = Store.create_pair(req.model_dump(mode="json"))
    return ok({"id": pid})


@router.put("/pairs/{pair_id}")
def update_pair(pair_id: int, req: UpdatePairRequest, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    ok_ = Store.update_pair(pair_id, req.model_dump(exclude_unset=True, mode="json"))
    if not ok_:
        raise HTTPException(status_code=400, detail="Failed to update pair")
    return ok(True)


@router.delete("/pairs/{pair_id}")
def delete_pair(pair_id: int, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    Store.delete_pair(pair_id)
    return ok(True)


@router.get("/remotes")
def list_remotes(user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    return ok({"data": Store.get_rclone_remotes_detail(), "config_path": str(Store.get_rclone_config_path())})


@router.get("/explore")
def explore_files(path: str = "/", user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    if os.name == "nt" and path == "/":
        current_file_dir = Path(__file__).parent.resolve()
        path = str(current_file_dir.parent.parent.parent.resolve())
    target = Path(path)
    if not target.exists() or not target.is_dir():
        return ok({"data": [], "current_path": str(target)})
    items = []
    for entry in sorted(target.iterdir(), key=lambda e: (e.is_file(), e.name.lower())):
        if entry.is_dir():
            items.append({"name": entry.name, "path": str(entry), "type": "folder"})
        else:
            items.append({"name": entry.name, "path": str(entry), "type": "file"})
    return ok({"data": items, "current_path": str(target)})


@router.post("/oauth/google/start")
def oauth_start(data: dict, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    result = GoogleOAuth.start(
        remote_name=(data.get("remote_name") or "").strip(),
        client_id=(data.get("client_id") or "").strip(),
        client_secret=(data.get("client_secret") or "").strip(),
        redirect_uri=(data.get("redirect_uri") or "").strip(),
    )
    return ok(result)


@router.get("/oauth/google/callback")
def oauth_callback(code: str = "", state: str = "", error: str = ""):
    if error:
        return HTMLResponse(
            content=f\"\"\"<html><body><script>
                window.opener && window.opener.postMessage({json.dumps({'type':'copanel_google_oauth','ok':False,'error':error})}, '*');
                window.close();
            </script>Authorization failed: {error}</body></html>\"\"\"
        )
    try:
        result = GoogleOAuth.exchange(code=code, state=state)
        payload = {"type": "copanel_google_oauth", "ok": True, "remote_name": result["remote_name"]}
        return HTMLResponse(
            content=f\"\"\"<html><body><script>
                window.opener && window.opener.postMessage({json.dumps(payload)}, '*');
                window.close();
            </script>Authorization completed.</body></html>\"\"\"
        )
    except Exception as e:
        return HTMLResponse(
            content=f\"\"\"<html><body><script>
                window.opener && window.opener.postMessage({json.dumps({'type':'copanel_google_oauth','ok':False,'error':str(e)})}, '*');
                window.close();
            </script>OAuth callback failed.</body></html>\"\"\", status_code=400
        )


@router.post("/oauth/google/manual-token")
def oauth_manual(data: dict, user: Dict[str, Any] = Depends(require_admin)) -> Dict[str, Any]:
    result = GoogleOAuth.apply_manual(
        remote_name=(data.get("remote_name") or "").strip(),
        token_json=(data.get("token_json") or "").strip(),
        client_id=(data.get("client_id") or "").strip(),
        client_secret=(data.get("client_secret") or "").strip(),
        redirect_uri=(data.get("redirect_uri") or "").strip(),
    )
    return ok(result)


@router.get("/oauth/google/status")
def oauth_status(remote_name: str = "", user: Dict[str, Any] = Depends(require_module("cloud_sync"))) -> Dict[str, Any]:
    if remote_name:
        from .logic import Store as S
        row = S._get_token(remote_name)
        return ok({"remote_name": remote_name, "connected": bool(row), "token": row})
    return ok(Store.list_oauth_status())


@router.get("/stream_pair/{pair_id}")
async def stream_pair(pair_id: int):
    pairs = [p for p in Store.list_pairs() if p["id"] == pair_id]
    if not pairs:
        raise HTTPException(status_code=404, detail="Pair not found")
    pair = pairs[0]

    rclone_config = str(Store.get_rclone_config_path())
    remote = f\"{pair['remote_name']}:{pair['remote_path']}\"
    flags = {"sync_deletions": bool(pair.get("sync_deletions")), "transfers": int(pair.get("transfers") or 4)}

    async def event_gen():
        cmd = build_rclone_cmd(pair["direction"], pair["local_path"], remote, flags, rclone_config)
        if os.name == "nt":
            yield f\"data: {json.dumps({'msg':'[Mock] rclone '+ ' '.join(cmd[1:3]), 'progress':20})}\\n\\n\"
            await asyncio.sleep(1)
            yield f\"data: {json.dumps({'msg':'Syncing files...', 'progress':60})}\\n\\n\"
            await asyncio.sleep(1)
            yield f\"data: {json.dumps({'msg':'Sync complete!', 'progress':100,'done':True})}\\n\\n\"
            return
        try:
            proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)
            while True:
                line = await proc.stdout.readline()
                if not line:
                    break
                text = line.decode("utf-8", errors="replace").strip()
                payload = {"msg": text}
                if '"progress"' in text or '"transferred"' in text:
                    payload["rclone"] = text
                yield f\"data: {json.dumps(payload)}\\n\\n\"
            code = await proc.wait()
            if code == 0:
                yield f\"data: {json.dumps({'msg':'Done','done':True,'progress':100})}\\n\\n\"
            else:
                yield f\"data: {json.dumps({'error': 'rclone exited with code '+str(code), 'done':True})}\\n\\n\"
        except Exception as e:
            yield f\"data: {json.dumps({'error': str(e), 'done':True})}\\n\\n\"

    return StreamingResponse(event_gen(), media_type="text/event-stream")

