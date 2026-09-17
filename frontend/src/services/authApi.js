/**
 * AgriConnect Authentication Service (JWT & Google OAuth)
 * Handles Email/Password Authentication & Google One Tap / OAuth with Role Segregation
 */

import { api } from "./api";

// Predefined Admin Credentials definition
export const PREDEFINED_ADMIN = {
  id: "USR-ADMIN-001",
  full_name: "System Administrator",
  email: "admin@agriconnect.com",
  role: "admin",
  location: "Central HQ, Chennai"
};

/**
 * In-memory store for registered users (synced with active session)
 */
let registeredUsersStore = [];

export function getRegisteredUsersStore() {
  return registeredUsersStore;
}

export function registerUserLocally(userProfile) {
  registeredUsersStore = [userProfile, ...registeredUsersStore.filter((u) => u.email !== userProfile.email)];
  return registeredUsersStore;
}

/**
 * Register a new user in MongoDB via FastAPI.
 * Public registration is restricted to Farmer, Buyer, or Transporter.
 */
export async function signUpUser({ email, password, fullName, phone, role, location, extraFields = {} }) {
  const cleanEmail = (email || "").toLowerCase().trim();

  // Security Check: Normal users cannot register as Admin
  if (role.toLowerCase() === "admin" || cleanEmail === "admin@agriconnect.com") {
    throw new Error("Admin accounts cannot be created via public registration.");
  }

  const normRole = role.toLowerCase(); // 'farmer' | 'buyer' | 'transporter'

  const res = await api.post("/api/auth/register", {
    full_name: fullName,
    email: cleanEmail,
    phone: phone || "",
    password: password,
    role: normRole,
    location: location || "Madurai",
    extra_fields: extraFields
  });

  if (res?.token) {
    localStorage.setItem("agriconnect_token", res.token);
  }
  if (res?.profile) {
    localStorage.setItem("agriconnect_session", JSON.stringify(res.profile));
    registerUserLocally(res.profile);
  }

  return {
    success: true,
    profile: res.profile,
    token: res.token
  };
}

/**
 * Login user via FastAPI JWT Authentication.
 * Enforces real credential verification (no demo account bypass).
 */
export async function signInUser(email, password) {
  const cleanEmail = (email || "").toLowerCase().trim();

  const res = await api.post("/api/auth/login", {
    email: cleanEmail,
    password: password
  });

  if (res?.token) {
    localStorage.setItem("agriconnect_token", res.token);
  }
  if (res?.profile) {
    localStorage.setItem("agriconnect_session", JSON.stringify(res.profile));
    registerUserLocally(res.profile);
  }

  return {
    success: true,
    profile: res.profile,
    token: res.token
  };
}

/**
 * Google Sign-In: Verifies Google identity and checks for role assignment.
 */
export async function signInWithGoogle(payload) {
  // payload can be { credential: "..." } or { email: "...", name: "...", google_id: "...", picture: "..." }
  const res = await api.post("/api/auth/google", payload);

  if (res?.needs_role_selection) {
    return {
      success: true,
      needs_role_selection: true,
      google_user: res.google_user
    };
  }

  // Returning user with active role
  if (res?.token) {
    localStorage.setItem("agriconnect_token", res.token);
  }
  if (res?.profile) {
    localStorage.setItem("agriconnect_session", JSON.stringify(res.profile));
    registerUserLocally(res.profile);
  }

  return {
    success: true,
    needs_role_selection: false,
    profile: res.profile,
    token: res.token
  };
}

/**
 * Complete Google User Onboarding: Assigns Role & Role-Specific Profile Details.
 */
export async function completeGoogleProfile(onboardingData) {
  const res = await api.post("/api/auth/google/complete-profile", onboardingData);

  if (res?.token) {
    localStorage.setItem("agriconnect_token", res.token);
  }
  if (res?.profile) {
    localStorage.setItem("agriconnect_session", JSON.stringify(res.profile));
    registerUserLocally(res.profile);
  }

  return {
    success: true,
    profile: res.profile,
    token: res.token
  };
}

/**
 * Sign out user and clear stored JWT token.
 */
export async function signOutUser() {
  localStorage.removeItem("agriconnect_token");
  localStorage.removeItem("agriconnect_session");
  return { success: true };
}

/**
 * Validates active JWT session with backend.
 */
export async function getCurrentUser() {
  const token = localStorage.getItem("agriconnect_token");
  if (!token) return null;

  try {
    const data = await api.get("/api/auth/me");
    return data?.user || null;
  } catch (e) {
    const saved = localStorage.getItem("agriconnect_session");
    if (saved) {
      try { return JSON.parse(saved); } catch (err) { return null; }
    }
    return null;
  }
}
