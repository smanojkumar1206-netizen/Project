from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from db.database import db

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    role: str # farmer | buyer | transporter ONLY
    location: Optional[str] = "Madurai"

@router.post("/login")
async def login(req: LoginRequest):
    clean_email = req.email.lower().strip()

    # Predefined Admin Validation (Requirement #3 & #14)
    if clean_email == "admin@agriconnect.com":
        if req.password != "AgriConnect@Admin2026":
            raise HTTPException(status_code=401, detail="Invalid password for Admin account. Access denied.")
        return {
            "success": True,
            "message": "Admin authenticated successfully",
            "token": "bearer-admin-token-2026",
            "profile": {
                "id": "USR-ADMIN-001",
                "full_name": "System Administrator",
                "email": "admin@agriconnect.com",
                "role": "admin"
            }
        }

    # Reject non-admin email attempting admin password
    if req.password == "AgriConnect@Admin2026" and clean_email != "admin@agriconnect.com":
        raise HTTPException(status_code=403, detail="Forbidden: Admin credentials do not match profile.")

    # Find existing registered user
    users = db.get_users("all")
    user = next((u for u in users if u["email"].lower() == clean_email), None)

    if not user:
        # Demo fallback for testing credentials
        role = "farmer"
        if "buyer" in clean_email: role = "buyer"
        elif "trans" in clean_email: role = "transporter"

        user = {
            "id": f"USR-{role.upper()}-1",
            "full_name": clean_email.split("@")[0].capitalize(),
            "email": clean_email,
            "role": role
        }

    return {
        "success": True,
        "token": f"bearer-token-{user['role']}",
        "profile": user
    }

@router.post("/register")
async def register(req: RegisterRequest):
    clean_email = req.email.lower().strip()

    if req.role.lower() == "admin" or clean_email == "admin@agriconnect.com":
        raise HTTPException(status_code=403, detail="Forbidden: Admin accounts cannot be created via public registration.")

    user_profile = db.register_user(
        full_name=req.full_name,
        email=clean_email,
        phone=req.phone,
        role=req.role.lower(),
        location=req.location
    )

    return {
        "success": True,
        "message": f"Account created as {req.role.upper()}!",
        "profile": user_profile
    }

# Helper Dependency for Backend Authorization
def get_current_user_role(x_user_role: Optional[str] = Header(None, alias="X-User-Role")) -> str:
    if not x_user_role:
        return "farmer" # default fallback for unauthenticated requests
    return x_user_role.lower()

def require_role(allowed_role: str):
    def role_dependency(role: str = Depends(get_current_user_role)):
        if role != allowed_role.lower():
            raise HTTPException(
                status_code=403,
                detail=f"Forbidden: Access restricted. Requires '{allowed_role}' role."
            )
        return role
    return role_dependency
