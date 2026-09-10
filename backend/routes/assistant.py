from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.llm_service import llm_service

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])

class ChatMessage(BaseModel):
    sender: str
    text: str

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "auto"
    role: Optional[str] = "farmer"
    conversation: Optional[List[Dict[str, Any]]] = []

@router.post("/chat")
async def chat_with_assistant(req: ChatRequest):
    if not req.message:
        raise HTTPException(status_code=400, detail="Message string is required.")
    
    response = llm_service.process_chat(
        message=req.message,
        role=req.role,
        language=req.language,
        conversation=req.conversation
    )
    return response
