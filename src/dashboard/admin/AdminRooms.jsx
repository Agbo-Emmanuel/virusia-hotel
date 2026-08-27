import React, { useEffect, useMemo, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  FaSearch,
  FaThLarge,
  FaList,
  FaUsers,
  FaMoon,
  FaClock,
  FaCalendarPlus,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaHourglassHalf,
  FaCalendarAlt,
  FaCalculator,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllRooms } from "../../services/room.service";
import { createBooking } from "../../services/booking.service";

const currency = (value) =>
  typeof value === "number" ? `₦${value.toLocaleString()}` : (value ?? "—");

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phoneNumber: "",
  bookingType: "per-night",
  bookedCheckIn: "",
  bookedCheckOut: "",
  numberOfHours: "",
};

const AdminRooms = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAllRooms = async () => {
    setIsLoading(true);
    try {
      const response = await getAllRooms();
      setRooms(response.rooms || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  // Categories are derived from whatever room types actually come back,
  // instead of being hardcoded, since the API is the source of truth.
  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(rooms.map((r) => r.roomType))).filter(
      Boolean,
    );
    return [
      { id: "all", label: "All Types" },
      ...unique.map((type) => ({
        id: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      })),
    ];
  }, [rooms]);

  const filteredRooms = rooms.filter((r) => {
    const matchesStatus =
      selectedStatus === "all" ? true : r.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" ? true : r.roomType === selectedCategory;

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      r.roomNumber?.toLowerCase().includes(term) ||
      r.roomType?.toLowerCase().includes(term);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // --- Walk-in booking flow -----------------------------------------

  const openBookingModal = (room) => {
    setBookingRoom(room);
    setBookingForm(EMPTY_FORM);
  };

  const closeBookingModal = () => {
    setBookingRoom(null);
    setBookingForm(EMPTY_FORM);
  };

  const handleFormChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingTypeChange = (type) => {
    setBookingForm((prev) => ({
      ...prev,
      bookingType: type,
      // Reset the fields that don't apply to the newly selected type.
      bookedCheckOut: type === "per-hour" ? "" : prev.bookedCheckOut,
      numberOfHours: type === "per-night" ? "" : prev.numberOfHours,
    }));
  };

  // Nights are calculated from the selected check-in/check-out dates —
  // rounded up so a partial day still counts as a full night.
  const nightsCount = useMemo(() => {
    if (bookingForm.bookingType !== "per-night") return 0;
    if (!bookingForm.bookedCheckIn || !bookingForm.bookedCheckOut) return 0;
    const start = new Date(bookingForm.bookedCheckIn);
    const end = new Date(bookingForm.bookedCheckOut);
    const diffMs = end - start;
    if (diffMs <= 0) return 0;
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }, [
    bookingForm.bookingType,
    bookingForm.bookedCheckIn,
    bookingForm.bookedCheckOut,
  ]);

  const hoursCount = useMemo(() => {
    if (bookingForm.bookingType !== "per-hour") return 0;
    const n = Number(bookingForm.numberOfHours);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [bookingForm.bookingType, bookingForm.numberOfHours]);

  // The amount is always derived from the room's rate — never typed in —
  // so it can't drift from what the room actually charges.
  const calculatedAmount = useMemo(() => {
    if (!bookingRoom) return 0;
    if (bookingForm.bookingType === "per-night") {
      return nightsCount * (bookingRoom.pricePerNight || 0);
    }
    return hoursCount * (bookingRoom.pricePerHour || 0);
  }, [bookingForm.bookingType, nightsCount, hoursCount, bookingRoom]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingRoom) return;

    const { fullName, email, phoneNumber, bookingType, bookedCheckIn } =
      bookingForm;

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      toast.error("Please fill in the guest's full name, email, and phone.");
      return;
    }
    if (!bookedCheckIn) {
      toast.error("Please select a check-in date & time.");
      return;
    }
    if (bookingType === "per-night" && !bookingForm.bookedCheckOut) {
      toast.error("Please select a check-out date & time.");
      return;
    }
    if (bookingType === "per-night" && nightsCount === 0) {
      toast.error("Check-out must be after check-in.");
      return;
    }
    if (bookingType === "per-hour" && !bookingForm.numberOfHours) {
      toast.error("Please enter the number of hours.");
      return;
    }
    if (calculatedAmount <= 0) {
      toast.error("Could not calculate an amount for this booking.");
      return;
    }

    const payload = {
      bookingType,
      roomID: bookingRoom._id,
      roomNumber: bookingRoom.roomNumber,
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      amount: calculatedAmount,
      bookedCheckIn: new Date(bookedCheckIn).toISOString(),
      bookedCheckOut:
        bookingType === "per-night" && bookingForm.bookedCheckOut
          ? new Date(bookingForm.bookedCheckOut).toISOString()
          : null,
      numberOfHours:
        bookingType === "per-hour" ? Number(bookingForm.numberOfHours) : null,
    };

    setIsSubmitting(true);
    try {
      await createBooking(payload);
      toast.success(`Room ${bookingRoom.roomNumber} booked for ${fullName}`);
      closeBookingModal();
      fetchAllRooms();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Room Operational Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time room occupancy, housekeeping, and maintenance status
            tracking.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-600"
            }`}
          >
            <FaThLarge />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-600"
            }`}
          >
            <FaList />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs font-bold text-slate-600">
          {[
            { id: "all", label: "All Rooms" },
            { id: "available", label: "Available" },
            { id: "occupied", label: "Occupied" },
            { id: "cleaning", label: "Cleaning" },
            { id: "maintenance", label: "Maintenance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                selectedStatus === tab.id
                  ? "bg-amber-600 text-white shadow-xs"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Room type filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-amber-500 outline-none transition cursor-pointer"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search room number or type..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-pulse"
            >
              <div className="h-24 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        /* Empty state */
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center text-slate-500 text-sm">
          No rooms match your current filters.
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredRooms.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              {r.images?.[0] && (
                <div className="h-28 w-full overflow-hidden bg-slate-100">
                  <img
                    src={r.images[0]}
                    alt={`Room ${r.roomNumber}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {r.roomType}
                    </span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2 font-serif">
                    Room {r.roomNumber}
                  </h3>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs border border-slate-100">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FaUsers className="text-slate-400" /> Guests:
                    </span>
                    <span className="font-bold text-slate-800">
                      {r.numberOfGuest}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FaMoon className="text-slate-400" /> Per night:
                    </span>
                    <span className="font-bold text-slate-800">
                      {currency(r.pricePerNight)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FaClock className="text-slate-400" /> Per hour:
                    </span>
                    <span className="font-medium text-slate-700">
                      {currency(r.pricePerHour)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openBookingModal(r)}
                  disabled={r.status !== "available"}
                  title={
                    r.status !== "available"
                      ? "Room is not currently available"
                      : "Book this room"
                  }
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <FaCalendarPlus className="text-xs" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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
                        {r.images?.[0] && (
                          <img
                            src={r.images[0]}
                            alt={`Room ${r.roomNumber}`}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <span>{r.roomNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800 capitalize">
                        {r.roomType}
                      </p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {r.numberOfGuest}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {currency(r.pricePerNight)}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {currency(r.pricePerHour)}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => openBookingModal(r)}
                        disabled={r.status !== "available"}
                        title={
                          r.status !== "available"
                            ? "Room is not currently available"
                            : "Book this room"
                        }
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center gap-1.5 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <FaCalendarPlus className="text-[10px]" />
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Walk-in Booking Modal */}
      {bookingRoom && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeBookingModal}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleBookingSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative animate-scale-up max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={closeBookingModal}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <FaTimes className="text-base" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                Walk-In Reservation
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                Book Room {bookingRoom.roomNumber}
              </h3>
              <p className="text-xs text-slate-400 mt-1 capitalize">
                {bookingRoom.roomType} · Up to {bookingRoom.numberOfGuest}{" "}
                guests
              </p>
            </div>

            {/* Booking type toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => handleBookingTypeChange("per-night")}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  bookingForm.bookingType === "per-night"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                Per Night
              </button>
              <button
                type="button"
                onClick={() => handleBookingTypeChange("per-hour")}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  bookingForm.bookingType === "per-hour"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                Per Hour
              </button>
            </div>

            {/* Guest details */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FaUser className="text-amber-600" /> Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.fullName}
                  onChange={(e) => handleFormChange("fullName", e.target.value)}
                  placeholder="e.g. Lexis Lutor"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaEnvelope className="text-amber-600" /> Email
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="guest@email.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaPhoneAlt className="text-amber-600" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phoneNumber}
                    onChange={(e) =>
                      handleFormChange("phoneNumber", e.target.value)
                    }
                    placeholder="0916 920 0398"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Check-in always required */}
              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-amber-600" /> Check-In Date &
                  Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bookingForm.bookedCheckIn}
                  onChange={(e) =>
                    handleFormChange("bookedCheckIn", e.target.value)
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition"
                />
              </div>

              {/* Per-night: check-out. Per-hour: number of hours. */}
              {bookingForm.bookingType === "per-night" ? (
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-amber-600" /> Check-Out Date
                    & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingForm.bookedCheckOut}
                    onChange={(e) =>
                      handleFormChange("bookedCheckOut", e.target.value)
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                  {bookingForm.bookedCheckIn &&
                    bookingForm.bookedCheckOut &&
                    nightsCount === 0 && (
                      <p className="text-red-500 text-[11px] mt-1 font-semibold">
                        Check-out must be after check-in.
                      </p>
                    )}
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaHourglassHalf className="text-amber-600" /> Number of
                    Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bookingForm.numberOfHours}
                    onChange={(e) =>
                      handleFormChange("numberOfHours", e.target.value)
                    }
                    placeholder="e.g. 3"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                </div>
              )}

              {/* Amount — always derived from the room's rate, never editable */}
              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FaCalculator className="text-amber-600" /> Amount
                </label>
                <div className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-extrabold text-slate-900 text-sm cursor-not-allowed select-none">
                  {currency(calculatedAmount)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {bookingForm.bookingType === "per-night"
                    ? nightsCount > 0
                      ? `${nightsCount} night${nightsCount > 1 ? "s" : ""} × ${currency(bookingRoom.pricePerNight)}`
                      : "Select a valid check-in and check-out to calculate the total."
                    : hoursCount > 0
                      ? `${hoursCount} hour${hoursCount > 1 ? "s" : ""} × ${currency(bookingRoom.pricePerHour)}`
                      : "Enter the number of hours to calculate the total."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={closeBookingModal}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || calculatedAmount <= 0}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
