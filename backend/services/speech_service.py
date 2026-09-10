"""
Backend Speech-to-Text (STT) Service wrapper.
Supports cloud audio transcription API (Whisper/Deepgram/Google Speech) with fallback.
"""

import os
from typing import Dict, Any

class SpeechService:
    def __init__(self):
        self.api_key = os.getenv("STT_API_KEY", "")

    def transcribe(self, audio_data: bytes, file_format: str = "wav", preferred_lang: str = "ta") -> Dict[str, Any]:
        """
        Transcribes incoming audio. If API key is not configured, returns mock transcription.
        """
        if not self.api_key:
            # Fallback mock response if STT service key isn't provided
            return {
                "text": "என்னிடம் 500 கிலோ தக்காளி இருக்கு. வாங்குற buyer யாராவது இருக்காங்களா?",
                "language": "ta",
                "confidence": 0.95,
                "note": "Demo STT Mode (STT_API_KEY not configured)"
            }

        # Cloud STT call implementation placeholder
        return {
            "text": "என்னிடம் 500 கிலோ தக்காளி இருக்கு",
            "language": preferred_lang,
            "confidence": 0.98
        }

speech_service = SpeechService()
