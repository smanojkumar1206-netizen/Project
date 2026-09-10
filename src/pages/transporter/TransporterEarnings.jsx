import React from "react";
import { DollarSign, Truck, CheckCircle2, Clock3, Download } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function TransporterEarnings({ notify }) {
  const earningsList = [
    { id: "PAY-T92", tripId: "TRIP-401", vehicle: "TN 58 AB 2211", fare: 850, fuelSurcharge: 120, total: 970, date: "10 Sep 2026", status: "SETTLED" },
    { id: "PAY-T88", tripId: "TRIP-395", vehicle: "TN 59 CD 8842", fare: 1850, fuelSurcharge: 250, total: 2100, date: "07 Sep 2026", status: "SETTLED" },
    { id: "PAY-T84", tripId: "TRIP-389", vehicle: "TN 58 EF 1098", fare: 1400, fuelSurcharge: 180, total: 1580, date: "02 Sep 2026", status: "SETTLED" }
  ];

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">FREIGHT PAYOUTS</div>
          <h1>Transporter Earnings</h1>
          <p>Track trip payouts, mileage reimbursements, fuel surcharges, and weekly settlements.</p>
        </div>
        <button className="primary" onClick={() => notify("Initiated earnings payout to registered bank account")}>
          Withdraw Freight Payout
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="statIcon"><DollarSign size={20} /></div>
          <div>
            <span>Total Freight Revenue</span>
            <strong>₹48,500</strong>
            <small className="up">+15% this month</small>
          </div>
        </div>
        <div className="stat">
          <div className="statIcon"><Truck size={20} /></div>
          <div>
            <span>Avg. Rate / km</span>
            <strong>₹38 / km</strong>
            <small>Consolidated load efficiency</small>
          </div>
        </div>
        <div className="stat">
          <div className="statIcon"><CheckCircle2 size={20} /></div>
          <div>
            <span>Settlement Status</span>
            <strong>100% Settled</strong>
            <small>Weekly payouts every Monday</small>
          </div>
        </div>
      </div>

      <section className="card tableCard">
        <div className="cardHead">
          <div>
            <h3>Freight Payout Log</h3>
            <span>Trip fare breakdown</span>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>TRIP ID</th>
                <th>VEHICLE</th>
                <th>BASE FARE</th>
                <th>FUEL SURCHARGE</th>
                <th>TOTAL PAYOUT</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {earningsList.map((tx) => (
                <tr key={tx.id}>
                  <td><b>{tx.id}</b></td>
                  <td>{tx.tripId}</td>
                  <td>{tx.vehicle}</td>
                  <td>₹{tx.fare}</td>
                  <td>₹{tx.fuelSurcharge}</td>
                  <td><strong>₹{tx.total.toLocaleString()}</strong></td>
                  <td>{tx.date}</td>
                  <td><StatusBadge text={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
