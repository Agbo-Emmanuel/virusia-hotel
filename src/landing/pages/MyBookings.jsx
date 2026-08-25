import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatMoney";
import {
  FaCalendarCheck,
  FaSearch,
  FaTimesCircle,
  FaPrint,
  FaBed,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaConciergeBell,
  FaShieldAlt,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const MyBookings = () => {
  const navigate = useNavigate();
  const [savedBookings, setSavedBookings] = useState([]);

  const [searchCode, setSearchCode] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'confirmed', 'cancelled'
  const [receiptBooking, setReceiptBooking] = useState(null);

  // Filter bookings
  const filteredBookings = savedBookings.filter((b) => {
    if (activeTab === "confirmed" && b.status !== "Confirmed") return false;
    if (activeTab === "cancelled" && b.status !== "Cancelled") return false;

    if (searchCode.trim() !== "") {
      const code = searchCode.toLowerCase().trim();
      const matchId = b.id.toLowerCase().includes(code);
      const matchName = b.guestInfo?.fullName?.toLowerCase().includes(code);
      const matchRoom = b.room?.title?.toLowerCase().includes(code);
      return matchId || matchName || matchRoom;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-24 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 mb-10 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
            GUEST DASHBOARD
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            My Reservations & Bookings
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            Manage your stay details, download digital receipts, or make changes to your upcoming luxury stay.
          </p>

          {/* Search Code & Tabs Bar */}
          <div className="pt-4 max-w-xl mx-auto space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Search by Booking Reference Code (e.g. VIR-984210) or Guest Name..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition shadow-inner"
              />
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`text-xs font-bold px-4 py-2 rounded-full transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Bookings ({savedBookings.length})
              </button>
              <button
                onClick={() => setActiveTab("confirmed")}
                className={`text-xs font-bold px-4 py-2 rounded-full transition cursor-pointer ${
                  activeTab === "confirmed"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Active & Confirmed ({savedBookings.filter((b) => b.status === "Confirmed").length})
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`text-xs font-bold px-4 py-2 rounded-full transition cursor-pointer ${
                  activeTab === "cancelled"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOOKINGS LIST */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const isCancelled = booking.status === "Cancelled";
            return (
              <div
                key={booking.id}
                className={`bg-white rounded-3xl p-6 border shadow-card transition-all space-y-6 ${
                  isCancelled
                    ? "border-slate-200 opacity-75"
                    : "border-slate-200/80 hover:shadow-luxury"
                }`}
              >
                {/* Booking Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                      #{booking.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isCancelled
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Room Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-4 md:col-span-2">
                    {booking.room.image ? (
                      <img
                        src={booking.room.image}
                        alt={booking.room.title}
                        className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl shrink-0">
                        <FaBed />
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                        {booking.room.category}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-slate-900">
                        {booking.room.title}
                      </h3>
                      <div className="text-xs text-slate-600 font-medium pt-1">
                        <strong>Check-In:</strong> {booking.checkIn} &nbsp;•&nbsp;{" "}
                        <strong>Check-Out:</strong> {booking.checkOut} ({booking.nights}{" "}
                        {booking.nights === 1 ? "night" : "nights"})
                      </div>
                    </div>
                  </div>

                  {/* Payment Total */}
                  <div className="text-left md:text-right border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                    <span className="text-xs text-slate-500 font-medium block">
                      Total Amount
                    </span>
                    <span className="font-serif text-2xl font-bold text-slate-900 block">
                      {formatPrice(booking.payment.totalAmount)}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      {booking.payment.status}
                    </span>
                  </div>
                </div>

                {/* Guest & Addons info */}
                <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div>
                    <strong className="text-slate-900 block mb-1 font-serif text-sm">
                      Guest Contact
                    </strong>
                    <p className="flex items-center gap-2">
                      <FaUser className="text-amber-600 text-xs" /> {booking.guestInfo.fullName}
                    </p>
                    <p className="flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-amber-600 text-xs" /> {booking.guestInfo.email}
                    </p>
                    <p className="flex items-center gap-2 mt-1">
                      <FaPhone className="text-amber-600 text-xs" /> {booking.guestInfo.phone}
                    </p>
                  </div>

                  <div>
                    <strong className="text-slate-900 block mb-1 font-serif text-sm">
                      Selected Concierge Add-ons
                    </strong>
                    {booking.addons && booking.addons.length > 0 ? (
                      <ul className="space-y-1">
                        {booking.addons.map((a, idx) => (
                          <li key={idx} className="flex justify-between text-slate-600">
                            <span>• {a.name}</span>
                            <span className="font-semibold">{formatPrice(a.total)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic">No add-ons selected.</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setReceiptBooking(booking)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition cursor-pointer"
                  >
                    <FaPrint />
                    <span>View Digital Receipt</span>
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold border border-rose-200 hover:border-rose-300 bg-rose-50/50 px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FaTimesCircle />
                      <span>Cancel Reservation</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto">
              <FaCalendarCheck />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              No Reservations Found
            </h3>
            <p className="text-xs text-slate-500">
              You haven't placed any room reservations yet or no bookings matched your lookup code.
            </p>
            <button
              onClick={() => navigate("/rooms")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer transition"
            >
              <FaBed />
              <span>Browse Available Rooms</span>
            </button>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {receiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative space-y-6">
            <button
              onClick={() => setReceiptBooking(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 text-xl"
            >
              <FaTimes />
            </button>

            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-lg bg-amber-600 text-white font-serif text-xl font-bold flex items-center justify-center mx-auto mb-2">
                V
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                VIRUSIA HOTEL & SUITES
              </h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                Official Booking Receipt
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold">Booking Ref:</span>
                <span className="font-mono font-extrabold text-amber-700">#{receiptBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guest Name:</span>
                <span className="font-bold text-slate-900">{receiptBooking.guestInfo.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Category:</span>
                <span className="font-bold text-slate-900">{receiptBooking.room.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-In / Out:</span>
                <span className="font-bold text-slate-900">{receiptBooking.checkIn} to {receiptBooking.checkOut} ({receiptBooking.nights} nights)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-900 font-serif">Total Amount Paid:</span>
                <span className="text-amber-700 font-serif">{formatPrice(receiptBooking.payment.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2"
              >
                <FaPrint /> Print Receipt
              </button>
              <button
                onClick={() => setReceiptBooking(null)}
                className="bg-slate-100 text-slate-700 font-bold text-xs px-6 py-3 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
