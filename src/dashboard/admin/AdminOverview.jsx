import React, { useState } from "react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaBed,
  FaDollarSign,
  FaUserPlus,
  FaCalendarPlus,
  FaBroom,
  FaSearch,
  FaFilter,
  FaEllipsisH,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminOverview = () => {
  const [activeTab, setActiveTab] = useState("arrivals");
  const [searchTerm, setSearchTerm] = useState("");

  const scheduleData = [
    {
      id: "BK-1049",
      guest: "Eleanor Vance",
      room: "Suite 401 (Presidential)",
      type: "Arrival",
      time: "02:00 PM",
      status: "confirmed",
      nights: 4,
      amount: "$1,840.00",
    },
    {
      id: "BK-1052",
      guest: "Marcus Brody",
      room: "Room 205 (Executive)",
      type: "Arrival",
      time: "03:30 PM",
      status: "confirmed",
      nights: 2,
      amount: "$760.00",
    },
    {
      id: "BK-0988",
      guest: "Sophia Martinez",
      room: "Room 108 (Deluxe)",
      type: "Departure",
      time: "11:00 AM",
      status: "checked-in",
      nights: 3,
      amount: "$990.00",
    },
    {
      id: "BK-1060",
      guest: "Dr. Henry Walton",
      room: "Suite 302 (Ocean View)",
      type: "Arrival",
      time: "04:15 PM",
      status: "pending",
      nights: 5,
      amount: "$2,450.00",
    },
    {
      id: "BK-0975",
      guest: "Claire Redfield",
      room: "Room 112 (Standard)",
      type: "Departure",
      time: "10:30 AM",
      status: "checked-out",
      nights: 1,
      amount: "$320.00",
    },
  ];

  const filteredSchedule = scheduleData.filter((item) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "arrivals"
          ? item.type === "Arrival"
          : item.type === "Departure";
    const matchesSearch =
      item.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
            Frontdesk Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif mt-3">
            Welcome back, Frontdesk Team 👋
          </h1>
          <p className="text-amber-100/80 text-sm mt-2">
            Here is your daily operational summary for Virusia Hotel & Suites.
            Today's occupancy is at{" "}
            <strong className="text-amber-300">86% capacity</strong>.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => toast.success("Quick Check-in modal opened")}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <FaUserPlus />
              <span>Check-in Guest</span>
            </button>
            <button
              onClick={() => toast.info("New Reservation modal opened")}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <FaCalendarPlus />
              <span>New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Check-ins"
          value="18 Guests"
          isPositive={true}
          icon={FaSignInAlt}
          color="amber"
          subtitle="12 arrived • 6 pending"
        />
        <StatCard
          title="Today's Check-outs"
          value="14 Guests"
          isPositive={true}
          icon={FaSignOutAlt}
          color="blue"
          subtitle="6 pending departure"
        />
        <StatCard
          title="Occupancy Rate"
          value="86%"
          isPositive={true}
          icon={FaBed}
          color="emerald"
          subtitle="43 of 50 rooms filled"
        />
        <StatCard
          title="Available Rooms"
          value="5"
          isPositive={true}
          icon={FaBed}
          color="purple"
          subtitle="rooms"
        />
      </div>

      {/* Main Operational Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Daily Operational Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Manage today's guest arrivals, departures, and key issuance.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab("arrivals")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "arrivals"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Arrivals (3)
            </button>
            <button
              onClick={() => setActiveTab("departures")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "departures"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Departures (2)
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "all"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              All (5)
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by guest name, room number, or booking ref..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Room & Type</th>
                <th className="py-3 px-4">Schedule Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedule.map((row) => (
                <tr key={row.id} className="hover:bg-amber-50/30 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {row.guest}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {row.room}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                      {row.time} ({row.type})
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() =>
                        toast.success(
                          `Updated status for ${row.guest} (${row.id})`,
                        )
                      }
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg text-[11px] transition cursor-pointer"
                    >
                      {row.type === "Arrival"
                        ? "Complete Check-in"
                        : "Check-out Guest"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
