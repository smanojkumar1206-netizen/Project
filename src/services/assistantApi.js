/**
 * Assistant API Service
 * Supports 7 regional languages (Tamil, English, Tanglish, Malayalam, Telugu, Hindi, Kannada)
 * Enforces User Chat Privacy Scoping (userId & role)
 */

const BACKEND_URL = "http://localhost:8000/api/assistant/chat";

/**
 * Detect language across 7 regional languages
 */
export function detectLanguage(text) {
  if (!text) return "ta";
  const str = text.toLowerCase();

  // 1. Unicode Script Matching
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta"; // Tamil
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml"; // Malayalam
  if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Hindi / Devanagari
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn"; // Kannada

  // 2. Keyword Matching for Tanglish / Hinglish / etc.
  if (["buyer", "venum", "enga", "irukku", "kedaikkuma", "irukka", "enna", "paaru", "kidu", "pannu"].some(w => str.includes(w))) {
    return "tanglish";
  }
  if (["evideya", "undo", "venam", "njan", "ethra"].some(w => str.includes(w))) {
    return "ml";
  }
  if (["ekkada", "undhi", "kaavali", "naku", "yentha"].some(w => str.includes(w))) {
    return "te";
  }
  if (["kahan", "hai", "chahiye", "mera", "kitna"].some(w => str.includes(w))) {
    return "hi";
  }
  if (["ellide", "beku", "nanage", "yestu"].some(w => str.includes(w))) {
    return "kn";
  }

  return "en";
}

/**
 * Main Assistant Query Processor with User Privacy Scoping
 */
export async function sendAssistantMessage({
  message,
  role = "farmer",
  userId = "USR-FARMER-1",
  language = "auto",
  aiMode = "demo",
  appState = {},
  conversation = []
}) {
  const normRole = role ? role.toLowerCase() : "farmer";
  const activeLang = language === "auto" ? detectLanguage(message) : language;

  // Live Backend Call
  if (aiMode === "live") {
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          role: normRole,
          user_id: userId,
          language: activeLang,
          conversation
        })
      });

      if (res.ok) {
        const data = await res.json();
        return {
          reply: data.reply,
          language: data.language || activeLang,
          tool_used: data.tool_used,
          data: data.data,
          nav_target: data.nav_target,
          action_required: data.action_required || false,
          confirm_payload: data.confirm_payload || null
        };
      }
    } catch (err) {
      console.warn("AgriAI Backend unreachable, using Demo Engine:", err.message);
    }
  }

  // --- DEMO ENGINE (Supports Same-Language Response across all 7 languages) ---
  return processDemoQuery(message, normRole, userId, activeLang, appState);
}

