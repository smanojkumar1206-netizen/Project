import React, { useState } from "react";
import { Search, MapPin, Clock3, Weight, DollarSign, Send, Eye, CheckCircle2 } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";

export default function FindBuyers({ requirements, notify }) {
  const [selectedReq, setSelectedReq] = useState(null);
  const [offerReq, setOfferReq] = useState(null);
  const [offerPrice, setOfferPrice] = useState(25);
  const [offerQty, setOfferQty] = useState(500);

  const handleSendOffer = (e) => {
    e.preventDefault();
    notify(`Offer sent to ${offerReq.buyer} for ${offerQty} kg of ${offerReq.crop} @ ₹${offerPrice}/kg`);
    setOfferReq(null);
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">BUYER MATCHING</div>
          <h1>Find Buyers</h1>
          <p>Browse active buyer requirements matching your produce and submit competitive supply offers.</p>
        </div>
      </div>

      <div className="marketTools">
        <div className="search wide">
          <Search size={17} />
          <input placeholder="Filter buyer requirements by crop, location or buyer..." />
        </div>
      </div>

      <div className="requirementGrid">
        {requirements.map((req) => (
          <div className="card requirementCard" key={req.id}>
            <div className="reqHeader">
              <div>
                <h3>{req.crop}</h3>
                <span className="buyerName">{req.buyer}</span>
              </div>
              <StatusBadge text={req.status} />
            </div>

            <div className="reqDetails">
              <div>
                <Weight size={15} />
                <span>Quantity Required: <strong>{req.qty} kg</strong></span>
              </div>
              <div>
                <DollarSign size={15} />
                <span>Max Target Price: <strong>₹{req.maxPrice}/kg</strong></span>
              </div>
              <div>
                <Clock3 size={15} />
                <span>Delivery Deadline: <strong>{req.deadline}</strong></span>
              </div>
              <div>
                <MapPin size={15} />
                <span>Delivery Location: <strong>{req.location}</strong></span>
              </div>
            </div>

            <div className="reqActions">
              <button className="outline small" onClick={() => setSelectedReq(req)}>
                <Eye size={15} /> View Requirement
              </button>
              <button
                className="primary small"
                onClick={() => {
                  setOfferReq(req);
                  setOfferPrice(req.maxPrice);
                  setOfferQty(req.qty);
                }}
              >
                <Send size={15} /> Send Offer
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedReq && (
        <Modal title={`Requirement Details · ${selectedReq.id}`} close={() => setSelectedReq(null)}>
          <div className="modalDetailContent">
            <div className="detailRow">
              <span>Buyer:</span>
              <strong>{selectedReq.buyer}</strong>
            </div>
            <div className="detailRow">
              <span>Crop Required:</span>
              <strong>{selectedReq.crop} (Grade {selectedReq.grade})</strong>
            </div>
            <div className="detailRow">
              <span>Required Quantity:</span>
              <strong>{selectedReq.qty} kg</strong>
            </div>
            <div className="detailRow">
              <span>Max Offered Price:</span>
              <strong>₹{selectedReq.maxPrice}/kg</strong>
            </div>
            <div className="detailRow">
              <span>Delivery Location:</span>
              <strong>{selectedReq.location}</strong>
            </div>
            <div className="detailRow">
              <span>Required Within:</span>
              <strong>{selectedReq.deadline}</strong>
            </div>
            <div className="detailRow">
              <span>Posted Date:</span>
              <strong>{selectedReq.createdAt}</strong>
            </div>
            <button
              className="primary full"
              style={{ marginTop: "20px" }}
              onClick={() => {
                setOfferReq(selectedReq);
                setSelectedReq(null);
              }}
            >
              <Send size={16} /> Make Direct Supply Offer
            </button>
          </div>
        </Modal>
      )}

      {offerReq && (
        <Modal title={`Send Offer to ${offerReq.buyer}`} close={() => setOfferReq(null)}>
          <form onSubmit={handleSendOffer}>
            <p className="formSubtitle">Offer supply for {offerReq.crop} ({offerReq.qty} kg requirement)</p>
            <div className="formGrid">
              <label>
                Offered Price (₹/kg)
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  required
                />
              </label>
              <label>
                Available Quantity (kg)
                <input
                  type="number"
                  value={offerQty}
                  onChange={(e) => setOfferQty(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="offerCalc">
              <span>Estimated Total Deal Value:</span>
              <strong>₹{(offerPrice * offerQty).toLocaleString()}</strong>
            </div>
            <button className="primary full" style={{ marginTop: "16px" }}>
              <Send size={16} /> Submit Offer
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
