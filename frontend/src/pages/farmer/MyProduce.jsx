import React, { useState } from "react";
import { Plus, Edit2, Trash2, Sprout, MapPin, Clock3, Weight, Tag } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";

export default function MyProduce({ listings, setListings, notify }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    crop: "Tomato",
    farmer: "Ravi Kumar",
    qty: 500,
    price: 28,
    location: "Melur, Madurai",
    harvest: "12 Sep 2026",
    grade: "A"
  });

  const handleDelete = (id) => {
    setListings(prev => prev.filter(item => item.id !== id));
    notify("Produce listing deleted successfully");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      setListings(prev =>
        prev.map(item => (item.id === editingItem.id ? { ...item, ...formData, qty: Number(formData.qty), price: Number(formData.price) } : item))
      );
      notify("Produce listing updated");
      setEditingItem(null);
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        qty: Number(formData.qty),
        price: Number(formData.price),
        status: "Available",
        distance: "10 km"
      };
      setListings(prev => [newItem, ...prev]);
      notify("New produce listed successfully");
      setShowAddModal(false);
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      crop: item.crop,
      farmer: item.farmer,
      qty: item.qty,
      price: item.price,
      location: item.location,
      harvest: item.harvest,
      grade: item.grade
    });
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">PRODUCE MANAGEMENT</div>
          <h1>My Produce</h1>
          <p>Manage your harvest inventory, set expected market prices, and update produce availability.</p>
        </div>
        <button className="primary" onClick={() => { setFormData({ crop: "Tomato", farmer: "Ravi Kumar", qty: 500, price: 28, location: "Melur, Madurai", harvest: "12 Sep 2026", grade: "A" }); setShowAddModal(true); }}>
          <Plus size={17} /> Add New Produce
        </button>
      </div>

      <div className="listingGrid">
        {listings.map((item) => (
          <div className="listing" key={item.id}>
            <div className="cropTop">
              <div className="cropIcon">
                <Sprout />
              </div>
              <StatusBadge text={item.status} />
            </div>
            <h3>{item.crop}</h3>
            <p className="farmerName">Grade {item.grade} · {item.farmer}</p>
            
            <div className="listingMeta">
              <span><Weight size={15} /> <strong>Quantity:</strong> {item.qty} kg</span>
              <span><Tag size={15} /> <strong>Expected Price:</strong> ₹{item.price}/kg</span>
              <span><MapPin size={15} /> <strong>Location:</strong> {item.location}</span>
              <span><Clock3 size={15} /> <strong>Harvest Date:</strong> {item.harvest}</span>
            </div>

            <div className="listingFoot">
              <div>
                <small>Total Value</small>
                <b>₹{(item.qty * item.price).toLocaleString()}</b>
              </div>
              <div className="actionButtons">
                <button className="iconBtn" title="Edit" onClick={() => openEdit(item)}>
                  <Edit2 size={16} />
                </button>
                <button className="iconBtn dangerIcon" title="Delete" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showAddModal || editingItem) && (
        <Modal title={editingItem ? "Edit Produce Listing" : "Add Produce Listing"} close={() => { setShowAddModal(false); setEditingItem(null); }}>
          <form onSubmit={handleSave} className="produceForm">
            <div className="formGrid">
              <label>
                Crop Name
                <select value={formData.crop} onChange={(e) => setFormData({ ...formData, crop: e.target.value })}>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Green Chilli">Green Chilli</option>
                  <option value="Potato">Potato</option>
                  <option value="Brinjal">Brinjal</option>
                </select>
              </label>
              <label>
                Quantity (kg)
                <input type="number" required value={formData.qty} onChange={(e) => setFormData({ ...formData, qty: e.target.value })} />
              </label>
              <label>
                Expected Price (₹/kg)
                <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </label>
              <label>
                Quality Grade
                <select value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })}>
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Processing)</option>
                </select>
              </label>
              <label>
                Farm Location
                <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </label>
              <label>
                Harvest Date
                <input required value={formData.harvest} onChange={(e) => setFormData({ ...formData, harvest: e.target.value })} />
              </label>
            </div>
            <button className="primary full" style={{ marginTop: "20px" }}>
              {editingItem ? "Update Produce" : "Publish Produce Listing"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