function processDemoQuery(message, role, userId, language, appState) {
  const msgLower = message.toLowerCase();

  // Extract quantity & units
  let quantityKg = 500;
  const tonMatch = msgLower.match(/(\d+)\s*(ton|டன்)/);
  const kgMatch = msgLower.match(/(\d+)\s*(kg|kilo|கிலோ)/);
  if (tonMatch) quantityKg = parseFloat(tonMatch[1]) * 1000;
  else if (kgMatch) quantityKg = parseFloat(kgMatch[1]);

  // Extract crop
  let crop = "Tomato";
  if (msgLower.includes("tomato") || msgLower.includes("தக்காளி") || msgLower.includes("ટમાટર")) crop = "Tomato";
  else if (msgLower.includes("onion") || msgLower.includes("வெங்காயம்")) crop = "Onion";
  else if (msgLower.includes("chilli") || msgLower.includes("மிளகாய்")) crop = "Green Chilli";
  else if (msgLower.includes("potato") || msgLower.includes("உருளை")) crop = "Potato";

  let location = "Madurai";
  if (msgLower.includes("dindigul") || msgLower.includes("திண்டுக்கல்")) location = "Dindigul";

  const ordMatch = msgLower.match(/ord-\d+/i);
  const orderId = ordMatch ? ordMatch[0].toUpperCase() : "ORD-1042";

  // Intent 1: Buyer Search
  if (msgLower.includes("buyer") || msgLower.includes("வாங்குற") || msgLower.includes("buy") || msgLower.includes("खरीददार")) {
    const reply = formatSameLanguageResponse({
      language,
      ta: `உங்களுடைய ${quantityKg} kg ${crop} பயிருக்கு 3 buyers AgriConnect-ல் கிடைத்துள்ளனர். Expected price: ₹25 - ₹35/kg.`,
      tanglish: `Unga ${quantityKg} kg ${crop}-kku 3 buyers AgriConnect-la ready-a irukkanga. Expected price: ₹25 - ₹35/kg.`,
      en: `Found 3 matching buyers for ${quantityKg} kg of ${crop} in ${location}. Price range: ₹25 - ₹35/kg.`,
      ml: `നിങ്ങളുടെ ${quantityKg} കിലോ ${crop} ഉൽപ്പന്നത്തിന് AgriConnect-ൽ 3 വാങ്ങുന്നവരുണ്ട്.`,
      te: `మీ ${quantityKg} kg ${crop} కొరకు AgriConnect లో 3 Buyers సిద్ధంగా ఉన్నారు.`,
      hi: `आपके ${quantityKg} kg ${crop} के लिए AgriConnect पर 3 खरीदार उपलब्ध हैं।`,
      kn: `ನಿಮ್ಮ ${quantityKg} kg ${crop} ಉತ್ಪನ್ನಕ್ಕೆ AgriConnect ನಲ್ಲಿ 3 ಖರೀದಿದಾರರು ಲಭ್ಯವಿದ್ದಾರೆ.`
    });

    return {
      reply,
      language,
      tool_used: "find_buyers",
      data: { crop, quantityKg, location, count: 3 },
      nav_target: "Find Buyers",
      action_button_label: "View Matching Buyers",
      is_demo_data: true
    };
  }

  // Intent 2: Order Tracking
  if (msgLower.includes("order") || msgLower.includes("ஆர்டர்") || msgLower.includes("status") || msgLower.includes("எங்கே") || msgLower.includes("कहाँ")) {
    const reply = formatSameLanguageResponse({
      language,
      ta: `உங்கள் Order ${orderId} (${crop} - ${quantityKg} kg) தற்போது 'TRANSPORT ASSIGNED' நிலையில் உள்ளது. Delivery Date: 12 Sep 2026.`,
      tanglish: `Unga Order ${orderId} (${crop} - ${quantityKg} kg) ippo 'TRANSPORT ASSIGNED' status-la irukku. Delivery: 12 Sep 2026.`,
      en: `Your order ${orderId} (${crop} - ${quantityKg} kg) is currently in 'TRANSPORT ASSIGNED' status. Delivery: 12 Sep 2026.`,
      ml: `നിങ്ങളുടെ ഓർഡർ ${orderId} നിലവിൽ 'TRANSPORT ASSIGNED' അവസ്ഥയിലാണ്.`,
      te: `మీ ఆర్డర్ ${orderId} ప్రస్తుతం 'TRANSPORT ASSIGNED' స్థితిలో ఉంది.`,
      hi: `आपका ऑर्डर ${orderId} फिलहाल 'TRANSPORT ASSIGNED' स्थिति में है।`,
      kn: `ನಿಮ್ಮ ಆರ್ಡರ್ ${orderId} ಪ್ರಸ್ತುತ 'TRANSPORT ASSIGNED' ಸ್ಥಿತಿಯಲ್ಲಿದೆ.`
    });

    return {
      reply,
      language,
      tool_used: "get_order_status",
      data: { orderId, crop, quantityKg, status: "TRANSPORT ASSIGNED" },
      nav_target: role === "buyer" ? "Transport Tracking" : "My Orders",
      action_button_label: "Track Transport",
      is_demo_data: true
    };
  }

  // Intent 3: IoT Sensor Condition
  if (msgLower.includes("temp") || msgLower.includes("humidity") || msgLower.includes("iot") || msgLower.includes("sensor") || msgLower.includes("ஷிப்மென்ட்")) {
    const reply = formatSameLanguageResponse({
      language,
      ta: "உங்கள் shipment temperature 8.4°C, humidity 82%. Door status: Closed. Condition: Low Risk.",
      tanglish: "Unga shipment temperature 8.4°C, humidity 82%. Door closed-a irukku. Risk condition: Low.",
      en: "Shipment temperature is 8.4°C, humidity 82%, door closed. Condition risk: Low.",
      ml: "ഷിപ്പ്മെന്റ് താപനില 8.4°C, ഈർപ്പം 82%. റിസ്ക് അനുപാതം: കുറവാണ്.",
      te: "షిప్‌మెంట్ ఉష్ణోగ్రత 8.4°C, తేమ 82%. రిస్క్ స్థాయి: తక్కువ.",
      hi: "आपकी शिपमेंट का तापमान 8.4°C, आर्द्रता 82% है। जोखिम स्थिति: कम।",
      kn: "ನಿಮ್ಮ ಶಿಪ್‌ಮೆಂಟ್ ತಾಪಮಾನ 8.4°C, ತೇವಾಂಶ 82%. ಅಪಾಯ ಮಟ್ಟ: ಕಡಿಮೆ."
    });

    return {
      reply,
      language,
      tool_used: "get_sensor_status",
      data: { temp: 8.4, humidity: 82, door: "Closed", risk: "Low" },
      nav_target: "IoT Monitoring",
      action_button_label: "Open IoT Monitoring",
      is_demo_data: true
    };
  }

  // Intent 4: Transport Vehicle Search
  if (msgLower.includes("transport") || msgLower.includes("vehicle") || msgLower.includes("வண்டி") || msgLower.includes("அனுப்ப")) {
    const reply = formatSameLanguageResponse({
      language,
      ta: `${quantityKg} kg ${crop}-வை கொண்டு செல்ல 2 வாகனங்கள் கிடைத்துள்ளன. Estimated freight: ₹850.`,
      tanglish: `${quantityKg} kg ${crop} transport-kku 2 vehicles ready-a irukku. Freight cost: ₹850.`,
      en: `Found 2 suitable transport vehicles for ${quantityKg} kg of ${crop}. Estimated freight: ₹850.`,
      ml: `${quantityKg} കിലോ ${crop} കൊണ്ടുപോകാൻ 2 വാഹനങ്ങൾ ലഭ്യമാണ്.`,
      te: `${quantityKg} kg ${crop} రవాణాకు 2 వాహనాలు అందుబాటులో ఉన్నాయి.`,
      hi: `${quantityKg} kg ${crop} परिवहन के लिए 2 वाहन उपलब्ध हैं। अनुमानित भाड़ा: ₹850।`,
      kn: `${quantityKg} kg ${crop} ರವಾನೆಗೆ 2 ವಾಹನಗಳು ಲಭ್ಯವಿವೆ.`
    });

    return {
      reply,
      language,
      tool_used: "find_transport",
      data: { vehicles_found: 2, est_cost: 850 },
      nav_target: "Transport",
      action_button_label: "View Transport",
      is_demo_data: true
    };
  }

  // Default Fallback
  const defaultReply = formatSameLanguageResponse({
    language,
    ta: "வணக்கம்! AgriConnect-ல் உங்கள் விளைபொருள், ஆர்டர், போக்குவரத்து மற்றும் குளிர்பதன கிடங்கு தகவல்களை குரல் வழியாக பெறலாம்.",
    tanglish: "Vanakkam! AgriConnect-la unga produce, order, transport details voice moolama kekkalaam.",
    en: "Hello! You can ask AgriAI about buyer search, produce listings, order tracking, transport, and IoT sensor updates.",
    ml: "നമസ്കാരം! AgriConnect-ൽ നിങ്ങളുടെ ഓർഡർ, ഗതാഗത വിവരങ്ങൾ സംസാരത്തിലൂടെ അറിയാം.",
    te: "నమస్కారం! AgriConnect లో మీ ఆర్డర్ మరియు రవాణా వివరాలను వాయిస్ ద్వారా తెలుసుకోవచ్చు.",
    hi: "नमस्ते! AgriConnect पर आप अपनी उपज, ऑर्डर और परिवहन की जानकारी बोलकर प्राप्त कर सकते हैं।",
    kn: "ನಮಸ್ಕಾರ! AgriConnect ನಲ್ಲಿ ನಿಮ್ಮ ಆರ್ಡರ್ ಮತ್ತು ಸಾರಿಗೆ ವಿವರಗಳನ್ನು ಧ್ವನಿಯ ಮೂಲಕ ಪಡೆಯಬಹುದು."
  });

  return {
    reply: defaultReply,
    language,
    tool_used: "general_assistant",
    nav_target: "Dashboard",
    is_demo_data: true
  };
}

function formatSameLanguageResponse({ language, ta, tanglish, en, ml, te, hi, kn }) {
  if (language === "ta") return ta;
  if (language === "tanglish") return tanglish;
  if (language === "ml") return ml;
  if (language === "te") return te;
  if (language === "hi") return hi;
  if (language === "kn") return kn;
  return en;
}
