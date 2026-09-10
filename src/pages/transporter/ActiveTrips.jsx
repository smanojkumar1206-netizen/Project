import React, { useState } from "react";
import { Route, MapPin, Navigation, Clock3, Truck, CheckCircle2, Play, PackageCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import RouteMap from "../../components/RouteMap";

export default function ActiveTrips({ activeTrips, onUpdateTripStatus, notify }) {
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">EN-ROUTE LOGISTICS & TRACKING</div>
          <h1>Active Trips</h1>
          <p>Manage active trips, progress through pickup → transit → delivery, and view interactive Google Map routing.</p>
        </div>
      </div>

      {/* Embedded RouteMap for active trip */}
      <div style={{ marginBottom: "24px" }}>
        <RouteMap
          routeData={{
            vehicle_id: "TN 58 AB 2211",
            vehicle_capacity: 1000,
            total_load_collected: 500,
            remaining_capacity: 500,
            capacity_utilization_pct: 50,
            total_distance_km: 18.4,
            estimated_time: "45 mins",
            stops: [
              { id: "1", type: "farmer", name: "Farmer Pickup (Melur)", crop: "Tomato", qty: 300, location: "Melur, Madurai", lat: 10.0381, lng: 78.3340, status: "PICKUP_DONE" },
              { id: "2", type: "farmer", name: "Farmer Pickup (Thirumangalam)", crop: "Tomato", qty: 200, location: "Thirumangalam", lat: 9.8256, lng: 77.9898, status: "PICKUP_IN_PROGRESS" },
              { id: "3", type: "buyer", name: "Buyer Destination (Madurai Fresh Mart)", crop: "Tomato", qty: 500, location: "Madurai Town", lat: 9.9195, lng: 78.1215, status: "DESTINATION" }
            ]
          }}
          height="380px"
        />
      </div>

      <section className="card tableCard">
        <div className="cardHead">
          <div>
            <h3>Active Transport Trips & Controls</h3>
            <span>Progress status from Pickup → Transit → Delivery</span>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>TRIP ID</th>
                <th>PRODUCE</th>
                <th>QTY</th>
                <th>FARMER PICKUP</th>
                <th>BUYER DESTINATION</th>
                <th>VEHICLE</th>
                <th>STATUS</th>
                <th>LIFECYCLE ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {activeTrips.map((trip) => {
                const st = (trip.status || "TRANSPORT ASSIGNED").toUpperCase();
                return (
                  <tr key={trip.id}>
                    <td><b>{trip.id}</b></td>
                    <td>{trip.produce}</td>
                    <td>{trip.qty} kg</td>
                    <td>{trip.pickupLocation || trip.farmerPickup}</td>
                    <td>{trip.destination || trip.buyerDestination}</td>
                    <td><b>{trip.vehicle}</b></td>
                    <td><StatusBadge text={st} /></td>
                    <td>
                      <div className="actionButtons" style={{ gap: "6px" }}>
                        {st.includes("ASSIGNED") && (
                          <button
                            className="primary small"
                            onClick={() => onUpdateTripStatus && onUpdateTripStatus(trip.id, "PICKUP_IN_PROGRESS")}
                          >
                            <Play size={13} /> Start Pickup
                          </button>
                        )}
                        {st.includes("PICKUP") && (
                          <button
                            className="primary small"
                            onClick={() => onUpdateTripStatus && onUpdateTripStatus(trip.id, "IN_TRANSIT")}
                          >
                            <Truck size={13} /> Start Trip (In Transit)
                          </button>
                        )}
                        {st.includes("TRANSIT") && (
                          <button
                            className="success small"
                            style={{ background: "#166534", color: "#fff", border: 0, padding: "5px 10px", borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            onClick={() => onUpdateTripStatus && onUpdateTripStatus(trip.id, "DELIVERED")}
                          >
                            <PackageCheck size={13} /> Complete Delivery
                          </button>
                        )}
                        {st.includes("DELIVERED") && (
                          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#166534" }}>✓ Delivered</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
