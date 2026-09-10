import React from "react";
import { Users, Sprout, ShoppingCart, Truck, Warehouse, Radio, BarChart3, Package, ArrowRight } from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

export default function AdminDashboard({ users = [], listings = [], orders = [], vehicles = [], activeTrips = [], storage = [], iotDevices = [], go }) {
  const farmersCount = users.filter(u => (u.role || "").toLowerCase() === "farmer").length;
  const buyersCount = users.filter(u => (u.role || "").toLowerCase() === "buyer").length;
  const transportersCount = users.filter(u => (u.role || "").toLowerCase() === "transporter").length;
  const activeListingsCount = listings.length;
  const activeOrdersCount = orders.length;
  const ordersInTransitCount = activeTrips.length;
  const totalVolumeKg = listings.reduce((a, b) => a + (b.qty || 0), 0) + 12000;
  const storageOccupancy = "72%";
  const connectedIoTCount = iotDevices.length;

  return (
    <div className="adminDashboard">
      <div className="pageTitle">
        <div>
          <div className="eyebrow">SYSTEM OVERVIEW</div>
          <h1>Admin Management Dashboard</h1>
          <p>Monitor the complete agricultural supply chain network, system users, marketplace listings, and IoT sensors.</p>
        </div>
      </div>

      <div className="stats grid9">
        <StatCard icon={Users} label="Total Users" value={users.length} sub={`${farmersCount} Farmers, ${buyersCount} Buyers, ${transportersCount} Transporters`} />
        <StatCard icon={Sprout} label="Total Farmers" value={farmersCount} sub="Verified suppliers" />
        <StatCard icon={ShoppingCart} label="Total Buyers" value={buyersCount} sub="Active buyers" />
        <StatCard icon={Truck} label="Total Transporters" value={transportersCount} sub="Logistics partners" />
        <StatCard icon={Package} label="Active Orders" value={activeOrdersCount} sub="In pipeline" />
        <StatCard icon={Truck} label="Orders in Transit" value={ordersInTransitCount} sub="En-route" />
        <StatCard icon={BarChart3} label="Produce Listings" value={activeListingsCount} sub="Marketplace items" trend="+2" />
        <StatCard icon={Warehouse} label="Storage Utilization" value={storageOccupancy} sub="Avg across hubs" />
        <StatCard icon={Radio} label="Active IoT Devices" value={connectedIoTCount} sub="Connected gateways" />
      </div>

      <div className="grid2">
        {/* User Accounts Overview */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Recent Registered Users</h3>
              <span>Platform users across all roles</span>
            </div>
            <button className="textBtn" onClick={() => go("Users")}>
              Manage users <ArrowRight size={15} />
            </button>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id || u.email}>
                    <td>
                      <b>{u.full_name || u.name}</b>
                      <div style={{ fontSize: "10px", color: "#6b7280" }}>{u.email}</div>
                    </td>
                    <td><span className={`rolePillTag ${(u.role || "").toLowerCase()}`}>{u.role}</span></td>
                    <td>{u.location || "Madurai"}</td>
                    <td><StatusBadge text={u.status || "Active"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Global Logistics Fleet Status */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Active Logistics Operations</h3>
              <span>Fleet vehicle & route overview</span>
            </div>
            <button className="textBtn" onClick={() => go("Transportation")}>
              View logistics <ArrowRight size={15} />
            </button>
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
                {vehicles.slice(0, 4).map((v) => (
                  <tr key={v.id}>
                    <td><b>{v.vehicleNumber || v.vehicle}</b></td>
                    <td>{v.type || "Truck"}</td>
                    <td>{v.maxCapacity || v.capacity || 5000} kg</td>
                    <td><StatusBadge text={v.status || "Active"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Storage & IoT Monitoring Overview */}
      <section className="card tableCard" style={{ marginTop: "18px" }}>
        <div className="cardHead">
          <div>
            <h3>Cold Storage Network Overview</h3>
            <span>Facility capacity & telemetry</span>
          </div>
          <button className="textBtn" onClick={() => go("Storage")}>
            Storage network <ArrowRight size={15} />
          </button>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>FACILITY NAME</th>
                <th>LOCATION</th>
                <th>TOTAL CAPACITY</th>
                <th>OCCUPIED</th>
                <th>AVAILABLE</th>
                <th>TEMP</th>
                <th>HUMIDITY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {storage.map((s) => (
                <tr key={s.id}>
                  <td><b>{s.name}</b></td>
                  <td>{s.location}</td>
                  <td>{s.totalCapacity}</td>
                  <td>{s.occupiedCapacity} ({s.occupancyPercent})</td>
                  <td>{s.availableCapacity}</td>
                  <td><b>{s.temp}</b></td>
                  <td>{s.humidity}</td>
                  <td><StatusBadge text={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
