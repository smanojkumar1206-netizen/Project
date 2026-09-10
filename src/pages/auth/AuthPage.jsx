import React, { useState } from "react";
import {
  Leaf, Sprout, ShoppingCart, Truck, ShieldCheck,
  User, Mail, Phone, Lock, MapPin, Building, AlertCircle, CheckCircle2, ArrowLeft
} from "lucide-react";
import { signUpUser, signInUser, isSupabaseConfigured, PREDEFINED_ADMIN } from "../../services/supabase";

export default function AuthPage({ onLoginSuccess }) {
  // View states: 'welcome' | 'login' | 'register'
  const [view, setView] = useState("welcome");

  // Registration Form State (Admin is NOT an option!)
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

  // Login Form State (No role buttons!)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setError("");
    setLoading(true);
    try {
      const res = await signInUser(demoEmail, demoPass);
      onLoginSuccess(res.profile);
    } catch (err) {
      setError(err.message || "Failed to login with demo account.");
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
      let errMsg = err.message || "Authentication failed.";
      if (errMsg.toLowerCase().includes("invalid login credentials")) {
        errMsg = "Invalid email or password. Please check your credentials.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // Requirement #2: Normal users can NEVER register as Admin
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
        {/* Brand Header */}
        <div className="authHeader">
          <div className="authLogo">
            <Leaf size={32} />
          </div>
          <h1>AGRICONNECT</h1>
          <p className="authSub">Smart Agricultural Supply Chain</p>
          {!isSupabaseConfigured && (
            <div className="demoConfigTag">
              <span>⚡ DEMO MODE ACTIVE — Authentication & DB simulated</span>
            </div>
          )}
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

        {/* ==================== 1. FIRST SCREEN WELCOME PAGE ==================== */}
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

            <div className="authButtonStack">
              <button
                className="btnPrimary btnLarge"
                onClick={() => { setError(""); setView("login"); }}
              >
                Login
              </button>
              <button
                className="btnSecondary btnLarge"
                onClick={() => { setError(""); setView("register"); }}
              >
                Create Account
              </button>
            </div>

            {/* Quick Testing Sign-In Access */}
            <div className="quickDemoBox">
              <div className="quickDemoHead">
                <ShieldCheck size={16} />
                <span>Quick Testing Credentials</span>
              </div>
              <div className="quickDemoGrid">
                <button type="button" onClick={() => handleQuickDemoLogin("farmer@agriconnect.org", "demo123")}>
                  🌾 Farmer Demo
                </button>
                <button type="button" onClick={() => handleQuickDemoLogin("buyer@agriconnect.org", "demo123")}>
                  📦 Buyer Demo
                </button>
                <button type="button" onClick={() => handleQuickDemoLogin("transporter@agriconnect.org", "demo123")}>
                  🚚 Transporter Demo
                </button>
                <button type="button" onClick={() => handleQuickDemoLogin("admin@agriconnect.com", "AgriConnect@Admin2026")}>
                  🛡️ Admin Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. LOGIN SCREEN (NO ROLE SELECTION BUTTONS!) ==================== */}
        {view === "login" && (
          <div className="authFormView">
            <button className="backBtnLink" onClick={() => { setError(""); setView("welcome"); }}>
              <ArrowLeft size={16} /> Back to Welcome
            </button>

            <h2>Sign in to AgriConnect</h2>
            <p className="formSubtitle">Enter your account credentials. Role will be automatically determined from your profile.</p>

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
                  />
                </div>
              </div>

              <button type="submit" className="btnPrimary btnBlock" disabled={loading}>
                {loading ? "Authenticating..." : "LOGIN"}
              </button>
            </form>

            <div className="quickDemoBox">
              <div className="quickDemoHead">
                <ShieldCheck size={14} />
                <span>1-Click Testing Logins</span>
              </div>
              <div className="quickDemoGrid">
                <button type="button" onClick={() => handleQuickDemoLogin("farmer@agriconnect.org", "demo123")}>Farmer</button>
                <button type="button" onClick={() => handleQuickDemoLogin("buyer@agriconnect.org", "demo123")}>Buyer</button>
                <button type="button" onClick={() => handleQuickDemoLogin("transporter@agriconnect.org", "demo123")}>Transporter</button>
                <button type="button" onClick={() => handleQuickDemoLogin("admin@agriconnect.com", "AgriConnect@Admin2026")}>Admin</button>
              </div>
            </div>

            <div className="authSwitchFooter">
              <span>Don't have an account? </span>
              <button className="linkBtnBold" onClick={() => { setError(""); setView("register"); }}>
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ==================== 3. CREATE ACCOUNT (ADMIN OMITTED!) ==================== */}
        {view === "register" && (
          <div className="authFormView">
            <button className="backBtnLink" onClick={() => { setError(""); setView("welcome"); }}>
              <ArrowLeft size={16} /> Back to Welcome
            </button>

            <h2>Create Your AgriConnect Account</h2>
            <p className="formSubtitle">Register as a Farmer, Buyer, or Transporter. (Admin registration is protected)</p>

            <form onSubmit={handleRegisterSubmit}>
              {/* Role Options: FARMER, BUYER, TRANSPORTER ONLY (NO ADMIN!) */}
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
                <span className="roleNote">
                  🛡️ Admin accounts are created through protected system configuration.
                </span>
              </div>

              {/* Standard Fields */}
              <div className="formRowGrid">
                <div className="formGroup">
                  <label>Full Name</label>
                  <div className="inputIconWrap">
                    <User size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Mobile Number</label>
                  <div className="inputIconWrap">
                    <Phone size={18} />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="formGroup">
                <label>Email Address</label>
                <div className="inputIconWrap">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="e.g. ramesh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="formRowGrid">
                <div className="formGroup">
                  <label>Password</label>
                  <div className="inputIconWrap">
                    <Lock size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label>Confirm Password</label>
                  <div className="inputIconWrap">
                    <Lock size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Role Specific Fields */}
              <div className="roleFieldsBox">
                <h4>Role Details ({regRole})</h4>

                {regRole === "FARMER" && (
                  <>
                    <div className="formGroup">
                      <label>Farm / Village Location</label>
                      <div className="inputIconWrap">
                        <MapPin size={18} />
                        <input
                          type="text"
                          placeholder="e.g. Melur, Madurai"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="formGroup">
                      <label>Produce Categories</label>
                      <input
                        type="text"
                        placeholder="e.g. Tomato, Onion, Chilli"
                        value={produceCategories}
                        onChange={(e) => setProduceCategories(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {regRole === "BUYER" && (
                  <>
                    <div className="formGroup">
                      <label>Business / Organization Name</label>
                      <div className="inputIconWrap">
                        <Building size={18} />
                        <input
                          type="text"
                          placeholder="e.g. Madurai Fresh Mart"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="formGroup">
                      <label>Business Location</label>
                      <div className="inputIconWrap">
                        <MapPin size={18} />
                        <input
                          type="text"
                          placeholder="e.g. Mattuthavani, Madurai"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {regRole === "TRANSPORTER" && (
                  <>
                    <div className="formGroup">
                      <label>Operating Location</label>
                      <div className="inputIconWrap">
                        <MapPin size={18} />
                        <input
                          type="text"
                          placeholder="e.g. Madurai Logistics Park"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="formRowGrid">
                      <div className="formGroup">
                        <label>Vehicle Type</label>
                        <input
                          type="text"
                          placeholder="Refrigerated Truck"
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                        />
                      </div>

                      <div className="formGroup">
                        <label>Vehicle Capacity</label>
                        <input
                          type="text"
                          placeholder="5,000 kg"
                          value={vehicleCapacity}
                          onChange={(e) => setVehicleCapacity(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button type="submit" className="btnPrimary btnBlock" disabled={loading}>
                {loading ? "Creating Account..." : "CREATE ACCOUNT"}
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
      </div>
    </div>
  );
}
