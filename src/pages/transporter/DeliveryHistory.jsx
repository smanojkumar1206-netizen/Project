import React from "react";
import { CheckCircle2, Download, Truck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function DeliveryHistory({ notify }) {
  const history = [
    { id: "DEL-8801", orderId: "ORD-1039", produce: "Green Chilli", qty: 100, vehicle: "TN 59 CD 8842", date: "10 Sep 2026", fare: 650, rating: "5.0 ★" },
    { id: "DEL-8794", orderId: "ORD-1032", produce: "Onion", qty: 800, vehicle: "TN 58 AB 2211", date: "07 Sep 2026", fare: 1850, rating: "4.9 ★" },
    { id: "DEL-8789", orderId: "ORD-1028", produce: "Tomato", qty: 600, vehicle: "TN 58 EF 1098", date: "02 Sep 2026", fare: 1400, rating: "5.0 ★" }
  ];

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">COMPLETED DISPATCHES</div>
          <h1>Delivery History</h1>
          <p>Review past completed transport trips, customer feedback ratings, and freight manifest logs.</p>
        </div>
      </div>

      <section className="card tableCard">
        <div className="cardHead">
          <div>
            <h3>Completed Transport Deliveries</h3>
            <span>Fulfillments log</span>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>DELIVERY ID</th>
                <th>ORDER ID</th>
                <th>PRODUCE</th>
                <th>QTY</th>
                <th>VEHICLE</th>
                <th>COMPLETED DATE</th>
                <th>FREIGHT FARE</th>
                <th>CLIENT RATING</th>
                <th>MANIFEST</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td><b>{h.id}</b></td>
                  <td>{h.orderId}</td>
                  <td>{h.produce}</td>
                  <td>{h.qty} kg</td>
                  <td>{h.vehicle}</td>
                  <td>{h.date}</td>
                  <td><strong>₹{h.fare}</strong></td>
                  <td><span className="ratingBadge">{h.rating}</span></td>
                  <td>
                    <button className="textBtn" onClick={() => notify(`Downloading manifest for ${h.id}`)}>
                      <Download size={14} /> Manifest PDF
                    </button>
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
