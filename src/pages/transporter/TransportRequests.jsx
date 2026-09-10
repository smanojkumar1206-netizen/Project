import React, { useState } from "react";
import { Package, MapPin, Navigation, Clock3, Weight, DollarSign, CheckCircle2, Route, Eye } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import RouteMap from "../../components/RouteMap";

export default function TransportRequests({ transportRequests, setTransportRequests, setActiveTrips, onAcceptTransport, notify }) {
  const [selectedRouteReq, setSelectedRouteReq] = useState(null);

  const handleAcceptTrip = (req) => {
    if (onAcceptTransport) {
      onAcceptTransport(req);
    } else {
      setTransportRequests((prev) => prev.filter((r) => r.id !== req.id));
      setActiveTrips((prev) => [
        {
          id: `TRIP-${Math.floor(400 + Math.random() * 599)}`,
          orderId: req.orderId || req.order_id,
          produce: req.produce,
          qty: req.qty,
          farmerPickup: req.pickup,
          buyerDestination: req.delivery,
          vehicle: "TN 58 AB 2211",
          transporter: "Express Logistics",
          distance: req.distance,
          eta: "1 hr 15 mins",
          status: "TRANSPORT ASSIGNED",
          pickupLocation: req.pickup,
          currentLocation: "Dispatch Depot",
          destination: req.delivery
        },
        ...prev
      ]);
    }
    notify && notify(`Accepted transport request ${req.id}! Assigned Vehicle: TN 58 AB 2211.`);
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">AUTOMATED LOGISTICS PIPELINE</div>
          <h1>Transport Requests</h1>
          <p>Review open cargo delivery requests automatically generated when buyers accept farmer offers.</p>
        </div>
      </div>

      {/* View Route Map Modal */}
      {selectedRouteReq && (
        <div className="trackMapModalOverlay">
          <div className="trackMapModalCard">
            <div className="modalHead">
              <div>
                <h3><Route size={18} /> Optimized Route: Request {selectedRouteReq.id}</h3>
                <span>{selectedRouteReq.produce} · {selectedRouteReq.qty} kg | Pickup: {selectedRouteReq.pickup} → Delivery: {selectedRouteReq.delivery}</span>
              </div>
              <button type="button" className="closeBtn" onClick={() => setSelectedRouteReq(null)}>×</button>
            </div>
            <div className="modalBody">
              <RouteMap
                routeData={{
                  vehicle_id: "TN 58 AB 2211",
                  vehicle_capacity: 1000,
                  total_load_collected: selectedRouteReq.qty,
                  remaining_capacity: 1000 - selectedRouteReq.qty,
                  total_distance_km: 18.4,
                  estimated_time: "45 mins",
                  stops: [
                    { id: "1", type: "farmer", name: "Farmer Pickup Point", crop: selectedRouteReq.produce, qty: selectedRouteReq.qty, location: selectedRouteReq.pickup, lat: 10.0381, lng: 78.3340, status: "WAITING_PICKUP" },
                    { id: "2", type: "buyer", name: "Buyer Delivery Point", crop: selectedRouteReq.produce, qty: selectedRouteReq.qty, location: selectedRouteReq.delivery, lat: 9.9195, lng: 78.1215, status: "DROP_LOCATION" }
                  ]
                }}
                height="360px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Requests Grid */}
      <div className="requestGrid">
        {transportRequests.length === 0 ? (
          <div className="card full" style={{ padding: "30px", textAlign: "center", gridColumn: "1 / -1" }}>
            <Package size={32} style={{ color: "#819087", marginBottom: "10px" }} />
            <h3>No Pending Transport Requests</h3>
            <p style={{ color: "#66736a" }}>When buyers accept farmer produce offers, new transport requests will automatically appear here.</p>
          </div>
        ) : (
          transportRequests.map((req) => (
            <div className="card requestCard" key={req.id}>
              <div className="reqHeader">
                <div>
                  <h3>{req.produce} Cargo ({req.qty} kg)</h3>
                  <span className="reqIdTag">Order ID: {req.orderId || req.order_id}</span>
                </div>
                <StatusBadge text={req.status || "WAITING_FOR_TRANSPORT"} />
              </div>

              <div className="reqDetailsGrid">
                <div><MapPin size={14} /> <span>Pickup Origin: <strong>{req.pickup}</strong></span></div>
                <div><Navigation size={14} /> <span>Destination: <strong>{req.delivery}</strong></span></div>
                <div><Weight size={14} /> <span>Vehicle Capacity Spec: <strong>{req.requiredCapacity || `${req.qty} kg`}</strong></span></div>
                <div><Clock3 size={14} /> <span>Pickup Time: <strong>{req.pickupTime || "Today 09:00 AM"}</strong></span></div>
                <div><Route size={14} /> <span>Est. Distance: <strong>{req.distance || "18.4 km"}</strong></span></div>
              </div>

              <div className="reqCostFoot">
                <div>
                  <small>Freight Payout</small>
                  <b>₹{req.estCost || 850}</b>
                </div>
                <div className="actionButtons">
                  <button className="outline small" onClick={() => setSelectedRouteReq(req)}>
                    <Route size={15} /> View Route
                  </button>
                  <button className="primary small" onClick={() => handleAcceptTrip(req)}>
                    <CheckCircle2 size={15} /> Accept Transport
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
