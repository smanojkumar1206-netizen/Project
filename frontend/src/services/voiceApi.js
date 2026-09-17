/**
 * Voice API Service
 * Handles Speech Synthesis (TTS) and Browser Speech Recognition (STT)
 * Supports Tamil (ta-IN) and English (en-IN)
 */

let currentUtterance = null;

export const speakResponse = (text, language = "ta", onEnd = () => {}) => {
  if (!("speechSynthesis" in window)) {
    console.warn("Web Speech Synthesis is not supported in this browser.");
    onEnd();
    return;
  }

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Select language tag
  const langCode = language === "en" ? "en-IN" : "ta-IN";
  utterance.lang = langCode;
  utterance.rate = 0.95; // Slightly calmer speaking rate for clarity
  utterance.pitch = 1.0;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.substring(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    onEnd();
  };

  utterance.onerror = (e) => {
    console.error("TTS playback error:", e);
    currentUtterance = null;
    onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
};

export const isSpeaking = () => {
  return "speechSynthesis" in window && window.speechSynthesis.speaking;
};

/**
 * Creates browser SpeechRecognition instance if supported
 */
export const createSpeechRecognizer = (language = "ta-IN", onResult = () => {}, onError = () => {}, onEnd = () => {}) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language === "en" ? "en-IN" : "ta-IN";

  recognition.onresult = (event) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
};
