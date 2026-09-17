import React from "react";

export default function StatCard({ icon: Icon, label, value, sub, trend }) {
  return (
    <div className="stat">
      <div className="statIcon">
        <Icon size={20} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {sub && <small className={trend?.startsWith("+") ? "up" : ""}>{sub}</small>}
      </div>
    </div>
  );
}
