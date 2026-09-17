import React from "react";
import { Warehouse, MapPin, Thermometer, Droplets, Plus } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function StorageManagement({ storage, notify }) {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">STORAGE INFRASTRUCTURE</div>
          <h1>Storage Management</h1>
          <p>Monitor cold storage facilities across Madurai & regional agricultural hubs.</p>
        </div>
        <button className="primary" onClick={() => notify("Add new storage facility dialog opened")}>
          <Plus size={17} /> Add Storage Facility
        </button>
      </div>

      <div className="storageGrid">
        {storage.map((s) => (
          <div className="card storageCard" key={s.id}>
            <div className="storageHead">
              <div className="warehouseIcon">
                <Warehouse />
              </div>
              <StatusBadge text={s.status} />
            </div>

            <h3>{s.name}</h3>
            <p><MapPin size={14} /> {s.location}</p>

            <div className="storageMetrics">
              <div className="sMetric"><Thermometer size={14} /> <span>Temp: <strong>{s.temp}</strong></span></div>
              <div className="sMetric"><Droplets size={14} /> <span>Humidity: <strong>{s.humidity}</strong></span></div>
            </div>

            <div className="capacity">
              <div>
                <span>Occupied Capacity: {s.occupiedCapacity}</span>
                <b>{s.occupancyPercent}</b>
              </div>
              <div className="miniBar">
                <span style={{ width: s.occupancyPercent }} />
              </div>
              <small>Total Capacity: {s.totalCapacity} · Available: {s.availableCapacity}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
