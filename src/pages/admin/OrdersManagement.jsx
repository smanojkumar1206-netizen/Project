import React from "react";
import { ShoppingCart } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function OrdersManagement({ orders, notify }) {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">GLOBAL MARKETPLACE</div>
          <h1>Orders Management</h1>
          <p>Supervise all platform order transactions, buyer-farmer matching, and logistics fulfillment status.</p>
        </div>
      </div>

      <section className="card tableCard">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>PRODUCE</th>
                <th>FARMER</th>
                <th>BUYER</th>
                <th>QTY</th>
                <th>AMOUNT</th>
                <th>TRANSPORTER</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td><b>{ord.id}</b></td>
                  <td>{ord.crop}</td>
                  <td>{ord.farmer}</td>
                  <td>{ord.buyer}</td>
                  <td>{ord.qty} kg</td>
                  <td><strong>₹{ord.amount.toLocaleString()}</strong></td>
                  <td>{ord.transporter}</td>
                  <td><StatusBadge text={ord.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
