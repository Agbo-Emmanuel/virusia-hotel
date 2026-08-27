import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  FaSearch,
  FaEye,
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaDownload,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaBed,
  FaSync,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/formatMoney";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../services/booking.service";
import { useNavigate } from "react-router-dom";

// Defines which status each booking is allowed to move to next.
// Cancelled and check-out are terminal states — no further updates.
const STATUS_FLOW = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checked-in"],
  "checked-in": ["checked-out"],
  "checked-out": [],
  cancelled: [],
};

const STATUS_ACTIONS = {
  confirmed: {
    label: "Confirm Booking",
    classes: "bg-emerald-50 hover:bg-emerald-100 text-emerald-800",
  },
  cancelled: {
    label: "Cancel Booking",
    classes: "bg-red-50 hover:bg-red-100 text-red-800",
  },
  "checked-in": {
    label: "Check In Guest",
    classes: "bg-sky-50 hover:bg-sky-100 text-sky-800",
  },
  "checked-out": {
    label: "Check Out Guest",
    classes: "bg-slate-100 hover:bg-slate-200 text-slate-800",
  },
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

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
      toast.error("Failed to load bookings");
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
      const payload = {
        bookingId: bookingId,
        status: newStatus,
      };
      await updateBookingStatus(payload);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
      setSelectedBooking((prev) =>
        prev && prev._id === bookingId ? { ...prev, status: newStatus } : prev,
      );
      toast.success(`Booking updated to ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update booking status");
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatuses = selectedBooking
    ? STATUS_FLOW[selectedBooking.status] || []
    : [];

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
              {isLoading ? (
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
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {b.bookingCode}
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
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative animate-scale-up max-h-[90vh] overflow-y-auto"
          >
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
                Reservation {selectedBooking.bookingCode}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <p className="font-bold text-slate-900 text-sm">
                  {selectedBooking.fullName}
                </p>
                <p className="text-slate-600 flex items-center gap-2">
                  <FaEnvelope className="text-slate-400" />
                  {selectedBooking.email}
                </p>
                <p className="text-slate-600 flex items-center gap-2">
                  <FaPhoneAlt className="text-slate-400" />
                  {selectedBooking.phoneNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-800 font-bold uppercase">
                    Assigned Room
                  </p>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <FaBed className="text-amber-600 text-[10px]" />
                    Room {selectedBooking.roomNumber}
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

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Booked Check-In
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {formatDateTime(selectedBooking.bookedCheckIn)}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Booked Check-Out
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {formatDateTime(selectedBooking.bookedCheckOut)}
                  </p>
                </div>
              </div>

              {(selectedBooking.actualCheckIn ||
                selectedBooking.actualCheckOut) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      Actual Check-In
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDateTime(selectedBooking.actualCheckIn)}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      Actual Check-Out
                    </p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDateTime(selectedBooking.actualCheckOut)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500 font-semibold">
                  <FaClock className="text-slate-400" />
                  Booking Type
                </span>
                <span className="font-bold text-slate-800 capitalize">
                  {selectedBooking.bookingType?.replace("-", " ")}
                  {selectedBooking.bookingType === "per-hour" &&
                    selectedBooking.numberOfHours &&
                    ` · ${selectedBooking.numberOfHours}h`}
                </span>
              </div>

              {/* Status Update — options depend on the current status */}
              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">
                  Change Reservation Status:
                </p>
                {nextStatuses.length > 0 ? (
                  <div
                    className={`grid gap-2 ${
                      nextStatuses.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {nextStatuses.map((target) => (
                      <button
                        key={target}
                        disabled={isUpdating}
                        onClick={() =>
                          handleStatusChange(selectedBooking._id, target)
                        }
                        className={`py-2 font-bold rounded-xl text-[11px] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed ${STATUS_ACTIONS[target].classes}`}
                      >
                        {STATUS_ACTIONS[target].label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">
                    This booking is in a final state — no further status updates
                    are available.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Total Cost
                </p>
                <p className="text-lg font-extrabold text-slate-900">
                  {formatPrice(selectedBooking.amount)}
                </p>
              </div>
              {/* <button
                onClick={() => {
                  toast.success(
                    `Printed Guest Receipt for ${selectedBooking.bookingCode}`,
                  );
                  setSelectedBooking(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <FaDownload />
                <span>Print Receipt</span>
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
