from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from db.database import db
from services.notification_service import notification_service

router = APIRouter(prefix="/api/transport", tags=["Transport"])

class AcceptTransportRequest(BaseModel):
    transport_request_id: str
    transporter_id: Optional[str] = "USR-TRANSPORTER-1"
    vehicle_number: Optional[str] = "TN 58 AB 2211"

class TripStatusUpdateRequest(BaseModel):
    status: str # IN_TRANSIT | DELIVERED

@router.get("/requests")
async def get_transport_requests():
    return db.transport_requests

@router.get("/trips")
async def get_active_trips():
    return db.active_trips

@router.post("/requests/{transport_request_id}/accept")
async def accept_transport_request(transport_request_id: str, req: Optional[AcceptTransportRequest] = None):
    transporter_id = req.transporter_id if req else "USR-TRANSPORTER-1"
    vehicle = req.vehicle_number if req else "TN 58 AB 2211"

    res = db.accept_transport(transport_request_id, transporter_id, vehicle)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])

    order = res["order"]

    # 1. Notify Farmer
    notification_service.create_notification(
        user_id=order["farmer_id"],
        role="farmer",
        title="Transport Assigned",
        message=f"Transport vehicle {vehicle} has been assigned to your order #{order['id']}.",
        event_type="TRANSPORT_ASSIGNED",
        related_order_id=order["id"]
    )

    # 2. Notify Buyer
    notification_service.create_notification(
        user_id=order["buyer_id"],
        role="buyer",
        title="Transport Assigned",
        message=f"Transport vehicle {vehicle} has been assigned to your shipment #{order['id']}.",
        event_type="TRANSPORT_ASSIGNED",
        related_order_id=order["id"]
    )

    # 3. Notify Transporter
    notification_service.create_notification(
        user_id=transporter_id,
        role="transporter",
        title="Transport Request Accepted",
        message=f"You have been assigned to transport Order #{order['id']} ({order['qty']} kg {order['crop']}).",
        event_type="TRANSPORT_ASSIGNED",
        related_order_id=order["id"]
    )

    return {"success": True, "data": res}

@router.post("/trips/{trip_id}/status")
async def update_trip_status(trip_id: str, req: TripStatusUpdateRequest):
    res = db.update_trip_status(trip_id, req.status)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])

    trip = res["trip"]
    order = res["order"]

    if req.status == "IN_TRANSIT":
        msg = f"Your shipment for Order #{order['id']} ({order['crop']}) is now in transit."
        notification_service.create_notification(
            user_id=order["farmer_id"],
            role="farmer",
            title="Shipment In Transit",
            message=msg,
            event_type="SHIPMENT_IN_TRANSIT",
            related_order_id=order["id"]
        )
        notification_service.create_notification(
            user_id=order["buyer_id"],
            role="buyer",
            title="Shipment In Transit",
            message=msg,
            event_type="SHIPMENT_IN_TRANSIT",
            related_order_id=order["id"]
        )
    elif req.status == "DELIVERED":
        msg = f"Delivery completed for Order #{order['id']} ({order['qty']} kg {order['crop']})."
        summary_body = f"""Agricultural Shipment Delivered Successfully

Order ID: {order['id']}
Crop: {order['crop']}
Quantity: {order['qty']} kg
Farmer: {order['farmer']}
Buyer: {order['buyer']}
Transporter: {order.get('transporter', 'TN 58 AB 2211')}
Status: DELIVERED"""

        notification_service.create_notification(
            user_id=order["farmer_id"],
            role="farmer",
            title="Delivery Completed",
            message=msg,
            event_type="DELIVERY_COMPLETED",
            related_order_id=order["id"]
        )
        notification_service.create_notification(
            user_id=order["buyer_id"],
            role="buyer",
            title="Delivery Completed",
            message=msg,
            event_type="DELIVERY_COMPLETED",
            related_order_id=order["id"]
        )

    return {"success": True, "data": res}
