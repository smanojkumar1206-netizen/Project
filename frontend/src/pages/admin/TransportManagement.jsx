import React from "react";
import { Truck, Route, Navigation, Clock3 } from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

export default function TransportManagement({ vehicles, activeTrips, notify }) {
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const delayedTrips = 0; // All on schedule

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">LOGISTICS SUPERVISION</div>
          <h1>Transportation Management</h1>
          <p>Monitor platform fleet utilization, active dispatch trips, available vehicles, and route efficiency metrics.</p>
        </div>
      </div>

      <div className="stats">
        <StatCard icon={Truck} label="Total Vehicles" value={vehicles.length} sub="Registered logistics fleet" />
        <StatCard icon={Route} label="Active Dispatch Trips" value={activeTrips.length} sub="Currently en-route" />
        <StatCard icon={Navigation} label="Available Vehicles" value={availableVehicles} sub="Ready for pickup" />
        <StatCard icon={Clock3} label="Delayed Trips" value={delayedTrips} sub="On-time rate 100%" />
      </div>

      <div className="grid2">
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Fleet Vehicles</h3>
              <span>Registered logistics fleet</span>
            </div>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>VEHICLE</th>
                  <th>TYPE</th>
                  <th>CAPACITY</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td><b>{v.vehicleNumber}</b></td>
                    <td>{v.type}</td>
                    <td>{v.maxCapacity} kg</td>
                    <td><StatusBadge text={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Active Transit Routes</h3>
              <span>En-route delivery monitoring</span>
            </div>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>TRIP</th>
                  <th>VEHICLE</th>
                  <th>PRODUCE</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {activeTrips.map((t) => (
                  <tr key={t.id}>
                    <td><b>{t.id}</b></td>
                    <td>{t.vehicle}</td>
                    <td>{t.produce} ({t.qty} kg)</td>
                    <td>{t.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
