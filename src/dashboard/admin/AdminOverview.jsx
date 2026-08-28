import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaBed,
  FaDollarSign,
  FaUserPlus,
  FaCalendarPlus,
  FaSearch,
  FaSync,
  FaEye,
  FaTimes,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/formatMoney";
import { getAllRooms } from "../../services/room.service";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../services/booking.service";

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
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

const AdminOverview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("arrivals");
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchOverviewData = async () => {
    setIsLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        getAllRooms(),
        getAllBookings(),
      ]);

      setRooms(roomsRes.rooms || []);
      const fetchedBookings = bookingsRes.bookings || [];
      const sortedBookings = [...fetchedBookings].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load operational overview data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();

    const handleFocus = () => fetchOverviewData();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchOverviewData();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Operational metrics derived from live backend data
  const metrics = useMemo(() => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const availableRooms = rooms.filter((r) => r.status === "available").length;
    const cleaningRooms = rooms.filter((r) => r.status === "cleaning").length;
    const maintenanceRooms = rooms.filter(
      (r) => r.status === "maintenance",
    ).length;

    const occupancyRate =
      totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const arrivedCheckIns = bookings.filter(
      (b) => b.status === "checked-in",
    ).length;
    const pendingCheckIns = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "pending",
    ).length;
    const totalCheckIns = arrivedCheckIns + pendingCheckIns;

    const completedCheckOuts = bookings.filter(
      (b) => b.status === "checked-out",
    ).length;
    const pendingCheckOuts = arrivedCheckIns;
    const totalCheckOuts = completedCheckOuts + pendingCheckOuts;

    const totalRevenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      cleaningRooms,
      maintenanceRooms,
      occupancyRate,
      arrivedCheckIns,
      pendingCheckIns,
      totalCheckIns,
      completedCheckOuts,
      pendingCheckOuts,
      totalCheckOuts,
      totalRevenue,
    };
  }, [rooms, bookings]);

  // Tab filtering counts
  const arrivalsCount = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.status === "pending" ||
          b.status === "confirmed" ||
          b.status === "checked-in",
      ).length,
    [bookings],
  );

  const departuresCount = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === "checked-in" || b.status === "checked-out",
      ).length,
    [bookings],
  );

  const filteredSchedule = useMemo(() => {
    return bookings.filter((item) => {
      const isArrival =
        item.status === "pending" ||
        item.status === "confirmed" ||
        item.status === "checked-in";
      const isDeparture =
        item.status === "checked-in" || item.status === "checked-out";

      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "arrivals"
            ? isArrival
            : isDeparture;

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        item.fullName?.toLowerCase().includes(term) ||
        item.bookingCode?.toLowerCase().includes(term) ||
        item.roomNumber?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [bookings, activeTab, searchTerm]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setIsUpdating(true);
    try {
      await updateBookingStatus({
        bookingId: bookingId,
        status: newStatus,
      });
      toast.success(`Booking status updated to ${newStatus.toUpperCase()}`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
      }
      const roomsRes = await getAllRooms();
      setRooms(roomsRes.rooms || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const scrollToSchedule = () => {
    const el = document.getElementById("operational-schedule");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const nextStatuses = selectedBooking
    ? STATUS_FLOW[selectedBooking.status] || []
    : [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
              Frontdesk Operational Overview
            </span>
            <button
              onClick={fetchOverviewData}
              disabled={isLoading}
              title="Refresh operational data"
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              <FaSync
                className={`text-xs ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif mt-3">
            Welcome back, Frontdesk Team 👋
          </h1>
          <p className="text-amber-100/80 text-sm mt-2">
            Here is your daily operational summary for Virusia Hotel & Suites.
            Today's occupancy is at{" "}
            <strong className="text-amber-300">
              {isLoading ? "..." : `${metrics.occupancyRate}% capacity`}
            </strong>
            .
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={scrollToSchedule}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <FaUserPlus />
              <span>Manage Daily Check-ins</span>
            </button>
            <button
              onClick={() => navigate("/admin/rooms")}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <FaCalendarPlus />
              <span>New Walk-in Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Check-ins"
          value={isLoading ? "..." : `${metrics.totalCheckIns} Guests`}
          isPositive={true}
          icon={FaSignInAlt}
          color="amber"
          subtitle={
            isLoading
              ? "Loading..."
              : `${metrics.arrivedCheckIns} arrived • ${metrics.pendingCheckIns} pending`
          }
        />
        <StatCard
          title="Today's Check-outs"
          value={isLoading ? "..." : `${metrics.totalCheckOuts} Guests`}
          isPositive={true}
          icon={FaSignOutAlt}
          color="blue"
          subtitle={
            isLoading
              ? "Loading..."
              : `${metrics.completedCheckOuts} completed • ${metrics.pendingCheckOuts} pending`
          }
        />
        <StatCard
          title="Occupancy Rate"
          value={isLoading ? "..." : `${metrics.occupancyRate}%`}
          isPositive={metrics.occupancyRate > 50}
          icon={FaBed}
          color="emerald"
          subtitle={
            isLoading
              ? "Loading..."
              : `${metrics.occupiedRooms} of ${metrics.totalRooms} rooms filled`
          }
        />
        <StatCard
          title="Available Rooms"
          value={isLoading ? "..." : `${metrics.availableRooms}`}
          isPositive={metrics.availableRooms > 0}
          icon={FaBed}
          color="purple"
          subtitle={
            isLoading
              ? "Loading..."
              : `${metrics.cleaningRooms} cleaning • ${metrics.maintenanceRooms} maintenance`
          }
        />
      </div>

      {/* Main Operational Schedule Table */}
      <div
        id="operational-schedule"
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Daily Operational Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Manage guest arrivals, departures, and active room keys.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab("arrivals")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === "arrivals"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Arrivals ({isLoading ? "..." : arrivalsCount})
            </button>
            <button
              onClick={() => setActiveTab("departures")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === "departures"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Departures ({isLoading ? "..." : departuresCount})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              All ({isLoading ? "..." : bookings.length})
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
            placeholder="Search by guest name, room number, email, or booking code..."
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
                <th className="py-3 px-4">Room Number</th>
                <th className="py-3 px-4">Schedule Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredSchedule.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-slate-400 font-medium"
                  >
                    No bookings found matching your search or active filter.
                  </td>
                </tr>
              ) : (
                filteredSchedule.map((row) => {
                  const isArrivalState =
                    row.status === "pending" || row.status === "confirmed";
                  const isCheckedInState = row.status === "checked-in";

                  return (
                    <tr
                      key={row._id}
                      onClick={() => setSelectedBooking(row)}
                      className="hover:bg-amber-50/30 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {row.bookingCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">
                          {row.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {row.email}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        Room {row.roomNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                          {formatDateTime(
                            row.bookedCheckIn || row.bookedCheckOut,
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isArrivalState && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(row._id, "checked-in")
                              }
                              className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg text-[11px] transition cursor-pointer disabled:opacity-50"
                            >
                              Complete Check-in
                            </button>
                          )}
                          {isCheckedInState && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(row._id, "checked-out")
                              }
                              className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-lg text-[11px] transition cursor-pointer disabled:opacity-50"
                            >
                              Check-out Guest
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedBooking(row)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="View Details"
                          >
                            <FaEye className="text-xs" />
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
      </div>

      {/* Booking Details Modal */}
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
                Booking Operational Details
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

              {/* Status Update Options */}
              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">
                  Update Status:
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
                        className={`py-2 font-bold rounded-xl text-[11px] cursor-pointer transition disabled:opacity-50 ${STATUS_ACTIONS[target].classes}`}
                      >
                        {STATUS_ACTIONS[target].label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">
                    This booking is in a final state.
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;

