"""
MongoDB Seeder Script for AgriConnect
Initializes MongoDB collections, indexes, and initial demonstrative data.
Usage: python seed_mongo.py
"""

import os
import sys
from typing import Dict, Any, List

# Add parent directory to sys.path so services and db modules can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from db.mongo import get_sync_db
from services.auth_service import hash_password

INITIAL_USERS = [
    {
        "id": "USR-ADMIN-001",
        "full_name": "System Administrator",
        "email": "admin@agriconnect.com",
        "phone": "+91 90000 00000",
        "role": "admin",
        "location": "Central HQ, Chennai",
        "hashed_password": hash_password("AgriConnect@Admin2026"),
        "status": "Active",
        "createdAt": "01 Sep 2026"
    },
    {
        "id": "USR-FARMER-1",
        "full_name": "Ravi Kumar",
        "email": "farmer@agriconnect.org",
        "phone": "+91 98765 43210",
        "role": "farmer",
        "location": "Melur, Madurai",
        "hashed_password": hash_password("farmer123"),
        "status": "Active",
        "produce_categories": ["Tomato", "Chilli", "Brinjal"],
        "farm_details": "12 Acres organic vegetable farm in Melur",
        "createdAt": "02 Sep 2026"
    },
    {
        "id": "USR-BUYER-1",
        "full_name": "Madurai Fresh Mart",
        "email": "buyer@agriconnect.org",
        "phone": "+91 94433 12345",
        "role": "buyer",
        "location": "Madurai Town",
        "hashed_password": hash_password("buyer123"),
        "status": "Active",
        "business_name": "Madurai Fresh Mart Pvt Ltd",
        "required_categories": ["Tomato", "Onion", "Potato"],
        "createdAt": "03 Sep 2026"
    },
    {
        "id": "USR-TRANSPORTER-1",
        "full_name": "Express Logistics",
        "email": "transporter@agriconnect.org",
        "phone": "+91 91234 56789",
        "role": "transporter",
        "location": "Madurai Logistics Park",
        "hashed_password": hash_password("transporter123"),
        "status": "Active",
        "vehicle_type": "Refrigerated Truck (5 Ton)",
        "vehicle_capacity": "5,000 kg",
        "createdAt": "04 Sep 2026"
    }
]

INITIAL_ORDERS = [
    {
        "id": "ORD-1042",
        "crop": "Tomato",
        "buyer": "Madurai Fresh Mart",
        "buyer_id": "USR-BUYER-1",
        "farmer": "Ravi Kumar",
        "farmer_id": "USR-FARMER-1",
        "qty": 500,
        "amount": 12500,
        "price": 25,
        "status": "ACCEPTED",
        "transport_status": "WAITING_FOR_TRANSPORT",
        "transporter": "Pending",
        "transporter_id": None,
        "deliveryDate": "12 Sep 2026",
        "pickupLocation": "Melur, Madurai",
        "deliveryLocation": "Madurai Town"
    },
    {
        "id": "ORD-1041",
        "crop": "Onion",
        "buyer": "Hotel Vaigai",
        "buyer_id": "USR-BUYER-2",
        "farmer": "Meena Farms",
        "farmer_id": "USR-FARMER-2",
        "qty": 300,
        "amount": 10200,
        "price": 34,
        "status": "ACCEPTED",
        "transport_status": "WAITING_FOR_TRANSPORT",
        "transporter": "Pending",
        "transporter_id": None,
        "deliveryDate": "13 Sep 2026",
        "pickupLocation": "Thirumangalam",
        "deliveryLocation": "Vaigai Hotel"
    }
]

INITIAL_TRANSPORT_REQUESTS = [
    {
        "id": "TR-801",
        "order_id": "ORD-1042",
        "produce": "Tomato",
        "qty": 500,
        "farmer_id": "USR-FARMER-1",
        "buyer_id": "USR-BUYER-1",
        "requiredCapacity": "500 kg",
        "pickup": "Melur, Madurai",
        "delivery": "Madurai Town",
        "pickupTime": "12 Sep, 08:00 AM",
        "deadline": "12 Sep, 02:00 PM",
        "distance": "18.4 km",
        "estCost": 850,
        "status": "WAITING_FOR_TRANSPORT",
        "assigned_transporter": None
    }
]

