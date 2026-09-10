/**
 * Transport Lifecycle API Connector
 * Handles offer acceptance, transport request creation, transport acceptance, and status updates
 */

const BACKEND_URL = "http://localhost:8000/api";

export async function acceptOfferApi(orderId) {
  try {
    const res = await fetch(`${BACKEND_URL}/orders/${orderId}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API offline, using local state workflow trigger.");
  }
  return { success: true };
}

export async function acceptTransportRequestApi(transportRequestId, vehicleNumber = "TN 58 AB 2211") {
  try {
    const res = await fetch(`${BACKEND_URL}/transport/requests/${transportRequestId}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicle_number: vehicleNumber })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API offline, updating local state.");
  }
  return { success: true };
}
