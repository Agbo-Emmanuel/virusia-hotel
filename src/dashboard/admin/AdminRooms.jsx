import React, { useEffect, useMemo, useRef, useState } from "react";
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
  FaExclamationTriangle,
  FaExclamationCircle,
  FaMinus,
  FaPlus,
  FaBed,
  FaCheckCircle,
  FaCopy,
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { getAllRooms } from "../../services/room.service";
import {
  getAvailableRoomsAdmin,
  createAdminBooking,
} from "../../services/booking.service";
import { getErrorMessage } from "../../utils/apiError";
import { formatPrice } from "../../utils/formatMoney";
import { describeLimits, roomCapacity } from "../../utils/roomGuest";
import {
  DEFAULT_CHECK_IN_TIME,
  DEFAULT_CHECK_OUT_TIME,
  MAX_NIGHTS,
  addDays,
  formatDisplayDate,
  formatTimeLabel,
  nightsBetween,
  nowForDateTimeInput,
  todayISO,
} from "../../utils/dates";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ADULTS = 10;
const MAX_CHILDREN = 8;

const inputClass =
  "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition text-sm";

const EMPTY_GUEST_FORM = { fullName: "", email: "", phoneNumber: "" };

// Small +/- stepper for adults / children, used in the search panel
const Stepper = ({ label, value, min, max, onChange }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
    <span className="text-xs font-bold text-slate-700">{label}</span>
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        aria-label={`Fewer ${label.toLowerCase()}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-7 h-7 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:border-amber-600 hover:text-amber-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaMinus className="text-[9px]" />
      </button>
      <span className="w-5 text-center font-bold text-slate-900 text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`More ${label.toLowerCase()}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-7 h-7 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:border-amber-600 hover:text-amber-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaPlus className="text-[9px]" />
      </button>
    </div>
  </div>
);

const AdminRooms = () => {
  // --- "All rooms" reference list (status overview only, no booking here) ---
  const [viewMode, setViewMode] = useState("grid");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  const fetchAllRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const response = await getAllRooms();
      setRooms(response.rooms || []);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, "Failed to load rooms"));
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

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

  // ------------------------------------------------------------------
  // Availability search: what a walk-in guest can actually be booked into,
  // for today (right now) or any later date/time the guest asks about.
  // ------------------------------------------------------------------
  const today = todayISO();

  const [searchType, setSearchType] = useState("per-night");
  const [nightlyCheckIn, setNightlyCheckIn] = useState(today);
  const [nightlyCheckOut, setNightlyCheckOut] = useState(addDays(today, 1));
  const [hourlyStart, setHourlyStart] = useState(nowForDateTimeInput());
  const [hourlyHours, setHourlyHours] = useState("2");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [formError, setFormError] = useState("");

  const [results, setResults] = useState(null); // { rooms, search }
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [resultTypeFilter, setResultTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");

  const [bookingRoom, setBookingRoom] = useState(null);
  const [guestForm, setGuestForm] = useState(EMPTY_GUEST_FORM);
  const [guestErrors, setGuestErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isConflict, setIsConflict] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [copied, setCopied] = useState(false);

  const lastParamsRef = useRef(null);
  const requestIdRef = useRef(0);

  const switchSearchType = (type) => {
    setSearchType(type);
    setFormError("");
    // Fresh, sensible defaults for the type just switched to — a stale
    // date from the other mode would only cause confusion.
    if (type === "per-hour") {
      setHourlyStart(nowForDateTimeInput());
      setHourlyHours("2");
    } else {
      setNightlyCheckIn(today);
      setNightlyCheckOut(addDays(today, 1));
    }
  };

  const handleNightlyCheckInChange = (value) => {
    setNightlyCheckIn(value);
    setNightlyCheckOut((prev) => (prev && prev <= value ? "" : prev));
    setFormError("");
  };

  const runSearch = async (params, { silent = false } = {}) => {
    const requestId = ++requestIdRef.current;
    lastParamsRef.current = params;
    if (!silent) setIsSearching(true);
    setSearchError("");

    try {
      const data = await getAvailableRoomsAdmin(params);
      if (requestId !== requestIdRef.current) return;
      setResults({ rooms: data.rooms || [], search: data.search });
      if (!silent) setResultTypeFilter("all");
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      // A failed background refresh (e.g. right after a booking) shouldn't
      // wipe out what's on screen, such as a booking confirmation.
      if (!silent) {
        setResults(null);
        setSearchError(
          getErrorMessage(
            error,
            "We couldn't check availability. Please try again.",
          ),
        );
      }
    } finally {
      if (requestId === requestIdRef.current) setIsSearching(false);
    }
  };

  // Search "today" as soon as the page opens, so the front desk has an
  // answer ready before a guest even finishes describing what they want.
  useEffect(() => {
    runSearch({
      bookingType: "per-night",
      checkIn: today,
      checkOut: addDays(today, 1),
      adults: 1,
      children: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (isSearching) return;

    if (searchType === "per-night") {
      if (!nightlyCheckIn || !nightlyCheckOut) {
        setFormError(
          !nightlyCheckIn
            ? "Please select a check-in date."
            : "Please select a check-out date.",
        );
        return;
      }
      if (nightlyCheckIn < today) {
        setFormError("Check-in date cannot be in the past.");
        return;
      }
      const nights = nightsBetween(nightlyCheckIn, nightlyCheckOut);
      if (nights < 1) {
        setFormError("Check-out must be after check-in.");
        return;
      }
      if (nights > MAX_NIGHTS) {
        setFormError(`Bookings are limited to ${MAX_NIGHTS} nights.`);
        return;
      }
      setFormError("");
      runSearch({
        bookingType: "per-night",
        checkIn: nightlyCheckIn,
        checkOut: nightlyCheckOut,
        adults,
        children,
      });
    } else {
      if (!hourlyStart) {
        setFormError("Please select a check-in date & time.");
        return;
      }
      const hours = Number(hourlyHours);
      if (!Number.isInteger(hours) || hours < 1 || hours > 24) {
        setFormError("Number of hours must be a whole number from 1 to 24.");
        return;
      }
      setFormError("");
      runSearch({
        bookingType: "per-hour",
        checkIn: new Date(hourlyStart).toISOString(),
        numberOfHours: hours,
        adults,
        children,
      });
    }
  };

  const resultTypeOptions = useMemo(() => {
    const types = Array.from(
      new Set((results?.rooms || []).map((r) => r.roomType)),
    ).filter(Boolean);
    return ["all", ...types];
  }, [results]);

  const visibleResults = useMemo(() => {
    const list = (results?.rooms || []).filter(
      (r) => resultTypeFilter === "all" || r.roomType === resultTypeFilter,
    );
    return [...list].sort((a, b) =>
      sortBy === "price-desc"
        ? b.totalAmount - a.totalAmount
        : a.totalAmount - b.totalAmount,
    );
  }, [results, resultTypeFilter, sortBy]);

  // --- Booking a room from the search results ---------------------------

  const openBookingModal = (room) => {
    setBookingRoom(room);
    setGuestForm(EMPTY_GUEST_FORM);
    setGuestErrors({});
    setSubmitError("");
    setIsConflict(false);
    setConfirmation(null);
    setCopied(false);
  };

  const closeBookingModal = () => {
    if (isSubmitting) return;
    setBookingRoom(null);
  };

  const handleGuestChange = (field, value) => {
    setGuestForm((prev) => ({ ...prev, [field]: value }));
    if (guestErrors[field])
      setGuestErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError("");
  };

  const validateGuestForm = () => {
    const errors = {};
    if (!guestForm.fullName.trim()) errors.fullName = "Guest name is required.";
    if (guestForm.email.trim() && !EMAIL_RE.test(guestForm.email.trim())) {
      errors.email = "That email address doesn't look right.";
    }
    if (!guestForm.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    } else if (guestForm.phoneNumber.replace(/\D/g, "").length < 7) {
      errors.phoneNumber = "That phone number looks too short.";
    }
    return errors;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingRoom || !results?.search || isSubmitting) return;

    const found = validateGuestForm();
    if (Object.keys(found).length > 0) {
      setGuestErrors(found);
      return;
    }

    const { search } = results;
    // Reuse the exact values the search was run with — same dates, same
    // guest counts, same booking type — so what the front desk sees is
    // exactly what gets booked.
    const payload = {
      bookingType: search.bookingType,
      roomID: bookingRoom._id,
      fullName: guestForm.fullName.trim(),
      email: guestForm.email.trim() || undefined,
      phoneNumber: guestForm.phoneNumber.trim(),
      adults: search.adults,
      children: search.children,
      bookedCheckIn: search.checkIn,
      ...(search.bookingType === "per-night"
        ? { bookedCheckOut: search.checkOut }
        : { numberOfHours: search.numberOfHours }),
    };

    setIsSubmitting(true);
    setSubmitError("");
    setIsConflict(false);
    try {
      const data = await createAdminBooking(payload);
      setConfirmation({ booking: data.booking, emailSent: data.emailSent });
      toast.success(
        `Room ${bookingRoom.roomNumber} booked for ${payload.fullName}`,
      );
      // Quietly refresh the list behind the confirmation screen — that room
      // is no longer free for this period.
      if (lastParamsRef.current)
        runSearch(lastParamsRef.current, { silent: true });
      fetchAllRooms();
    } catch (error) {
      console.log(error);
      setSubmitError(getErrorMessage(error, "Failed to create booking"));
      setIsConflict(error?.response?.status === 409);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConflictRefresh = () => {
    setBookingRoom(null);
    toast.info("Room list updated with the latest availability.");
    if (lastParamsRef.current) runSearch(lastParamsRef.current);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(confirmation.booking.bookingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available — the code is already visible on screen
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          Walk-In Reservations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search which rooms are free for a guest at the hotel right now, or for
          a time they've asked about, then book per night or per hour.
        </p>
      </div>

      {/* ---------------- Availability search ---------------- */}
      <form
        onSubmit={handleSearchSubmit}
        noValidate
        className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5"
      >
        {/* Booking type toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto sm:inline-flex">
          <button
            type="button"
            onClick={() => switchSearchType("per-night")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              searchType === "per-night"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FaMoon
              className={searchType === "per-night" ? "text-amber-600" : ""}
            />
            Per Night
          </button>
          <button
            type="button"
            onClick={() => switchSearchType("per-hour")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              searchType === "per-hour"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FaClock
              className={searchType === "per-hour" ? "text-amber-600" : ""}
            />
            Per Hour
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
          {/* Dates / time */}
          {searchType === "per-night" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Check-In Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={nightlyCheckIn}
                  onChange={(e) => handleNightlyCheckInChange(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  min={addDays(nightlyCheckIn || today, 1)}
                  value={nightlyCheckOut}
                  onChange={(e) => {
                    setNightlyCheckOut(e.target.value);
                    setFormError("");
                  }}
                  className={inputClass}
                />
              </div>
              <p className="sm:col-span-2 text-[11px] text-slate-400">
                Check-in from {formatTimeLabel(DEFAULT_CHECK_IN_TIME)} ·
                Check-out by {formatTimeLabel(DEFAULT_CHECK_OUT_TIME)}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Check-In Date & Time
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setHourlyStart(nowForDateTimeInput());
                      setFormError("");
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Use current time
                  </button>
                </div>
                <input
                  type="datetime-local"
                  value={hourlyStart}
                  onChange={(e) => {
                    setHourlyStart(e.target.value);
                    setFormError("");
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Number of Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={hourlyHours}
                  onChange={(e) => {
                    setHourlyHours(e.target.value);
                    setFormError("");
                  }}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Guests + submit */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Stepper
                label="Adults"
                value={adults}
                min={1}
                max={MAX_ADULTS}
                onChange={setAdults}
              />
              <Stepper
                label="Children"
                value={children}
                min={0}
                max={MAX_CHILDREN}
                onChange={setChildren}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <CgSpinner className="h-4 w-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <FaSearch className="text-xs" />
                  <span>Check availability</span>
                </>
              )}
            </button>
          </div>
        </div>

        {formError && (
          <p
            role="alert"
            className="flex items-start gap-2 text-xs font-semibold text-red-600"
          >
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            {formError}
          </p>
        )}
      </form>

      {/* ---------------- Results ---------------- */}
      <section aria-live="polite" className="space-y-5">
        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 animate-pulse"
              >
                <div className="h-24 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-9 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : searchError ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-red-200 shadow-xs space-y-3 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl mx-auto">
              <FaExclamationCircle />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              We couldn't check availability
            </h3>
            <p className="text-sm text-slate-500">{searchError}</p>
            <button
              type="button"
              onClick={() =>
                lastParamsRef.current && runSearch(lastParamsRef.current)
              }
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : results && results.rooms.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 text-center border border-slate-200 shadow-xs space-y-2 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
              <FaSearch />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              No rooms available for this time
            </h3>
            <p className="text-sm text-slate-500">
              Try different dates, fewer guests, or the other booking type.
            </p>
          </div>
        ) : (
          results && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                    {visibleResults.length} room
                    {visibleResults.length === 1 ? "" : "s"} available
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {results.search.bookingType === "per-night" ? (
                      <>
                        {formatDisplayDate(results.search.checkIn)} →{" "}
                        {formatDisplayDate(results.search.checkOut)} ·{" "}
                        {results.search.nights} night
                        {results.search.nights === 1 ? "" : "s"}
                      </>
                    ) : (
                      <>
                        From {new Date(results.search.checkIn).toLocaleString()}{" "}
                        for {results.search.numberOfHours} hour
                        {results.search.numberOfHours === 1 ? "" : "s"}
                      </>
                    )}{" "}
                    · {results.search.adults} adult
                    {results.search.adults === 1 ? "" : "s"}
                    {results.search.children > 0 &&
                      `, ${results.search.children} child${results.search.children === 1 ? "" : "ren"}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {resultTypeOptions.length > 2 && (
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                      {resultTypeOptions.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setResultTypeFilter(type)}
                          className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition cursor-pointer ${
                            resultTypeFilter === type
                              ? "bg-amber-600 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {type === "all" ? "All types" : type}
                        </button>
                      ))}
                    </div>
                  )}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort rooms"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:border-amber-500 outline-none transition cursor-pointer"
                  >
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleResults.map((room) => (
                  <article
                    key={room._id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col"
                  >
                    <div className="relative h-32 bg-slate-100">
                      {room.images?.[0] ? (
                        <img
                          src={room.images[0]}
                          alt={`Room ${room.roomNumber}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl">
                          <FaBed />
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 bg-white/95 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {room.roomType}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">
                          Room {room.roomNumber}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                          <FaUsers className="text-amber-600" />
                          Up to {roomCapacity(room) ?? "—"} guests
                        </p>
                        {describeLimits(room).length > 0 && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {describeLimits(room).join(" · ")}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto space-y-2.5">
                        <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl px-3 py-2.5">
                          <p className="text-[11px] text-slate-500 font-medium">
                            {results.search.bookingType === "per-night"
                              ? `${formatPrice(room.pricePerNight)} × ${results.search.nights} night${results.search.nights === 1 ? "" : "s"}`
                              : `${formatPrice(room.pricePerHour)} × ${results.search.numberOfHours} hour${results.search.numberOfHours === 1 ? "" : "s"}`}
                          </p>
                          <p className="flex items-baseline justify-between mt-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                              Total
                            </span>
                            <span className="font-serif text-lg font-bold text-slate-900">
                              {formatPrice(room.totalAmount)}
                            </span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openBookingModal(room)}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          <FaCalendarPlus className="text-xs" />
                          <span>Book Now</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )
        )}
      </section>

      {/* ---------------- All rooms (status overview only) ---------------- */}
      <div className="pt-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              All Rooms — Status Overview
            </h2>
            <p className="text-xs text-slate-500">
              For reference only. Use the availability search above to book a
              room.
            </p>
          </div>
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

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
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

        {isLoadingRooms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 animate-pulse"
              >
                <div className="h-20 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200/80 shadow-xs text-center text-slate-500 text-sm">
            No rooms match your current filters.
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRooms.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
              >
                {r.images?.[0] && (
                  <div className="h-24 w-full overflow-hidden bg-slate-100">
                    <img
                      src={r.images[0]}
                      alt={`Room ${r.roomNumber}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {r.roomType}
                    </span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-serif">
                    Room {r.roomNumber}
                  </h3>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>Up to {roomCapacity(r) ?? "—"} guests</p>
                    <p>
                      {formatPrice(r.pricePerNight)} / night ·{" "}
                      {formatPrice(r.pricePerHour)} / hour
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Per Night</th>
                    <th className="py-3 px-4">Per Hour</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRooms.map((r) => (
                    <tr key={r._id} className="hover:bg-amber-50/20 transition">
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {r.roomNumber}
                      </td>
                      <td className="py-3.5 px-4 capitalize font-bold text-slate-800">
                        {r.roomType}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {roomCapacity(r) ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatPrice(r.pricePerNight)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatPrice(r.pricePerHour)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Booking modal ---------------- */}
      {bookingRoom && results?.search && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeBookingModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-5 relative animate-scale-up max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={closeBookingModal}
              aria-label="Close"
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <FaTimes className="text-base" />
            </button>

            {confirmation ? (
              /* ---- Confirmation ---- */
              <div className="space-y-5 pr-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
                    <FaCheckCircle />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Booking confirmed
                  </h3>
                  <p className="text-sm text-slate-600">
                    Room {bookingRoom.roomNumber} is booked for{" "}
                    {confirmation.booking.fullName}.
                  </p>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                    Booking code
                  </p>
                  <p className="font-mono text-2xl font-extrabold text-slate-900 tracking-wider mt-1">
                    {confirmation.booking.bookingCode}
                  </p>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                  >
                    <FaCopy />
                    {copied ? "Copied!" : "Copy code"}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 text-sm">
                  <span className="text-slate-500 font-medium">Total</span>
                  <span className="font-serif text-lg font-bold text-slate-900">
                    {formatPrice(confirmation.booking.amount)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingRoom(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* ---- Guest details form ---- */
              <form
                onSubmit={handleBookingSubmit}
                noValidate
                className="space-y-5 pr-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                    Walk-In Reservation
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                    Book Room {bookingRoom.roomNumber}
                  </h3>
                </div>

                {/* Locked-in search summary */}
                <div className="bg-slate-50 rounded-2xl p-3.5 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">
                      {results.search.bookingType === "per-night"
                        ? "Stay"
                        : "Time"}
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {results.search.bookingType === "per-night" ? (
                        <>
                          {formatDisplayDate(results.search.checkIn)} →{" "}
                          {formatDisplayDate(results.search.checkOut)}
                        </>
                      ) : (
                        <>
                          {new Date(results.search.checkIn).toLocaleString()} ·{" "}
                          {results.search.numberOfHours}h
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Guests</span>
                    <span className="font-semibold text-slate-800">
                      {results.search.adults} adult
                      {results.search.adults === 1 ? "" : "s"}
                      {results.search.children > 0 &&
                        `, ${results.search.children} child${results.search.children === 1 ? "" : "ren"}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-serif font-bold text-amber-800">
                      {formatPrice(bookingRoom.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label
                      htmlFor="admin-booking-fullName"
                      className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"
                    >
                      <FaUser className="text-amber-600" /> Guest Full Name
                    </label>
                    <input
                      id="admin-booking-fullName"
                      type="text"
                      value={guestForm.fullName}
                      onChange={(e) =>
                        handleGuestChange("fullName", e.target.value)
                      }
                      placeholder="e.g. Lexis Lutor"
                      className={inputClass}
                    />
                    {guestErrors.fullName && (
                      <p className="mt-1 text-[11px] font-semibold text-red-600">
                        {guestErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="admin-booking-email"
                        className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"
                      >
                        <FaEnvelope className="text-amber-600" /> Email{" "}
                        <span className="font-medium text-slate-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="admin-booking-email"
                        type="email"
                        value={guestForm.email}
                        onChange={(e) =>
                          handleGuestChange("email", e.target.value)
                        }
                        placeholder="guest@email.com"
                        className={inputClass}
                      />
                      {guestErrors.email && (
                        <p className="mt-1 text-[11px] font-semibold text-red-600">
                          {guestErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="admin-booking-phone"
                        className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"
                      >
                        <FaPhoneAlt className="text-amber-600" /> Phone Number
                      </label>
                      <input
                        id="admin-booking-phone"
                        type="tel"
                        value={guestForm.phoneNumber}
                        onChange={(e) =>
                          handleGuestChange("phoneNumber", e.target.value)
                        }
                        placeholder="0916 920 0398"
                        className={inputClass}
                      />
                      {guestErrors.phoneNumber && (
                        <p className="mt-1 text-[11px] font-semibold text-red-600">
                          {guestErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xl px-3.5 py-3 text-xs font-semibold leading-relaxed"
                  >
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />
                    <div className="space-y-1.5">
                      <p>{submitError}</p>
                      {isConflict && (
                        <button
                          type="button"
                          onClick={handleConflictRefresh}
                          className="underline underline-offset-2 font-bold cursor-pointer"
                        >
                          Refresh available rooms
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <CgSpinner className="h-4 w-4 animate-spin" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <span>Confirm Booking</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
