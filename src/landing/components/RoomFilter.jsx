import React from "react";
import { useBooking } from "../../context/BookingContext";
import { ROOM_CATEGORIES, AMENITIES_LIST } from "../../data/rooms";
import {
  FaSearch,
  FaSlidersH,
  FaCalendarAlt,
  FaUserFriends,
  FaDollarSign,
  FaUndo,
  FaFilter,
} from "react-icons/fa";

const RoomFilter = ({ isSidebar = false }) => {
  const { filters, setFilters, resetFilters, formatPrice } = useBooking();

  const handleAmenityToggle = (amenityId) => {
    setFilters((prev) => {
      const exists = prev.selectedAmenities.includes(amenityId);
      const updated = exists
        ? prev.selectedAmenities.filter((id) => id !== amenityId)
        : [...prev.selectedAmenities, amenityId];
      return { ...prev, selectedAmenities: updated };
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-6 ${
        isSidebar ? "sticky top-24" : ""
      }`}
    >
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
          <FaFilter className="text-amber-600 text-base" />
          <span>Filter Rooms</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <FaUndo className="text-[10px]" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Search Input Keyword */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Search Keyword
        </label>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="e.g. Deluxe, Suite, Ocean view..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Dates Selection */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Check-In
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, checkIn: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Check-Out
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, checkOut: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Room Category Tabs / Select */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Room Category
        </label>
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition"
        >
          {ROOM_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Guests Counter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Guests Capacity
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="font-semibold text-slate-700">Adults</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    adults: Math.max(1, prev.adults - 1),
                  }))
                }
                className="w-6 h-6 rounded-md bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
              >
                -
              </button>
              <span className="font-bold text-slate-900 w-4 text-center">
                {filters.adults}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    adults: prev.adults + 1,
                  }))
                }
                className="w-6 h-6 rounded-md bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="font-semibold text-slate-700">Children</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    children: Math.max(0, prev.children - 1),
                  }))
                }
                className="w-6 h-6 rounded-md bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
              >
                -
              </button>
              <span className="font-bold text-slate-900 w-4 text-center">
                {filters.children}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    children: prev.children + 1,
                  }))
                }
                className="w-6 h-6 rounded-md bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-amber-500 hover:text-white transition"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div>
        <div className="flex justify-between items-center text-xs mb-2">
          <label className="font-bold text-slate-700 uppercase tracking-wider">
            Max Price / Night
          </label>
          <span className="font-bold text-amber-700 text-sm">
            {formatPrice(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>$100</span>
          <span>$750</span>
          <span>$1,500+</span>
        </div>
      </div>

      {/* Amenities Multi-select Checkboxes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Room Amenities
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {AMENITIES_LIST.map((amenity) => {
            const checked = filters.selectedAmenities.includes(amenity.id);
            return (
              <label
                key={amenity.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleAmenityToggle(amenity.id)}
                  className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span>{amenity.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Results By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
          }
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition"
        >
          <option value="recommended">Featured & Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Guest Rating: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default RoomFilter;
