import React, { useState } from "react";
import { Route, ArrowRight, Truck, MapPin, CheckCircle2, RefreshCw } from "lucide-react";
import RouteMap from "../../components/RouteMap";
import { fetchOptimizedRoute } from "../../services/routeApi";

export default function RouteOptimizer({ vehicles, notify }) {
  const [optimized, setOptimized] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("TN 58 AB 2211 · 1,000 kg");
  const [objective, setObjective] = useState("Minimize distance + fuel cost");

  const [routeData, setRouteData] = useState({
    vehicle_id: "TN 58 AB 2211",
    vehicle_capacity: 1000,
    total_load_collected: 500,
    remaining_capacity: 500,
    capacity_utilization_pct: 50,
    total_distance_km: 35.2,
    estimated_time: "1h 12m",
    pickup_count: 2,
    stops: [
      { id: "1", type: "farmer", name: "Farmer A (Melur)", crop: "Tomato", qty: 300, location: "Melur, Madurai", lat: 10.0381, lng: 78.3340, status: "PICKUP" },
      { id: "2", type: "farmer", name: "Farmer B (Usilampatti)", crop: "Tomato", qty: 200, location: "Usilampatti", lat: 9.9696, lng: 77.7944, status: "PICKUP" },
      { id: "3", type: "buyer", name: "Buyer Drop (Madurai Town)", crop: "Tomato", qty: 500, location: "Madurai Town", lat: 9.9195, lng: 78.1215, status: "DELIVERY" }
    ]
  });

  const handleRunOptimizer = async () => {
    setLoading(true);
    const data = await fetchOptimizedRoute("TR-801");
    setRouteData(data);
    setOptimized(true);
    setLoading(false);
    notify && notify("OR-Tools CVRP + A* route optimization engine updated successfully!");
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">CAPACITY & ROUTE ENGINE</div>
          <h1>Route Optimizer</h1>
          <p>Multi-stop route consolidation for load capacity optimization using OR-Tools CVRP + Dijkstra/A* algorithm.</p>
        </div>
        <button className="primary" onClick={handleRunOptimizer} disabled={loading}>
          {loading ? <RefreshCw size={17} className="spinIcon" /> : <Route size={17} />}
          {loading ? "Optimizing Route..." : "Run Route Optimization"}
        </button>
      </div>

      <div className="optimizerNoticeBanner">
        <span className="algoTag">Optimized using OR-Tools CVRP + A*/Dijkstra Graph Search</span>
        <span className="demoTag">● Interactive Map & Capacitated Sequence</span>
      </div>

      {/* Embedded RouteMap Visualizer */}
      <div style={{ marginBottom: "24px" }}>
        <RouteMap routeData={routeData} height="420px" />
      </div>

      <div className="routeLayout">
        <section className="card routePanel" style={{ gridColumn: "1 / -1" }}>
          <h3>Route Optimization Parameters & Execution Results</h3>

          <div className="formGrid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
            <label>
              Assigned Fleet Vehicle
              <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
                <option>TN 58 AB 2211 · 1,000 kg Refrigerated</option>
                <option>TN 59 CD 8842 · 2,500 kg Medium Truck</option>
                <option>TN 58 EF 1098 · 800 kg Insulated Mini</option>
              </select>
            </label>

            <label>
              Pickup & Dropoff Points
              <input value={`${routeData.pickup_count} Farmer Pickups + 1 Buyer Drop-off`} readOnly />
            </label>

            <label>
              Optimization Objective
              <select value={objective} onChange={(e) => setObjective(e.target.value)}>
                <option>Minimize distance + fuel cost</option>
                <option>Strict earliest delivery deadline</option>
                <option>Maximize vehicle load capacity %</option>
              </select>
            </label>
          </div>

          <div className="routeResult">
            <div className="optBadgeHeader">
              <CheckCircle2 size={16} color="#15803d" />
              <span>Calculated using OR-Tools Capacitated Vehicle Routing Algorithm</span>
            </div>
            <div><span>Total Calculated Distance:</span> <b>{routeData.total_distance_km} km</b></div>
            <div><span>Estimated Travel Time:</span> <b>{routeData.estimated_time}</b></div>
            <div><span>Vehicle Capacity Utilization:</span> <b>{routeData.capacity_utilization_pct}% ({routeData.total_load_collected} / {routeData.vehicle_capacity} kg)</b></div>
            <div><span>Remaining Payload Capacity:</span> <b>{routeData.remaining_capacity} kg</b></div>
          </div>
        </section>
      </div>
    </div>
  );
}
