import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import BookingDetailsModal from "../components/BookingDetailsModal";
import {
  FaSearch,
  FaEye,
  FaCalendarAlt,
  FaPlus,
  FaSync,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/formatMoney";
import { getErrorMessage } from "../../utils/apiError";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../services/booking.service";
import { useNavigate } from "react-router-dom";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const guestsShort = (b) => {
  if (!Number.isFinite(b.adults)) return null; // older bookings have no guest counts
  const children = b.children || 0;
  return `${b.adults} adult${b.adults === 1 ? "" : "s"}${
    children > 0 ? ` · ${children} child${children === 1 ? "" : "ren"}` : ""
  }`;
};

const AdminBookings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAllBookings = async () => {
    setIsLoading(true);
    try {
      const response = await getAllBookings();
      const fetched = response.bookings || [];

      // Newest bookings first, so anything just created (e.g. from the
      // "New Manual Reservation" walk-in flow) shows up at the top
      // instead of needing to be hunted for further down the list.
      const sorted = [...fetched].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setBookings(sorted);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, "Failed to load bookings"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();

    // Refetch whenever the admin comes back to this tab/window — covers
    // the common case of creating a booking on the Rooms page in another
    // tab (or navigating back to this one) and expecting the list to
    // already be current, without a manual refresh.
    const handleFocus = () => fetchAllBookings();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchAllBookings();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      selectedStatus === "all" ? true : b.status === selectedStatus;

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      b.bookingCode?.toLowerCase().includes(term) ||
      b.fullName?.toLowerCase().includes(term) ||
      b.email?.toLowerCase().includes(term) ||
      b.roomNumber?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await updateBookingStatus({
        bookingId,
        status: newStatus,
      });
      // Use what the server returns (e.g. actual check-in time, recalculated
      // per-hour check-out) instead of only patching the status locally
      const updated = response.booking || { status: newStatus };
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, ...updated } : b)),
      );
      setSelectedBooking((prev) =>
        prev && prev._id === bookingId ? { ...prev, ...updated } : prev,
      );
      toast.success(`Booking updated to ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, "Failed to update booking status"));
    } finally {
      setIsUpdating(false);
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

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchAllBookings}
            disabled={isLoading}
            title="Refresh bookings"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSync className={`text-xs ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => navigate("/admin/rooms")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <FaPlus />
            <span>New Manual Reservation</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold text-slate-600">
          {[
            { id: "all", label: "All Bookings" },
            { id: "pending", label: "Pending" },
            { id: "confirmed", label: "Confirmed" },
            { id: "checked-in", label: "Checked In" },
            { id: "checked-out", label: "Checked Out" },
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
            placeholder="Search by code, guest, email, or room..."
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
                <th className="py-3.5 px-4">Booking Code</th>
                <th className="py-3.5 px-4">Guest Information</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Check In - Out</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && bookings.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4" colSpan={7}>
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 px-4 text-center text-slate-400"
                  >
                    No bookings match your current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr
                    key={b._id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-amber-50/20 transition cursor-pointer"
                  >
                    <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {b.bookingCode}
                      {b.source && (
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                          {b.source === "front-desk" ? "Front desk" : "Website"}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{b.fullName}</p>
                      <p className="text-[11px] text-slate-400">{b.email}</p>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">
                      Room {b.roomNumber}
                      {b.bookingType === "per-hour" && b.numberOfHours && (
                        <p className="text-[11px] text-slate-400 font-normal">
                          {b.numberOfHours}h stay
                        </p>
                      )}
                      {guestsShort(b) && (
                        <p className="text-[11px] text-slate-400 font-normal flex items-center gap-1 whitespace-nowrap">
                          <FaUsers className="text-[9px]" />
                          {guestsShort(b)}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-medium text-slate-700 whitespace-nowrap">
                        <FaCalendarAlt className="text-amber-600 text-[10px]" />
                        <span>
                          {formatDate(b.bookedCheckIn)} →{" "}
                          {formatDate(b.bookedCheckOut)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">
                        {formatPrice(b.amount)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="p-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-lg transition cursor-pointer"
                        title="View Details"
                      >
                        <FaEye className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
        title="Booking Details"
        statusHeading="Change Reservation Status:"
      />
    </div>
  );
};

export default AdminBookings;
