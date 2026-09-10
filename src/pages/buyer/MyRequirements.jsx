import React, { useState } from "react";
import { Plus, FileText, MapPin, Clock3, Weight, DollarSign, CheckCircle2 } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";

export default function MyRequirements({ requirements, setRequirements, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    crop: "Tomato",
    buyer: "Madurai Fresh Mart",
    qty: 500,
    maxPrice: 25,
    location: "Madurai Town",
    deadline: "Within 2 days",
    grade: "A"
  });

  const handlePost = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Math.floor(300 + Math.random() * 699)}`,
      ...formData,
      qty: Number(formData.qty),
      maxPrice: Number(formData.maxPrice),
      status: "Active",
      createdAt: "Today"
    };
    setRequirements((prev) => [newReq, ...prev]);
    notify(`Requirement posted for ${newReq.qty} kg of ${newReq.crop}`);
    setShowForm(false);
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">PROCUREMENT DEMAND</div>
          <h1>My Requirements</h1>
          <p>Post your specific crop demand, maximum price target, and delivery schedule for verified farmers to fulfill.</p>
        </div>
        <button className="primary" onClick={() => setShowForm(true)}>
          <Plus size={17} /> Post Requirement
        </button>
      </div>

      <div className="requirementGrid">
        {requirements.map((req) => (
          <div className="card requirementCard" key={req.id}>
            <div className="reqHeader">
              <div>
                <h3>{req.crop} Demand</h3>
                <span className="reqIdTag">{req.id}</span>
              </div>
              <StatusBadge text={req.status} />
            </div>

            <div className="reqDetails">
              <div><Weight size={15} /> <span>Required Quantity: <strong>{req.qty} kg</strong></span></div>
              <div><DollarSign size={15} /> <span>Maximum Price: <strong>₹{req.maxPrice}/kg</strong></span></div>
              <div><MapPin size={15} /> <span>Delivery Location: <strong>{req.location}</strong></span></div>
              <div><Clock3 size={15} /> <span>Required Delivery: <strong>{req.deadline}</strong></span></div>
            </div>

            <div className="reqFoot">
              <small>Quality Spec: Grade {req.grade}</small>
              <button
                className="outline small"
                onClick={() => {
                  setRequirements((prev) => prev.filter((r) => r.id !== req.id));
                  notify(`Requirement ${req.id} closed`);
                }}
              >
                Close Post
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title="Post Buyer Requirement" close={() => setShowForm(false)}>
          <form onSubmit={handlePost}>
            <div className="formGrid">
              <label>
                Crop Needed
                <select value={formData.crop} onChange={(e) => setFormData({ ...formData, crop: e.target.value })}>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Green Chilli">Green Chilli</option>
                  <option value="Potato">Potato</option>
                </select>
              </label>
              <label>
                Required Quantity (kg)
                <input
                  type="number"
                  required
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                />
              </label>
              <label>
                Maximum Price Target (₹/kg)
                <input
                  type="number"
                  required
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                />
              </label>
              <label>
                Quality Requirement
                <select value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })}>
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                </select>
              </label>
              <label>
                Delivery Location
                <input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </label>
              <label>
                Required Delivery Date
                <input
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </label>
            </div>
            <button className="primary full" style={{ marginTop: "20px" }}>
              <Plus size={16} /> Post Requirement
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
