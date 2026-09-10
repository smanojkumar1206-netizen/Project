from fastapi import APIRouter
from typing import Optional
from services.notification_service import notification_service

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/")
async def get_notifications(user_id: Optional[str] = "USR-FARMER-1", role: Optional[str] = "farmer"):
    return notification_service.get_user_notifications(user_id, role)

@router.post("/{notif_id}/read")
async def mark_read(notif_id: str):
    notification_service.mark_as_read(notif_id)
    return {"success": True}
