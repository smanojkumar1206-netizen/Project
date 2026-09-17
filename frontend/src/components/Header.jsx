import React from "react";
import { Menu, ChevronRight, Search, Bell, LogOut } from "lucide-react";
import { ROLE_CONFIG, normalizeRole } from "../config/roles";

export default function Header({
  role,
  page,
  setMobileOpen,
  notify,
  unreadCount = 0,
  onOpenNotifications,
  currentUserProfile,
  onLogout
}) {
  const normKey = normalizeRole(role);
  const currentConfig = ROLE_CONFIG[normKey] || ROLE_CONFIG.farmer;

  const profileName = currentUserProfile?.full_name || (
    normKey === "farmer" ? "Ravi Kumar (Farmer)" :
    normKey === "buyer" ? "Madurai Fresh Mart" :
    normKey === "transporter" ? "Express Logistics" : "System Admin"
  );

  return (
    <header className={`topbar ${currentConfig.themeClass}`}>
      <div className="leftHeader">
        <button className="iconBtn hamburger" onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <div className="crumb">
          <span>AgriConnect</span>
          <ChevronRight size={15} />
          <span className="roleTag">{currentConfig.name}</span>
          <ChevronRight size={15} />
          <b>{page}</b>
        </div>
      </div>

      <div className="topActions">
        <div className="search">
          <Search size={17} />
          <input placeholder={`Search in ${currentConfig.name} portal...`} />
        </div>

        <button
          className="iconBtn notification"
          onClick={() => onOpenNotifications ? onOpenNotifications() : notify(`${unreadCount} unread notifications`)}
          title="Notifications"
        >
          <Bell size={19} />
          {unreadCount > 0 && <span className="headerNotifBadge">{unreadCount}</span>}
        </button>

        <div className="profile">
          <div className="avatar">{profileName[0] || "U"}</div>
          <div className="profileMeta">
            <b>{profileName}</b>
            <span>{currentConfig.name} Account</span>
          </div>
        </div>

        {onLogout && (
          <button
            className="iconBtn logoutHeaderBtn"
            onClick={onLogout}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
