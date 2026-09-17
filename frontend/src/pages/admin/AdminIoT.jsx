import React, { useState } from "react";
import { Radio, RefreshCw, Thermometer, Droplets, Weight, DoorOpen, ShieldCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function AdminIoT({ iotDevices, notify }) {
  const [live, setLive] = useState(true);

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">SYSTEM SENSOR TELEMETRY</div>
          <h1>IoT Monitoring Console</h1>
          <p>Monitor all connected ESP32 sensor units across vehicles, cold storage hubs, and transit gateways.</p>
        </div>
        <button className="outline" onClick={() => { setLive(!live); notify(live ? "IoT telemetry stream paused" : "IoT telemetry stream active"); }}>
          <RefreshCw size={16} /> {live ? " Live Network Telemetry" : " Paused"}
        </button>
      </div>

      <div className="iotBanner indigoBanner">
        <div>
          <Radio />
          <div>
            <b>System IoT Mesh Gateway</b>
            <span>{iotDevices.length} Connected sensor units · Signal quality 99.8% · ESP32 Bluetooth Gateways active</span>
          </div>
        </div>
        <span className="livePill">
          <i /> MESH ONLINE
        </span>
      </div>

      <section className="card tableCard">
        <div className="cardHead">
          <div>
            <h3>All Connected Sensor Units</h3>
            <span>Live telemetry feed</span>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>DEVICE ID</th>
                <th>VEHICLE / STORAGE UNIT</th>
                <th>TYPE</th>
                <th>TEMP</th>
                <th>HUMIDITY</th>
                <th>LOAD (KG)</th>
                <th>DOOR STATUS</th>
                <th>RISK SCORE</th>
                <th>CONNECTION</th>
                <th>LAST UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {iotDevices.map((dev) => (
                <tr key={dev.id}>
                  <td><b>{dev.id}</b></td>
                  <td>{dev.label}</td>
                  <td>{dev.type}</td>
                  <td><b>{dev.temp}°C</b></td>
                  <td>{dev.humidity}%</td>
                  <td>{dev.loadKg} / {dev.maxLoadKg} kg</td>
                  <td>{dev.doorStatus}</td>
                  <td>
                    <span className={dev.riskScore > 30 ? "riskMedium" : "riskLow"}>
                      {dev.riskScore} / 100 ({dev.riskLevel})
                    </span>
                  </td>
                  <td><StatusBadge text={dev.status} /></td>
                  <td>{dev.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
