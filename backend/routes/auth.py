import os
import json
import base64
import logging
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from db.database import db
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

logger = logging.getLogger("agriconnect_auth_route")
router = APIRouter(prefix="/api/auth", tags=["Auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

# Request Schemas
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
    extra_fields: Optional[Dict[str, Any]] = None

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    google_id: Optional[str] = None

class GoogleCompleteProfileRequest(BaseModel):
    email: str
    role: str # farmer | buyer | transporter ONLY
    full_name: str
    phone: Optional[str] = ""
    location: Optional[str] = "Madurai"
    google_id: Optional[str] = None
    picture: Optional[str] = None
    extra_fields: Optional[Dict[str, Any]] = None

def _decode_google_credential(credential: str) -> Dict[str, Any]:
    """
    Decodes Google ID Token credential.
    Uses google-auth if Client ID is configured, otherwise extracts verified/unverified payload safely.
    """
    if GOOGLE_CLIENT_ID:
        try:
            from google.oauth2 import id_token  # type: ignore
            from google.auth.transport import requests as google_requests  # type: ignore
            idinfo = id_token.verify_oauth2_token(credential, google_requests.Request(), GOOGLE_CLIENT_ID)
            return idinfo
        except Exception as e:
            logger.warning(f"Google token verification with client ID failed: {e}. Falling back to token payload inspection.")

    # Base64 decode payload if token has 3 dot-separated JWT parts
    try:
        parts = credential.split(".")
        if len(parts) == 3:
            payload_b64 = parts[1]
            padding = '=' * (4 - (len(payload_b64) % 4))
            decoded_bytes = base64.urlsafe_b64decode(payload_b64 + padding)
            return json.loads(decoded_bytes.decode('utf-8'))
    except Exception as e:
        logger.warning(f"Failed to parse Google JWT parts: {e}")

    return {}

# -------------------------------------------------------------
# 1. Standard Email & Password Login
# -------------------------------------------------------------
@router.post("/login")
async def login(req: LoginRequest):
    clean_email = req.email.lower().strip()

    # Predefined Admin Validation
    if clean_email == "admin@agriconnect.com":
        if req.password != "AgriConnect@Admin2026":
            raise HTTPException(status_code=401, detail="Invalid password for Admin account. Access denied.")
        
        token = create_access_token({
            "sub": "USR-ADMIN-001",
            "email": "admin@agriconnect.com",
            "role": "admin",
            "name": "System Administrator"
        })
        return {
            "success": True,
            "message": "Admin authenticated successfully",
            "token": token,
            "profile": {
                "id": "USR-ADMIN-001",
                "full_name": "System Administrator",
                "email": "admin@agriconnect.com",
                "role": "admin",
                "location": "Central HQ, Chennai"
            }
        }

    # Reject non-admin email attempting admin password
    if req.password == "AgriConnect@Admin2026" and clean_email != "admin@agriconnect.com":
        raise HTTPException(status_code=403, detail="Forbidden: Admin credentials do not match profile.")

    # Find registered user in MongoDB / in-memory store
    user = db.get_user_by_email(clean_email)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="No account found with this email. Please register or sign in with Google."
        )

    stored_hash = user.get("hashed_password")
    if stored_hash and not verify_password(req.password, stored_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    user_profile = dict(user)
    user_profile.pop("hashed_password", None)

    # Generate real signed JWT token
    token = create_access_token({
        "sub": user_profile.get("id"),
        "email": user_profile.get("email"),
        "role": user_profile.get("role"),
        "name": user_profile.get("full_name")
    })

    return {
        "success": True,
        "token": token,
        "profile": user_profile
    }

# -------------------------------------------------------------
# 2. Standard Email & Password Registration
# -------------------------------------------------------------
@router.post("/register")
async def register(req: RegisterRequest):
    clean_email = req.email.lower().strip()

    if req.role.lower() == "admin" or clean_email == "admin@agriconnect.com":
        raise HTTPException(status_code=403, detail="Forbidden: Admin accounts cannot be created via public registration.")

    # Check if user already exists
    existing = db.get_user_by_email(clean_email)
    if existing and existing.get("email", "").lower() == clean_email:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_profile = db.register_user(
        full_name=req.full_name,
        email=clean_email,
        phone=req.phone,
        role=req.role.lower(),
        location=req.location,
        password=req.password,
        extra_fields=req.extra_fields
    )

    token = create_access_token({
        "sub": user_profile["id"],
        "email": user_profile["email"],
        "role": user_profile["role"],
        "name": user_profile["full_name"]
    })

    return {
        "success": True,
        "message": f"Account created as {req.role.upper()}!",
        "token": token,
        "profile": user_profile
    }

# -------------------------------------------------------------
# 3. Google Authentication & Identity Lookup
# -------------------------------------------------------------
@router.post("/google")
async def google_auth(req: GoogleAuthRequest):
    email = req.email
    name = req.name
    picture = req.picture
    google_id = req.google_id

    # If credential was passed from Google Identity Services
    if req.credential:
        payload = _decode_google_credential(req.credential)
        if payload:
            email = payload.get("email", email)
            name = payload.get("name", name)
            picture = payload.get("picture", picture)
            google_id = payload.get("sub", google_id)

    if not email:
        raise HTTPException(status_code=400, detail="Google authentication failed: Email not found in credential.")

    clean_email = email.lower().strip()

    # Admin check: If admin signs in with Google, grant admin role
    if clean_email == "admin@agriconnect.com":
        token = create_access_token({
            "sub": "USR-ADMIN-001",
            "email": "admin@agriconnect.com",
            "role": "admin",
            "name": name or "System Administrator"
        })
        return {
            "success": True,
            "needs_role_selection": False,
            "token": token,
            "profile": {
                "id": "USR-ADMIN-001",
                "full_name": name or "System Administrator",
                "email": "admin@agriconnect.com",
                "role": "admin",
                "location": "Central HQ, Chennai",
                "picture": picture
            }
        }

    # Check if user already exists by email or google_id
    existing_user = db.get_user_by_google_id(google_id) if google_id else None
    if not existing_user:
        existing_user = db.get_user_by_email(clean_email)

    # Returning User: User already has a designated role in AgriConnect
    if existing_user and existing_user.get("role"):
        user_clean = dict(existing_user)
        user_clean.pop("hashed_password", None)
        
        # Link google_id or picture if not linked yet
        if google_id and not user_clean.get("google_id"):
            user_clean["google_id"] = google_id
        if picture and not user_clean.get("picture"):
            user_clean["picture"] = picture

        token = create_access_token({
            "sub": user_clean.get("id"),
            "email": user_clean.get("email"),
            "role": user_clean.get("role"),
            "name": user_clean.get("full_name")
        })

        return {
            "success": True,
            "needs_role_selection": False,
            "token": token,
            "profile": user_clean
        }

    # New User: Prompt for Role Selection (Farmer, Buyer, Transporter)
    return {
        "success": True,
        "needs_role_selection": True,
        "google_user": {
            "email": clean_email,
            "full_name": name or clean_email.split("@")[0].capitalize(),
            "google_id": google_id or f"g-{clean_email}",
            "picture": picture or ""
        }
    }

# -------------------------------------------------------------
# 4. Google User Onboarding (Complete Profile & Role)
# -------------------------------------------------------------
@router.post("/google/complete-profile")
async def google_complete_profile(req: GoogleCompleteProfileRequest):
    clean_email = req.email.lower().strip()
    norm_role = req.role.lower().strip()

    # Security: Normal public Google users cannot assign themselves Admin role
    if norm_role == "admin" or clean_email == "admin@agriconnect.com":
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Admin role cannot be self-selected."
        )

    if norm_role not in ["farmer", "buyer", "transporter"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role selected. Must be 'farmer', 'buyer', or 'transporter'."
        )

    # Register user in MongoDB with selected role
    user_profile = db.register_user(
        full_name=req.full_name,
        email=clean_email,
        phone=req.phone or "",
        role=norm_role,
        location=req.location or "Madurai",
        google_id=req.google_id,
        picture=req.picture,
        extra_fields=req.extra_fields
    )

    # Issue signed AgriConnect JWT with the selected role
    token = create_access_token({
        "sub": user_profile["id"],
        "email": user_profile["email"],
        "role": user_profile["role"],
        "name": user_profile["full_name"]
    })

    return {
        "success": True,
        "message": f"Welcome to AgriConnect as {norm_role.upper()}!",
        "token": token,
        "profile": user_profile
    }

# -------------------------------------------------------------
# 5. Token Validation / Current User Profile
# -------------------------------------------------------------
@router.get("/me")
async def get_me(authorization: Optional[str] = Header(None)):
    """Validates the Bearer JWT and returns the current user profile."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token.")

    email = payload.get("email")
    user = db.get_user_by_email(email)
    if not user:
        return {"user": payload}

    user_clean = dict(user)
    user_clean.pop("hashed_password", None)
    return {"user": user_clean}

# Helper Dependency for Backend Authorization
def get_current_user_role(
    authorization: Optional[str] = Header(None),
    x_user_role: Optional[str] = Header(None, alias="X-User-Role")
) -> str:
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "role" in payload:
            return payload["role"].lower()
    
    if x_user_role:
        return x_user_role.lower()
    
    return "farmer"

def require_role(allowed_role: str):
    def role_dependency(role: str = Depends(get_current_user_role)):
        if role != allowed_role.lower():
            raise HTTPException(
                status_code=403,
                detail=f"Forbidden: Access restricted. Requires '{allowed_role}' role."
            )
        return role
    return role_dependency
