# AgriConnect — Smart Agricultural Supply Chain, Authentication & Notification System

AgriConnect is an agricultural supply chain web platform integrated with **Role-Based Authentication (Supabase Auth)**, **Multi-Channel Notifications (In-App, Email, SMS)**, **Google Maps Interactive Routing**, **OR-Tools CVRP Route Optimization**, a **Multilingual AI Voice Assistant (7 Languages)**, and an automated **Farmer → Buyer Offer Acceptance → Transport Lifecycle Workflow**.

---

## 🌟 Key Application Features

### 1. 🔐 Complete Authentication & Access Control (First Screen Guard)
- **First Screen Unauthenticated Guard**: When opening AgriConnect, unauthenticated users see the **Welcome to AgriConnect** screen with `[Create Account]` and `[Login]` options. Dashboards cannot be accessed without authenticating first.
- **Supabase Authentication**: Email/password authentication, secure session handling, protected routes, and user profile management.
- **Secure Public Registration**:
  - Public registration supports **Farmer**, **Buyer**, and **Transporter** roles.
  - Admin accounts are protected and cannot be created freely by standard users.
- **Role-Specific Registration Fields**:
  - **Farmer**: Farm/Village location, Produce categories, Optional farm details.
  - **Buyer**: Business/organization name, Business location, Required produce categories.
  - **Transporter**: Vehicle type, Vehicle capacity, Operating location.
- **Role-Based Redirection**: Authenticated users are automatically routed to their role-specific dashboard (`/farmer`, `/buyer`, `/transporter`, `/admin`).

---

### 2. 🔔 Multi-Channel Notification Engine (In-App, Email, SMS)
- **Notification Bell & Notification Center**: Header notification bell with unread badge counter. Click opens the Notification Center displaying all notifications scoped strictly to the authenticated user.
- **Multi-Channel Triggers**:
  - **Account Creation**: Sends "Welcome to AgriConnect" email & SMS.
  - **Buyer Order Placement**: Sends Order Confirmation email to Buyer and alerts Farmer via In-App + Email + SMS.
  - **Farmer Accept Offer**: Order `status = ACCEPTED`, creates Transport Request (`status = WAITING_FOR_TRANSPORT`), notifies Farmer, Buyer, Transporter.
  - **Transporter Accept Request**: Transport `status = ASSIGNED`, notifies Farmer, Buyer, Transporter.
  - **Shipment In Transit**: Order `status = IN_TRANSIT`, provides live Google Maps tracking view.
  - **Delivery Completed**: Order `status = DELIVERED`, notifies Farmer and Buyer with complete summary (Order ID, Crop, Qty, Farmer, Buyer, Transporter, Delivery time).
- **Non-Blocking Resilience**: If Email or SMS provider is temporarily unavailable, order placement and status updates complete successfully without failing or rolling back database transactions.

---

### 3. ⚡ DEMO Mode Fallback Support
- **Seamless Operation**: AgriConnect works 100% out-of-the-box even when Supabase, Email, or SMS providers are not configured.
- **1-Click Quick Testing Login**: Includes pre-seeded testing accounts:
  - 🌾 **Farmer**: `farmer@agriconnect.org`
  - 📦 **Buyer**: `buyer@agriconnect.org`
  - 🚚 **Transporter**: `transporter@agriconnect.org`
  - 🛡️ **Admin**: `admin@agriconnect.org`
- **Simulated Notification Logs**: Notifications appear in the Notification Center with clear **DEMO EMAIL** and **DEMO SMS** badges when live external APIs are not active.

---

### 4. 🗺️ Google Maps Integration & Route Optimization
- **Interactive Google Maps Component**: Renders custom markers for Farmer pickups, Buyer destination, and Transporter vehicle position.
- **Optimized Polyline**: Connects stops in optimal pickup order.
- **Route Metrics Summary Bar**: Distance (km), estimated time, collected load, vehicle capacity utilization bar.

---

