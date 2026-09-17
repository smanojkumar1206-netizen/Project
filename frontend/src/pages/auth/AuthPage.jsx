import React, { useState, useEffect } from "react";
import {
  Leaf, Sprout, ShoppingCart, Truck, ShieldCheck,
  User, Mail, Phone, Lock, MapPin, Building, AlertCircle, CheckCircle2, ArrowLeft,
  ChevronRight
} from "lucide-react";
import {
  signUpUser,
  signInUser,
  signInWithGoogle,
  completeGoogleProfile,
  PREDEFINED_ADMIN
} from "../../services/authApi";

function GoogleIcon() {
  return (
    <svg className="googleIconSvg" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AuthPage({ onLoginSuccess, initialView = "welcome", onBackToLanding }) {
  // View states: 'welcome' | 'login' | 'register' | 'google-onboard'
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
  }, [initialView]);

  // Standard Registration Form State
  const [regRole, setRegRole] = useState("FARMER"); // FARMER, BUYER, TRANSPORTER ONLY
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");

  // Role-specific Registration State
  const [produceCategories, setProduceCategories] = useState("Tomato, Onion, Chilli");
  const [farmDetails, setFarmDetails] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [requiredCategories, setRequiredCategories] = useState("Tomato, Potato, Grains");
  const [vehicleType, setVehicleType] = useState("Refrigerated Truck (5 Ton)");
  const [vehicleCapacity, setVehicleCapacity] = useState("5,000 kg");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Google Onboarding State
  const [googleUser, setGoogleUser] = useState(null);
  const [onboardRole, setOnboardRole] = useState("FARMER");
  const [onboardPhone, setOnboardPhone] = useState("");
  const [onboardLocation, setOnboardLocation] = useState("Madurai");
  const [onboardFarmDetails, setOnboardFarmDetails] = useState("10 Acres organic vegetable farm");
  const [onboardProduceCategories, setOnboardProduceCategories] = useState("Tomato, Onion, Chilli");
  const [onboardBusinessName, setOnboardBusinessName] = useState("");
  const [onboardRequiredCategories, setOnboardRequiredCategories] = useState("Tomato, Potato");
  const [onboardVehicleType, setOnboardVehicleType] = useState("Refrigerated Truck (5 Ton)");
  const [onboardVehicleCapacity, setOnboardVehicleCapacity] = useState("5,000 kg");

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Initialize Google Identity Services
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
    if (window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse
        });
      } catch (e) {
        console.warn("Google Identity init error:", e);
      }
    }
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) return;
    setLoading(true);
    setError("");

    try {
      const res = await signInWithGoogle({ credential: response.credential });
      if (res.needs_role_selection) {
        setGoogleUser(res.google_user);
        setView("google-onboard");
      } else if (res.profile) {
        setSuccessMsg(`Authenticated as ${res.profile.full_name}! Redirecting...`);
        setTimeout(() => onLoginSuccess(res.profile), 700);
      }
    } catch (err) {
      setError(err.message || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setError("");
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

    // 1. If Google Identity is loaded with client ID, open prompt
    if (window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            promptGoogleManualInput();
          }
        });
        return;
      } catch (e) {}
    }

    // 2. Direct interactive sign-in dialog
    promptGoogleManualInput();
  };

  const promptGoogleManualInput = async () => {
    const userEmail = window.prompt(
      "Enter your Google Account email address (e.g. user@gmail.com):",
      "farmer.ravi@gmail.com"
    );
    if (!userEmail || !userEmail.trim()) return;

    const userName = window.prompt(
      "Enter your Google Account Display Name:",
      userEmail.split("@")[0].replace(".", " ").toUpperCase()
    );

    setLoading(true);
    try {
      const res = await signInWithGoogle({
        email: userEmail.trim().toLowerCase(),
        name: userName ? userName.trim() : userEmail.split("@")[0],
        google_id: `g-${btoa(userEmail.trim()).slice(0, 16)}`,
        picture: ""
      });

      if (res.needs_role_selection) {
        setGoogleUser(res.google_user);
        setView("google-onboard");
      } else if (res.profile) {
        setSuccessMsg(`Welcome back, ${res.profile.full_name}! Redirecting...`);
        setTimeout(() => onLoginSuccess(res.profile), 700);
      }
    } catch (err) {
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOnboardSubmit = async (e) => {
    e.preventDefault();
    if (!googleUser) return;
    setError("");
    setLoading(true);

    let extraFields = {};
    if (onboardRole === "FARMER") {
      extraFields = {
        produce_categories: onboardProduceCategories.split(",").map(s => s.trim()),
        farm_details: onboardFarmDetails
      };
    } else if (onboardRole === "BUYER") {
      if (!onboardBusinessName.trim()) {
        setError("Business / Organization Name is required.");
        setLoading(false);
        return;
      }
      extraFields = {
        business_name: onboardBusinessName,
        required_categories: onboardRequiredCategories.split(",").map(s => s.trim())
      };
    } else if (onboardRole === "TRANSPORTER") {
      extraFields = {
        vehicle_type: onboardVehicleType,
        vehicle_capacity: onboardVehicleCapacity
      };
    }

    try {
      const res = await completeGoogleProfile({
        email: googleUser.email,
        full_name: googleUser.full_name,
        role: onboardRole.toLowerCase(),
        phone: onboardPhone || "",
        location: onboardLocation || "Madurai",
        google_id: googleUser.google_id,
        picture: googleUser.picture,
        extra_fields: extraFields
      });

      setSuccessMsg(`Profile completed! Entering ${onboardRole} Dashboard...`);
      setTimeout(() => onLoginSuccess(res.profile), 800);
    } catch (err) {
      setError(err.message || "Failed to complete onboarding.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!loginEmail.trim()) {
      setError("Please enter your Email Address.");
      return;
    }
    if (!loginPassword) {
      setError("Please enter your Password.");
      return;
    }

    setLoading(true);
    try {
      const res = await signInUser(loginEmail, loginPassword);
      onLoginSuccess(res.profile);
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // Normal users can NEVER register as Admin
    if (regRole === "ADMIN" || email.toLowerCase().trim() === "admin@agriconnect.com") {
      setError("Admin accounts cannot be created via public registration.");
      return;
    }

    if (!fullName.trim()) { setError("Full Name is required."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid Email Address."); return; }
    if (!mobile.trim() || mobile.length < 10) { setError("Please enter a valid 10-digit Mobile Number."); return; }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match. Please re-enter."); return; }
    if (!location.trim()) { setError("Location details are required."); return; }

    let extraFields = {};
    if (regRole === "FARMER") {
      extraFields = {
        produce_categories: produceCategories.split(",").map(s => s.trim()),
        farm_details: farmDetails
      };
    } else if (regRole === "BUYER") {
      if (!businessName.trim()) { setError("Business/Organization Name is required."); return; }
      extraFields = {
        business_name: businessName,
        required_categories: requiredCategories.split(",").map(s => s.trim())
      };
    } else if (regRole === "TRANSPORTER") {
      extraFields = {
        vehicle_type: vehicleType,
        vehicle_capacity: vehicleCapacity
      };
    }

    setLoading(true);
    try {
      const res = await signUpUser({
        email,
        password,
        fullName,
        phone: mobile,
        role: regRole,
        location,
        extraFields
      });

      setSuccessMsg(`Account created as ${regRole}! Authenticating...`);
      setTimeout(() => {
        onLoginSuccess(res.profile);
      }, 1000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPageContainer">
      <div className="authCardWrapper">
        {onBackToLanding && (
          <button
            type="button"
            className="authBackToLandingBtn"
            onClick={onBackToLanding}
          >
            <ArrowLeft size={16} /> Back to AgriConnect Home
          </button>
        )}

        {/* Brand Header */}
        <div className="authHeader">
          <div className="authLogo">
            <Leaf size={32} />
          </div>
          <h1>AGRICONNECT</h1>
          <p className="authSub">Smart Agricultural Supply Chain Platform</p>
        </div>

        {error && (
          <div className="authAlert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="authAlert success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ==================== 1. WELCOME SCREEN ==================== */}
        {view === "welcome" && (
          <div className="authWelcomeView">
            <div className="welcomeHeroBox">
              <h2>WELCOME TO AGRICONNECT</h2>
              <p>Direct farm-to-buyer agricultural marketplace with role-locked security and end-to-end logistics tracking.</p>
            </div>

            <div className="roleHighlights">
              <div className="highlightItem">
                <Sprout size={20} className="iconFarmer" />
                <div>
                  <strong>Farmer Portal</strong>
                  <span>Sell crops directly at fair market rates</span>
                </div>
              </div>
              <div className="highlightItem">
                <ShoppingCart size={20} className="iconBuyer" />
                <div>
                  <strong>Buyer Portal</strong>
                  <span>Source fresh produce from verified farms</span>
                </div>
              </div>
              <div className="highlightItem">
                <Truck size={20} className="iconTransporter" />
                <div>
                  <strong>Transporter Portal</strong>
                  <span>Accept haul requests & optimize routes</span>
                </div>
              </div>
            </div>

            <div className="authButtonStack" style={{ marginTop: "20px" }}>
              {/* Google OAuth Button */}
              <button
                type="button"
                className="btnGoogle"
                onClick={handleGoogleClick}
                disabled={loading}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="authDivider">
                <span>or</span>
              </div>

              <button
                className="btnPrimary btnLarge"
                onClick={() => { setError(""); setView("login"); }}
              >
                Sign In with Email
              </button>

              <button
                className="btnSecondary btnLarge"
                onClick={() => { setError(""); setView("register"); }}
              >
                Create New Account
              </button>
            </div>
          </div>
        )}

        {/* ==================== 2. LOGIN SCREEN ==================== */}
        {view === "login" && (
          <div className="authFormView">
            <button className="backBtnLink" onClick={() => { setError(""); setView("welcome"); }}>
              <ArrowLeft size={16} /> Back to Welcome
            </button>

            <h2>Sign in to AgriConnect</h2>
            <p className="formSubtitle">Enter your account credentials or continue with Google.</p>

            {/* Google OAuth Button */}
            <button
              type="button"
              className="btnGoogle"
              onClick={handleGoogleClick}
              disabled={loading}
              style={{ marginBottom: "16px" }}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <div className="authDivider">
              <span>or sign in with email</span>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="formGroup">
                <label>Email Address</label>
                <div className="inputIconWrap">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="e.g. farmer@agriconnect.org or admin@agriconnect.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="formGroup">
                <label>Password</label>
                <div className="inputIconWrap">
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btnPrimary btnBlock" disabled={loading}>
                {loading ? "Authenticating..." : "SIGN IN"}
              </button>
            </form>

            <div className="authSwitchFooter">
              <span>Don't have an account? </span>
              <button className="linkBtnBold" onClick={() => { setError(""); setView("register"); }}>
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ==================== 3. CREATE ACCOUNT ==================== */}
        {view === "register" && (
          <div className="authFormView">
            <button className="backBtnLink" onClick={() => { setError(""); setView("welcome"); }}>
              <ArrowLeft size={16} /> Back to Welcome
            </button>

            <h2>Create Your AgriConnect Account</h2>
            <p className="formSubtitle">Register as a Farmer, Buyer, or Transporter.</p>

            {/* Google Alternative */}
            <button
              type="button"
              className="btnGoogle"
              onClick={handleGoogleClick}
              disabled={loading}
              style={{ marginBottom: "16px" }}
            >
              <GoogleIcon />
              <span>Sign up with Google</span>
            </button>

            <div className="authDivider">
              <span>or register with email</span>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              {/* Role Options */}
              <div className="formGroup">
                <label>Account Type</label>
                <div className="roleSelectTabs">
                  <button
                    type="button"
                    className={`roleTab ${regRole === "FARMER" ? "active" : ""}`}
                    onClick={() => setRegRole("FARMER")}
                  >
                    <Sprout size={18} />
                    <span>Farmer</span>
                  </button>

                  <button
                    type="button"
                    className={`roleTab ${regRole === "BUYER" ? "active" : ""}`}
                    onClick={() => setRegRole("BUYER")}
                  >
                    <ShoppingCart size={18} />
                    <span>Buyer</span>
                  </button>

                  <button
                    type="button"
                    className={`roleTab ${regRole === "TRANSPORTER" ? "active" : ""}`}
                    onClick={() => setRegRole("TRANSPORTER")}
                  >
                    <Truck size={18} />
                    <span>Transporter</span>
                  </button>
                </div>
              </div>

              {/* Standard Fields */}
              <div className="formGroup">
                <label>Full Name</label>
                <div className="inputIconWrap">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="formGridTwo">
                <div className="formGroup">
                  <label>Mobile Number</label>
                  <div className="inputIconWrap">
                    <Phone size={18} />
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Email Address</label>
                  <div className="inputIconWrap">
                    <Mail size={18} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="formGroup">
                <label>Location (City / District / Taluk)</label>
                <div className="inputIconWrap">
                  <MapPin size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Melur, Madurai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {regRole === "FARMER" && (
                <div className="roleFieldsSection">
                  <span className="roleSectionTitle">🌾 Farmer Details</span>
                  <div className="formGroup">
                    <label>Produce Categories</label>
                    <input
                      type="text"
                      placeholder="e.g. Tomato, Onion, Chilli, Brinjal"
                      value={produceCategories}
                      onChange={(e) => setProduceCategories(e.target.value)}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Farm Details (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Acres Organic Vegetable Farm"
                      value={farmDetails}
                      onChange={(e) => setFarmDetails(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {regRole === "BUYER" && (
                <div className="roleFieldsSection">
                  <span className="roleSectionTitle">📦 Buyer Details</span>
                  <div className="formGroup">
                    <label>Business / Organization Name</label>
                    <div className="inputIconWrap">
                      <Building size={18} />
                      <input
                        type="text"
                        placeholder="e.g. Madurai Fresh Mart Pvt Ltd"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="formGroup">
                    <label>Required Produce Categories</label>
                    <input
                      type="text"
                      placeholder="e.g. Tomato, Potato, Onion"
                      value={requiredCategories}
                      onChange={(e) => setRequiredCategories(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {regRole === "TRANSPORTER" && (
                <div className="roleFieldsSection">
                  <span className="roleSectionTitle">🚚 Transporter Fleet Details</span>
                  <div className="formGridTwo">
                    <div className="formGroup">
                      <label>Vehicle Type</label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                      >
                        <option value="Mini Truck (1-2 Ton)">Mini Truck (1-2 Ton)</option>
                        <option value="Refrigerated Truck (5 Ton)">Refrigerated Truck (5 Ton)</option>
                        <option value="Heavy Freight (10 Ton)">Heavy Freight (10 Ton)</option>
                        <option value="Agro Pickup (750 kg)">Agro Pickup (750 kg)</option>
                      </select>
                    </div>
                    <div className="formGroup">
                      <label>Vehicle Capacity</label>
                      <input
                        type="text"
                        placeholder="e.g. 5,000 kg"
                        value={vehicleCapacity}
                        onChange={(e) => setVehicleCapacity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="formGridTwo">
                <div className="formGroup">
                  <label>Password</label>
                  <div className="inputIconWrap">
                    <Lock size={18} />
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Confirm Password</label>
                  <div className="inputIconWrap">
                    <Lock size={18} />
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btnPrimary btnBlock" disabled={loading}>
                {loading ? "Creating Account..." : "REGISTER ACCOUNT"}
              </button>
            </form>

            <div className="authSwitchFooter">
              <span>Already have an account? </span>
              <button className="linkBtnBold" onClick={() => { setError(""); setView("login"); }}>
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ==================== 4. GOOGLE USER ONBOARDING (CHOOSE ROLE) ==================== */}
        {view === "google-onboard" && googleUser && (
          <div className="authFormView">
            <button className="backBtnLink" onClick={() => { setError(""); setView("welcome"); }}>
              <ArrowLeft size={16} /> Cancel
            </button>

            <h2>Complete Your Profile</h2>
            <p className="formSubtitle">Select your role on AgriConnect to complete your Google account onboarding.</p>

            <div className="googleUserCard">
              {googleUser.picture ? (
                <img src={googleUser.picture} alt="Google Avatar" className="googleAvatar" />
              ) : (
                <div className="googleAvatarFallback">
                  {googleUser.full_name ? googleUser.full_name[0].toUpperCase() : "G"}
                </div>
              )}
              <div className="googleUserInfo">
                <strong>{googleUser.full_name}</strong>
                <span>{googleUser.email}</span>
              </div>
            </div>

            <form onSubmit={handleGoogleOnboardSubmit}>
              {/* Choose Role */}
              <div className="formGroup">
                <label>Select Your Agricultural Role</label>
                <div className="roleSelectTabs">
                  <button
                    type="button"
                    className={`roleTab ${onboardRole === "FARMER" ? "active" : ""}`}
                    onClick={() => setOnboardRole("FARMER")}
                  >
                    <Sprout size={18} />
                    <span>Farmer</span>
                  </button>

                  <button
                    type="button"
                    className={`roleTab ${onboardRole === "BUYER" ? "active" : ""}`}
                    onClick={() => setOnboardRole("BUYER")}
                  >
                    <ShoppingCart size={18} />
                    <span>Buyer</span>
                  </button>

                  <button
                    type="button"
                    className={`roleTab ${onboardRole === "TRANSPORTER" ? "active" : ""}`}
                    onClick={() => setOnboardRole("TRANSPORTER")}
                  >
                    <Truck size={18} />
                    <span>Transporter</span>
                  </button>
                </div>
              </div>

              <div className="formGridTwo">
                <div className="formGroup">
                  <label>Mobile Number</label>
                  <div className="inputIconWrap">
                    <Phone size={18} />
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={onboardPhone}
                      onChange={(e) => setOnboardPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Operating Location</label>
                  <div className="inputIconWrap">
                    <MapPin size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Melur, Madurai"
                      value={onboardLocation}
                      onChange={(e) => setOnboardLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields for Google Onboarding */}
              {onboardRole === "FARMER" && (
                <div className="roleFieldsSection">
                  <span className="roleSectionTitle">🌾 Farm Profile</span>
                  <div className="formGroup">
                    <label>Produce Categories</label>
                    <input
                      type="text"
                      placeholder="e.g. Tomato, Onion, Chilli, Brinjal"
                      value={onboardProduceCategories}
                      onChange={(e) => setOnboardProduceCategories(e.target.value)}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Farm Details (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Acres Organic Vegetable Farm"
                      value={onboardFarmDetails}
                      onChange={(e) => setOnboardFarmDetails(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {onboardRole === "BUYER" && (
                <div className="roleFieldsSection">
                  <span className="roleSectionTitle">📦 Buyer Organization Profile</span>
                  <div className="formGroup">
                    <label>Business / Store Name</label>
                    <div className="inputIconWrap">
                      <Building size={18} />
                      <input
                        type="text"
                        placeholder="e.g. Madurai Fresh Mart Pvt Ltd"
                        value={onboardBusinessName}
                        onChange={(e) => setOnboardBusinessName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="formGroup">
                    <label>Required Produce Categories</label>
                    <input
                      type="text"
                      placeholder="e.g. Tomato, Potato, Onion"
                      value={onboardRequiredCategories}
                      onChange={(e) => setOnboardRequiredCategories(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {onboardRole === "TRANSPORTER" && (
                <div className="roleFieldsSection">
                  <span className="roleSectionTitle">🚚 Transport Vehicle Profile</span>
                  <div className="formGridTwo">
                    <div className="formGroup">
                      <label>Vehicle Type</label>
                      <select
                        value={onboardVehicleType}
                        onChange={(e) => setOnboardVehicleType(e.target.value)}
                      >
                        <option value="Mini Truck (1-2 Ton)">Mini Truck (1-2 Ton)</option>
                        <option value="Refrigerated Truck (5 Ton)">Refrigerated Truck (5 Ton)</option>
                        <option value="Heavy Freight (10 Ton)">Heavy Freight (10 Ton)</option>
                        <option value="Agro Pickup (750 kg)">Agro Pickup (750 kg)</option>
                      </select>
                    </div>
                    <div className="formGroup">
                      <label>Vehicle Capacity</label>
                      <input
                        type="text"
                        placeholder="e.g. 5,000 kg"
                        value={onboardVehicleCapacity}
                        onChange={(e) => setOnboardVehicleCapacity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btnPrimary btnBlock" disabled={loading} style={{ marginTop: "14px" }}>
                {loading ? "Completing Profile..." : `ENTER ${onboardRole} DASHBOARD`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
