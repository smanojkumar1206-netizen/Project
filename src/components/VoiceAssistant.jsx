import React, { useState, useEffect, useRef } from "react";
import {
  Mic, MicOff, Volume2, VolumeX, Trash2, X, Send, Square,
  Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Zap, Lock
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import ChatMessage from "./ChatMessage";
import { speakResponse, stopSpeaking, isSpeaking, createSpeechRecognizer } from "../services/voiceApi";
import { sendAssistantMessage } from "../services/assistantApi";

export function VoiceAssistant({
  isOpen,
  onClose,
  role = "farmer",
  userId = "USR-FARMER-1",
  setPage,
  notify,
  appState = {}
}) {
  // User Chat Privacy Scoping
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [language, setLanguage] = useState("auto"); // auto language detection
  const [aiMode, setAiMode] = useState("demo"); // 'demo' or 'live'
  const [voiceStatus, setVoiceStatus] = useState("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const [recognizer, setRecognizer] = useState(null);

  const messagesEndRef = useRef(null);

  // Initialize/Reset conversation history when active user/role changes (Chat Privacy Enforcement)
  useEffect(() => {
    stopSpeaking();
    setMessages([
      {
        id: `init-${userId}-${Date.now()}`,
        sender: "ai",
        text: `வணக்கம் ${role.toUpperCase()}! AgriConnect-ல் உங்களுக்கு எப்படி உதவலாம்? (Multi-lingual AgriAI Assistant)`,
        language: "ta",
        time: "Just now"
      }
    ]);
  }, [userId, role]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Configure Speech Recognizer
  useEffect(() => {
    const rec = createSpeechRecognizer(
      language === "auto" ? "ta-IN" : language,
      (transcript) => {
        setVoiceStatus("PROCESSING");
        handleUserQuery(transcript);
      },
      (error) => {
        setVoiceStatus("ERROR");
        setErrorMessage("Microphone audio error. Please try again.");
      },
      () => {
        setVoiceStatus((prev) => (prev === "LISTENING" ? "IDLE" : prev));
      }
    );
    setRecognizer(rec);
  }, [language]);

  const handleStartListening = () => {
    stopSpeaking();
    setErrorMessage("");

    if (recognizer) {
      try {
        setVoiceStatus("LISTENING");
        recognizer.start();
      } catch (err) {
        setVoiceStatus("LISTENING");
        setTimeout(() => {
          setVoiceStatus("PROCESSING");
          const demoQueries = {
            farmer: "என்னிடம் 500 கிலோ தக்காளி இருக்கு. வாங்குற buyer இருக்காங்களா?",
            buyer: "Where is my tomato order?",
            transporter: "எனக்கு இன்று transport request இருக்கா?",
            admin: "System analytics & users summary"
          };
          handleUserQuery(demoQueries[role] || demoQueries.farmer);
        }, 2000);
      }
    } else {
      setVoiceStatus("LISTENING");
      setTimeout(() => {
        setVoiceStatus("PROCESSING");
        handleUserQuery("என்னிடம் 500 கிலோ தக்காளி இருக்கு. வாங்குற buyer இருக்காங்களா?");
      }, 1800);
    }
  };

  const handleStopListening = () => {
    if (recognizer) {
      try { recognizer.stop(); } catch (e) {}
    }
    setVoiceStatus("IDLE");
  };

  const handleUserQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: queryText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setVoiceStatus("TOOL_EXECUTION");

    try {
      const result = await sendAssistantMessage({
        message: queryText,
        role,
        userId,
        language,
        aiMode,
        appState,
        conversation: messages.map((m) => ({ sender: m.sender, text: m.text }))
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: result.reply,
        language: result.language,
        tool_used: result.tool_used,
        data: result.data,
        nav_target: result.nav_target,
        action_button_label: result.action_button_label,
        action_required: result.action_required,
        confirm_payload: result.confirm_payload,
        is_demo_data: result.is_demo_data,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setVoiceStatus("SPEAKING");

      // Voice output in matching language
      speakResponse(result.reply, result.language, () => setVoiceStatus("IDLE"));
    } catch (err) {
      console.error("AgriAI Error:", err);
      setVoiceStatus("ERROR");
      setErrorMessage("Could not process request. Please try again.");
    }
  };

  const handleConfirmAction = (messageObj) => {
    if (messageObj.confirm_payload && appState.setListings) {
      const payload = messageObj.confirm_payload;
      const newListing = {
        id: Date.now(),
        crop: payload.crop,
        farmer: payload.farmer || "Ravi Kumar",
        qty: payload.qty,
        price: payload.price,
        location: payload.location,
        status: "Available"
      };

      appState.setListings((prev) => [newListing, ...prev]);
      setMessages((prev) => prev.map((m) => (m.id === messageObj.id ? { ...m, confirmed: true } : m)));
      speakResponse(`உங்கள் ${payload.qty} kg ${payload.crop} list செய்யப்பட்டது!`, "ta");
      notify && notify(`Produce listed: ${payload.qty} kg ${payload.crop}`);
    }
  };

  const handleCancelAction = (messageObj) => {
    setMessages((prev) => prev.map((m) => (m.id === messageObj.id ? { ...m, cancelled: true } : m)));
  };

  // Preset Questions in 7 languages
  const presetQueries = [
    { label: "Tamil", text: "என்னிடம் 500 கிலோ தக்காளி இருக்கு. வாங்குற buyer இருக்காங்களா?" },
    { label: "Tanglish", text: "En tomato order enga irukku?" },
    { label: "English", text: "Where is my tomato order?" },
    { label: "Malayalam", text: "എന്റെ ടൊമാറ്റോ ഓർഡർ എവിടെയാണ്?" },
    { label: "Telugu", text: "నా టమాటో ఆర్డర్ ఎక్కడ ఉంది?" },
    { label: "Hindi", text: "मेरा टमाटर ऑर्डर कहाँ है?" },
    { label: "Kannada", text: "ನನ್ನ ಟೊಮೆಟೊ ಆರ್ಡರ್ ಎಲ್ಲಿದೆ?" }
  ];

  if (!isOpen) return null;

  return (
    <div className="voiceAssistantOverlay">
      <div className="voiceAssistantPanel">
        {/* Header */}
        <div className="assistantHeader">
          <div className="headerBrand">
            <div className="brandAvatar">🌾</div>
            <div>
              <div className="brandTitleRow">
                <h3>AgriAI</h3>
                <span className="rolePillTag">{role.toUpperCase()}</span>
                <span className="privacyLockTag" title="Private Session (User Scoped)">
                  <Lock size={10} /> Private
                </span>
              </div>
              <p className="subText">7 Languages • Auto Same-Language Reply</p>
            </div>
          </div>

          <div className="headerActions">
            <button
              type="button"
              className={`modeTogglePill ${aiMode === "demo" ? "demo" : "live"}`}
              onClick={() => setAiMode(aiMode === "demo" ? "live" : "demo")}
            >
              <Zap size={11} /> {aiMode === "demo" ? "● Demo AI" : "● Live AI"}
            </button>
            <button type="button" className="closeAssistantBtn" onClick={() => { stopSpeaking(); onClose(); }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 7 Regional Language Presets */}
        <div className="presetSection">
          <div className="presetTitle">
            <Sparkles size={12} /> Test Multi-Lingual Same-Language Responses:
          </div>
          <div className="presetChipsRow">
            {presetQueries.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="presetChip"
                onClick={() => handleUserQuery(item.text)}
              >
                <b>[{item.label}]</b> "{item.text}"
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="chatContainer">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSpeak={(text, lang) => speakResponse(text, lang)}
              onNavigate={(target) => { onClose(); setPage(target); }}
              onConfirmAction={handleConfirmAction}
              onCancelAction={handleCancelAction}
            />
          ))}

          {/* Voice State Animations */}
          {voiceStatus === "LISTENING" && (
            <div className="statusWaveBox listening">
              <div className="waveBars"><span></span><span></span><span></span><span></span><span></span></div>
              <p>Listening... பேசுங்கள்... Speak in any language...</p>
            </div>
          )}

          {voiceStatus === "PROCESSING" && (
            <div className="statusWaveBox processing">
              <RefreshCw size={18} className="spinIcon" />
              <p>Detecting user language & intent...</p>
            </div>
          )}

          {voiceStatus === "TOOL_EXECUTION" && (
            <div className="statusWaveBox tools">
              <ShieldCheck size={18} className="pulseIcon" />
              <p>Executing AgriConnect validated tools...</p>
            </div>
          )}

          {voiceStatus === "SPEAKING" && (
            <div className="statusWaveBox speaking">
              <Volume2 size={18} className="pulseIcon" />
              <p>Replying in detected same language...</p>
              <button type="button" className="stopSpeechBtn" onClick={() => { stopSpeaking(); setVoiceStatus("IDLE"); }}>
                <Square size={10} /> Stop
              </button>
            </div>
          )}

          {voiceStatus === "ERROR" && (
            <div className="statusWaveBox error">
              <AlertTriangle size={18} />
              <p>{errorMessage || "Could not process request."}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="assistantFooter">
          <div className="footerTopControls">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <div className="rightToolBtns">
              <button
                type="button"
                className="iconToolBtn"
                onClick={() => {
                  setMessages([{
                    id: `init-${userId}-${Date.now()}`,
                    sender: "ai",
                    text: `History cleared. How can AgriAI help you today?`,
                    language: "en",
                    time: "Just now"
                  }]);
                  notify && notify("Chat history cleared");
                }}
                title="Clear history"
              >
                <Trash2 size={15} />
              </button>
              {isSpeaking() && (
                <button type="button" className="iconToolBtn active" onClick={() => { stopSpeaking(); setVoiceStatus("IDLE"); }}>
                  <VolumeX size={15} />
                </button>
              )}
            </div>
          </div>

          <form className="inputFormRow" onSubmit={(e) => { e.preventDefault(); handleUserQuery(inputQuery); }}>
            <button
              type="button"
              className={`micTriggerBtn ${voiceStatus === "LISTENING" ? "active" : ""}`}
              onClick={voiceStatus === "LISTENING" ? handleStopListening : handleStartListening}
            >
              {voiceStatus === "LISTENING" ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input
              type="text"
              className="textQueryInput"
              placeholder="Ask in Tamil, English, Tanglish, Malayalam, Telugu, Hindi, Kannada..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            <button type="submit" className="sendQueryBtn" disabled={!inputQuery.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VoiceAssistant;
