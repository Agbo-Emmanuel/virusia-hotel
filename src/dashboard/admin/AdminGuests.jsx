import React, { useState } from "react";
import {
  FaSearch,
  FaUserPlus,
  FaCrown,
  FaEnvelope,
  FaPhoneAlt,
  FaBed,
  FaStar,
  FaEllipsisH,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminGuests = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const guests = [
    {
      id: "G-101",
      name: "Eleanor Vance",
      email: "e.vance@luxury.org",
      phone: "+1 (555) 123-4567",
      tier: "VIP Diamond",
      totalStays: 14,
      totalSpent: "$18,400.00",
      lastStay: "2026-08-26 (Presidential Suite)",
      notes: "Prefers high floor room & Dom Pérignon welcome bottle.",
    },
    {
      id: "G-102",
      name: "Marcus Brody",
      email: "m.brody@museum.edu",
      phone: "+1 (555) 234-5678",
      tier: "VIP Gold",
      totalStays: 6,
      totalSpent: "$4,850.00",
      lastStay: "2026-08-26 (Executive Suite)",
      notes: "Allergic to feathers; extra foam pillows required.",
    },
    {
      id: "G-103",
      name: "Sophia Martinez",
      email: "sophia.m@creative.co",
      phone: "+1 (555) 345-6789",
      tier: "VIP Gold",
      totalStays: 4,
      totalSpent: "$3,200.00",
      lastStay: "2026-08-24 (Deluxe Room)",
      notes: "Loves morning ocean view breakfast.",
    },
    {
      id: "G-104",
      name: "David Chen",
      email: "d.chen@techsolutions.io",
      phone: "+1 (555) 456-7890",
      tier: "Member",
      totalStays: 2,
      totalSpent: "$1,450.00",
      lastStay: "2026-08-24 (Deluxe Room)",
      notes: "Late check-out request usually.",
    },
    {
      id: "G-105",
      name: "Claire Redfield",
      email: "claire.r@biotech.org",
      phone: "+1 (555) 567-8901",
      tier: "Member",
      totalStays: 1,
      totalSpent: "$320.00",
      lastStay: "2026-08-20 (Standard Room)",
      notes: "First time guest.",
    },
  ];

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Guest Directory & Loyalty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain guest profiles, VIP statuses, preferences, and stay logs.
          </p>
        </div>

        <button
          onClick={() => toast.info("Register New Guest Profile Modal Opened")}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FaUserPlus />
          <span>Add New Guest Profile</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative max-w-md w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by guest name, email, or phone number..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* Guests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-base font-serif shadow-xs">
                    {guest.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{guest.name}</h3>
                    <p className="text-xs text-slate-400">{guest.id}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                    guest.tier.includes("Diamond")
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : guest.tier.includes("Gold")
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {guest.tier.includes("VIP") && <FaCrown className="text-[10px]" />}
                  <span>{guest.tier}</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-slate-400 text-xs shrink-0" />
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="text-slate-400 text-xs shrink-0" />
                  <span>{guest.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBed className="text-slate-400 text-xs shrink-0" />
                  <span>Last stay: {guest.lastStay}</span>
                </div>
              </div>

              {guest.notes && (
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-xs">
                  <p className="font-bold text-amber-900 text-[10px] uppercase">Special Notes:</p>
                  <p className="text-amber-800 text-[11px] mt-0.5">{guest.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Total Spent</span>
                <span className="font-bold text-slate-900">{guest.totalSpent}</span>
              </div>
              <button
                onClick={() => toast.info(`Viewing full stay history for ${guest.name}`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 font-bold rounded-lg transition cursor-pointer"
              >
                {guest.totalStays} Stays Logged
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGuests;
