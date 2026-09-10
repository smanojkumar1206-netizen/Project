import React, { useState } from "react";
import { Search, Sprout, MapPin, Clock3, Weight, Tag, Eye, ShoppingCart } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";

export default function FindProduce({ listings, onPlaceOrder, notify }) {
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [orderProduce, setOrderProduce] = useState(null);
  const [orderQty, setOrderQty] = useState(100);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    onPlaceOrder({
      ...orderProduce,
      requestedQty: Number(orderQty)
    });
    setOrderProduce(null);
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">MARKETPLACE CATALOG</div>
          <h1>Find Produce</h1>
          <p>Explore available fresh crops directly from verified local farmers with transparent pricing and location details.</p>
        </div>
      </div>

      <div className="marketTools">
        <div className="search wide">
          <Search size={17} />
          <input placeholder="Search crop, farmer name, or location..." />
        </div>
        <select>
          <option>All Produce Types</option>
          <option>Tomato</option>
          <option>Onion</option>
          <option>Green Chilli</option>
          <option>Potato</option>
        </select>
        <select>
          <option>All Quality Grades</option>
          <option>Grade A (Premium)</option>
          <option>Grade B (Standard)</option>
        </select>
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
              <span><Weight size={15} /> <strong>Available:</strong> {item.qty} kg</span>
              <span><Tag size={15} /> <strong>Price:</strong> ₹{item.price}/kg</span>
              <span><MapPin size={15} /> <strong>Location:</strong> {item.location} ({item.distance || "12 km"})</span>
              <span><Clock3 size={15} /> <strong>Harvest Date:</strong> {item.harvest}</span>
            </div>

            <div className="listingFoot">
              <div>
                <small>Unit Price</small>
                <b>₹{item.price}/kg</b>
              </div>
              <div className="actionButtons">
                <button className="outline small" onClick={() => setSelectedProduce(item)}>
                  <Eye size={14} /> View Details
                </button>
                <button
                  className="primary small"
                  onClick={() => {
                    setOrderProduce(item);
                    setOrderQty(Math.min(100, item.qty));
                  }}
                >
                  <ShoppingCart size={14} /> Place Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Produce Detail Modal */}
      {selectedProduce && (
        <Modal title={`${selectedProduce.crop} Details`} close={() => setSelectedProduce(null)}>
          <div className="modalDetailContent">
            <div className="detailRow"><span>Farmer:</span><strong>{selectedProduce.farmer}</strong></div>
            <div className="detailRow"><span>Quality Grade:</span><strong>Grade {selectedProduce.grade}</strong></div>
            <div className="detailRow"><span>Available Quantity:</span><strong>{selectedProduce.qty} kg</strong></div>
            <div className="detailRow"><span>Price per kg:</span><strong>₹{selectedProduce.price} / kg</strong></div>
            <div className="detailRow"><span>Farm Location:</span><strong>{selectedProduce.location}</strong></div>
            <div className="detailRow"><span>Approx. Distance:</span><strong>{selectedProduce.distance || "12 km"}</strong></div>
            <div className="detailRow"><span>Harvest / Ready Date:</span><strong>{selectedProduce.harvest}</strong></div>
            <button
              className="primary full"
              style={{ marginTop: "20px" }}
              onClick={() => {
                setOrderProduce(selectedProduce);
                setOrderQty(Math.min(100, selectedProduce.qty));
                setSelectedProduce(null);
              }}
            >
              <ShoppingCart size={16} /> Proceed to Place Order
            </button>
          </div>
        </Modal>
      )}

      {/* Order Placement Modal */}
      {orderProduce && (
        <Modal title={`Place Order for ${orderProduce.crop}`} close={() => setOrderProduce(null)}>
          <form onSubmit={handleCreateOrder}>
            <div className="formGrid">
              <label>
                Crop
                <input value={orderProduce.crop} readOnly />
              </label>
              <label>
                Supplier / Farmer
                <input value={orderProduce.farmer} readOnly />
              </label>
              <label>
                Price (₹/kg)
                <input value={`₹${orderProduce.price}/kg`} readOnly />
              </label>
              <label>
                Required Quantity (kg)
                <input
                  type="number"
                  max={orderProduce.qty}
                  min={10}
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="offerCalc">
              <span>Total Estimated Order Value:</span>
              <strong>₹{(orderProduce.price * orderQty).toLocaleString()}</strong>
            </div>
            <button className="primary full" style={{ marginTop: "18px" }}>
              Confirm & Submit Order
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
