import React from "react";
import { Sprout, ShoppingCart, DollarSign, Truck, Warehouse, ArrowRight, Plus, CheckCircle2, Clock3 } from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

export default function FarmerDashboard({ listings, orders, requirements, storage, go, onOpenAddProduce }) {
  // Farmer-specific stats calculations
  const farmerListings = listings.filter(l => l.farmer.includes("Ravi") || l.farmer.includes("Farmer") || l.farmer.includes("Demo"));
  const activeOrders = orders.filter(o => o.status !== "DELIVERED" && o.status !== "PAYMENT COMPLETED");
  const pendingRequests = requirements.filter(r => r.status === "Active");
  const totalEarnings = orders
    .filter(o => o.status === "DELIVERED" || o.status === "PAYMENT COMPLETED")
    .reduce((acc, curr) => acc + (curr.amount || 0), 28400);
  const inTransport = orders.filter(o => o.status === "IN TRANSIT" || o.status === "TRANSPORT ASSIGNED").length;

  return (
    <div className="farmerDashboard">
      <div className="pageTitle">
        <div>
          <div className="eyebrow">FARMER PORTAL</div>
          <h1>Farmer Dashboard</h1>
          <p>Welcome back, Farmer! Monitor your produce listings, buyer matches, and harvest transport.</p>
        </div>
        <button className="primary" onClick={onOpenAddProduce}>
          <Plus size={17} /> Add New Produce
        </button>
      </div>

      <div className="stats grid6">
        <StatCard icon={Sprout} label="Total Produce Listed" value={farmerListings.length > 0 ? farmerListings.length : listings.length} sub="Active in market" trend="+2" />
        <StatCard icon={ShoppingCart} label="Active Orders" value={activeOrders.length} sub="Pending fulfillment" />
        <StatCard icon={Clock3} label="Pending Buyer Requests" value={pendingRequests.length} sub="Matching your crops" />
        <StatCard icon={DollarSign} label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} sub="This season" trend="+14%" />
        <StatCard icon={Truck} label="Produce in Transport" value={`${inTransport} shipments`} sub="Live tracking" />
        <StatCard icon={Warehouse} label="Storage Status" value="72% Occupied" sub="560 kg free at Melur" />
      </div>

      <div className="grid2">
        {/* Active Produce Summary */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>My Active Produce Listings</h3>
              <span>Crops currently visible to buyers</span>
            </div>
            <button className="textBtn" onClick={() => go("My Produce")}>
              View all <ArrowRight size={15} />
            </button>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>CROP</th>
                  <th>QTY</th>
                  <th>PRICE</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {listings.slice(0, 3).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>{item.crop}</b>
                    </td>
                    <td>{item.qty} kg</td>
                    <td>₹{item.price}/kg</td>
                    <td>{item.location}</td>
                    <td>
                      <StatusBadge text={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Matched Buyer Requests */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Matched Buyer Requirements</h3>
              <span>Buyers seeking your available crops</span>
            </div>
            <button className="textBtn" onClick={() => go("Find Buyers")}>
              Explore buyers <ArrowRight size={15} />
            </button>
          </div>
          <div className="requirementMiniList">
            {requirements.slice(0, 3).map((req) => (
              <div className="reqItemMini" key={req.id}>
                <div>
                  <b>{req.buyer}</b>
                  <span>
                    Requires {req.crop} · {req.qty} kg · ₹{req.maxPrice}/kg · {req.location}
                  </span>
                </div>
                <button className="outline small" onClick={() => go("Find Buyers")}>
                  Send Offer
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Orders Lifecycle Table */}
      <section className="card tableCard" style={{ marginTop: "18px" }}>
        <div className="cardHead">
          <div>
            <h3>Active Orders Lifecycle</h3>
            <span>Track progress from buyer request to final payment</span>
          </div>
          <button className="textBtn" onClick={() => go("My Orders")}>
            View order pipeline <ArrowRight size={15} />
          </button>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CROP</th>
                <th>BUYER</th>
                <th>QTY</th>
                <th>AMOUNT</th>
                <th>ORDER LIFECYCLE</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <b>{ord.id}</b>
                  </td>
                  <td>{ord.crop}</td>
                  <td>{ord.buyer}</td>
                  <td>{ord.qty} kg</td>
                  <td>₹{ord.amount.toLocaleString()}</td>
                  <td>
                    <StatusBadge text={ord.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
