"""ClamAV request schemas."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class UpdateSignaturesRequest(BaseModel):
    force: bool = False


class ScanRequest(BaseModel):
    path: str = Field(..., min_length=1)
    recursive: bool = True
    include_archives: bool = True
    max_file_size_mb: int = Field(100, ge=1, le=2048)
    auto_quarantine: bool = False


class QuarantineActionRequest(BaseModel):
    detection_id: str = Field(..., min_length=1)


class ClamAVSettingsRequest(BaseModel):
    quarantine_dir: str = Field(..., min_length=1)
    default_scan_targets: List[str] = Field(default_factory=list)
    exclude_paths: List[str] = Field(default_factory=list)
    retention_days: int = Field(30, ge=1, le=365)
    max_file_size_mb: int = Field(100, ge=1, le=2048)
    include_archives: bool = True
    preferred_engine: str = Field("auto", pattern=r"^(auto|clamscan|clamdscan)$")
