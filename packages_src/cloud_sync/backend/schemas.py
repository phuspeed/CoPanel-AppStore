from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Literal, Optional


class SavePairRequest(BaseModel):
    pair_name: str = Field(..., min_length=1, max_length=120)
    direction: Literal["upload", "download"] = "upload"
    local_path: str
    remote_name: str
    remote_path: str
    sync_deletions: bool = True
    transfers: int = 4
    active: bool = True


class UpdatePairRequest(BaseModel):
    pair_name: Optional[str] = Field(None, min_length=1, max_length=120)
    direction: Optional[Literal["upload", "download"]] = None
    local_path: Optional[str] = None
    remote_name: Optional[str] = None
    remote_path: Optional[str] = None
    sync_deletions: Optional[bool] = None
    transfers: Optional[int] = None
    active: Optional[bool] = None
