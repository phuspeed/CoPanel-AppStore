"""Request bodies for speedtest module."""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class RunBody(BaseModel):
    server_id: Optional[str] = Field(default="cloudflare")
    download_bytes: Optional[int] = Field(default=None, ge=1_000_000, le=200_000_000)
    upload_bytes: Optional[int] = Field(default=None, ge=500_000, le=100_000_000)
