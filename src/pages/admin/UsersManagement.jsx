import React, { useState } from "react";
import { Users, Eye, Edit2, UserX, Search, ShieldCheck } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";

export default function UsersManagement({ users = [], setUsers, roleFilter: initialRoleFilter = "All", notify }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");
  const [activeRoleTab, setActiveRoleTab] = useState(
    initialRoleFilter && initialRoleFilter !== "Users" ? initialRoleFilter : "All"
  );

  const filteredUsers = users.filter((u) => {
    const normRole = (u.role || "").toLowerCase();
    const matchRole =
      activeRoleTab === "All" ||
      activeRoleTab === "Users" ||
      normRole === activeRoleTab.toLowerCase().replace(/s$/, "");

    const nameStr = (u.full_name || u.name || "").toLowerCase();
    const emailStr = (u.email || "").toLowerCase();
    const phoneStr = (u.phone || "").toLowerCase();
    const searchStr = search.toLowerCase();

    const matchSearch =
      nameStr.includes(searchStr) ||
      emailStr.includes(searchStr) ||
      phoneStr.includes(searchStr);

    return matchRole && matchSearch;
  });

  const toggleSuspend = (user) => {
    const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
    const userName = user.full_name || user.name;
    setUsers((prev) =>
      prev.map((u) => ((u.id === user.id || u.email === user.email) ? { ...u, status: newStatus } : u))
    );
    notify && notify(`User ${userName} status set to ${newStatus}`);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    const userName = editUser.full_name || editUser.name;
    setUsers((prev) =>
      prev.map((u) => ((u.id === editUser.id || u.email === editUser.email) ? editUser : u))
    );
    notify && notify(`User ${userName} updated successfully`);
    setEditUser(null);
  };

  return (
    <div>
      <div className="pageTitle">
        <div>
          <div className="eyebrow">USER ADMINISTRATION</div>
          <h1>System User Directory ({users.length} Total Users)</h1>
          <p>Monitor all registered Farmers, Buyers, and Transporters in PostgreSQL database.</p>
        </div>
      </div>

      {/* Role Filter Tabs & Search Bar */}
      <div className="marketTools">
        <div className="roleFilterTabs" style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {["All", "Farmers", "Buyers", "Transporters"].map((tab) => (
            <button
              key={tab}
              className={`filterTabBtn ${activeRoleTab === tab ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: activeRoleTab === tab ? "var(--role-primary)" : "#fff",
                color: activeRoleTab === tab ? "#fff" : "var(--ink)",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer"
              }}
              onClick={() => setActiveRoleTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="search wide">
          <Search size={17} />
          <input
            placeholder="Search users by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <section className="card tableCard">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>FULL NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ROLE</th>
                <th>LOCATION</th>
                <th>REGISTERED DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "24px", color: "var(--muted)" }}>
                    No user accounts match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userName = user.full_name || user.name || "User";
                  const normRole = (user.role || "farmer").toLowerCase();
                  return (
                    <tr key={user.id || user.email}>
                      <td><b>{userName}</b></td>
                      <td>{user.email || "user@agriconnect.org"}</td>
                      <td>{user.phone || "+91 98765 43210"}</td>
                      <td>
                        <span className={`rolePillTag ${normRole}`}>
                          {user.role ? user.role.toUpperCase() : "FARMER"}
                        </span>
                      </td>
                      <td>{user.location || "Madurai"}</td>
                      <td>{user.createdAt || user.created_at || user.joined || "Today"}</td>
                      <td>
                        <StatusBadge text={user.status || "Active"} />
                      </td>
                      <td>
                        <div className="adminActions">
                          <button className="textBtn" title="View Details" onClick={() => setSelectedUser(user)}>
                            <Eye size={16} /> View
                          </button>
                          <button className="textBtn" title="Edit User" onClick={() => setEditUser({ ...user })}>
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            className={`textBtn ${user.status === "Suspended" ? "successText" : "dangerText"}`}
                            title={user.status === "Suspended" ? "Activate User" : "Suspend User"}
                            onClick={() => toggleSuspend(user)}
                          >
                            <UserX size={16} /> {user.status === "Suspended" ? "Activate" : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* View User Modal */}
      {selectedUser && (
        <Modal title={`User Details · ${selectedUser.full_name || selectedUser.name}`} close={() => setSelectedUser(null)}>
          <div className="modalDetailContent">
            <div className="detailRow"><span>User ID:</span><strong>{selectedUser.id}</strong></div>
            <div className="detailRow"><span>Full Name:</span><strong>{selectedUser.full_name || selectedUser.name}</strong></div>
            <div className="detailRow"><span>Assigned Role:</span><strong>{(selectedUser.role || "").toUpperCase()}</strong></div>
            <div className="detailRow"><span>Email Address:</span><strong>{selectedUser.email}</strong></div>
            <div className="detailRow"><span>Phone Number:</span><strong>{selectedUser.phone}</strong></div>
            <div className="detailRow"><span>Location:</span><strong>{selectedUser.location}</strong></div>
            <div className="detailRow"><span>Account Status:</span><strong>{selectedUser.status || "Active"}</strong></div>
            <div className="detailRow"><span>Registration Date:</span><strong>{selectedUser.createdAt || selectedUser.joined || "Today"}</strong></div>
            <button
              className={`primary full ${selectedUser.status === "Suspended" ? "" : "dangerBtn"}`}
              style={{ marginTop: "20px" }}
              onClick={() => {
                toggleSuspend(selectedUser);
                setSelectedUser(null);
              }}
            >
              {selectedUser.status === "Suspended" ? "Re-activate Account" : "Suspend User Account"}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <Modal title={`Edit User Profile · ${editUser.full_name || editUser.name}`} close={() => setEditUser(null)}>
          <form onSubmit={handleUpdateUser}>
            <div className="formGrid">
              <label>
                Full Name
                <input
                  required
                  value={editUser.full_name || editUser.name || ""}
                  onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value, name: e.target.value })}
                />
              </label>
              <label>
                Role
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="transporter">Transporter</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>
                Phone
                <input
                  value={editUser.phone || ""}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                />
              </label>
              <label>
                Location
                <input
                  required
                  value={editUser.location || ""}
                  onChange={(e) => setEditUser({ ...editUser, location: e.target.value })}
                />
              </label>
            </div>
            <button className="primary full" style={{ marginTop: "20px" }}>
              Save Profile Changes
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
