from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel, Field


ProtocolType = Literal["ftp", "ftps", "sftp"]
AuthType = Literal["password", "key_path", "key_blob"]
TransferDirection = Literal["download", "upload"]


class ConnectionCreate(BaseModel):
    label: str = Field(..., min_length=1, max_length=120)
    protocol: ProtocolType = "sftp"
    host: str = Field(..., min_length=1, max_length=253)
    port: int = Field(0, ge=0, le=65535)
    username: str = Field(..., min_length=1, max_length=128)
    auth_type: AuthType = "password"
    password: Optional[str] = Field(None, max_length=4096)
    key_path: Optional[str] = Field(None, max_length=4096)
    key_blob: Optional[str] = Field(None, max_length=65536)
    remote_root: str = Field("/", max_length=2048)
    passive: bool = True
    timeout: int = Field(30, ge=5, le=300)


class ConnectionUpdate(BaseModel):
    label: Optional[str] = Field(None, min_length=1, max_length=120)
    protocol: Optional[ProtocolType] = None
    host: Optional[str] = Field(None, min_length=1, max_length=253)
    port: Optional[int] = Field(None, ge=1, le=65535)
    username: Optional[str] = Field(None, min_length=1, max_length=128)
    auth_type: Optional[AuthType] = None
    password: Optional[str] = Field(None, max_length=4096)
    key_path: Optional[str] = Field(None, max_length=4096)
    key_blob: Optional[str] = Field(None, max_length=65536)
    remote_root: Optional[str] = Field(None, max_length=2048)
    passive: Optional[bool] = None
    timeout: Optional[int] = Field(None, ge=5, le=300)
    clear_password: bool = False
    clear_key: bool = False


class ConnectionTestBody(BaseModel):
    """Optional ad-hoc credentials for testing before save."""
    label: Optional[str] = Field(None, max_length=120)
    protocol: Optional[ProtocolType] = None
    host: Optional[str] = Field(None, min_length=1, max_length=253)
    port: Optional[int] = Field(None, ge=0, le=65535)
    username: Optional[str] = Field(None, min_length=1, max_length=128)
    auth_type: Optional[AuthType] = None
    password: Optional[str] = Field(None, max_length=4096)
    key_path: Optional[str] = Field(None, max_length=4096)
    key_blob: Optional[str] = Field(None, max_length=65536)
    remote_root: Optional[str] = Field(None, max_length=2048)
    passive: Optional[bool] = None
    timeout: Optional[int] = Field(None, ge=5, le=300)


class MkdirBody(BaseModel):
    path: str = Field(..., min_length=1, max_length=4096)


class RenameBody(BaseModel):
    path: str = Field(..., min_length=1, max_length=4096)
    new_name: str = Field(..., min_length=1, max_length=512)


class DeleteBody(BaseModel):
    path: str = Field(..., min_length=1, max_length=4096)
    recursive: bool = False


class TransferBody(BaseModel):
    connection_id: int
    direction: TransferDirection
    remote_path: str = Field(..., min_length=1, max_length=4096)
    local_path: str = Field(..., min_length=1, max_length=4096)
    overwrite: bool = True


class LocalExploreQuery(BaseModel):
    path: str = "/"
