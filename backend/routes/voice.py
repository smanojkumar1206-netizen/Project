from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.speech_service import speech_service
from services.tts_service import tts_service

router = APIRouter(prefix="/api/voice", tags=["Voice"])

class SpeakRequest(BaseModel):
    text: str
    language: Optional[str] = "ta"

@router.post("/transcribe")
async def transcribe_audio(
    file: Optional[UploadFile] = File(None),
    language: Optional[str] = Form("ta")
):
    audio_bytes = await file.read() if file else b""
    result = speech_service.transcribe(audio_bytes, preferred_lang=language)
    return result

@router.post("/speak")
async def text_to_speech(req: SpeakRequest):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text parameter is required.")
    
    result = tts_service.synthesize(req.text, req.language)
    return result
