from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from db.database import db
from routes.auth import require_role

router = APIRouter(prefix="/api/admin", tags=["Admin Management"])

@router.get("/users", dependencies=[Depends(require_role("admin"))])
async def get_all_users(role_filter: Optional[str] = Query("all")):
    """
    Protected Admin endpoint: Returns all registered users from database.
    Requires role == 'admin'.
    """
    return db.get_users(role_filter)

@router.get("/stats", dependencies=[Depends(require_role("admin"))])
async def get_admin_stats():
    """
    Protected Admin endpoint: Returns system statistics dynamically.
    Requires role == 'admin'.
    """
    return db.get_admin_stats()
