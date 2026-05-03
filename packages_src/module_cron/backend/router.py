"""Cloud Backup Extension Router"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/schedule")
async def get_backup_schedule():
    return {
        "status": "success",
        "service": "Cloud Backup Extension",
        "schedule": "daily at 02:00",
    }

@router.post("/run")
async def run_backup():
    return {
        "status": "success",
        "message": "Backup job triggered successfully.",
    }
