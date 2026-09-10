from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from db.database import db
from services.notification_service import notification_service

router = APIRouter(prefix="/api/orders", tags=["Orders"])

class CreateOrderRequest(BaseModel):
    crop: str
    qty: float
    price: float
    buyer_name: Optional[str] = "Madurai Fresh Mart"
    buyer_id: Optional[str] = "USR-BUYER-1"
    farmer_name: Optional[str] = "Ravi Kumar"
    farmer_id: Optional[str] = "USR-FARMER-1"
    pickup_location: Optional[str] = "Melur, Madurai"
    delivery_location: Optional[str] = "Madurai Town"

class AcceptOfferRequest(BaseModel):
    order_id: str
    user_id: Optional[str] = "USR-FARMER-1"

@router.get("/")
async def get_orders():
    return db.orders

@router.post("/create")
async def create_order(req: CreateOrderRequest):
    order = db.create_order(
        crop=req.crop,
        qty=req.qty,
        price=req.price,
        buyer_name=req.buyer_name,
        buyer_id=req.buyer_id,
        farmer_name=req.farmer_name,
        farmer_id=req.farmer_id,
        pickup=req.pickup_location,
        delivery=req.delivery_location
    )

    # 1. Notify Farmer (In-App + Email + SMS)
    farmer_msg = f"Buyer {req.buyer_name} placed an order for {req.qty} kg {req.crop} at ₹{req.price}/kg."
    notification_service.create_notification(
        user_id=req.farmer_id,
        role="farmer",
        title="New Order Received",
        message=farmer_msg,
        event_type="NEW_ORDER",
        related_order_id=order["id"]
    )

    # 2. Notify Buyer (Order Confirmation Email & In-App)
    buyer_msg = f"Order #{order['id']} successfully placed for {req.qty} kg {req.crop}. Total: ₹{order['amount']}."
    buyer_email_body = f"""Hello {req.buyer_name},

Your order has been successfully placed.

Crop: {req.crop}
Quantity: {req.qty} kg
Price: ₹{req.price}/kg
Farmer: {req.farmer_name}
Pickup Location: {req.pickup_location}
Delivery Location: {req.delivery_location}

Order ID: {order['id']}

Status: ORDER PLACED

You can track your order from your AgriConnect dashboard.

Thank you,
AgriConnect"""

    notification_service.send_email(
        to_email=f"{req.buyer_id.lower()}@agriconnect.org",
        subject="AgriConnect — Order Confirmation",
        body=buyer_email_body
    )

    notification_service.create_notification(
        user_id=req.buyer_id,
        role="buyer",
        title="Order Confirmation",
        message=buyer_msg,
        event_type="ORDER_PLACED",
        related_order_id=order["id"]
    )

    return {
        "success": True,
        "message": "Order created successfully and notifications dispatched.",
        "order": order
    }

@router.post("/{order_id}/accept")
async def accept_offer(order_id: str, req: Optional[AcceptOfferRequest] = None):
    res = db.accept_offer(order_id)
    order = res["order"]
    tr = res["transport_request"]

    # Notification 1: Farmer
    notification_service.create_notification(
        user_id=order["farmer_id"],
        role="farmer",
        title="Offer Accepted",
        message=f"Your offer for {order['qty']} kg {order['crop']} has been accepted and is waiting for transport.",
        event_type="OFFER_ACCEPTED",
        related_order_id=order["id"]
    )

    # Notification 2: Buyer
    notification_service.create_notification(
        user_id=order["buyer_id"],
        role="buyer",
        title="Order Accepted",
        message=f"Your order #{order['id']} has been accepted by the farmer and is waiting for transport.",
        event_type="ORDER_ACCEPTED",
        related_order_id=order["id"]
    )

    # Notification 3: Transporter Broadcast
    notification_service.create_notification(
        user_id="BROADCAST",
        role="transporter",
        title="New Transport Request",
        message=f"New transport request available: {tr['qty']} kg {tr['produce']} from {tr['pickup']} to {tr['delivery']}.",
        event_type="NEW_TRANSPORT_REQUEST",
        related_transport_id=tr["id"]
    )

    return {
        "success": True,
        "message": "Offer accepted! Transport request created automatically.",
        "data": res
    }
