import React, { useState } from "react";
import {
  FaUserShield,
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaBan,
  FaEnvelope,
  FaKey,
  FaTimes,
  FaUserCog,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SuperAdminAdmins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [adminsList, setAdminsList] = useState([
    {
      id: "ADM-01",
      name: "Alexander Wright",
      email: "a.wright@virusia.com",
      role: "Super Admin",
      status: "Active",
      lastLogin: "Today, 08:45 AM",
      permissions: ["Full Access", "Financial Control", "Staff Management"],
    },
    {
      id: "ADM-02",
      name: "Sarah Jenkins",
      email: "s.jenkins@virusia.com",
      role: "Frontdesk Admin",
      status: "Active",
      lastLogin: "Today, 07:30 AM",
      permissions: ["Bookings", "Rooms Status", "Guest Directory"],
    },
    {
      id: "ADM-03",
      name: "David Miller",
      email: "d.miller@virusia.com",
      role: "Operations Admin",
      status: "Active",
      lastLogin: "Yesterday, 06:12 PM",
      permissions: ["Housekeeping", "Maintenance Logs"],
    },
    {
      id: "ADM-04",
      name: "Elena Rostova",
      email: "e.rostova@virusia.com",
      role: "Frontdesk Admin",
      status: "Suspended",
      lastLogin: "5 days ago",
      permissions: ["Bookings"],
    },
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Frontdesk Admin",
  });

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    const created = {
      id: `ADM-0${adminsList.length + 1}`,
      name: newAdmin.name || "New Staff Member",
      email: newAdmin.email || "staff@virusia.com",
      role: newAdmin.role,
      status: "Active",
      lastLogin: "Never",
      permissions: ["Bookings", "Rooms Status"],
    };
    setAdminsList([...adminsList, created]);
    setShowAddModal(false);
    toast.success(`Created admin account for ${created.name}`);
  };

  const handleToggleStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setAdminsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
    toast.info(`Account status for ${name} changed to ${nextStatus}`);
  };

  const filtered = adminsList.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Admin Staff & Access Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage administrative user accounts, security roles, and access privilege scopes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-800 hover:bg-purple-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FaPlus />
          <span>Add New Admin Staff</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search admins by name, email, or role..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-purple-500 outline-none transition"
          />
        </div>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((admin) => (
          <div
            key={admin.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 font-serif font-extrabold flex items-center justify-center text-lg shadow-xs">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{admin.name}</h3>
                    <p className="text-xs text-slate-400">{admin.id} • {admin.role}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                    admin.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {admin.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-slate-400 text-xs shrink-0" />
                  <span className="font-medium text-slate-800">{admin.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaKey className="text-slate-400 text-xs shrink-0" />
                  <span>Last active: {admin.lastLogin}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="font-bold text-slate-700 text-[11px] mb-1.5">Granted Scopes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {admin.permissions.map((p) => (
                    <span
                      key={p}
                      className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-100"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => toast.info(`Editing permissions for ${admin.name}`)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Edit Scopes
              </button>
              <button
                onClick={() => handleToggleStatus(admin.id, admin.name, admin.status)}
                className={`px-4 py-2 font-bold rounded-xl transition cursor-pointer ${
                  admin.status === "Active"
                    ? "bg-rose-50 hover:bg-rose-100 text-rose-700"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                }`}
              >
                {admin.status === "Active" ? "Suspend Account" : "Re-activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAdmin}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-scale-up text-xs"
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <FaTimes className="text-base" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 font-serif border-b border-slate-100 pb-3">
              Add New Admin User
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="e.g. Michael Scott"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="m.scott@virusia.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Role Level</label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-semibold"
              >
                <option value="Frontdesk Admin">Frontdesk Admin</option>
                <option value="Operations Admin">Operations Admin</option>
                <option value="Super Admin">Super Admin (Full Platform Control)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 font-bold rounded-xl text-white shadow-md cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAdmins;
