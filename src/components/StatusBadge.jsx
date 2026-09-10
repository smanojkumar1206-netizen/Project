import React from "react";

export default function StatusBadge({ text }) {
  if (!text) return null;
  const upper = text.toUpperCase();
  
  let cls = "pending";
  if (upper.includes("DELIVERED") || upper.includes("COMPLETED") || upper.includes("CONFIRMED") || upper === "ACTIVE" || upper === "AVAILABLE" || upper === "OPERATIONAL") {
    cls = "delivered";
  } else if (upper.includes("TRANSIT") || upper.includes("ASSIGNED") || upper === "ON TRIP") {
    cls = "assigned";
  } else if (upper.includes("MATCHED") || upper.includes("REQUESTED")) {
    cls = "matched";
  } else if (upper.includes("MAINTENANCE") || upper.includes("SUSPENDED") || upper.includes("RISK") || upper.includes("ATTENTION")) {
    cls = "danger";
  }

  return (
    <span className={`status ${cls}`}>
      <i />
      {text}
    </span>
  );
}
