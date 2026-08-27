import { useState, useMemo, useEffect } from "react";
import RoomCard from "../components/RoomCard";
import BookingModal from "../components/BookingModal";
import StatusBadge from "../../dashboard/components/StatusBadge";
import {
  FaSearch,
  FaThLarge,
  FaList,
  FaUsers,
  FaMoon,
  FaClock,
  FaCalendarPlus,
  FaTimes,
  FaUndo,
  FaBed,
  FaFilter,
  FaHotel,
} from "react-icons/fa";
import { getAllRooms } from "../../services/room.service";
import { formatPrice } from "../../utils/formatMoney";
import { toast } from "react-toastify";

const currency = (val) => (typeof val === "number" ? formatPrice(val) : val ?? "—");

const Rooms = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingRoom, setSelectedBookingRoom] = useState(null);

  const fetchAllRooms = async () => {
    setIsLoading(true);
    try {
      const response = await getAllRooms();
      setRooms(response.rooms || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load rooms from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  // Dynamic Category Options derived from API rooms
  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(rooms.map((r) => r.roomType))).filter(
      Boolean,
    );
    return [
      { id: "all", label: "All Room Types" },
      ...unique.map((type) => ({
        id: type,
        label: type.charAt(0).toUpperCase() + type.slice(1) + " Suite",
      })),
    ];
  }, [rooms]);

  // Operational Statistics summary
  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.status === "available").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const cleaning = rooms.filter((r) => r.status === "cleaning").length;
    const maintenance = rooms.filter((r) => r.status === "maintenance").length;
    return { total, available, occupied, cleaning, maintenance };
  }, [rooms]);

  // Filtered rooms logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      // 1. Status Filter
      const matchesStatus =
        selectedStatus === "all" ? true : r.status === selectedStatus;

      // 2. Category / Room Type Filter
      const matchesCategory =
        selectedCategory === "all" ? true : r.roomType === selectedCategory;

      // 3. Search Term (roomNumber or roomType)
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        r.roomNumber?.toLowerCase().includes(term) ||
        r.roomType?.toLowerCase().includes(term);

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [rooms, selectedStatus, selectedCategory, searchTerm]);

  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedCategory("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-24 pb-20">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 mb-8 shadow-xs">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
            <FaHotel className="text-amber-600" />
            <span>VIRUSIA HOTEL & SUITES</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            Accommodations & Luxury Suites
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Discover our exquisite oceanfront rooms, executive business suites, and penthouse residences. Book your stay seamlessly by night or by hour.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* STATS & FILTER HEADER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs font-bold text-slate-600">
            {[
              { id: "all", label: `All (${stats.total})` },
              { id: "available", label: `Available (${stats.available})` },
              { id: "occupied", label: `Occupied (${stats.occupied})` },
              { id: "cleaning", label: `Cleaning (${stats.cleaning})` },
              { id: "maintenance", label: `Maintenance (${stats.maintenance})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  selectedStatus === tab.id
                    ? "bg-amber-600 text-white shadow-xs"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls: Search, Category & View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Room Type Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-amber-500 outline-none transition cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search room # or type..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 outline-none transition"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <FaThLarge />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="List View"
              >
                <FaList />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE FILTERS & COUNT */}
        {(selectedStatus !== "all" || selectedCategory !== "all" || searchTerm) && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Active filters:</span>
            {selectedStatus !== "all" && (
              <span className="bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200 capitalize">
                Status: {selectedStatus}
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200 capitalize">
                Type: {selectedCategory}
              </span>
            )}
            {searchTerm && (
              <span className="bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                "{searchTerm}"
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-amber-700 font-bold hover:underline cursor-pointer ml-2"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-pulse"
              >
                <div className="h-48 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
              <FaSearch />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              No Rooms Matched Your Search
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any rooms matching your current status or room type filter. Try adjusting your search parameters.
            </p>
            <button
              onClick={resetFilters}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer transition"
            >
              <FaUndo />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onBookNow={(r) => setSelectedBookingRoom(r)}
              />
            ))}
          </div>
        ) : (
          /* LIST VIEW TABLE */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Room</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Guests</th>
                    <th className="py-3.5 px-4">Per Night</th>
                    <th className="py-3.5 px-4">Per Hour</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRooms.map((r) => (
                    <tr key={r._id} className="hover:bg-amber-50/20 transition">
                      <td className="py-4 px-4 font-extrabold text-slate-900">
                        <div className="flex items-center gap-3">
                          {r.images?.[0] ? (
                            <img
                              src={r.images[0]}
                              alt={`Room ${r.roomNumber}`}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                              <FaBed className="text-base" />
                            </div>
                          )}
                          <div>
                            <span className="block font-serif text-sm font-bold text-slate-900">
                              Room {r.roomNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{r._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-800 capitalize">
                          {r.roomType}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-amber-600 text-xs" />
                          Up to {r.numberOfGuest} Guests
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {currency(r.pricePerNight)}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {currency(r.pricePerHour)}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedBookingRoom(r)}
                          disabled={r.status !== "available"}
                          title={
                            r.status !== "available"
                              ? `Room is ${r.status}`
                              : "Book this room now"
                          }
                          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition cursor-pointer inline-flex items-center gap-1.5 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xs"
                        >
                          <FaCalendarPlus className="text-[11px]" />
                          <span>{r.status === "available" ? "Book Now" : "Unavailable"}</span>
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

      {/* Customer Booking Modal Popup */}
      <BookingModal
        room={selectedBookingRoom}
        isOpen={!!selectedBookingRoom}
        onClose={() => setSelectedBookingRoom(null)}
        onSuccess={fetchAllRooms}
      />
    </div>
  );
};

export default Rooms;
