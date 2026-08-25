import React, { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  FaSearch,
  FaDownload,
  FaUndo,
  FaDollarSign,
  FaCalendarAlt,
  FaFilter,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SuperAdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [masterBookings, setMasterBookings] = useState([
    {
      id: "VR-8901",
      guest: "Alexander Wright",
      email: "a.wright@example.com",
      room: "Suite 401 - Presidential",
      dates: "2026-08-26 to 2026-08-30",
      total: "$1,840.00",
      method: "Paystack (Online)",
      status: "confirmed",
      refunded: false,
    },
    {
      id: "VR-8902",
      guest: "Samantha Miller",
      email: "s.miller@example.com",
      room: "Room 205 - Executive",
      dates: "2026-08-26 to 2026-08-28",
      total: "$760.00",
      method: "Credit Card (POS)",
      status: "checked-in",
      refunded: false,
    },
    {
      id: "VR-8904",
      guest: "Emma Watson",
      email: "e.watson@example.com",
      room: "Room 302 - Ocean View",
      dates: "2026-08-27 to 2026-09-01",
      total: "$2,450.00",
      method: "Paystack (Online)",
      status: "pending",
      refunded: false,
    },
    {
      id: "VR-8906",
      guest: "Jessica Alba",
      email: "j.alba@example.com",
      room: "Suite 501 - Penthouse",
      dates: "2026-08-29 to 2026-09-02",
      total: "$3,600.00",
      method: "Paystack (Online)",
      status: "cancelled",
      refunded: true,
    },
  ]);

  const handleRefund = (id) => {
    setMasterBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, refunded: true, status: "cancelled" } : b))
    );
    toast.success(`Refund of full reservation amount processed for ${id}`);
  };

  const handleExportCSV = () => {
    toast.success("Exported Master Reservation Register (CSV)");
  };

  const filtered = masterBookings.filter((b) => {
    const matchStatus = statusFilter === "all" ? true : b.status === statusFilter;
    const matchSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Master Reservations & Financial Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin system-wide audit of all reservations, transactions, and refunds.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FaDownload />
          <span>Export All Financial Data (CSV)</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Settled Bookings</p>
          <p className="text-2xl font-extrabold text-slate-900 font-serif mt-1">$8,650.00</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Refunds Issued</p>
          <p className="text-2xl font-extrabold text-rose-600 font-serif mt-1">$3,600.00</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Paystack Commission</p>
          <p className="text-2xl font-extrabold text-purple-700 font-serif mt-1">$129.75</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs font-bold text-slate-600">
          {["all", "confirmed", "checked-in", "pending", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-2 rounded-xl capitalize transition cursor-pointer ${
                statusFilter === tab
                  ? "bg-purple-700 text-white shadow-xs"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ref, guest, or room..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Guest Info</th>
                <th className="py-3.5 px-4">Room & Duration</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Super Admin Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-purple-50/20 transition">
                  <td className="py-4 px-4 font-extrabold text-slate-900">{b.id}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{b.guest}</p>
                    <p className="text-[11px] text-slate-400">{b.email}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-800">{b.room}</p>
                    <p className="text-[11px] text-slate-400">{b.dates}</p>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{b.method}</td>
                  <td className="py-4 px-4 font-extrabold text-slate-900">{b.total}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    {b.refunded ? (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-1 rounded-full">
                        Refund Processed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRefund(b.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <FaUndo className="text-[10px]" />
                        <span>Issue Refund</span>
                      </button>
                    )}
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

export default SuperAdminBookings;
