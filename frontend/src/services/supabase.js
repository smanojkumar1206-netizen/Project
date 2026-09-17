/**
 * Legacy compatibility adapter redirecting to authApi.js (MongoDB + JWT)
 */
export * from "./authApi";
export const isSupabaseConfigured = false;
export const isMongoConfigured = true;
export const supabase = null;
