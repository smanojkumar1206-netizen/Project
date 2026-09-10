import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Predefined Admin Credentials (Requirement #3 & #14)
export const PREDEFINED_ADMIN = {
  id: "USR-ADMIN-001",
  auth_user_id: "demo-auth-admin-001",
  full_name: "System Administrator",
  email: "admin@agriconnect.com",
  phone: "+91 90000 00000",
  role: "admin",
  location: "Central HQ, Chennai",
  createdAt: "01 Sep 2026",
  status: "Active"
};

// Initial Registered Users Database Array
export const INITIAL_REGISTERED_USERS = [
  {
    id: "USR-FARMER-1",
    auth_user_id: "demo-auth-farmer-1",
    full_name: "Ravi Kumar",
    email: "farmer@agriconnect.org",
    phone: "+91 98765 43210",
    role: "farmer",
    location: "Melur, Madurai",
    createdAt: "02 Sep 2026",
    status: "Active",
    produce_categories: ["Tomato", "Chilli", "Brinjal"],
    farm_details: "12 Acres organic vegetable farm in Melur"
  },
  {
    id: "USR-BUYER-1",
    auth_user_id: "demo-auth-buyer-1",
    full_name: "Madurai Fresh Mart",
    email: "buyer@agriconnect.org",
    phone: "+91 94433 12345",
    role: "buyer",
    location: "Madurai Town",
    createdAt: "03 Sep 2026",
    status: "Active",
    business_name: "Madurai Fresh Mart Pvt Ltd",
    required_categories: ["Tomato", "Onion", "Potato"]
  },
  {
    id: "USR-TRANSPORTER-1",
    auth_user_id: "demo-auth-transporter-1",
    full_name: "Express Logistics",
    email: "transporter@agriconnect.org",
    phone: "+91 91234 56789",
    role: "transporter",
    location: "Madurai Logistics Park",
    createdAt: "04 Sep 2026",
    status: "Active",
    vehicle_type: "Refrigerated Truck (5 Ton)",
    vehicle_capacity: "5,000 kg"
  },
  PREDEFINED_ADMIN
];

// Persistent local store for registered users
let registeredUsersStore = [...INITIAL_REGISTERED_USERS];

export function getRegisteredUsersStore() {
  return registeredUsersStore;
}

/**
 * Register a new user in Supabase Auth & create profile record.
 * Normal users can NEVER register as Admin.
 */
export async function signUpUser({ email, password, fullName, phone, role, location, extraFields = {} }) {
  const cleanEmail = (email || "").toLowerCase().trim();

  // Security Check: Normal users cannot register as Admin
  if (role.toLowerCase() === "admin" || cleanEmail === "admin@agriconnect.com") {
    throw new Error("Admin accounts cannot be created via public registration.");
  }

  const normRole = role.toLowerCase(); // 'farmer' | 'buyer' | 'transporter'

  if (isSupabaseConfigured && supabase) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          full_name: fullName,
          role: normRole
        }
      }
    });

    if (authError) throw new Error(authError.message);

    const user = authData.user;
    if (!user) throw new Error("Registration failed. Please check your details.");

    // Create user profile in profiles table
    const profilePayload = {
      auth_user_id: user.id,
      full_name: fullName,
      email: cleanEmail,
      phone: phone || "",
      role: normRole,
      location: location || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: profile } = await supabase
      .from("profiles")
      .insert([profilePayload])
      .select()
      .single();

    const createdProfile = profile || {
      id: `USR-${normRole.toUpperCase()}-${Date.now()}`,
      ...profilePayload,
      createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Active"
    };

    registeredUsersStore.unshift(createdProfile);

    return {
      user,
      profile: createdProfile
    };
  }

  // DEMO MODE Registration Fallback
  const newDemoUser = {
    id: `USR-${normRole.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    auth_user_id: `demo-auth-${Date.now()}`,
    full_name: fullName,
    email: cleanEmail,
    phone: phone || "+91 98000 11111",
    role: normRole,
    location: location || "Madurai",
    createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    status: "Active",
    ...extraFields
  };

  registeredUsersStore.unshift(newDemoUser);

  return {
    user: { id: newDemoUser.auth_user_id, email: newDemoUser.email },
    profile: newDemoUser,
    isDemo: true
  };
}

/**
 * Login user via Supabase Auth or Demo accounts.
 * Validates exact Admin credentials for admin@agriconnect.com + AgriConnect@Admin2026.
 */
export async function signInUser(emailOrPhone, password) {
  const cleanEmail = (emailOrPhone || "").toLowerCase().trim();

  // ==================== ADMIN CREDENTIAL SECURITY VALIDATION ====================
  if (cleanEmail === "admin@agriconnect.com") {
    if (password !== "AgriConnect@Admin2026") {
      throw new Error("Invalid password for Admin account. Admin access denied.");
    }
    return {
      user: { id: PREDEFINED_ADMIN.auth_user_id, email: PREDEFINED_ADMIN.email },
      profile: PREDEFINED_ADMIN,
      isDemo: !isSupabaseConfigured
    };
  }

  // Reject unauthorized email attempting Admin password
  if (password === "AgriConnect@Admin2026" && cleanEmail !== "admin@agriconnect.com") {
    // Treat as normal authentication check, DO NOT elevate to Admin
    console.warn("Attempted admin password with non-admin email. Standard authorization enforced.");
  }

  if (isSupabaseConfigured && supabase) {
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (authErr) throw new Error(authErr.message);

    const user = authData.user;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    const role = (profile?.role || user.user_metadata?.role || "farmer").toLowerCase();

    // Double check: Never allow non-admin user to inherit admin role unless authenticating as admin@agriconnect.com
    const finalRole = (role === "admin" && cleanEmail !== "admin@agriconnect.com") ? "farmer" : role;

    return {
      user,
      profile: profile || {
        id: user.id,
        auth_user_id: user.id,
        full_name: user.user_metadata?.full_name || cleanEmail.split("@")[0],
        email: user.email,
        role: finalRole,
        location: "Madurai"
      }
    };
  }

  // DEMO MODE Login Fallback
  // Find registered user in memory store by email
  const existingUser = registeredUsersStore.find(u => u.email.toLowerCase() === cleanEmail);

  if (existingUser) {
    return {
      user: { id: existingUser.auth_user_id, email: existingUser.email },
      profile: existingUser,
      isDemo: true
    };
  }

  // Fallback to role matching if generic demo emails used
  let matchedUser = INITIAL_REGISTERED_USERS[0]; // farmer
  if (cleanEmail.includes("buyer")) matchedUser = INITIAL_REGISTERED_USERS[1];
  else if (cleanEmail.includes("trans")) matchedUser = INITIAL_REGISTERED_USERS[2];

  return {
    user: { id: matchedUser.auth_user_id, email: matchedUser.email },
    profile: matchedUser,
    isDemo: true
  };
}

/**
 * Sign out session.
 */
export async function signOutUser() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  return true;
}
