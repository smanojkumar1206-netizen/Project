import React from "react";
import { Truck, MapPin, Navigation, Clock3, ShieldCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import RouteMap from "../../components/RouteMap";

export default function BuyerTransportTracking({ activeTrips, notify }) {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">LIVE SHIPMENT TRACKING</div>
          <h1>Transport Tracking</h1>
          <p>Real-time transit tracking for your incoming produce shipments on Google Maps.</p>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <RouteMap
          routeData={{
            vehicle_id: "TN 58 AB 2211",
            vehicle_capacity: 1000,
            total_load_collected: 500,
            remaining_capacity: 500,
            total_distance_km: 18.4,
            estimated_time: "45 mins",
            stops: [
              { id: "1", type: "farmer", name: "Farmer Pickup (Melur)", crop: "Tomato", qty: 500, location: "Melur, Madurai", lat: 10.0381, lng: 78.3340, status: "PICKED_UP" },
              { id: "2", type: "buyer", name: "Your Delivery Hub (Madurai Fresh Mart)", crop: "Tomato", qty: 500, location: "Madurai Town", lat: 9.9195, lng: 78.1215, status: "DESTINATION" }
            ]
          }}
          height="380px"
        />
      </div>

      <div className="transportGrid">
        {activeTrips.map((trip) => (
          <div className="card transportCard" key={trip.id}>
            <div className="cardHead">
              <div className="truckBadgeHeader">
                <div className="roundIcon">
                  <Truck size={20} />
                </div>
                <div>
                  <h3>Vehicle: {trip.vehicle}</h3>
                  <span className="transporterName">Logistics: {trip.transporter}</span>
                </div>
              </div>
              <StatusBadge text={trip.status} />
            </div>

            <div className="transportInfoGrid">
              <div className="infoTile">
                <span>Shipment Cargo</span>
                <strong>{trip.produce} · {trip.qty} kg</strong>
              </div>
              <div className="infoTile">
                <span>Route Distance</span>
                <strong>{trip.distance}</strong>
              </div>
              <div className="infoTile">
                <span>Pickup Origin</span>
                <strong><MapPin size={14} /> {trip.pickupLocation || trip.farmerPickup}</strong>
              </div>
              <div className="infoTile">
                <span>Destination</span>
                <strong><Navigation size={14} /> {trip.destination || trip.buyerDestination}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
