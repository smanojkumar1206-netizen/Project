import React, { useState } from "react";
import { Truck, MapPin, Weight, Plus, Edit2, ShieldCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";

export default function MyVehicles({ vehicles, setVehicles, notify }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: "TN 59 AB 9988",
    type: "Refrigerated Van",
    maxCapacity: 1200,
    location: "Madurai Depot",
    driver: "Ramesh P.",
    driverPhone: "+91 98765 11111"
  });

  const updateStatus = (id, newStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
    notify(`Updated vehicle ${id} status to ${newStatus}`);
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const vObj = {
      id: `V-${Math.floor(105 + Math.random() * 895)}`,
      ...newVehicle,
      maxCapacity: Number(newVehicle.maxCapacity),
      status: "Available"
    };
    setVehicles((prev) => [...prev, vObj]);
    notify(`New vehicle ${vObj.vehicleNumber} registered successfully`);
    setShowAddModal(false);
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">FLEET MANAGEMENT</div>
          <h1>My Vehicles</h1>
          <p>Manage your transport fleet, vehicle specs, real-time availability, and driver assignments.</p>
        </div>
        <button className="primary" onClick={() => setShowAddModal(true)}>
          <Plus size={17} /> Add Vehicle
        </button>
      </div>

      <div className="vehicleGrid">
        {vehicles.map((v) => (
          <div className="card vehicleCard" key={v.id}>
            <div className="cardHead">
              <div className="truckBadgeHeader">
                <div className="roundIcon">
                  <Truck size={20} />
                </div>
                <div>
                  <h3>{v.vehicleNumber}</h3>
                  <span className="vType">{v.type}</span>
                </div>
              </div>
              <StatusBadge text={v.status} />
            </div>

            <div className="vehicleDetails">
              <div><Weight size={14} /> <span>Max Load Capacity: <strong>{v.maxCapacity} kg</strong></span></div>
              <div><MapPin size={14} /> <span>Current Location: <strong>{v.location}</strong></span></div>
              <div><ShieldCheck size={14} /> <span>Assigned Driver: <strong>{v.driver} ({v.driverPhone})</strong></span></div>
            </div>

            <div className="vehicleStatusToggle">
              <span className="toggleLabel">Set Status:</span>
              <div className="statusBtnGroup">
                <button
                  className={`statusOption ${v.status === "Available" ? "activeAvailable" : ""}`}
                  onClick={() => updateStatus(v.id, "Available")}
                >
                  Available
                </button>
                <button
                  className={`statusOption ${v.status === "On Trip" ? "activeOnTrip" : ""}`}
                  onClick={() => updateStatus(v.id, "On Trip")}
                >
                  On Trip
                </button>
                <button
                  className={`statusOption ${v.status === "Maintenance" ? "activeMaint" : ""}`}
                  onClick={() => updateStatus(v.id, "Maintenance")}
                >
                  Maintenance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <Modal title="Register New Vehicle" close={() => setShowAddModal(false)}>
          <form onSubmit={handleAddVehicle}>
            <div className="formGrid">
              <label>
                Vehicle Number
                <input
                  required
                  value={newVehicle.vehicleNumber}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
                />
              </label>
              <label>
                Vehicle Type
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                >
                  <option value="Refrigerated Van">Refrigerated Van</option>
                  <option value="Medium Truck">Medium Truck</option>
                  <option value="Insulated Mini Truck">Insulated Mini Truck</option>
                  <option value="Heavy Cargo Carrier">Heavy Cargo Carrier</option>
                </select>
              </label>
              <label>
                Max Load Capacity (kg)
                <input
                  type="number"
                  required
                  value={newVehicle.maxCapacity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, maxCapacity: e.target.value })}
                />
              </label>
              <label>
                Depot / Base Location
                <input
                  required
                  value={newVehicle.location}
                  onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
                />
              </label>
              <label>
                Driver Name
                <input
                  required
                  value={newVehicle.driver}
                  onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                />
              </label>
              <label>
                Driver Contact Phone
                <input
                  required
                  value={newVehicle.driverPhone}
                  onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })}
                />
              </label>
            </div>
            <button className="primary full" style={{ marginTop: "20px" }}>
              <Plus size={16} /> Save & Register Vehicle
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
