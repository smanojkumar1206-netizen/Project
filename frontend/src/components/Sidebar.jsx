import React from "react";
import { Leaf, X, Settings, LogOut, ShieldCheck, Lock } from "lucide-react";
import { ROLE_CONFIG, ROLES, normalizeRole } from "../config/roles";

export default function Sidebar({
  role,
  page,
  setPage,
  mobileOpen,
  setMobileOpen,
  notify,
  onLogout
}) {
  const normKey = normalizeRole(role);
  const currentConfig = ROLE_CONFIG[normKey] || ROLE_CONFIG[ROLES.farmer];

  return (
    <aside className={`sidebar ${currentConfig.themeClass} ${mobileOpen ? "open" : ""}`}>
      <div className="brand">
        <div className="brandIcon">
          <Leaf size={22} />
        </div>
        <div>
          <strong>AgriConnect</strong>
          <span>Smart Supply Chain</span>
        </div>
        <button className="iconBtn mobileClose" onClick={() => setMobileOpen(false)}>
          <X />
        </button>
      </div>

      {/* Permanently Locked User Role Display (Requirement #4: NO FRONTEND ROLE SWITCHING) */}
      <div className="roleBox lockedRoleBox">
        <div className="roleHeader">
          <span>AUTHENTICATED PORTAL</span>
          <span className="rolePill">{currentConfig.name.toUpperCase()}</span>
        </div>
        <div className="lockedRoleBadge">
          <Lock size={14} />
          <span>{currentConfig.name} Portal (Role Locked)</span>
        </div>
      </div>

      <nav className="roleNav">
        {currentConfig.navigation.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              className={isActive ? "active" : ""}
              onClick={() => {
                setPage(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebarBottom">
        <div className="userRoleMeta">
          <ShieldCheck size={14} />
          <span>{currentConfig.badgeLabel}</span>
        </div>
        <button onClick={() => notify("Settings module ready for configuration")}>
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button
          className="logoutBtn"
          onClick={() => {
            if (onLogout) onLogout();
            else notify(`${currentConfig.name} session signed out`);
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
