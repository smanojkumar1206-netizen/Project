import React from "react";
import { Bell, CheckCircle2, Truck, ShoppingBag, X, Info, Mail, MessageSquare } from "lucide-react";

export function NotificationPanel({
  notifications = [],
  isOpen,
  onClose,
  onMarkRead,
  onNavigate
}) {
  if (!isOpen) return null;

  const getChannelBadge = (channel, isDemoChannel) => {
    return (
      <div className="notifChannelBadges">
        <span className="channelBadge inApp">In-App</span>
        <span className="channelBadge email">
          <Mail size={10} /> Email {isDemoChannel ? "(DEMO)" : ""}
        </span>
        <span className="channelBadge sms">
          <MessageSquare size={10} /> SMS {isDemoChannel ? "(DEMO)" : ""}
        </span>
      </div>
    );
  };

  return (
    <div className="notificationDropdownOverlay" onClick={onClose}>
      <div className="notificationDropdownPanel" onClick={(e) => e.stopPropagation()}>
        <div className="notifHeader">
          <div className="notifTitle">
            <Bell size={18} />
            <h3>Notification Center</h3>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="countBadge">{notifications.filter(n => !n.read).length}</span>
            )}
          </div>
          <button type="button" className="closeBtn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="notifList">
          {notifications.length === 0 ? (
            <div className="emptyNotif">
              <Info size={28} />
              <p>No notifications for your profile right now.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notifCardItem ${!n.read ? "unread" : ""}`}
                onClick={() => {
                  onMarkRead && onMarkRead(n.id);
                  if (n.type.includes("TRANSPORT") || n.type.includes("SHIPMENT")) onNavigate && onNavigate("Transport");
                  if (n.type.includes("OFFER") || n.type.includes("ORDER") || n.type.includes("DELIVERY")) onNavigate && onNavigate("My Orders");
                  onClose();
                }}
              >
                <div className="notifIconBox">
                  {n.type.includes("TRANSPORT") || n.type.includes("TRANSIT") ? (
                    <Truck size={18} color="#d97706" />
                  ) : n.type.includes("NEW_ORDER") || n.type.includes("ORDER") ? (
                    <ShoppingBag size={18} color="#0284c7" />
                  ) : (
                    <CheckCircle2 size={18} color="#166534" />
                  )}
                </div>

                <div className="notifContent">
                  <div className="notifItemHead">
                    <strong>{n.title}</strong>
                    <span className="time">{n.timestamp}</span>
                  </div>
                  <p>{n.message}</p>
                  {getChannelBadge(n.channel, n.is_demo_channel)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPanel;
