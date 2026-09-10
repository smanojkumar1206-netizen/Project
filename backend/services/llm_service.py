import os
import re
import json
from typing import Dict, Any, List
from tools.agri_tools import execute_tool

SYSTEM_PROMPT = """You are AgriAI, the agricultural voice assistant for the AgriConnect platform.
Your purpose is to help farmers, buyers, transporters and administrators interact with AgriConnect using natural language.

CRITICAL LANGUAGE RULE:
You support Tamil, English, Tanglish, Malayalam, Telugu, Hindi, and Kannada.
You MUST ALWAYS respond in the EXACT SAME language spoken/written by the user.
- If user speaks Tamil -> Reply in natural Tamil.
- If user speaks Tanglish -> Reply in Tanglish (spoken Tamil in English alphabet).
- If user speaks English -> Reply in English.
- If user speaks Malayalam -> Reply in Malayalam.
- If user speaks Telugu -> Reply in Telugu.
- If user speaks Hindi -> Reply in Hindi.
- If user speaks Kannada -> Reply in Kannada.

Never invent marketplace listings, buyers, prices, orders, transport status, storage availability or sensor readings.
When information is required from AgriConnect, use the available tools.
Keep responses short, polite, and practical for spoken audio playback."""

def detect_language(text: str) -> str:
    if not text:
        return "ta"
    
    # 1. Unicode Script Checks
    if re.search(r'[\u0B80-\u0BFF]', text): # Tamil
        return "ta"
    if re.search(r'[\u0D00-\u0D7F]', text): # Malayalam
        return "ml"
    if re.search(r'[\u0C00-\u0C7F]', text): # Telugu
        return "te"
    if re.search(r'[\u0900-\u097F]', text): # Devanagari / Hindi
        return "hi"
    if re.search(r'[\u0C80-\u0CFF]', text): # Kannada
        return "kn"

    lower = text.lower()

    # 2. Latin Script Keyword Checks for Tanglish / Hinglish / Manglish etc.
    tanglish_words = ["buyer", "venum", "enga", "irukku", "kedaikkuma", "irukka", "enna", "paaru", "kidu", "pannu", "thodu"]
    if any(w in lower for w in tanglish_words):
        return "tanglish"

    manglish_words = ["evideya", "undo", "venam", "njan", "ethra"]
    if any(w in lower for w in manglish_words):
        return "ml"

    telgish_words = ["ekkada", "undhi", "kaavali", "naku", "yentha"]
    if any(w in lower for w in telgish_words):
        return "te"

    hinglish_words = ["kahan", "hai", "chahiye", "mera", "kitna"]
    if any(w in lower for w in hinglish_words):
        return "hi"

    kanglish_words = ["ellide", "beku", "nanage", "yestu"]
    if any(w in lower for w in kanglish_words):
        return "kn"

    return "en"

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY", "")

    def process_chat(
        self,
        message: str,
        role: str = "farmer",
        user_id: str = "USR-FARMER-1",
        language: str = "auto",
        conversation: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        detected_lang = language if language != "auto" else detect_language(message)
        msg_lower = message.lower()

        # Parse units & quantities
        quantity_kg = 500
        ton_match = re.search(r'(\d+)\s*(ton|டன்)', msg_lower)
        quintal_match = re.search(r'(\d+)\s*(quintal|குவிண்டால்)', msg_lower)
        kg_match = re.search(r'(\d+)\s*(kg|kilo|கிலோ)', msg_lower)
        if ton_match:
            quantity_kg = float(ton_match.group(1)) * 1000
        elif quintal_match:
            quantity_kg = float(quintal_match.group(1)) * 100
        elif kg_match:
            quantity_kg = float(kg_match.group(1))

        # Parse crop
        crop = "Tomato"
        if "tomato" in msg_lower or "தக்காளி" in msg_lower or "ટમાટર" in msg_lower or "ટમેટા" in msg_lower:
            crop = "Tomato"
        elif "onion" in msg_lower or "வெங்காயம்" in msg_lower or "प्याज" in msg_lower:
            crop = "Onion"
        elif "chilli" in msg_lower or "மிளகாய்" in msg_lower or "मिर्च" in msg_lower:
            crop = "Green Chilli"
        elif "potato" in msg_lower or "உருளை" in msg_lower or "आलू" in msg_lower:
            crop = "Potato"

        # Parse location
        location = "Madurai"
        if "dindigul" in msg_lower or "திண்டுக்கல்" in msg_lower:
            location = "Dindigul"
        elif "melur" in msg_lower or "மேலூர்" in msg_lower:
            location = "Melur"

        # Parse Order ID
        order_match = re.search(r'ord-\d+', msg_lower)
        order_id = order_match.group(0).upper() if order_match else "ORD-1042"

        # Intent Detection
        tool_to_call = "find_buyers"
        tool_params = {"crop": crop, "quantity_kg": quantity_kg, "location": location}

        if any(k in msg_lower for k in ["buyer", "வாங்குற", "வாங்க", "buy", "खरीददार"]):
            tool_to_call = "find_buyers"
        elif any(k in msg_lower for k in ["order", "ஆர்டர்", "status", "எங்கே", "track", "कहाँ"]):
            tool_to_call = "get_order_status"
            tool_params = {"order_id": order_id}
        elif any(k in msg_lower for k in ["temperature", "temp", "humidity", "iot", "sensor", "ஷிப்மென்ட்"]):
            tool_to_call = "get_sensor_status"
            tool_params = {"vehicle_id": "IOT-TRK07"}
        elif any(k in msg_lower for k in ["transport", "vehicle", "வண்டி", "அனுப்ப", "वाहन"]):
            tool_to_call = "find_transport"
            tool_params = {"quantity_kg": quantity_kg, "pickup_location": location, "destination": "Chennai"}
        elif any(k in msg_lower for k in ["storage", "ஸ்டோரேஜ்", "சேமிப்பு"]):
            tool_to_call = "find_storage"
        elif any(k in msg_lower for k in ["price", "விலை", "rate", "दाम"]):
            tool_to_call = "get_market_price"

        # Execute Tool
        tool_result = execute_tool(tool_to_call, tool_params, role, user_id)
        nav_target = tool_result.get("nav_target", "Dashboard")

        # Generate Multi-Lingual Response matching detected user language
        reply_text = ""
        
        if detected_lang == "ta":
            if tool_to_call == "find_buyers":
                reply_text = f"உங்கள் {quantity_kg:.0f} kg {crop} பயிருக்கு 3 buyers AgriConnect-ல் தயார் நிலையில் உள்ளனர்."
            elif tool_to_call == "get_order_status":
                reply_text = f"உங்கள் Order {order_id} தற்போது 'TRANSPORT ASSIGNED' நிலையில் உள்ளது."
            elif tool_to_call == "get_sensor_status":
                reply_text = "உங்கள் shipment temperature 8.4°C, humidity 82%. Door status: Closed. Condition: Low Risk."
            elif tool_to_call == "find_transport":
                reply_text = f"உங்கள் {quantity_kg:.0f} kg சுமைக்கு 2 வாகனங்கள் போக்குவரத்திற்கு தயார் நிலையில் உள்ளன."
            else:
                reply_text = f"{location} சந்தையில் {crop} சராசரி விலை ₹28/kg (+4% இந்த வாரம்)."

        elif detected_lang == "tanglish":
            if tool_to_call == "find_buyers":
                reply_text = f"Unga {quantity_kg:.0f} kg {crop}-kku 3 buyers AgriConnect-la ready-a irukkanga."
            elif tool_to_call == "get_order_status":
                reply_text = f"Unga Order {order_id} ippo 'TRANSPORT ASSIGNED' status-la irukku."
            elif tool_to_call == "get_sensor_status":
                reply_text = "Unga shipment temperature 8.4°C, humidity 82%. Door closed-a irukku. Risk low."
            elif tool_to_call == "find_transport":
                reply_text = f"Unga {quantity_kg:.0f} kg load-kku 2 transport vehicles ready-a irukku."
            else:
                reply_text = f"{location} market-la {crop} average price ₹28/kg."

        elif detected_lang == "ml":
            reply_text = f"നിങ്ങളുടെ {quantity_kg:.0f} കിലോ {crop} ഉൽപ്പന്നത്തിന് AgriConnect-ൽ 3 വാങ്ങുന്നവരുണ്ട്. ഓർഡർ നില: തത്സമയം ലഭ്യമാണ്."

        elif detected_lang == "te":
            reply_text = f"మీ {quantity_kg:.0f} kg {crop} కొరకు AgriConnect లో 3 Buyers సిద్ధంగా ఉన్నారు."

        elif detected_lang == "hi":
            reply_text = f"आपके {quantity_kg:.0f} kg {crop} के लिए AgriConnect पर 3 खरीदार (Buyers) उपलब्ध हैं। ऑर्डर स्थिति: इन ट्रांजिट।"

        elif detected_lang == "kn":
            reply_text = f"ನಿಮ್ಮ {quantity_kg:.0f} kg {crop} ಉತ್ಪನ್ನಕ್ಕೆ AgriConnect ನಲ್ಲಿ 3 ಖರೀದಿದಾರರು ಲಭ್ಯವಿದ್ದಾರೆ."

        else: # English
            if tool_to_call == "find_buyers":
                reply_text = f"Found 3 matching buyers for your {quantity_kg:.0f} kg of {crop} in {location}."
            elif tool_to_call == "get_order_status":
                reply_text = f"Your order {order_id} is currently in 'TRANSPORT ASSIGNED' status."
            elif tool_to_call == "get_sensor_status":
                reply_text = "Shipment temperature is 8.4°C, humidity 82%, door closed. Risk condition: Low."
            elif tool_to_call == "find_transport":
                reply_text = f"Found 2 suitable vehicles for transporting {quantity_kg:.0f} kg payload."
            else:
                reply_text = f"Current market price for {crop} in {location} is ₹28/kg (+4% this week)."

        return {
            "reply": reply_text,
            "language": detected_lang,
            "tool_used": tool_to_call,
            "data": tool_result.get("data", {}),
            "nav_target": nav_target
        }

llm_service = LLMService()
