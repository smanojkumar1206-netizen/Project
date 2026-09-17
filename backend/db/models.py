from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class UserModel(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str # farmer | buyer | transporter | admin
    location: Optional[str] = "Madurai"
    hashed_password: Optional[str] = None
    google_id: Optional[str] = None
    picture: Optional[str] = None
    status: str = "Active"
    created_at: Optional[str] = None
    # Role-specific fields
    produce_categories: Optional[List[str]] = None
    farm_details: Optional[str] = None
    business_name: Optional[str] = None
    required_categories: Optional[List[str]] = None
    vehicle_type: Optional[str] = None
    vehicle_capacity: Optional[str] = None

class OrderModel(BaseModel):
    id: str
    crop: str
    qty: float
    price: float
    amount: float
    buyer: str
    buyer_id: str
    farmer: str
    farmer_id: str
    status: str = "ORDER_PLACED" # ORDER_PLACED | ACCEPTED | TRANSPORT_ASSIGNED | IN_TRANSIT | DELIVERED | CANCELLED
    transport_status: str = "PENDING"
    transporter: Optional[str] = "Pending"
    transporter_id: Optional[str] = None
    deliveryDate: Optional[str] = "15 Sep 2026"
    pickupLocation: str
    deliveryLocation: str
    created_at: Optional[str] = None

class TransportRequestModel(BaseModel):
    id: str
    order_id: str
    produce: str
    qty: float
    farmer_id: str
    buyer_id: str
    requiredCapacity: str
    pickup: str
    delivery: str
    pickupTime: Optional[str] = "Today, 09:00 AM"
    deadline: Optional[str] = "Today, 05:00 PM"
    distance: Optional[str] = "18.4 km"
    estCost: Optional[float] = 850.0
    status: str = "WAITING_FOR_TRANSPORT" # WAITING_FOR_TRANSPORT | ASSIGNED | COMPLETED
    assigned_transporter: Optional[str] = None

class ActiveTripModel(BaseModel):
    id: str
    orderId: str
    produce: str
    qty: float
    farmerPickup: str
    buyerDestination: str
    vehicle: str
    transporter: str
    transporter_id: str
    distance: str
    eta: str
    status: str = "TRANSPORT_ASSIGNED" # TRANSPORT_ASSIGNED | IN_TRANSIT | DELIVERED
    pickupLocation: str
    currentLocation: str
    destination: str

class ListingModel(BaseModel):
    id: str
    crop: str
    farmer: str
    farmer_id: str
    qty: float
    price: float
    location: str
    harvest: Optional[str] = "10 Sep 2026"
    grade: Optional[str] = "A"
    status: str = "Available"

class RequirementModel(BaseModel):
    id: str
    crop: str
    buyer: str
    buyer_id: str
    qty: float
    maxPrice: float
    location: str
    deadline: Optional[str] = "Within 2 days"
    status: str = "Active"

class NotificationModel(BaseModel):
    id: str
    user_id: str
    role: Optional[str] = None
    title: str
    message: str
    type: str
    channel: str = "IN_APP"
    read: bool = False
    timestamp: Optional[str] = "Just now"
    related_order_id: Optional[str] = None
    related_transport_id: Optional[str] = None

def serialize_mongo_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Converts MongoDB _id ObjectId to string id if present."""
    if doc is None:
        return None
    d = dict(doc)
    if "_id" in d:
        d["mongo_id"] = str(d["_id"])
        if "id" not in d:
            d["id"] = str(d["_id"])
        del d["_id"]
    return d
