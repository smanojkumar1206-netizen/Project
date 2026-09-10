import React from "react";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { ROLE_CONFIG, normalizeRole } from "../config/roles";

export default function AccessRestricted({ role, page, setPage }) {
  const normKey = normalizeRole(role);
  const currentConfig = ROLE_CONFIG[normKey] || ROLE_CONFIG.farmer;

  return (
    <div className="accessRestrictedContainer">
      <div className="accessRestrictedCard">
        <div className="lockBadge">
          <Lock size={32} />
        </div>
        <div className="warningIconWrap">
          <ShieldAlert size={24} />
        </div>
        <h2>Access Restricted</h2>
        <p className="restrictedDesc">
          You do not have permission to view <strong>"{page}"</strong> as a <span>{currentConfig.name}</span>.
        </p>
        <p className="restrictedHint">
          This feature is restricted to authorized roles. Switch your role using the sidebar selector or return to your role dashboard.
        </p>
        <div className="actionRow">
          <button className="primary" onClick={() => setPage(currentConfig.defaultPage)}>
            <ArrowLeft size={16} /> Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
