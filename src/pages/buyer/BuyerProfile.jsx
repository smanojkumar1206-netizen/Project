import React from "react";
import { User, MapPin, Phone, Mail, ShieldCheck, ShoppingCart, Award } from "lucide-react";

export default function BuyerProfile({ notify }) {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">BUYER ACCOUNT</div>
          <h1>Buyer Profile</h1>
          <p>Manage procurement business profile, delivery warehouse address, and tax registration details.</p>
        </div>
      </div>

      <div className="grid2">
        <section className="card">
          <div className="profileHeaderCard">
            <div className="avatarBig buyerAvatar">M</div>
            <div>
              <h2>Madurai Fresh Mart</h2>
              <span className="badgeBlue"><ShieldCheck size={14} /> Verified Wholesale Buyer</span>
              <p className="subText"><MapPin size={14} /> Madurai Town Hub, Tamil Nadu</p>
            </div>
          </div>

          <div className="profileInfoList">
            <div className="infoRow">
              <Mail size={16} />
              <div>
                <span>Procurement Email</span>
                <strong>procure@maduraifresh.com</strong>
              </div>
            </div>
            <div className="infoRow">
              <Phone size={16} />
              <div>
                <span>Contact Phone</span>
                <strong>+91 98421 33445</strong>
              </div>
            </div>
            <div className="infoRow">
              <ShoppingCart size={16} />
              <div>
                <span>Primary Sourcing</span>
                <strong>Tomatoes, Onions, Potatoes</strong>
              </div>
            </div>
            <div className="infoRow">
              <Award size={16} />
              <div>
                <span>Buyer Trust Score</span>
                <strong>99.4% On-time Payment</strong>
              </div>
            </div>
          </div>

          <button className="primary full" style={{ marginTop: "20px" }} onClick={() => notify("Edit buyer business profile opened")}>
            Edit Business Profile
          </button>
        </section>

        <section className="card">
          <h3>Delivery Receiving Hub</h3>
          <div className="farmSpecs">
            <div className="specBox">
              <span>Main Warehouse</span>
              <strong>Madurai Wholesale Market Yard</strong>
            </div>
            <div className="specBox">
              <span>Daily Unloading Hours</span>
              <strong>04:00 AM – 02:00 PM</strong>
            </div>
            <div className="specBox">
              <span>Cold Bay Available</span>
              <strong className="blueText">Yes (Temp 4°C – 10°C)</strong>
            </div>
            <div className="specBox">
              <span>GSTIN License</span>
              <strong>33AAAAA0000A1Z5</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
