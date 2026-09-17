import React from "react";
import { Mic, Sparkles } from "lucide-react";

export function VoiceButton({ isOpen, onClick, isListening, isSpeaking, voiceStatus }) {
  return (
    <div className={`voiceButtonContainer ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className={`floatingVoiceBtn ${isListening ? "listening" : ""} ${isSpeaking ? "speaking" : ""}`}
        onClick={onClick}
        aria-label="Open AgriAI Tamil Voice Assistant"
        title="AgriAI Tamil Voice Assistant"
      >
        <span className="btnRings"></span>
        <span className="btnRings ring2"></span>
        <div className="btnInner">
          <Mic size={22} className="micIcon" />
          <Sparkles size={12} className="sparkleIcon" />
        </div>
      </button>
      <div className="floatingBadge" onClick={onClick}>
        <span>Ask AgriAI</span>
        <span className="langTag">தமிழ் / Eng</span>
      </div>
    </div>
  );
}

export default VoiceButton;
