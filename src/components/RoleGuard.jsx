import React from "react";
import AccessRestricted from "./AccessRestricted";
import { ROLE_CONFIG, normalizeRole, isPageAllowed } from "../config/roles";

/**
 * RoleGuard protects views and routes based on authenticated user's permanent assigned role.
 */
export default function RoleGuard({ userRole, targetPage, setPage, children }) {
  const normUserRole = normalizeRole(userRole);
  const isAllowed = isPageAllowed(normUserRole, targetPage);

  if (!isAllowed) {
    const userRoleConfig = ROLE_CONFIG[normUserRole] || ROLE_CONFIG.farmer;
    return (
      <AccessRestricted
        role={normUserRole}
        page={targetPage}
        setPage={() => setPage(userRoleConfig.defaultPage)}
      />
    );
  }

  return <>{children}</>;
}