INITIAL_ACTIVE_TRIPS = [
    {
        "id": "TRIP-401",
        "orderId": "ORD-1038",
        "produce": "Potato",
        "qty": 800,
        "farmerPickup": "Kannan Farm (Dindigul)",
        "buyerDestination": "Pandian Processing",
        "vehicle": "TN 58 EF 1098",
        "transporter": "Express Logistics",
        "transporter_id": "USR-TRANSPORTER-1",
        "distance": "42.0 km",
        "eta": "1 hr 10 mins",
        "status": "IN_TRANSIT",
        "pickupLocation": "Dindigul",
        "currentLocation": "Vadipatti",
        "destination": "Dindigul Bypass"
    }
]

INITIAL_LISTINGS = [
    { "id": 1, "crop": "Tomato", "farmer": "Ravi Kumar", "farmer_id": "USR-FARMER-1", "qty": 500, "price": 25, "location": "Melur, Madurai", "harvest": "10 Sep 2026", "grade": "A", "status": "Available" },
    { "id": 2, "crop": "Onion", "farmer": "Meena Farms", "farmer_id": "USR-FARMER-2", "qty": 800, "price": 34, "location": "Thirumangalam, Madurai", "harvest": "11 Sep 2026", "grade": "A", "status": "Available" }
]

INITIAL_REQUIREMENTS = [
    { "id": "REQ-301", "crop": "Tomato", "buyer": "Madurai Fresh Mart", "buyer_id": "USR-BUYER-1", "qty": 500, "maxPrice": 25, "location": "Madurai", "deadline": "Within 2 days", "status": "Active" }
]

INITIAL_STORAGE = [
    { "id": "STR-01", "name": "Madurai Central Agro Hub", "location": "Melur Road, Madurai", "totalCapacity": "2,000 kg", "occupiedCapacity": "1,440 kg", "availableCapacity": "560 kg", "occupancyPercent": "72%", "temp": "6.2°C", "humidity": "82%", "status": "Operational" }
]

INITIAL_IOT = [
    { "id": "IOT-TRK07", "label": "Refrigerated Truck TRK-07 (TN 58 AB 2211)", "type": "Vehicle Unit", "location": "En-route Madurai", "temp": 8.4, "humidity": 82, "loadKg": 485, "maxLoadKg": 500, "doorStatus": "Closed", "riskScore": 18, "riskLevel": "Low", "status": "Connected" }
]

INITIAL_NOTIFICATIONS = [
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
    }
]

def seed_database():
    db = get_sync_db()
    if db is None:
        print("[WARN] MongoDB is not reachable. Seed skipped. The application will use its in-memory fallback.")
        return False

    print("[INFO] Seeding MongoDB database 'agriconnect'...")

    # Create Indexes
    db.users.create_index("email", unique=True)
    db.users.create_index("role")
    db.orders.create_index("id", unique=True)
    db.transport_requests.create_index("id", unique=True)
    db.active_trips.create_index("id", unique=True)
    db.notifications.create_index("user_id")

    # Upsert Initial Data
    for u in INITIAL_USERS:
        db.users.update_one({"email": u["email"]}, {"$set": u}, upsert=True)

    for o in INITIAL_ORDERS:
        db.orders.update_one({"id": o["id"]}, {"$set": o}, upsert=True)

    for tr in INITIAL_TRANSPORT_REQUESTS:
        db.transport_requests.update_one({"id": tr["id"]}, {"$set": tr}, upsert=True)

    for t in INITIAL_ACTIVE_TRIPS:
        db.active_trips.update_one({"id": t["id"]}, {"$set": t}, upsert=True)

    for item in INITIAL_LISTINGS:
        db.listings.update_one({"id": item["id"]}, {"$set": item}, upsert=True)

    for req in INITIAL_REQUIREMENTS:
        db.requirements.update_one({"id": req["id"]}, {"$set": req}, upsert=True)

    for s in INITIAL_STORAGE:
        db.storage.update_one({"id": s["id"]}, {"$set": s}, upsert=True)

    for d in INITIAL_IOT:
        db.iot_devices.update_one({"id": d["id"]}, {"$set": d}, upsert=True)

    for n in INITIAL_NOTIFICATIONS:
        db.notifications.update_one({"id": n["id"]}, {"$set": n}, upsert=True)

    print("[SUCCESS] MongoDB collections seeded successfully with indexes and initial documents.")
    return True

if __name__ == "__main__":
    seed_database()
