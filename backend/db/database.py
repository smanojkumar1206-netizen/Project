import os
from typing import Dict, Any, List

DATA_MODE = os.getenv("DATA_MODE", "demo").lower()

PREDEFINED_ADMIN = {
    "id": "USR-ADMIN-001",
    "auth_user_id": "demo-auth-admin-001",
    "full_name": "System Administrator",
    "email": "admin@agriconnect.com",
    "phone": "+91 90000 00000",
    "role": "admin",
    "location": "Central HQ, Chennai",
    "createdAt": "01 Sep 2026",
    "status": "Active"
}

INITIAL_USERS = [
    {
        "id": "USR-FARMER-1",
        "auth_user_id": "demo-auth-farmer-1",
        "full_name": "Ravi Kumar",
        "email": "farmer@agriconnect.org",
        "phone": "+91 98765 43210",
        "role": "farmer",
        "location": "Melur, Madurai",
        "createdAt": "02 Sep 2026",
        "status": "Active"
    },
    {
        "id": "USR-BUYER-1",
        "auth_user_id": "demo-auth-buyer-1",
        "full_name": "Madurai Fresh Mart",
        "email": "buyer@agriconnect.org",
        "phone": "+91 94433 12345",
        "role": "buyer",
        "location": "Madurai Town",
        "createdAt": "03 Sep 2026",
        "status": "Active"
    },
    {
        "id": "USR-TRANSPORTER-1",
        "auth_user_id": "demo-auth-transporter-1",
        "full_name": "Express Logistics",
        "email": "transporter@agriconnect.org",
        "phone": "+91 91234 56789",
        "role": "transporter",
        "location": "Madurai Logistics Park",
        "createdAt": "04 Sep 2026",
        "status": "Active"
    },
    PREDEFINED_ADMIN
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

class DatabaseAdapter:
    def __init__(self):
        self.mode = DATA_MODE
        self.users = list(INITIAL_USERS)
        self.orders = list(INITIAL_ORDERS)
        self.transport_requests = list(INITIAL_TRANSPORT_REQUESTS)
        self.active_trips = list(INITIAL_ACTIVE_TRIPS)
        self.listings = list(INITIAL_LISTINGS)
        self.requirements = list(INITIAL_REQUIREMENTS)
        self.storage = list(INITIAL_STORAGE)
        self.iot_devices = list(INITIAL_IOT)

    def register_user(self, full_name: str, email: str, phone: str, role: str, location: str) -> Dict[str, Any]:
        user_id = f"USR-{role.upper()}-{len(self.users) + 100}"
        user_profile = {
            "id": user_id,
            "auth_user_id": f"auth-{user_id.lower()}",
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "role": role.lower(),
            "location": location,
            "createdAt": "Today",
            "status": "Active"
        }
        self.users.insert(0, user_profile)
        return user_profile

    def get_users(self, role_filter: str = None) -> List[Dict[str, Any]]:
        if not role_filter or role_filter.lower() == "all" or role_filter.lower() == "users":
            return self.users
        return [u for u in self.users if u.get("role", "").lower() == role_filter.lower()]

    def get_admin_stats(self) -> Dict[str, Any]:
        total_users = len(self.users)
        farmers = len([u for u in self.users if u.get("role") == "farmer"])
        buyers = len([u for u in self.users if u.get("role") == "buyer"])
        transporters = len([u for u in self.users if u.get("role") == "transporter"])
        active_orders = len([o for o in self.orders if o.get("status") != "DELIVERED"])
        active_transport = len(self.transport_requests) + len(self.active_trips)
        listings_count = len(self.listings)

        return {
            "total_users": total_users,
            "farmers": farmers,
            "buyers": buyers,
            "transporters": transporters,
            "active_orders": active_orders,
            "active_transport": active_transport,
            "listings_count": listings_count
        }

    def get_order_by_id(self, order_id: str) -> Dict[str, Any]:
        o_clean = order_id.upper().strip()
        for o in self.orders:
            if o["id"] == o_clean or o_clean in o["id"]:
                return o
        return self.orders[0]

    def create_order(self, crop: str, qty: float, price: float, buyer_name: str, buyer_id: str, farmer_name: str, farmer_id: str, pickup: str, delivery: str) -> Dict[str, Any]:
        order_id = f"ORD-{len(self.orders) + 1045}"
        new_order = {
            "id": order_id,
            "crop": crop,
            "buyer": buyer_name,
            "buyer_id": buyer_id,
            "farmer": farmer_name,
            "farmer_id": farmer_id,
            "qty": qty,
            "price": price,
            "amount": qty * price,
            "status": "ORDER_PLACED",
            "transport_status": "PENDING",
            "transporter": "Pending",
            "transporter_id": None,
            "deliveryDate": "15 Sep 2026",
            "pickupLocation": pickup,
            "deliveryLocation": delivery
        }
        self.orders.insert(0, new_order)
        return new_order

    def accept_offer(self, order_id: str) -> Dict[str, Any]:
        order = self.get_order_by_id(order_id)
        order["status"] = "ACCEPTED"
        order["transport_status"] = "WAITING_FOR_TRANSPORT"

        tr_id = f"TR-{len(self.transport_requests) + 805}"
        new_tr = {
            "id": tr_id,
            "order_id": order["id"],
            "produce": order["crop"],
            "qty": order["qty"],
            "farmer_id": order.get("farmer_id", "USR-FARMER-1"),
            "buyer_id": order.get("buyer_id", "USR-BUYER-1"),
            "requiredCapacity": f"{order['qty']} kg",
            "pickup": order["pickupLocation"],
            "delivery": order["deliveryLocation"],
            "pickupTime": "Today, 09:00 AM",
            "deadline": "Today, 05:00 PM",
            "distance": "18.4 km",
            "estCost": 850,
            "status": "WAITING_FOR_TRANSPORT",
            "assigned_transporter": None
        }
        self.transport_requests.insert(0, new_tr)
        return {"order": order, "transport_request": new_tr}

    def accept_transport(self, transport_request_id: str, transporter_id: str = "USR-TRANSPORTER-1", vehicle: str = "TN 58 AB 2211") -> Dict[str, Any]:
        for tr in self.transport_requests:
            if tr["id"] == transport_request_id:
                tr["status"] = "ASSIGNED"
                tr["assigned_transporter"] = vehicle

                order = self.get_order_by_id(tr["order_id"])
                order["status"] = "TRANSPORT_ASSIGNED"
                order["transport_status"] = "ASSIGNED"
                order["transporter"] = vehicle
                order["transporter_id"] = transporter_id

                trip = {
                    "id": f"TRIP-{len(self.active_trips) + 405}",
                    "orderId": order["id"],
                    "produce": order["crop"],
                    "qty": order["qty"],
                    "farmerPickup": order["farmer"],
                    "buyerDestination": order["buyer"],
                    "vehicle": vehicle,
                    "transporter": "Express Logistics",
                    "transporter_id": transporter_id,
                    "distance": tr["distance"],
                    "eta": "45 mins",
                    "status": "TRANSPORT_ASSIGNED",
                    "pickupLocation": order["pickupLocation"],
                    "currentLocation": order["pickupLocation"],
                    "destination": order["deliveryLocation"]
                }
                self.active_trips.insert(0, trip)
                return {"transport_request": tr, "order": order, "trip": trip}

        return {"error": "Transport request not found"}

    def update_trip_status(self, trip_id: str, status: str) -> Dict[str, Any]:
        target_trip = None
        for trip in self.active_trips:
            if trip["id"] == trip_id or trip_id in trip["id"]:
                trip["status"] = status
                target_trip = trip
                break

        if target_trip:
            order = self.get_order_by_id(target_trip["orderId"])
            order["status"] = status
            return {"trip": target_trip, "order": order}

        return {"error": "Trip not found"}

db = DatabaseAdapter()
