import React from "react";
import { BarChart3, Leaf, Route, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "../../components/StatCard";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">SUPPLY CHAIN INTELLIGENCE</div>
          <h1>Analytics & Insights</h1>
          <p>System-wide indicators for farmer-to-buyer transaction volume, transport utilization, and post-harvest risk alerts.</p>
        </div>
      </div>

      <div className="stats">
        <StatCard icon={ShoppingCart} label="Farmer-to-Buyer Deals" value="186" sub="+22% vs last month" trend="+22%" />
        <StatCard icon={Route} label="Transport Utilization" value="88%" sub="Avg load capacity used" />
        <StatCard icon={TrendingUp} label="Average Delivery Time" value="1.8 Hours" sub="-25 mins route optimization" />
        <StatCard icon={Leaf} label="Total Produce Movement" value="18.4 Tons" sub="This season" trend="+16%" />
      </div>

      <div className="grid2">
        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Monthly Transaction Fulfillment</h3>
              <span>Orders matched & delivered</span>
            </div>
          </div>
          <div className="bars">
            {[62, 70, 58, 74, 81, 86, 92].map((h, i) => (
              <div key={i}>
                <div className="bar" style={{ height: h + "%" }} />
                <span>{["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"][i]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Top Produce Movement Volume</h3>
              <span>Current marketplace share</span>
            </div>
          </div>
          {[
            ["Tomato", "5.2 Tons", "28%"],
            ["Onion", "4.1 Tons", "22%"],
            ["Potato", "3.6 Tons", "19%"],
            ["Green Chilli", "2.8 Tons", "15%"],
            ["Brinjal", "1.9 Tons", "11%"]
          ].map((x) => (
            <div className="progressRow" key={x[0]}>
              <div>
                <b>{x[0]}</b>
                <span>{x[1]}</span>
                <strong>{x[2]}</strong>
              </div>
              <div className="miniBar">
                <span style={{ width: x[2] }} />
              </div>
            </div>
          ))}
        </section>
      </div>

      <section className="card" style={{ marginTop: "18px" }}>
        <div className="cardHead">
          <div>
            <h3>Post-Harvest Quality Risk Alerts</h3>
            <span>Automated ESP32 telemetry rule-based risk triggers</span>
          </div>
        </div>
        <div className="riskAlertList">
          <div className="riskAlertRow low">
            <ShieldCheckIcon />
            <div>
              <b>Melur Storage Unit STR-01 · Normal Operation</b>
              <span>Temperature 6.2°C, Humidity 84% · Zero degradation risk detected</span>
            </div>
            <span className="riskPill low">LOW RISK</span>
          </div>
          <div className="riskAlertRow med">
            <AlertTriangle size={18} />
            <div>
              <b>Truck Unit TRK-09 (TN 58 EF 1098) · Door Ajar Warning</b>
              <span>Container door opened 2 mins ago en-route Dindigul Highway. Temperature 11.8°C</span>
            </div>
            <span className="riskPill med">MEDIUM RISK</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShieldCheckIcon() {
  return <TrendingUp size={18} color="#166534" />;
}
