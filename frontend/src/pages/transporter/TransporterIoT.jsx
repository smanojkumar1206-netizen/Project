import React, { useState } from "react";
import { Radio, Thermometer, Droplets, Weight, DoorOpen, RefreshCw, Truck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function TransporterIoT({ iotDevices, notify }) {
  const [live, setLive] = useState(true);

  // Filter IoT units attached to fleet vehicles
  const vehicleIoT = iotDevices.filter((d) => d.type === "Vehicle Unit");

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">FLEET SENSORS</div>
          <h1>IoT Monitoring</h1>
          <p>ESP32 Bluetooth sensor telemetry for cold-chain refrigerated trucks in transit.</p>
        </div>
        <button className="outline" onClick={() => { setLive(!live); notify(live ? "Telemetry paused" : "Live fleet telemetry stream active"); }}>
          <RefreshCw size={16} /> {live ? " Live Vehicle Stream" : " Paused"}
        </button>
      </div>

      <div className="iotBanner amberBanner">
        <div>
          <Radio />
          <div>
            <b>Vehicle Gateway Unit · TRK-07 (TN 58 AB 2211)</b>
            <span>Refrigerated cargo temp monitoring · Last telemetry update: 12 sec ago</span>
          </div>
        </div>
        <span className="livePill">
          <i /> LIVE EN-ROUTE
        </span>
      </div>

      <div className="sensorGrid">
        <div className="sensor">
          <div className="sensorIcon"><Thermometer /></div>
          <span>Cargo Bay Temp</span>
          <strong>8.4<small>°C</small></strong>
          <em>Normal</em>
          <p>Cold-chain target: 4.0 – 10.0°C</p>
        </div>

        <div className="sensor">
          <div className="sensorIcon"><Droplets /></div>
          <span>Container Humidity</span>
          <strong>82<small>%</small></strong>
          <em>Optimal</em>
          <p>Target range: 70 – 90%</p>
        </div>

        <div className="sensor">
          <div className="sensorIcon"><Weight /></div>
          <span>Active Axle Load</span>
          <strong>485<small>kg</small></strong>
          <em>70% Cap</em>
          <p>Vehicle capacity: 1,000 kg</p>
        </div>

        <div className="sensor">
          <div className="sensorIcon"><DoorOpen /></div>
          <span>Cargo Door Security</span>
          <strong>Closed</strong>
          <em>Secure</em>
          <p>No unauthorized door openings</p>
        </div>
      </div>

      <section className="card tableCard" style={{ marginTop: "18px" }}>
        <div className="cardHead">
          <div>
            <h3>Connected Fleet Sensor Units</h3>
            <span>ESP32 gateway connection status</span>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>DEVICE ID</th>
                <th>VEHICLE / UNIT</th>
                <th>TEMP</th>
                <th>HUMIDITY</th>
                <th>LOAD (KG)</th>
                <th>DOOR</th>
                <th>RISK SCORE</th>
                <th>STATUS</th>
                <th>LAST UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {vehicleIoT.map((unit) => (
                <tr key={unit.id}>
                  <td><b>{unit.id}</b></td>
                  <td>{unit.label}</td>
                  <td><b>{unit.temp}°C</b></td>
                  <td>{unit.humidity}%</td>
                  <td>{unit.loadKg} / {unit.maxLoadKg} kg</td>
                  <td>{unit.doorStatus}</td>
                  <td>
                    <span className={unit.riskScore > 30 ? "riskMedium" : "riskLow"}>
                      {unit.riskScore} / 100 ({unit.riskLevel})
                    </span>
                  </td>
                  <td><StatusBadge text={unit.status} /></td>
                  <td>{unit.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
