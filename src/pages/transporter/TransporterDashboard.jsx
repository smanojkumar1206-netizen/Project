import React from "react";
import { Package, Truck, Route, CheckCircle2, Clock3, DollarSign, ArrowRight } from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

export default function TransporterDashboard({ transportRequests, vehicles, activeTrips, go, notify }) {
  const openRequests = transportRequests.filter(r => r.status === "Open").length;
  const inTransitCount = activeTrips.length;
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const totalVehicles = vehicles.length;
  const completedTrips = 38;
  const totalEarnings = 48500;

  return (
    <div className="transporterDashboard">
      <div className="pageTitle">
        <div>
          <div className="eyebrow">LOGISTICS OPERATIONS</div>
          <h1>Transport Dashboard</h1>
          <p>Accept cargo pickup requests, track active vehicle routes, and optimize multi-stop delivery schedules.</p>
        </div>
        <button className="primary" onClick={() => go("Route Optimizer")}>
          <Route size={17} /> Open Route Optimizer
        </button>
      </div>

      <div className="stats grid6">
        <StatCard icon={Package} label="Available Requests" value={openRequests} sub="Cargo awaiting pickup" trend="+3" />
        <StatCard icon={Truck} label="Active Trips" value={inTransitCount} sub="Vehicles en-route" />
        <StatCard icon={Route} label="Available Vehicles" value={`${availableVehicles} / ${totalVehicles}`} sub="Fleet ready" />
        <StatCard icon={Clock3} label="Today's Deliveries" value="4 Scheduled" sub="On-time target 100%" />
        <StatCard icon={CheckCircle2} label="Completed Trips" value={completedTrips} sub="This month" trend="+15%" />
        <StatCard icon={DollarSign} label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} sub="Freight payouts" />
      </div>

      <div className="grid2">
        {/* Pending Transport Requests */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>New Transport Cargo Requests</h3>
              <span>Pickup assignments ready to accept</span>
            </div>
            <button className="textBtn" onClick={() => go("Transport Requests")}>
              View all <ArrowRight size={15} />
            </button>
          </div>
          <div className="reqMiniList">
            {transportRequests.slice(0, 3).map((tr) => (
              <div className="transportReqRow" key={tr.id}>
                <div>
                  <b>{tr.produce} · {tr.qty} kg</b>
                  <span>{tr.pickup} → {tr.delivery} ({tr.distance})</span>
                </div>
                <div className="reqFareAction">
                  <strong>₹{tr.estCost}</strong>
                  <button className="primary small" onClick={() => notify(`Accepted transport trip for ${tr.orderId}`)}>
                    Accept Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vehicle Fleet Snapshot */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Fleet Status</h3>
              <span>Current availability of registered vehicles</span>
            </div>
            <button className="textBtn" onClick={() => go("My Vehicles")}>
              Manage fleet <ArrowRight size={15} />
            </button>
          </div>
          <div className="vehicleFleetList">
            {vehicles.map((v) => (
              <div className="vehicleRow" key={v.id}>
                <div className="roundIcon">
                  <Truck size={18} />
                </div>
                <div className="vInfo">
                  <b>{v.vehicleNumber}</b>
                  <span>{v.type} · Max {v.maxCapacity} kg</span>
                </div>
                <StatusBadge text={v.status} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Active Trips Overview */}
      <section className="card tableCard" style={{ marginTop: "18px" }}>
        <div className="cardHead">
          <div>
            <h3>Active En-Route Trips</h3>
            <span>Live logistics monitoring</span>
          </div>
          <button className="textBtn" onClick={() => go("Active Trips")}>
            Full transit list <ArrowRight size={15} />
          </button>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>TRIP ID</th>
                <th>VEHICLE</th>
                <th>PRODUCE CARGO</th>
                <th>FARMER PICKUP</th>
                <th>BUYER DESTINATION</th>
                <th>DISTANCE</th>
                <th>ETA</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {activeTrips.map((trip) => (
                <tr key={trip.id}>
                  <td><b>{trip.id}</b></td>
                  <td>{trip.vehicle}</td>
                  <td>{trip.produce} ({trip.qty} kg)</td>
                  <td>{trip.pickupLocation}</td>
                  <td>{trip.destination}</td>
                  <td>{trip.distance}</td>
                  <td>{trip.eta}</td>
                  <td><StatusBadge text={trip.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
