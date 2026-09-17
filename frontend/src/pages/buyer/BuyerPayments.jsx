import React from "react";
import { DollarSign, CheckCircle2, Clock3, Download } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function BuyerPayments({ notify }) {
  const transactions = [
    { id: "INV-401", orderId: "ORD-1042", produce: "Tomato", amount: 12500, date: "10 Sep 2026", status: "ESCROW HELD" },
    { id: "INV-398", orderId: "ORD-1039", produce: "Green Chilli", amount: 6200, date: "08 Sep 2026", status: "PAID" },
    { id: "INV-395", orderId: "ORD-1031", produce: "Onion", amount: 22500, date: "28 Aug 2026", status: "PAID" }
  ];

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">PROCUREMENT INVOICES</div>
          <h1>Buyer Payments</h1>
          <p>Manage payment methods, secure escrow balances, and procurement invoices.</p>
        </div>
        <button className="primary" onClick={() => notify("Added credit line / payment method")}>
          Add Payment Method
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="statIcon"><DollarSign size={20} /></div>
          <div>
            <span>Total Spent</span>
            <strong>₹41,200</strong>
            <small className="up">This month</small>
          </div>
        </div>
        <div className="stat">
          <div className="statIcon"><Clock3 size={20} /></div>
          <div>
            <span>Held in Escrow</span>
            <strong>₹12,500</strong>
            <small>Protected payment</small>
          </div>
        </div>
        <div className="stat">
          <div className="statIcon"><CheckCircle2 size={20} /></div>
          <div>
            <span>Payment Rating</span>
            <strong>Instant (100%)</strong>
            <small>Verified Buyer badge</small>
          </div>
        </div>
      </div>

      <section className="card tableCard">
        <div className="cardHead">
          <div>
            <h3>Procurement Payment Invoices</h3>
            <span>Transaction history and receipts</span>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>INVOICE ID</th>
                <th>ORDER ID</th>
                <th>PRODUCE</th>
                <th>AMOUNT</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>DOWNLOAD</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td><b>{tx.id}</b></td>
                  <td>{tx.orderId}</td>
                  <td>{tx.produce}</td>
                  <td><strong>₹{tx.amount.toLocaleString()}</strong></td>
                  <td>{tx.date}</td>
                  <td><StatusBadge text={tx.status} /></td>
                  <td>
                    <button className="textBtn" onClick={() => notify(`Downloading invoice ${tx.id}...`)}>
                      <Download size={14} /> Invoice PDF
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
