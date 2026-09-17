import React, { useState } from "react";
import { ShoppingCart, Truck, DollarSign, Download, MapPin, X } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import TransportStatus from "../../components/TransportStatus";
import RouteMap from "../../components/RouteMap";

export default function BuyerOrders({ orders, notify }) {
  const [selectedTrackOrder, setSelectedTrackOrder] = useState(null);

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">PROCUREMENT ORDERS & SHIPMENTS</div>
          <h1>My Orders</h1>
          <p>Track your active farm produce procurement orders, status stepper, and live shipment routing.</p>
        </div>
      </div>

      {/* Track Shipment Map Modal */}
      {selectedTrackOrder && (
        <div className="trackMapModalOverlay">
          <div className="trackMapModalCard">
            <div className="modalHead">
              <div>
                <h3><MapPin size={18} /> Live Shipment Tracking: {selectedTrackOrder.id}</h3>
                <span>{selectedTrackOrder.crop} · {selectedTrackOrder.qty} kg | Farmer: {selectedTrackOrder.farmer}</span>
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
                    { id: "1", type: "farmer", name: `Farmer (${selectedTrackOrder.farmer})`, crop: selectedTrackOrder.crop, qty: selectedTrackOrder.qty, location: selectedTrackOrder.pickupLocation || "Melur", lat: 10.0381, lng: 78.3340, status: "PICKUP_LOCATION" },
                    { id: "2", type: "buyer", name: selectedTrackOrder.buyer || "Madurai Fresh Mart", crop: selectedTrackOrder.crop, qty: selectedTrackOrder.qty, location: selectedTrackOrder.deliveryLocation || "Madurai Town", lat: 9.9195, lng: 78.1215, status: "DELIVERY_DESTINATION" }
                  ]
                }}
                height="380px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Orders List with Steppers */}
      <div className="ordersListWithSteppers">
        {orders.map((ord) => (
          <div className="card orderStepperCardItem" key={ord.id}>
            <div className="cardHead">
              <div className="orderTitleBox">
                <h3>Order ID: {ord.id}</h3>
                <span className="buyerLabel">Supplier: <b>{ord.farmer}</b> | {ord.crop} · {ord.qty} kg @ ₹{ord.price}/kg</span>
              </div>
              <StatusBadge text={ord.status} />
            </div>

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
