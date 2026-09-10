import React from "react";
import { User, MapPin, Phone, Mail, ShieldCheck, Truck, Award } from "lucide-react";

export default function TransporterProfile({ notify }) {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">LOGISTICS PARTNER</div>
          <h1>Transporter Profile</h1>
          <p>Manage logistics company credentials, fleet permits, driver licenses, and hub location.</p>
        </div>
      </div>

      <div className="grid2">
        <section className="card">
          <div className="profileHeaderCard">
            <div className="avatarBig transporterAvatar">E</div>
            <div>
              <h2>Express Freight Logistics</h2>
              <span className="badgeAmber"><ShieldCheck size={14} /> Verified Logistics Partner</span>
              <p className="subText"><MapPin size={14} /> Central Depot, Mattuthavani, Madurai</p>
            </div>
          </div>

          <div className="profileInfoList">
            <div className="infoRow">
              <Mail size={16} />
              <div>
                <span>Dispatch Email</span>
                <strong>dispatch@expressfreight.in</strong>
              </div>
            </div>
            <div className="infoRow">
              <Phone size={16} />
              <div>
                <span>Helpdesk Phone</span>
                <strong>+91 97890 55667</strong>
              </div>
            </div>
            <div className="infoRow">
              <Truck size={16} />
              <div>
                <span>Fleet Capacity</span>
                <strong>4 Vehicles (Refrigerated & Mini Trucks)</strong>
              </div>
            </div>
            <div className="infoRow">
              <Award size={16} />
              <div>
                <span>On-Time Delivery Rate</span>
                <strong>98.2% Reliability Score</strong>
              </div>
            </div>
          </div>

          <button className="primary full" style={{ marginTop: "20px" }} onClick={() => notify("Edit fleet profile dialog opened")}>
            Edit Fleet Credentials
          </button>
        </section>

        <section className="card">
          <h3>Logistics Compliance & Permits</h3>
          <div className="farmSpecs">
            <div className="specBox">
              <span>National Goods Permit</span>
              <strong className="greenText">Valid till Dec 2028</strong>
            </div>
            <div className="specBox">
              <span>Cold-Chain Certification</span>
              <strong>ISO 22000 Certified</strong>
            </div>
            <div className="specBox">
              <span>Insurance Cargo Coverage</span>
              <strong>Up to ₹10,00,000 / Trip</strong>
            </div>
            <div className="specBox">
              <span>GST Transport ID</span>
              <strong>33BBBBB1111B2Z9</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
