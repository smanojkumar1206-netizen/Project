from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.routing_service import routing_service

router = APIRouter(prefix="/api/routes", tags=["Routes"])

class OptimizeRequest(BaseModel):
    transport_request_id: Optional[str] = "TR-801"
    vehicle_capacity: Optional[float] = 1000.0
    vehicle_id: Optional[str] = "TN 58 AB 2211"
    pickups: Optional[List[Dict[str, Any]]] = [
        {"farmer": "Farmer A (Ravi Kumar)", "crop": "Tomato", "qty": 300, "location": "Melur"},
        {"farmer": "Farmer B (Meena Farms)", "crop": "Tomato", "qty": 200, "location": "Thirumangalam"}
    ]
    destination: Optional[Dict[str, Any]] = {"buyer": "Madurai Fresh Mart", "location": "Madurai Town"}

@router.get("/{transport_request_id}")
async def get_optimized_route(transport_request_id: str):
    # Retrieve route optimization for transport request
    pickups = [
        {"farmer": "Ravi Kumar", "crop": "Tomato", "qty": 300, "location": "Melur"},
        {"farmer": "Meena Farms", "crop": "Tomato", "qty": 200, "location": "Thirumangalam"}
    ]
    destination = {"buyer": "Madurai Fresh Mart", "location": "Madurai Town"}

    res = routing_service.optimize_route(
        pickups=pickups,
        destination=destination,
        vehicle_capacity=1000.0,
        vehicle_id="TN 58 AB 2211"
    )
    return res

@router.post("/optimize")
async def compute_optimized_route(req: OptimizeRequest):
    res = routing_service.optimize_route(
        pickups=req.pickups,
        destination=req.destination,
        vehicle_capacity=req.vehicle_capacity,
        vehicle_id=req.vehicle_id
    )
    return res
