import React from "react";
import { CheckCircle2 } from "lucide-react";

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast">
      <CheckCircle2 size={18} />
      <span>{toast}</span>
    </div>
  );
}
