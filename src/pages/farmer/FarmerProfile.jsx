import React from "react";
import { User, MapPin, Phone, Mail, ShieldCheck, Sprout, Award } from "lucide-react";

export default function FarmerProfile({ notify }) {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">ACCOUNT PROFILE</div>
          <h1>Farmer Profile</h1>
          <p>Manage your farm identity, verification status, contact information, and farm location.</p>
        </div>
      </div>

      <div className="grid2">
        <section className="card">
          <div className="profileHeaderCard">
            <div className="avatarBig">R</div>
            <div>
              <h2>Ravi Kumar</h2>
              <span className="badgeGreen"><ShieldCheck size={14} /> Verified Organic Farmer</span>
              <p className="subText"><MapPin size={14} /> Melur, Madurai, Tamil Nadu</p>
            </div>
          </div>

          <div className="profileInfoList">
            <div className="infoRow">
              <Mail size={16} />
              <div>
                <span>Email Address</span>
                <strong>ravi.farmer@agriconnect.in</strong>
              </div>
            </div>
            <div className="infoRow">
              <Phone size={16} />
              <div>
                <span>Phone Number</span>
                <strong>+91 94431 11223</strong>
              </div>
            </div>
            <div className="infoRow">
              <Sprout size={16} />
              <div>
                <span>Primary Crops</span>
                <strong>Tomato, Green Chilli, Brinjal</strong>
              </div>
            </div>
            <div className="infoRow">
              <Award size={16} />
              <div>
                <span>Quality Rating</span>
                <strong>4.9 / 5.0 (24 Ratings)</strong>
              </div>
            </div>
          </div>

          <button className="primary full" style={{ marginTop: "20px" }} onClick={() => notify("Edit profile dialog opened")}>
            Edit Profile Details
          </button>
        </section>

        <section className="card">
          <h3>Farm Land Specs</h3>
          <div className="farmSpecs">
            <div className="specBox">
              <span>Total Farm Area</span>
              <strong>12.5 Acres</strong>
            </div>
            <div className="specBox">
              <span>Irrigation Type</span>
              <strong>Drip & Canal</strong>
            </div>
            <div className="specBox">
              <span>Soil Health Card</span>
              <strong className="greenText">Verified (Grade A)</strong>
            </div>
            <div className="specBox">
              <span>Storage Hub Nearest</span>
              <strong>Madurai Agro Hub (4 km)</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
