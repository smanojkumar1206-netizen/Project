import React from "react";
import { DollarSign, CheckCircle2, Clock3, Download, ArrowUpRight } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function FarmerPayments({ notify }) {
  const transactions = [
    { id: "PAY-901", orderId: "ORD-1039", crop: "Green Chilli", amount: 6200, date: "10 Sep 2026", status: "COMPLETED", buyer: "City Caterers" },
    { id: "PAY-900", orderId: "ORD-1035", crop: "Tomato", amount: 14000, date: "04 Sep 2026", status: "COMPLETED", buyer: "Madurai Fresh" },
    { id: "PAY-898", orderId: "ORD-1042", crop: "Tomato", amount: 12500, date: "Pending", status: "IN ESCROW", buyer: "Madurai Fresh Mart" }
  ];

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">FINANCIAL OVERVIEW</div>
          <h1>Payments</h1>
          <p>View transaction history, direct bank deposits, escrow status, and invoice receipts.</p>
        </div>
        <button className="primary" onClick={() => notify("Payout withdrawal request submitted to bank")}>
          Withdraw to Bank Account
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="statIcon"><DollarSign size={20} /></div>
          <div>
            <span>Total Earnings</span>
            <strong>₹32,700</strong>
            <small className="up">+18% this month</small>
          </div>
        </div>
        <div className="stat">
          <div className="statIcon"><Clock3 size={20} /></div>
          <div>
            <span>Pending in Escrow</span>
            <strong>₹12,500</strong>
            <small>Releases upon delivery</small>
          </div>
        </div>
        <div className="stat">
          <div className="statIcon"><CheckCircle2 size={20} /></div>
          <div>
            <span>Completed Payouts</span>
            <strong>4 deals</strong>
            <small>Direct UPI / Bank Transfer</small>
          </div>
        </div>
      </div>

      <section className="card tableCard">
        <div className="cardHead">
          <div>
            <h3>Payment Transactions</h3>
            <span>Recent earnings and payouts</span>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>PAYMENT ID</th>
                <th>ORDER ID</th>
                <th>PRODUCE</th>
                <th>BUYER</th>
                <th>AMOUNT</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>INVOICE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td><b>{tx.id}</b></td>
                  <td>{tx.orderId}</td>
                  <td>{tx.crop}</td>
                  <td>{tx.buyer}</td>
                  <td><strong>₹{tx.amount.toLocaleString()}</strong></td>
                  <td>{tx.date}</td>
                  <td><StatusBadge text={tx.status} /></td>
                  <td>
                    <button className="textBtn" onClick={() => notify(`Downloading invoice ${tx.id}...`)}>
                      <Download size={14} /> Download
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
