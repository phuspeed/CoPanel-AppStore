"""Audio Player API."""
from __future__ import annotations

import os
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Header, Query, Request
from fastapi.responses import FileResponse

from core.api import ApiError, ok
from core.audit import record_audit
from core.auth import require_module, user_has_module

from . import logic
from .schemas import (
    CreatePlaylistRequest,
    PlaylistTracksRequest,
    RenamePlaylistRequest,
    SaveSettingsRequest,
)

router = APIRouter()


def _auth_user(
    request: Request,
    authorization: Optional[str] = Header(None),
) -> Dict[str, Any]:
    """Bearer header, or a path-scoped ``?media_token=`` for <audio>/<img>.

    Browsers cannot attach Authorization headers to media requests. The core
    middleware (CoPanel 1.1.15+) verifies ``media_token`` for this path and
    stores the user on ``request.state.stream_user``. The login JWT is never
    accepted in the URL.
    """
    user = None
    if authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            try:
                from core.auth import user_from_access_token
            except ImportError:  # pragma: no cover - very old core
                user_from_access_token = None
            if user_from_access_token is not None:
                user = user_from_access_token(parts[1])
    if not user:
        user = getattr(request.state, "stream_user", None)
    if not user:
        raise ApiError("UNAUTHORIZED", "Authentication required", http_status=401)
    if not user_has_module(user, "audio_station"):
        raise ApiError(
            "FORBIDDEN",
            "Access to module 'audio_station' is not granted.",
            http_status=403,
        )
    return user


def _is_superadmin(user: Dict[str, Any]) -> bool:
    return user.get("role") == "superadmin"


def _restricted_folder_picker(path: str, user: Dict[str, Any]) -> Dict[str, Any]:
    """Folder picker for non-superadmin users: only inside their permitted folders."""
    try:
        from core.user_home import permitted_folders
        from modules.file_manager.router import check_safe_path
    except Exception:  # older panel / File Manager missing: deny rather than browse freely
        raise ApiError("FORBIDDEN", "Folder access check unavailable.", http_status=403)
    # Read-only: home folders are created at login (CoPanel 1.1.15), never
    # from a GET as root.
    folders = [os.path.abspath(f) for f in permitted_folders(user)]
    if not folders:
        raise ApiError("FORBIDDEN", "No permitted folders for this user.", http_status=403)
    target = check_safe_path(path or folders[0], user)
    if not os.path.isdir(target):
        raise ApiError("NOT_FOUND", "Folder not found.", http_status=404)
    entries = []
    try:
        for name in sorted(os.listdir(target), key=str.lower):
            full = os.path.join(target, name)
            if not name.startswith(".") and os.path.isdir(full):
                entries.append({"name": name, "path": full, "type": "dir"})
    except PermissionError:
        pass
    parent = os.path.dirname(target)
    if os.path.realpath(target) in {os.path.realpath(f) for f in folders} or parent == target:
        parent = None
    return {
        "current": target,
        "parent": parent,
        "entries": entries,
        "volumes": [{"label": f, "path": f} for f in folders],
        "library_roots": logic.get_library_roots(),
    }


try:
    logic.ensure_startup()
except Exception:
    pass


@router.get("/settings")
def get_settings(
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.get_settings())


