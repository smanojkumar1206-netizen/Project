import React, { useState } from "react";
import { Settings, Save, Shield, Database, Radio, Bell } from "lucide-react";

export default function SystemSettings({ notify }) {
  const [commissionRate, setCommissionRate] = useState("2.5%");
  const [maxDistanceKm, setMaxDistanceKm] = useState("75");
  const [tempMin, setTempMin] = useState("4.0");
  const [tempMax, setTempMax] = useState("12.0");

  const handleSave = (e) => {
    e.preventDefault();
    notify("System configuration settings saved successfully!");
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">SYSTEM CONFIGURATION</div>
          <h1>System Settings</h1>
          <p>Configure platform commission fees, route constraints, IoT sensor thresholds, and integration parameters.</p>
        </div>
      </div>

      <div className="grid2">
        <section className="card">
          <h3>Marketplace & Freight Platform Fees</h3>
          <form onSubmit={handleSave}>
            <div className="formGrid">
              <label>
                Marketplace Platform Fee Rate (%)
                <input
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
              </label>
              <label>
                Max Search Radius (km)
                <input
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(e.target.value)}
                />
              </label>
            </div>
            <h3 style={{ marginTop: "20px" }}>IoT Temperature Alert Thresholds</h3>
            <div className="formGrid">
              <label>
                Min Storage Temp (°C)
                <input
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                />
              </label>
              <label>
                Max Storage Temp (°C)
                <input
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                />
              </label>
            </div>
            <button className="primary full" style={{ marginTop: "20px" }}>
              <Save size={16} /> Save Configuration
            </button>
          </form>
        </section>

        <section className="card">
          <h3>Backend Integration & Services</h3>
          <div className="profileInfoList">
            <div className="infoRow">
              <Database size={16} />
              <div>
                <span>Database Stack</span>
                <strong>Supabase PostgreSQL (Demo Seed Active)</strong>
              </div>
            </div>
            <div className="infoRow">
              <Shield size={16} />
              <div>
                <span>Backend Framework</span>
                <strong>FastAPI Service Architecture Ready</strong>
              </div>
            </div>
            <div className="infoRow">
              <Radio size={16} />
              <div>
                <span>IoT Telemetry Gateway</span>
                <strong>ESP32 MQTT / HTTP Stream active</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
