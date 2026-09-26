import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import BookingDetailsModal from "../components/BookingDetailsModal";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaBed,
  FaUserPlus,
  FaCalendarPlus,
  FaSearch,
  FaSync,
  FaEye,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllRooms } from "../../services/room.service";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../services/booking.service";
import { getErrorMessage } from "../../utils/apiError";
import { toHotelISODate, todayISO } from "../../utils/dates";

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

const TABS = [
  { id: "arrivals", label: "Arrivals" },
  { id: "departures", label: "Departures" },
  { id: "overdue", label: "Overdue" },
  { id: "inhouse", label: "In-house" },
  { id: "upcoming", label: "Upcoming" },
  { id: "all", label: "All" },
];

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
      toast.error(
        getErrorMessage(error, "Failed to load operational overview data"),
      );
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

  // ---------------------------------------------------------------------
  // Bookings can now be for FUTURE dates, so the front-desk views are
  // date-aware. "Today" means today at the hotel.
  //   due arrival   = pending/confirmed and check-in date is today or earlier
  //   upcoming      = pending/confirmed and check-in date is after today
  //   due departure = checked-in and booked check-out date is today or earlier
  //   overdue       = set automatically by the backend once a checked-in
  //                   guest is more than 20 minutes past their booked
  //                   check-out time and still hasn't checked out
  // ---------------------------------------------------------------------
  const buckets = useMemo(() => {
    const today = todayISO();
    const dateOf = toHotelISODate;

    const notArrived = (b) =>
      b.status === "pending" || b.status === "confirmed";

    const dueArrivals = bookings.filter(
      (b) => notArrived(b) && dateOf(b.bookedCheckIn) <= today,
    );
    const upcoming = bookings.filter(
      (b) => notArrived(b) && dateOf(b.bookedCheckIn) > today,
    );
    const arrivedToday = bookings.filter(
      (b) =>
        (b.status === "checked-in" ||
          b.status === "checked-out" ||
          b.status === "overdue") &&
        dateOf(b.actualCheckIn) === today,
    );
    const inHouse = bookings.filter((b) => b.status === "checked-in");
    const overdue = bookings.filter((b) => b.status === "overdue");
    const dueDepartures = inHouse.filter(
      (b) => b.bookedCheckOut && dateOf(b.bookedCheckOut) <= today,
    );
    const departedToday = bookings.filter(
      (b) => b.status === "checked-out" && dateOf(b.actualCheckOut) === today,
    );

    return {
      dueArrivals,
      upcoming,
      arrivedToday,
      inHouse,
      overdue,
      dueDepartures,
      departedToday,
    };
  }, [bookings]);

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

    const arrivedCheckIns = buckets.arrivedToday.length;
    const pendingCheckIns = buckets.dueArrivals.length;
    const completedCheckOuts = buckets.departedToday.length;
    const pendingCheckOuts = buckets.dueDepartures.length;
    const overdueCount = buckets.overdue.length;

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      cleaningRooms,
      maintenanceRooms,
      occupancyRate,
      arrivedCheckIns,
      pendingCheckIns,
      totalCheckIns: arrivedCheckIns + pendingCheckIns,
      completedCheckOuts,
      pendingCheckOuts,
      totalCheckOuts: completedCheckOuts + pendingCheckOuts,
      overdueCount,
    };
  }, [rooms, buckets]);

  const tabRows = useMemo(
    () => ({
      // Departures includes overdue guests too — they still need to check
      // out, they've just gone past the "due" moment without moving there.
      arrivals: [...buckets.dueArrivals, ...buckets.arrivedToday],
      departures: [
        ...buckets.dueDepartures,
        ...buckets.overdue,
        ...buckets.departedToday,
      ],
      overdue: buckets.overdue,
      inhouse: buckets.inHouse,
      upcoming: buckets.upcoming,
      all: bookings,
    }),
    [buckets, bookings],
  );

  const filteredSchedule = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (tabRows[activeTab] || []).filter(
      (item) =>
        term === "" ||
        item.fullName?.toLowerCase().includes(term) ||
        item.bookingCode?.toLowerCase().includes(term) ||
        item.roomNumber?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term),
    );
  }, [tabRows, activeTab, searchTerm]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await updateBookingStatus({
        bookingId,
        status: newStatus,
      });
      toast.success(`Booking status updated to ${newStatus.toUpperCase()}`);

      // Use what the server returns (actual check-in time, recalculated
      // per-hour check-out) instead of only patching the status locally
      const updated = response.booking || { status: newStatus };
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, ...updated } : b)),
      );
      setSelectedBooking((prev) =>
        prev && prev._id === bookingId ? { ...prev, ...updated } : prev,
      );

      // Check-in / check-out change the room's status, so refresh the rooms too
      const roomsRes = await getAllRooms();
      setRooms(roomsRes.rooms || []);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to update status"));
    } finally {
      setIsUpdating(false);
    }
  };

  const scrollToSchedule = () => {
    const el = document.getElementById("operational-schedule");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const viewOverdueBookings = () => {
    setActiveTab("overdue");
    setSearchTerm("");
    scrollToSchedule();
  };

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

      {/* Overdue alert — only shown when there's actually something to act on */}
      {!isLoading && metrics.overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg shrink-0">
              <FaExclamationTriangle />
            </div>
            <div>
              <p className="font-bold text-red-800 text-sm">
                {metrics.overdueCount} guest
                {metrics.overdueCount === 1 ? "" : "s"} overdue for check-out
              </p>
              <p className="text-xs text-red-600/80 mt-0.5">
                More than 20 minutes past their booked check-out time and still
                haven't checked out.
              </p>
            </div>
          </div>
          <button
            onClick={viewOverdueBookings}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0"
          >
            View overdue bookings
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
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
          title="Overdue Check-outs"
          value={isLoading ? "..." : `${metrics.overdueCount}`}
          isPositive={metrics.overdueCount === 0}
          icon={FaExclamationTriangle}
          color="red"
          subtitle={
            isLoading
              ? "Loading..."
              : metrics.overdueCount > 0
                ? "Needs follow-up now"
                : "All guests on schedule"
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
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Daily Operational Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Manage guest arrivals, departures, and active room keys.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold text-slate-600 overflow-x-auto">
            {TABS.map((tab) => {
              const count = isLoading ? "..." : tabRows[tab.id].length;
              const isOverdueTab = tab.id === "overdue";
              const flagged = isOverdueTab && !isLoading && count > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? flagged
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-white text-amber-700 shadow-xs"
                      : flagged
                        ? "text-red-700 hover:text-red-900"
                        : "hover:text-slate-900"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
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

        {activeTab === "overdue" &&
          !isLoading &&
          filteredSchedule.length === 0 && (
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
              No overdue guests right now — everyone is on schedule.
            </p>
          )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Room Number</th>
                <th className="py-3 px-4">
                  {activeTab === "departures" || activeTab === "overdue"
                    ? "Check-out Time"
                    : "Check-in Time"}
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && bookings.length === 0 ? (
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
                filteredSchedule.map((row) => (
                  <tr
                    key={row._id}
                    onClick={() => setSelectedBooking(row)}
                    className={`transition cursor-pointer ${
                      row.status === "overdue"
                        ? "bg-red-50/60 hover:bg-red-50"
                        : "hover:bg-amber-50/30"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {row.bookingCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">
                        {row.fullName}
                      </p>
                      <p className="text-[10px] text-slate-400">{row.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                      Room {row.roomNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] whitespace-nowrap ${
                          row.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatDateTime(
                          activeTab === "departures" || activeTab === "overdue"
                            ? row.bookedCheckOut
                            : row.bookedCheckIn || row.bookedCheckOut,
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
                        {/* An online booking must be confirmed before check-in */}
                        {row.status === "pending" && (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(row._id, "confirmed")
                            }
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg text-[11px] transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                          >
                            Confirm
                          </button>
                        )}
                        {row.status === "confirmed" && (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(row._id, "checked-in")
                            }
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-lg text-[11px] transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                          >
                            Complete Check-in
                          </button>
                        )}
                        {(row.status === "checked-in" ||
                          row.status === "overdue") && (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(row._id, "checked-out")
                            }
                            className={`font-bold px-3 py-1 rounded-lg text-[11px] transition cursor-pointer disabled:opacity-50 whitespace-nowrap ${
                              row.status === "overdue"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-sky-50 hover:bg-sky-100 text-sky-800"
                            }`}
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
        title="Booking Operational Details"
        statusHeading="Update Status:"
      />
    </div>
  );
};

export default AdminOverview;
