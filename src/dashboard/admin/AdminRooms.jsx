import React, { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  FaBed,
  FaSearch,
  FaFilter,
  FaBroom,
  FaTools,
  FaCheck,
  FaUserCheck,
  FaExchangeAlt,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminRooms = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [rooms, setRooms] = useState([
    {
      id: "101",
      number: "Room 101",
      floor: "1st Floor",
      category: "Standard Room",
      type: "standard",
      price: "$320/night",
      status: "available",
      guest: "-",
      cleanliness: "Clean & Sanitized",
    },
    {
      id: "102",
      number: "Room 102",
      floor: "1st Floor",
      category: "Standard Room",
      type: "standard",
      price: "$320/night",
      status: "occupied",
      guest: "John Doe (VR-8802)",
      cleanliness: "Occupied",
    },
    {
      id: "201",
      number: "Room 201",
      floor: "2nd Floor",
      category: "Deluxe Room",
      type: "deluxe",
      price: "$450/night",
      status: "cleaning",
      guest: "-",
      cleanliness: "Deep Cleaning in progress",
    },
    {
      id: "205",
      number: "Room 205",
      floor: "2nd Floor",
      category: "Executive Suite",
      type: "executive",
      price: "$620/night",
      status: "occupied",
      guest: "Marcus Brody (VR-1052)",
      cleanliness: "Occupied",
    },
    {
      id: "302",
      number: "Room 302",
      floor: "3rd Floor",
      category: "Ocean View Suite",
      type: "executive",
      price: "$780/night",
      status: "available",
      guest: "-",
      cleanliness: "Inspected & Ready",
    },
    {
      id: "401",
      number: "Room 401",
      floor: "4th Floor",
      category: "Presidential Suite",
      type: "presidential",
      price: "$1,840/night",
      status: "occupied",
      guest: "Eleanor Vance (VR-1049)",
      cleanliness: "Occupied VIP",
    },
    {
      id: "405",
      number: "Room 405",
      floor: "4th Floor",
      category: "Executive Suite",
      type: "executive",
      price: "$650/night",
      status: "maintenance",
      guest: "-",
      cleanliness: "AC Repair Scheduled",
    },
    {
      id: "501",
      number: "Room 501",
      floor: "5th Floor",
      category: "Penthouse Suite",
      type: "penthouse",
      price: "$2,200/night",
      status: "available",
      guest: "-",
      cleanliness: "Ready for Guest",
    },
  ]);

  const handleStatusToggle = (roomId, currentStatus) => {
    const statusCycle = {
      available: "occupied",
      occupied: "cleaning",
      cleaning: "maintenance",
      maintenance: "available",
    };
    const nextStatus = statusCycle[currentStatus] || "available";

    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: nextStatus } : r))
    );
    toast.info(`Room ${roomId} status changed to ${nextStatus.toUpperCase()}`);
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesStatus =
      selectedStatus === "all" ? true : r.status === selectedStatus;
    const matchesCat =
      selectedCategory === "all" ? true : r.type === selectedCategory;
    const matchesSearch =
      r.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Room Operational Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time room occupancy, housekeeping, and maintenance status tracking.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
              viewMode === "grid" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600"
            }`}
          >
            <FaThLarge />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
              viewMode === "list" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600"
            }`}
          >
            <FaList />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs font-bold text-slate-600">
          {[
            { id: "all", label: "All Rooms" },
            { id: "available", label: "Available" },
            { id: "occupied", label: "Occupied" },
            { id: "cleaning", label: "Cleaning" },
            { id: "maintenance", label: "Maintenance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                selectedStatus === tab.id
                  ? "bg-amber-600 text-white shadow-xs"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search room number or guest..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredRooms.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{r.floor}</span>
                  <StatusBadge status={r.status} size="sm" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2 font-serif">
                  {r.number}
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">{r.category}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs border border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>Guest:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[120px]">
                    {r.guest}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Rate:</span>
                  <span className="font-bold text-slate-800">{r.price}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Condition:</span>
                  <span className="font-medium text-slate-700">{r.cleanliness}</span>
                </div>
              </div>

              <button
                onClick={() => handleStatusToggle(r.id, r.status)}
                className="w-full py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200/60"
              >
                <FaExchangeAlt className="text-xs text-amber-600" />
                <span>Toggle Status</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Room Number</th>
                  <th className="py-3.5 px-4">Floor & Type</th>
                  <th className="py-3.5 px-4">Current Guest</th>
                  <th className="py-3.5 px-4">Nightly Rate</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((r) => (
                  <tr key={r.id} className="hover:bg-amber-50/20 transition">
                    <td className="py-4 px-4 font-extrabold text-slate-900">{r.number}</td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{r.category}</p>
                      <p className="text-[11px] text-slate-400">{r.floor}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{r.guest}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{r.price}</td>
                    <td className="py-4 px-4 text-slate-600">{r.cleanliness}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleStatusToggle(r.id, r.status)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
