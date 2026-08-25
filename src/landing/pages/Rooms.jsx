import React, { useMemo } from "react";
import { useBooking } from "../../context/BookingContext";
import { ROOMS_DATA, ROOM_CATEGORIES } from "../../data/rooms";
import RoomCard from "../components/RoomCard";
import RoomFilter from "../components/RoomFilter";
import { FaSlidersH, FaSearch, FaTimes, FaUndo } from "react-icons/fa";

const Rooms = () => {
  const { filters, setFilters, resetFilters } = useBooking();

  // Filter & Sort rooms dynamically
  const filteredRooms = useMemo(() => {
    return ROOMS_DATA.filter((room) => {
      // 1. Search Query Filter
      if (filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = room.title.toLowerCase().includes(query);
        const matchesDesc = room.description.toLowerCase().includes(query);
        const matchesTagline = room.tagline.toLowerCase().includes(query);
        const matchesCategory = room.category.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesTagline && !matchesCategory) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.category !== "all" && room.category !== filters.category) {
        return false;
      }

      // 3. Price Filter
      if (room.price > filters.maxPrice) {
        return false;
      }

      // 4. Guest Capacity Filter
      const totalRequestedGuests = (filters.adults || 1) + (filters.children || 0);
      if (room.capacity.maxGuests < totalRequestedGuests) {
        return false;
      }

      // 5. Amenities Multi-select Filter
      if (filters.selectedAmenities.length > 0) {
        const hasAllSelected = filters.selectedAmenities.every((amenityId) =>
          room.amenities.includes(amenityId)
        );
        if (!hasAllSelected) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort logic
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      // Recommended default
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-24 pb-20">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 mb-10 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
            VIRUSIA HOTEL ACCOMMODATIONS
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            Rooms & Luxury Suites
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            Explore our curated collection of oceanfront rooms, executive business suites, and penthouse residences.
          </p>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {ROOM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, category: cat.id }))
                }
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  filters.category === cat.id
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID (Sidebar Filter + Rooms Cards Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTER */}
          <div className="lg:col-span-1">
            <RoomFilter isSidebar={true} />
          </div>

          {/* ROOMS LISTING AREA */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Stats & Sorting Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-bold text-slate-700">
                Showing <span className="text-amber-700 text-sm font-serif">{filteredRooms.length}</span> of{" "}
                {ROOMS_DATA.length} Available Rooms
              </div>

              {/* Active Filters Indicators */}
              {(filters.searchQuery ||
                filters.category !== "all" ||
                filters.selectedAmenities.length > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  {filters.searchQuery && (
                    <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                      "{filters.searchQuery}"
                      <FaTimes
                        className="cursor-pointer hover:text-amber-900"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, searchQuery: "" }))
                        }
                      />
                    </span>
                  )}
                  {filters.selectedAmenities.length > 0 && (
                    <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                      {filters.selectedAmenities.length} Amenities Filtered
                    </span>
                  )}
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-slate-500 hover:text-amber-600 underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* ROOM CARDS GRID OR EMPTY STATE */}
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
                  <FaSearch />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  No Rooms Matched Your Search
                </h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your price range, date range, or clear selected amenity filters to view available suites.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer transition"
                >
                  <FaUndo />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