### 5. 🗣️ Multilingual AI Voice Assistant (7 Regional Languages)
- **Supported Languages**: Tamil, Tanglish, English, Malayalam, Telugu, Hindi, Kannada.
- **Same-Language Response**: Responds in the **EXACT SAME LANGUAGE** spoken by the user.
- **Quick Action Buttons**: 🌾 My Produce, 📦 My Orders, 🚚 Transport, 🔔 Notifications.

---

## 🗄️ Supabase PostgreSQL Database Schema

Execute the provided DDL script in your Supabase SQL Editor:
`backend/db/supabase_schema.sql`

```sql
-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('FARMER', 'BUYER', 'TRANSPORTER', 'ADMIN')),
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Role-Specific Profile Tables
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_location TEXT,
  produce_categories TEXT[],
  farm_details TEXT
);

CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  business_location TEXT,
  required_categories TEXT[]
);

CREATE TABLE IF NOT EXISTS public.transporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT,
  vehicle_capacity TEXT,
  operating_location TEXT
);

-- 3. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_order_id TEXT,
  related_transport_id TEXT,
  channel TEXT DEFAULT 'IN_APP' CHECK (channel IN ('IN_APP', 'EMAIL', 'SMS')),
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `.env` in root and backend:

```env
# Operational Data Mode: 'demo' (mock/seed data) or 'supabase' (live PostgreSQL)
DATA_MODE=demo

# Supabase Auth & Database Credentials (Frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Auth & Database Credentials (Backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key

# Email Provider Credentials (Backend)
EMAIL_PROVIDER_API_KEY=your_email_api_key
EMAIL_FROM=notifications@agriconnect.org

# SMS Provider Credentials (Backend)
SMS_PROVIDER_API_KEY=your_sms_api_key
SMS_PROVIDER_SENDER_ID=AGRI_CONN

# Google Maps JavaScript API Key (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# AI API Credentials (Backend Only)
LLM_API_KEY=your_llm_api_key
STT_API_KEY=your_stt_api_key
TTS_API_KEY=your_tts_api_key

# FastAPI Server Port
PORT=8000
```

---

## 🚀 How to Run the Application

### 1. Run Frontend (React + Vite)

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173`. The Welcome screen will appear first.

### 2. Run Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python main.py
```
Backend server runs at `http://localhost:8000`. Swagger API docs available at `http://localhost:8000/docs`.

---

## 🧪 Complete End-to-End Order Workflow Test Scenario

1. **Open Website**: Verify Welcome to AgriConnect screen appears with `[Create Account]` and `[Login]`.
2. **Register/Login as Farmer**:
   - Create Farmer account or click `🌾 Farmer Demo`.
   - Post produce listing for 500 kg Tomato.
3. **Logout & Login as Buyer**:
   - Click Logout in header/sidebar.
   - Login as Buyer (`📦 Buyer Demo`).
   - Find Produce → Place Order for 500 kg Tomato.
   - Verify Buyer Order Confirmation notification + Farmer notification dispatched.
4. **Login as Farmer**:
   - Go to "My Orders" → Accept Order.
   - Verify Order = `ACCEPTED`, Transport Request = `WAITING_FOR_TRANSPORT`.
5. **Login as Transporter**:
   - Go to "Transport Requests" → Accept Transport.
   - Verify Status = `ASSIGNED`, Notifications sent to Farmer & Buyer.
6. **Start Trip & Tracking**:
   - Active Trips → Click `[Start Trip (In Transit)]`.
   - Status = `IN_TRANSIT`. Open Google Maps tracking view.
7. **Complete Delivery**:
   - Click `[Complete Delivery]`.
   - Status = `DELIVERED`. Verify final summary notification dispatched to Farmer & Buyer.

---

## 📦 Production Deployment

```bash
# Build React bundle
npm run build

# Preview build output
npm run preview
```
Deploy the frontend static bundle to Vercel/Netlify/Cloudflare Pages and backend FastAPI to Render/AWS/GCP.
