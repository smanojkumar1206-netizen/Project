import React from "react";
import { Warehouse, MapPin, Thermometer, Droplets, Plus } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function FarmerStorage({ storage, notify }) {
  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">TEMPORARY STORAGE</div>
          <h1>Storage</h1>
          <p>Book local cold-storage facilities when harvest timing does not match immediate delivery.</p>
        </div>
        <button className="primary" onClick={() => notify("Storage booking request initiated")}>
          <Plus size={17} /> Book Storage Bay
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
              <div className="sMetric">
                <Thermometer size={14} /> <span>Temp: <strong>{s.temp}</strong></span>
              </div>
              <div className="sMetric">
                <Droplets size={14} /> <span>Humidity: <strong>{s.humidity}</strong></span>
              </div>
            </div>

            <div className="capacity">
              <div>
                <span>Occupancy</span>
                <b>{s.occupancyPercent}</b>
              </div>
              <div className="miniBar">
                <span style={{ width: s.occupancyPercent }} />
              </div>
              <small>{s.availableCapacity} free space · Suitable for {s.suitableFor}</small>
            </div>

            <button className="outline full" onClick={() => notify(`Selected ${s.name} for storage reservation`)}>
              Reserve Space
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
