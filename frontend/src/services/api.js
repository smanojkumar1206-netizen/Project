/**
 * Centralized API Client with JWT Bearer Interceptor
 * Connects Frontend to FastAPI Backend (MongoDB)
 */

const API_BASE = import.meta.env.VITE_API_URL || "";

function getHeaders(customHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders
  };

  const token = localStorage.getItem("agriconnect_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const session = localStorage.getItem("agriconnect_session");
  if (session) {
    try {
      const user = JSON.parse(session);
      if (user?.role) {
        headers["X-User-Role"] = user.role;
      }
    } catch (e) {}
  }

  return headers;
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: getHeaders(options.headers)
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage = data?.detail || data?.message || `HTTP Error ${res.status}`;
      const err = new Error(errorMessage);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    apiRequest(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined
    }),
  put: (endpoint, body) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined
    }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" })
};

export default api;
