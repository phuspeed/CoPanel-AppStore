"""Redis Cache Manager Router"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
async def get_redis_status():
    return {
        "status": "success",
        "service": "Redis Cache Manager",
        "message": "This is a packaged Redis module."
    }
