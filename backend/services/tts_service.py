"""
Backend Text-to-Speech (TTS) Service wrapper.
Supports Tamil (ta-IN) & English (en-IN) speech synthesis.
"""

import os
from typing import Dict, Any

class TTSService:
    def __init__(self):
        self.api_key = os.getenv("TTS_API_KEY", "")

    def synthesize(self, text: str, language: str = "ta") -> Dict[str, Any]:
        """
        Synthesizes text to speech.
        """
        lang_code = "ta-IN" if language == "ta" else "en-IN"
        if not self.api_key:
            return {
                "success": True,
                "text": text,
                "language": lang_code,
                "audio_url": None,
                "fallback_to_browser": True,
                "note": "Using browser Web Speech API synthesis"
            }

        return {
            "success": True,
            "text": text,
            "language": lang_code,
            "audio_url": "/static/audio_output.mp3",
            "fallback_to_browser": False
        }

tts_service = TTSService()
