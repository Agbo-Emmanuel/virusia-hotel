import React, { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCalendarAlt,
  FaUserCheck,
  FaPlus,
  FaTimes,
  FaDownload,
  FaBed,
  FaDollarSign,
  FaRegCreditCard,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/formatMoney";

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookingsData = [
    {
      id: "VR-8901",
      guestName: "Alexander Wright",
      email: "a.wright@example.com",
      phone: "+1 (555) 234-5678",
      room: "Room 401 - Presidential Suite",
      checkIn: "2026-08-26",
      checkOut: "2026-08-30",
      guests: "2 Adults, 1 Child",
      status: "confirmed",
      totalAmount: 184000,
      paymentStatus: "Paid (Paystack)",
      addOns: ["Breakfast Buffet", "Airport Transfer"],
    },
    {
      id: "VR-8902",
      guestName: "Samantha Miller",
      email: "s.miller@example.com",
      phone: "+1 (555) 987-6543",
      room: "Room 205 - Executive Suite",
      checkIn: "2026-08-26",
      checkOut: "2026-08-28",
      guests: "2 Adults",
      status: "checked-in",
      totalAmount: 760,
      paymentStatus: "Paid (Card)",
      addOns: ["Spa Pass"],
    },
    {
      id: "VR-8903",
      guestName: "David Chen",
      email: "d.chen@example.com",
      phone: "+1 (555) 345-6789",
      room: "Room 108 - Deluxe Room",
      checkIn: "2026-08-24",
      checkOut: "2026-08-27",
      guests: "1 Adult",
      status: "checked-in",
      totalAmount: 990,
      paymentStatus: "Paid (Paystack)",
      addOns: [],
    },
    {
      id: "VR-8904",
      guestName: "Emma Watson",
      email: "e.watson@example.com",
      phone: "+1 (555) 876-5432",
      room: "Room 302 - Ocean View Suite",
      checkIn: "2026-08-27",
      checkOut: "2026-09-01",
      guests: "2 Adults",
      status: "pending",
      totalAmount: 2450,
      paymentStatus: "Pending Deposit",
      addOns: ["Champagne & Fruit Basket"],
    },
    {
      id: "VR-8905",
      guestName: "Robert Downey",
      email: "r.downey@example.com",
      phone: "+1 (555) 456-7890",
      room: "Room 112 - Standard Room",
      checkIn: "2026-08-20",
      checkOut: "2026-08-22",
      guests: "1 Adult",
      status: "checked-out",
      totalAmount: 320,
      paymentStatus: "Paid (Cash)",
      addOns: [],
    },
    {
      id: "VR-8906",
      guestName: "Jessica Alba",
      email: "j.alba@example.com",
      phone: "+1 (555) 654-3210",
      room: "Room 501 - Penthouse Suite",
      checkIn: "2026-08-29",
      checkOut: "2026-09-02",
      guests: "4 Adults",
      status: "cancelled",
      totalAmount: 3600,
      paymentStatus: "Refunded",
      addOns: ["Spa Pass", "Airport Transfer"],
    },
  ];

  const filteredBookings = bookingsData.filter((b) => {
    const matchesStatus =
      selectedStatus === "all" ? true : b.status === selectedStatus;
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (bookingId, newStatus) => {
    toast.success(`Booking ${bookingId} status updated to ${newStatus}`);
    if (selectedBooking) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Reservations & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage operational guest bookings, check-in statuses, and
            reservations.
          </p>
        </div>

        <button
          onClick={() => toast.info("New Reservation Form Modal Opened")}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FaPlus />
          <span>New Manual Reservation</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold text-slate-600">
          {[
            { id: "all", label: "All Bookings" },
            { id: "confirmed", label: "Confirmed" },
            { id: "checked-in", label: "Checked In" },
            { id: "checked-out", label: "Checked Out" },
            { id: "pending", label: "Pending" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
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
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, guest, or room..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Guest Information</th>
                <th className="py-3.5 px-4">Assigned Room</th>
                <th className="py-3.5 px-4">Check In - Out</th>
                <th className="py-3.5 px-4">Total & Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-amber-50/20 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">{b.id}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{b.guestName}</p>
                    <p className="text-[11px] text-slate-400">{b.email}</p>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-800">
                    {b.room}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <FaCalendarAlt className="text-amber-600 text-[10px]" />
                      <span>
                        {b.checkIn} → {b.checkOut}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">
                      {formatPrice(b.totalAmount)}
                    </p>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="p-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-lg transition cursor-pointer"
                      title="View Details"
                    >
                      <FaEye className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative animate-scale-up">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <FaTimes className="text-base" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                Booking Details
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                Reservation #{selectedBooking.id}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <p className="font-bold text-slate-900 text-sm">
                  {selectedBooking.guestName}
                </p>
                <p className="text-slate-600">Email: {selectedBooking.email}</p>
                <p className="text-slate-600">Phone: {selectedBooking.phone}</p>
                <p className="text-slate-600">
                  Occupancy: {selectedBooking.guests}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-800 font-bold uppercase">
                    Assigned Room
                  </p>
                  <p className="font-bold text-slate-900 mt-1">
                    {selectedBooking.room}
                  </p>
                </div>
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-800 font-bold uppercase">
                    Current Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={selectedBooking.status} size="sm" />
                  </div>
                </div>
              </div>

              {selectedBooking.addOns.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 mb-1">
                    Add-on Services:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBooking.addOns.map((addon) => (
                      <span
                        key={addon}
                        className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      >
                        + {addon}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update Quick Buttons */}
              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">
                  Change Reservation Status:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "confirmed")
                    }
                    className="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-[11px] cursor-pointer"
                  >
                    Set Confirmed
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "checked-in")
                    }
                    className="py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-xl text-[11px] cursor-pointer"
                  >
                    Check In
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "checked-out")
                    }
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-[11px] cursor-pointer"
                  >
                    Check Out
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Total Cost
                </p>
                <p className="text-lg font-extrabold text-slate-900">
                  {selectedBooking.totalAmount}
                </p>
              </div>
              <button
                onClick={() => {
                  toast.success(
                    `Printed Guest Receipt for ${selectedBooking.id}`,
                  );
                  setSelectedBooking(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <FaDownload />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
