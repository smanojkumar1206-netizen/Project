"""
Notification Service for AgriConnect.
Manages user-scoped in-app notifications, email notifications, and SMS notifications
for Farmers, Buyers, Transporters, and Admins.
"""

import os
import logging
from typing import Dict, Any, List, Optional
import time

logger = logging.getLogger("agriconnect_notifications")

class NotificationService:
    def __init__(self):
        # Email & SMS Service Provider Environment Variables
        self.email_api_key = os.getenv("EMAIL_PROVIDER_API_KEY", "")
        self.email_from = os.getenv("EMAIL_FROM", "notifications@agriconnect.org")
        self.sms_api_key = os.getenv("SMS_PROVIDER_API_KEY", "")
        self.sms_sender_id = os.getenv("SMS_PROVIDER_SENDER_ID", "AGRI_CONN")

        # In-App Notification Store
        self.notifications: List[Dict[str, Any]] = [
            {
                "id": "NOTIF-101",
                "user_id": "USR-FARMER-1",
                "role": "farmer",
                "title": "Offer Accepted",
                "message": "Madurai Fresh Mart accepted your offer for 500 kg Tomato. Waiting for transport.",
                "type": "OFFER_ACCEPTED",
                "channel": "IN_APP",
                "read": False,
                "timestamp": "10 mins ago"
            },
            {
                "id": "NOTIF-102",
                "user_id": "USR-BUYER-1",
                "role": "buyer",
                "title": "Order Confirmed",
                "message": "Your order ORD-1042 has been confirmed by farmer Ravi Kumar. Waiting for transport.",
                "type": "ORDER_CONFIRMED",
                "channel": "IN_APP",
                "read": False,
                "timestamp": "10 mins ago"
            },
            {
                "id": "NOTIF-103",
                "user_id": "USR-TRANSPORTER-1",
                "role": "transporter",
                "title": "New Transport Request",
                "message": "New transport request TR-801 available: 500 kg Tomato pickup at Melur, Madurai.",
                "type": "NEW_TRANSPORT_REQUEST",
                "channel": "IN_APP",
                "read": False,
                "timestamp": "8 mins ago"
            }
        ]

    def send_email(self, to_email: str, subject: str, body: str) -> bool:
        """
        Sends an email via configured provider or logs simulated DEMO email.
        Non-blocking: exception safe to prevent blocking order transactions.
        """
        try:
            if self.email_api_key:
                logger.info(f"Sending live email to {to_email} via provider...")
                # Integrate with actual provider (e.g., SendGrid/Resend) when API key is set
                return True
            else:
                logger.info(f"[DEMO EMAIL MODE] To: {to_email} | Subject: {subject}\nBody:\n{body}")
                return True
        except Exception as e:
            logger.error(f"Email delivery error (non-blocking): {e}")
            return False

    def send_sms(self, phone: str, message: str) -> bool:
        """
        Sends SMS via backend provider or logs simulated DEMO SMS.
        Non-blocking: exception safe.
        """
        try:
            if self.sms_api_key:
                logger.info(f"Sending live SMS to {phone} via provider...")
                return True
            else:
                logger.info(f"[DEMO SMS MODE] To: {phone} | Message: {message}")
                return True
        except Exception as e:
            logger.error(f"SMS delivery error (non-blocking): {e}")
            return False

    def create_notification(
        self,
        user_id: str,
        role: str,
        title: str,
        message: str,
        event_type: str,
        channel: str = "IN_APP",
        related_order_id: Optional[str] = None,
        related_transport_id: Optional[str] = None,
        user_email: Optional[str] = None,
        user_phone: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Creates an in-app notification and dispatches Email + SMS asynchronously without blocking.
        """
        notif_id = f"NOTIF-{len(self.notifications) + 101}"
        notif = {
            "id": notif_id,
            "user_id": user_id,
            "role": role.lower(),
            "title": title,
            "message": message,
            "type": event_type,
            "channel": channel,
            "related_order_id": related_order_id,
            "related_transport_id": related_transport_id,
            "read": False,
            "timestamp": "Just now",
            "is_demo_channel": not bool(self.email_api_key or self.sms_api_key)
        }
        self.notifications.insert(0, notif)

        # Dispatch Email if email address is provided or determined
        if user_email or "FARMER" in user_id or "BUYER" in user_id:
            dest_email = user_email or f"{user_id.lower()}@agriconnect.org"
            self.send_email(dest_email, f"AgriConnect Alert: {title}", message)

        # Dispatch SMS if phone is provided or determined
        if user_phone or user_id:
            dest_phone = user_phone or "+91 98765 43210"
            self.send_sms(dest_phone, f"AgriConnect: {title} - {message}")

        return notif

    def get_user_notifications(self, user_id: str, role: str) -> List[Dict[str, Any]]:
        u_norm = (user_id or "").lower()
        r_norm = (role or "farmer").lower()

        results = []
        for n in self.notifications:
            if n["user_id"].lower() == u_norm or n["user_id"] == "BROADCAST" or (n["role"] == r_norm and n["type"] == "NEW_TRANSPORT_REQUEST"):
                results.append(n)
        return results

    def mark_as_read(self, notif_id: str):
        for n in self.notifications:
            if n["id"] == notif_id:
                n["read"] = True

notification_service = NotificationService()
