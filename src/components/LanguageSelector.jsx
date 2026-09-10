import React from "react";
import { Globe } from "lucide-react";

export function LanguageSelector({ language, setLanguage }) {
  const languages = [
    { code: "ta", label: "தமிழ்" },
    { code: "tanglish", label: "Tanglish" },
    { code: "en", label: "English" },
    { code: "ml", label: "മലയാളം" },
    { code: "te", label: "తెలుగు" },
    { code: "hi", label: "हिंदी" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "auto", label: "Auto" }
  ];

  return (
    <div className="languageSelector multi">
      <Globe size={13} className="langIcon" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="langSelectDropdown"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