@router.put("/settings")
def save_settings(
    req: SaveSettingsRequest,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    if not _is_superadmin(user):
        # Library roots, scan and symlink options are server-wide.
        raise ApiError("FORBIDDEN", "Only an administrator can change Audio Station settings.", http_status=403)
    try:
        saved = logic.save_settings(req.model_dump(exclude_none=True))
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    record_audit("audio.settings", module="audio_station", actor=user.get("username"))
    return ok(saved)


@router.get("/folders/browse")
def browse_folders_picker(
    path: str = Query(""),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    if not _is_superadmin(user):
        return ok(_restricted_folder_picker(path, user))
    return ok(logic.browse_folders_picker(path))


@router.get("/browse")
def browse_library(
    path: str = Query(""),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    try:
        return ok(logic.browse_library(path))
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)


@router.get("/library/stats")
def library_stats(
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.get_library_stats())


@router.get("/library/tracks")
def library_tracks(
    q: str = Query(""),
    sort: str = Query("title"),
    offset: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=2000),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_tracks(q=q, sort=sort, offset=offset, limit=limit))


@router.get("/library/albums")
def library_albums(
    q: str = Query(""),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_albums(q=q))


@router.get("/library/albums/{album_key}/tracks")
def album_tracks(
    album_key: str,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_album_tracks(album_key))


@router.get("/library/artists")
def library_artists(
    q: str = Query(""),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_artists(q=q))


@router.get("/library/artists/{name}/tracks")
def artist_tracks(
    name: str,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_artist_tracks(name))


@router.get("/library/genres")
def library_genres(
    q: str = Query(""),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_genres(q=q))


@router.get("/library/genres/{name}/tracks")
def genre_tracks(
    name: str,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_genre_tracks(name))


@router.get("/library/top-genres")
def top_genres(
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_top_genres())


@router.get("/library/recent")
def library_recent(
    limit: int = Query(100, ge=1, le=500),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_recent_tracks(limit=limit))


@router.get("/library/random")
def library_random(
    limit: int = Query(100, ge=1, le=500),
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_random_tracks(limit=limit))


@router.get("/playlists")
def playlists(
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.list_playlists())


@router.post("/playlists")
def create_playlist(
    req: CreatePlaylistRequest,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    pl = logic.create_playlist(req.name)
    record_audit("audio.playlist.create", module="audio_station", target=pl["id"], actor=user.get("username"))
    return ok(pl)


@router.put("/playlists/{playlist_id}")
def rename_playlist(
    playlist_id: str,
    req: RenamePlaylistRequest,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    try:
        pl = logic.rename_playlist(playlist_id, req.name)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    if not pl:
        raise ApiError("NOT_FOUND", "Playlist not found", http_status=404)
    return ok(pl)


@router.delete("/playlists/{playlist_id}")
def delete_playlist(
    playlist_id: str,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    try:
        deleted = logic.delete_playlist(playlist_id)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    if not deleted:
        raise ApiError("NOT_FOUND", "Playlist not found", http_status=404)
    record_audit("audio.playlist.delete", module="audio_station", target=playlist_id, actor=user.get("username"))
    return ok({"deleted": True})


@router.get("/playlists/{playlist_id}/tracks")
def playlist_tracks(
    playlist_id: str,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    data = logic.get_playlist_tracks(playlist_id)
    if data.get("playlist") is None:
        raise ApiError("NOT_FOUND", "Playlist not found", http_status=404)
    return ok(data)


@router.post("/playlists/{playlist_id}/tracks")
def add_playlist_tracks(
    playlist_id: str,
    req: PlaylistTracksRequest,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    try:
        data = logic.add_tracks_to_playlist(playlist_id, req.track_ids)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    return ok(data)


@router.delete("/playlists/{playlist_id}/tracks/{position}")
def remove_playlist_track(
    playlist_id: str,
    position: int,
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    try:
        removed = logic.remove_playlist_track(playlist_id, position)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    if not removed:
        raise ApiError("NOT_FOUND", "Track not found in playlist", http_status=404)
    return ok({"removed": True})


@router.post("/library/scan")
def start_scan(
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    status = logic.trigger_scan()
    record_audit("audio.scan", module="audio_station", actor=user.get("username"))
    return ok(status)


@router.get("/library/scan/status")
def scan_status(
    user: Dict[str, Any] = Depends(require_module("audio_station")),
) -> Dict[str, Any]:
    return ok(logic.get_scan_status())


@router.get("/cover")
async def cover_art(
    path: str = Query(""),
    id: str = Query(""),
    hash: str = Query(""),
    user: Dict[str, Any] = Depends(_auth_user),
) -> FileResponse:
    try:
        target, media_type = logic.get_cover_info(path=path, track_id=id, cover_hash=hash)
    except ValueError as exc:
        raise ApiError("NOT_FOUND", str(exc), http_status=404)
    return FileResponse(path=target, media_type=media_type)


@router.get("/stream")
async def stream_audio(
    path: str = Query(..., min_length=1),
    user: Dict[str, Any] = Depends(_auth_user),
) -> FileResponse:
    try:
        target, media_type = logic.get_stream_info(path)
    except ValueError as exc:
        raise ApiError("VALIDATION_ERROR", str(exc), http_status=400)
    return FileResponse(
        path=target,
        media_type=media_type,
        filename=os.path.basename(target),
    )
