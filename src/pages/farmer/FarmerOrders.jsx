import React, { useState } from "react";
import { CheckCircle2, Clock3, Truck, DollarSign, Package, MapPin, ArrowRight, X } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import TransportStatus from "../../components/TransportStatus";
import RouteMap from "../../components/RouteMap";

export default function FarmerOrders({ orders, onAcceptOffer, notify, go }) {
  const [selectedTrackOrder, setSelectedTrackOrder] = useState(null);

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">ORDER PIPELINE & LOGISTICS</div>
          <h1>My Orders</h1>
          <p>Track the complete order lifecycle: Offer Acceptance → Automatic Transport Request → Transit → Delivery.</p>
        </div>
      </div>

      {/* Track Transport Map Modal Overlay */}
      {selectedTrackOrder && (
        <div className="trackMapModalOverlay">
          <div className="trackMapModalCard">
            <div className="modalHead">
              <div>
                <h3><MapPin size={18} /> Live Transport Tracking: {selectedTrackOrder.id}</h3>
                <span>{selectedTrackOrder.crop} · {selectedTrackOrder.qty} kg | Pickup: {selectedTrackOrder.pickupLocation || "Melur, Madurai"}</span>
              </div>
              <button type="button" className="closeBtn" onClick={() => setSelectedTrackOrder(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modalBody">
              <RouteMap
                routeData={{
                  vehicle_id: selectedTrackOrder.transporter !== "Pending" ? selectedTrackOrder.transporter : "TN 58 AB 2211",
                  vehicle_capacity: 1000,
                  total_load_collected: selectedTrackOrder.qty,
                  remaining_capacity: 1000 - selectedTrackOrder.qty,
                  total_distance_km: 18.4,
                  estimated_time: "45 mins",
                  stops: [
                    { id: "1", type: "farmer", name: `Farmer ${selectedTrackOrder.farmer || "Ravi Kumar"}`, crop: selectedTrackOrder.crop, qty: selectedTrackOrder.qty, location: selectedTrackOrder.pickupLocation || "Melur", lat: 10.0381, lng: 78.3340, status: "PICKUP_LOCATION" },
                    { id: "2", type: "buyer", name: selectedTrackOrder.buyer, crop: selectedTrackOrder.crop, qty: selectedTrackOrder.qty, location: selectedTrackOrder.deliveryLocation || "Madurai Town", lat: 9.9195, lng: 78.1215, status: "DELIVERY_DESTINATION" }
                  ]
                }}
                height="380px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Orders List with Stepper */}
      <div className="ordersListWithSteppers">
        {orders.map((ord) => (
          <div className="card orderStepperCardItem" key={ord.id}>
            <div className="cardHead">
              <div className="orderTitleBox">
                <h3>Order ID: {ord.id}</h3>
                <span className="buyerLabel">Buyer: <b>{ord.buyer}</b> | {ord.crop} · {ord.qty} kg @ ₹{ord.price}/kg</span>
              </div>
              <div className="headRightActions">
                <StatusBadge text={ord.status} />

                {/* Offer Accept Action */}
                {(ord.status === "REQUESTED" || ord.status === "OFFER_SENT" || ord.status === "MATCHED") && (
                  <button
                    type="button"
                    className="primary actionBtn"
                    onClick={() => onAcceptOffer && onAcceptOffer(ord.id)}
                  >
                    <CheckCircle2 size={14} /> Accept Offer & Request Transport
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Component */}
            <TransportStatus
              order={ord}
              onTrackClick={(o) => setSelectedTrackOrder(o)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
