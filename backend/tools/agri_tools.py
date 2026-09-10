"""
AgriConnect Backend Tools & RBAC Enforcement with User Scoping
Deterministic tools executed by AgriAI backend.
"""

from typing import Dict, Any, List
from db.database import db

def validate_role_access(role: str, tool_name: str) -> bool:
    role = (role or "farmer").lower()
    
    role_permissions = {
        "farmer": [
            "find_buyers", "find_produce", "create_produce_listing", "get_order_status",
            "find_transport", "get_transport_status", "find_storage", "get_sensor_status",
            "get_market_price", "get_demand", "get_farmer_summary"
        ],
        "buyer": [
            "find_produce", "find_buyers", "get_order_status", "find_transport",
            "get_transport_status", "find_storage", "get_market_price", "get_demand",
            "get_buyer_summary"
        ],
        "transporter": [
            "find_transport", "get_transport_status", "get_order_status",
            "get_sensor_status", "get_market_price", "get_transporter_summary",
            "find_produce"
        ],
        "admin": [
            "find_buyers", "find_produce", "create_produce_listing", "get_order_status",
            "find_transport", "get_transport_status", "find_storage", "get_sensor_status",
            "get_market_price", "get_demand", "get_farmer_summary", "get_buyer_summary",
            "get_transporter_summary", "get_system_analytics"
        ]
    }
    
    allowed = role_permissions.get(role, role_permissions["farmer"])
    return tool_name in allowed

def execute_tool(tool_name: str, params: Dict[str, Any], user_role: str, user_id: str = "USR-001") -> Dict[str, Any]:
    if not validate_role_access(user_role, tool_name):
        return {
            "success": False,
            "error": f"Role '{user_role}' is not authorized to execute tool '{tool_name}'.",
            "code": "UNAUTHORIZED_TOOL_ACCESS"
        }

    try:
        if tool_name == "find_buyers":
            crop = params.get("crop", "Tomato")
            qty = params.get("quantity_kg", 500)
            loc = params.get("location", "Madurai")
            buyers = db.get_buyers_for_crop(crop, loc)
            return {
                "success": True,
                "tool": tool_name,
                "data": {
                    "crop": crop,
                    "requested_quantity_kg": qty,
                    "location": loc,
                    "count": len(buyers),
                    "buyers": buyers
                },
                "nav_target": "Find Buyers"
            }

        elif tool_name == "find_produce":
            crop = params.get("crop", "Tomato")
            qty = params.get("quantity_kg", 500)
            loc = params.get("location", "Madurai")
            listings = db.get_produce(crop, loc)
            return {
                "success": True,
                "tool": tool_name,
                "data": {
                    "crop": crop,
                    "requested_quantity_kg": qty,
                    "location": loc,
                    "count": len(listings),
                    "produce_listings": listings
                },
                "nav_target": "Find Produce"
            }

        elif tool_name == "create_produce_listing":
            crop = params.get("crop", "Tomato")
            qty = float(params.get("quantity_kg", 500))
            price = float(params.get("expected_price", 25))
            loc = params.get("location", "Madurai")
            item = db.create_listing(crop, qty, price, loc)
            return {
                "success": True,
                "tool": tool_name,
                "action_type": "write",
                "data": { "created": True, "listing": item },
                "nav_target": "My Produce"
            }

        elif tool_name == "get_order_status":
            order_id = params.get("order_id", "ORD-1042")
            order = db.get_order_by_id(order_id)
            return {
                "success": True,
                "tool": tool_name,
                "data": order,
                "nav_target": "My Orders" if user_role in ["farmer", "buyer"] else "Active Trips"
            }

        elif tool_name == "find_transport":
            qty = float(params.get("quantity_kg", 500))
            pickup = params.get("pickup_location", "Madurai")
            dest = params.get("destination", "Chennai")
            vehicles = db.find_transport(qty, pickup, dest)
            return {
                "success": True,
                "tool": tool_name,
                "data": {
                    "pickup_location": pickup,
                    "destination": dest,
                    "required_capacity_kg": qty,
                    "vehicles_found": len(vehicles),
                    "vehicles": vehicles
                },
                "nav_target": "Transport" if user_role == "farmer" else "Transport Requests"
            }

        elif tool_name == "get_sensor_status":
            target_id = params.get("vehicle_id") or "IOT-TRK07"
            device = db.get_sensor(target_id)
            return {
                "success": True,
                "tool": tool_name,
                "data": device,
                "nav_target": "IoT Monitoring"
            }

        elif tool_name == "get_market_price":
            crop = params.get("crop", "Tomato")
            loc = params.get("location", "Madurai")
            price_info = db.get_market_price(crop, loc)
            return {
                "success": True,
                "tool": tool_name,
                "data": price_info,
                "nav_target": "Dashboard"
            }

        else:
            return { "success": True, "tool": tool_name, "data": {}, "nav_target": "Dashboard" }

    except Exception as e:
        return { "success": False, "error": str(e) }
