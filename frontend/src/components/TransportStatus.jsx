import React from "react";
import { CheckCircle2, Clock, Truck, MapPin, Check, ArrowRight } from "lucide-react";

export function TransportStatus({
  order = {},
  onTrackClick = null
}) {
  const status = (order.status || order.transport_status || "ACCEPTED").toUpperCase();

  const steps = [
    { key: "ACCEPTED", label: "Offer Accepted" },
    { key: "WAITING_FOR_TRANSPORT", label: "Waiting for Transport" },
    { key: "TRANSPORT_ASSIGNED", label: "Transport Assigned" },
    { key: "PICKUP_IN_PROGRESS", label: "Pickup in Progress" },
    { key: "IN_TRANSIT", label: "In Transit" },
    { key: "DELIVERED", label: "Delivered" }
  ];

  const getStepIndex = (st) => {
    if (st.includes("DELIVER")) return 5;
    if (st.includes("IN_TRANSIT") || st.includes("TRANSIT")) return 4;
    if (st.includes("PICKUP")) return 3;
    if (st.includes("ASSIGNED")) return 2;
    if (st.includes("WAITING")) return 1;
    return 0;
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="transportStatusCard">
      <div className="statusHeaderRow">
        <div className="orderMeta">
          <span className="orderIdTag">{order.id || "ORD-1042"}</span>
          <strong>{order.crop || "Tomato"} · {order.qty || 500} kg</strong>
        </div>
        <span className={`currentStatusPill status-${status.toLowerCase()}`}>
          {status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="stepperRow">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className={`stepItem ${isDone ? "done" : ""} ${isCurrent ? "active" : ""}`}>
              <div className="stepCircle">
                {isDone ? <Check size={12} /> : <span>{idx + 1}</span>}
              </div>
              <span className="stepLabel">{step.label}</span>
              {idx < steps.length - 1 && <div className={`stepLine ${idx < currentIndex ? "done" : ""}`}></div>}
            </div>
          );
        })}
      </div>

      {/* Footer Track Action Button */}
      {onTrackClick && (
        <div className="stepperFooterRow">
          <span className="logisticsSub">
            <Truck size={14} /> Transporter: <b>{order.transporter || "Pending Assignment"}</b>
          </span>
          <button type="button" className="trackBtnPrimary" onClick={() => onTrackClick(order)}>
            <MapPin size={14} /> Track Transport Map <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default TransportStatus;
