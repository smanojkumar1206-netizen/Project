import React from "react";
import GoogleMap from "./GoogleMap";
import { Route, ArrowRight, Truck, CheckCircle2, ShieldCheck, Scale } from "lucide-react";

export function RouteMap({
  routeData = {},
  height = "420px"
}) {
  const stops = routeData.stops || [
    { id: "1", name: "Farmer A (Melur)", type: "farmer", crop: "Tomato", qty: 300, lat: 10.0381, lng: 78.3340, status: "COLLECTED" },
    { id: "2", name: "Farmer B (Thirumangalam)", type: "farmer", crop: "Tomato", qty: 200, lat: 9.8256, lng: 77.9898, status: "PENDING_PICKUP" },
    { id: "3", name: "Madurai Fresh Mart", type: "buyer", crop: "Tomato", qty: 500, lat: 9.9195, lng: 78.1215, status: "DESTINATION" }
  ];

  const vehicleId = routeData.vehicle_id || "TN 58 AB 2211";
  const capacity = routeData.vehicle_capacity || 1000;
  const load = routeData.total_load_collected || 500;
  const remaining = routeData.remaining_capacity || (capacity - load);
  const distance = routeData.total_distance_km || 35.2;
  const timeStr = routeData.estimated_time || "1h 12m";
  const utilPct = routeData.capacity_utilization_pct || Math.round((load / capacity) * 100);

  const routeCoords = routeData.route_coordinates || stops.map(s => ({ lat: s.lat, lng: s.lng }));

  return (
    <div className="routeMapWrapperCard">
      {/* Route Metrics Top Summary Bar */}
      <div className="routeMetricsTopBar">
        <div className="metricBadge">
          <Truck size={16} />
          <div>
            <span>Vehicle ID</span>
            <strong>{vehicleId}</strong>
          </div>
        </div>

        <div className="metricBadge">
          <Route size={16} />
          <div>
            <span>Total Distance</span>
            <strong>{distance} km</strong>
          </div>
        </div>

        <div className="metricBadge">
          <ShieldCheck size={16} />
          <div>
            <span>Est. Travel Time</span>
            <strong>{timeStr}</strong>
          </div>
        </div>

        <div className="metricBadge capacityBadge">
          <Scale size={16} />
          <div className="capDetails">
            <div className="capLabels">
              <span>Load: <b>{load} kg</b> / {capacity} kg</span>
              <span className="remTag">Rem: <b>{remaining} kg</b></span>
            </div>
            <div className="capProgressBar">
              <div className="fillBar" style={{ width: `${utilPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Pickup Sequence Chips */}
      <div className="sequenceChipsRow">
        <span className="seqLabel">Optimal Sequence (OR-Tools CVRP):</span>
        {stops.map((s, idx) => (
          <React.Fragment key={idx}>
            <span className={`seqChip ${s.type}`}>
              {s.name} {s.qty ? `(${s.qty} kg)` : ""}
            </span>
            {idx < stops.length - 1 && <ArrowRight size={13} className="seqArrow" />}
          </React.Fragment>
        ))}
      </div>

      {/* Map Rendering Container */}
      <GoogleMap
        markers={stops}
        routeCoordinates={routeCoords}
        height={height}
      />
    </div>
  );
}

export default RouteMap;
