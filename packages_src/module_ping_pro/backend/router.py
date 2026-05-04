from fastapi import APIRouter

router = APIRouter()

@router.get("")
@router.get("/")
def ping_status():
    return {"status": "success", "message": "Pong from Ping Pro Module!"}
