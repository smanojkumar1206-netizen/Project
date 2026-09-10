import React from "react";
import { FileText, ShoppingCart, Truck, DollarSign, Clock3, CheckCircle2, ArrowRight, Plus, Sprout } from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

export default function BuyerDashboard({ listings, requirements, orders, activeTrips, go, onOpenPostReq }) {
  const activeReqs = requirements.filter(r => r.status === "Active").length;
  const ordersPlaced = orders.length;
  const inTransit = orders.filter(o => o.status === "IN TRANSIT" || o.status === "TRANSPORT ASSIGNED").length;
  const totalPurchaseValue = orders.reduce((acc, curr) => acc + (curr.amount || 0), 41200);
  const pendingDeliveries = orders.filter(o => o.status !== "DELIVERED").length;
  const completedOrders = orders.filter(o => o.status === "DELIVERED").length;

  return (
    <div className="buyerDashboard">
      <div className="pageTitle">
        <div>
          <div className="eyebrow">BUYER PORTAL</div>
          <h1>Buyer Dashboard</h1>
          <p>Find fresh produce directly from verified suppliers, track orders in transit, and manage procurement requirements.</p>
        </div>
        <button className="primary" onClick={onOpenPostReq}>
          <Plus size={17} /> Post New Requirement
        </button>
      </div>

      <div className="stats grid6">
        <StatCard icon={FileText} label="Active Requirements" value={activeReqs} sub="Open for farmer offers" trend="+1" />
        <StatCard icon={ShoppingCart} label="Orders Placed" value={ordersPlaced} sub="Total procurement" />
        <StatCard icon={Truck} label="Orders in Transit" value={inTransit} sub="Live route tracking" />
        <StatCard icon={DollarSign} label="Total Purchase Value" value={`₹${totalPurchaseValue.toLocaleString()}`} sub="This month" trend="+12%" />
        <StatCard icon={Clock3} label="Pending Deliveries" value={pendingDeliveries} sub="Expected within 48 hrs" />
        <StatCard icon={CheckCircle2} label="Completed Orders" value={completedOrders} sub="Fulfilled & verified" />
      </div>

      <div className="grid2">
        {/* Marketplace Quick Pick */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Featured Farm Produce</h3>
              <span>Direct listings from verified farmers</span>
            </div>
            <button className="textBtn" onClick={() => go("Find Produce")}>
              Browse produce <ArrowRight size={15} />
            </button>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>CROP</th>
                  <th>QTY AVAILABLE</th>
                  <th>PRICE / KG</th>
                  <th>LOCATION</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {listings.slice(0, 3).map((item) => (
                  <tr key={item.id}>
                    <td><b>{item.crop}</b></td>
                    <td>{item.qty} kg</td>
                    <td>₹{item.price}/kg</td>
                    <td>{item.location}</td>
                    <td>
                      <button className="outline small" onClick={() => go("Find Produce")}>
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Active Requirements List */}
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>My Active Requirements</h3>
              <span>Procurement posts matching farmer produce</span>
            </div>
            <button className="textBtn" onClick={() => go("My Requirements")}>
              Manage all <ArrowRight size={15} />
            </button>
          </div>
          <div className="requirementMiniList">
            {requirements.slice(0, 3).map((req) => (
              <div className="reqItemMini" key={req.id}>
                <div>
                  <b>{req.crop} Needed</b>
                  <span>{req.qty} kg · Max ₹{req.maxPrice}/kg · {req.location}</span>
                </div>
                <StatusBadge text={req.status} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Orders Tracking Overview */}
      <section className="card tableCard" style={{ marginTop: "18px" }}>
        <div className="cardHead">
          <div>
            <h3>Procurement Orders Status</h3>
            <span>Live status of your produce orders</span>
          </div>
          <button className="textBtn" onClick={() => go("My Orders")}>
            View all orders <ArrowRight size={15} />
          </button>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CROP</th>
                <th>FARMER</th>
                <th>QTY</th>
                <th>VALUE</th>
                <th>STATUS</th>
                <th>DELIVERY DATE</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((ord) => (
                <tr key={ord.id}>
                  <td><b>{ord.id}</b></td>
                  <td>{ord.crop}</td>
                  <td>{ord.farmer}</td>
                  <td>{ord.qty} kg</td>
                  <td>₹{ord.amount.toLocaleString()}</td>
                  <td><StatusBadge text={ord.status} /></td>
                  <td>{ord.deliveryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
