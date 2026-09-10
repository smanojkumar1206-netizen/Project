import React, { useState } from "react";
import { Radio, Thermometer, Droplets, Weight, DoorOpen, RefreshCw, ShieldCheck } from "lucide-react";

export default function FarmerIoT({ iotDevices, notify }) {
  const [live, setLive] = useState(true);

  // Filter IoT devices related to farmer's produce (e.g. Storage STR-01 & assigned transport unit)
  const farmerDevices = iotDevices.filter(d => d.ownerRole === "farmer" || d.id === "IOT-STR01");

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">SMART FARM SENSORS</div>
          <h1>IoT Monitoring</h1>
          <p>Real-time telemetry monitoring for your harvested produce in storage and transit.</p>
        </div>
        <button className="outline" onClick={() => { setLive(!live); notify(live ? "Telemetry paused" : "Live telemetry stream resumed"); }}>
          <RefreshCw size={16} /> {live ? " Live Sensor Stream" : " Paused"}
        </button>
      </div>

      <div className="iotBanner">
        <div>
          <Radio />
          <div>
            <b>Farmer Storage Monitoring Unit · STR-01 (Melur Hub)</b>
            <span>ESP32 Gateway connected · Last telemetry update: 5 sec ago</span>
          </div>
        </div>
        <span className="livePill">
          <i /> LIVE TELEMETRY
        </span>
      </div>

      <div className="sensorGrid">
        <div className="sensor">
          <div className="sensorIcon">
            <Thermometer />
          </div>
          <span>Temperature</span>
          <strong>6.2<small>°C</small></strong>
          <em>Normal</em>
          <p>Target produce range: 4.0 – 8.0°C</p>
        </div>

        <div className="sensor">
          <div className="sensorIcon">
            <Droplets />
          </div>
          <span>Humidity</span>
          <strong>84<small>%</small></strong>
          <em>Optimal</em>
          <p>Target humidity: 80 – 90%</p>
        </div>

        <div className="sensor">
          <div className="sensorIcon">
            <Weight />
          </div>
          <span>Stored Load / Weight</span>
          <strong>1,440<small>kg</small></strong>
          <em>Optimal</em>
          <p>Storage capacity: 2,000 kg</p>
        </div>

        <div className="sensor">
          <div className="sensorIcon">
            <DoorOpen />
          </div>
          <span>Storage Door Status</span>
          <strong>Closed</strong>
          <em>Secure</em>
          <p>No unauthorized door access</p>
        </div>
      </div>

      <div className="grid2">
        <section className="card chartCard">
          <div className="cardHead">
            <div>
              <h3>Produce Temperature Trend</h3>
              <span>Last 60 minutes telemetry</span>
            </div>
            <span className="greenValue">6.2°C</span>
          </div>
          <div className="fakeChart">
            <div className="chartLine" />
          </div>
          <div className="axis">
            <span>11:00 AM</span>
            <span>11:15 AM</span>
            <span>11:30 AM</span>
            <span>11:45 AM</span>
          </div>
        </section>

        <section className="card">
          <div className="cardHead">
            <div>
              <h3>Crop Condition Risk Score</h3>
              <span>Rule-based quality assurance score</span>
            </div>
          </div>
          <div className="risk">
            <div className="riskCircle">
              12<small>/100</small>
            </div>
            <div>
              <b>Very Low Risk</b>
              <p>Storage temperature and humidity levels are optimal. Produce quality score is 98% Grade A.</p>
            </div>
          </div>
          <button className="outline full" onClick={() => notify("Sensor threshold settings opened")}>
            Configure Risk Alert Limits
          </button>
        </section>
      </div>
    </div>
  );
}
