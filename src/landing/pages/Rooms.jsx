import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaExclamationCircle,
  FaHotel,
  FaInfoCircle,
  FaMinus,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import DateRangePicker from "../components/DateRangePicker";
import AvailableRoomCard from "../components/AvailableRoomCard";
import RoomBookingModal from "../components/RoomBookingModal";
import { getAvailableRooms } from "../../services/booking.service";
import { getErrorMessage } from "../../utils/apiError";
import { pluralize } from "../../utils/roomGuest";
import {
  formatDisplayDate,
  isValidISODate,
  nightsBetween,
  todayISO,
  MAX_NIGHTS,
} from "../../utils/dates";

const MAX_ADULTS = 10;
const MAX_CHILDREN = 8;

const clampInt = (value, min, max, fallback) => {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};

// Reads a previous search from the URL (?checkIn=&checkOut=&adults=&children=)
// so refreshing the page, or coming back to it, keeps the guest's search.
const readSearchFromUrl = (params) => {
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  if (!isValidISODate(checkIn) || !isValidISODate(checkOut)) return null;
  const nights = nightsBetween(checkIn, checkOut);
  if (checkIn < todayISO() || nights < 1 || nights > MAX_NIGHTS) return null;
  return {
    checkIn,
    checkOut,
    adults: clampInt(params.get("adults"), 1, MAX_ADULTS, 2),
    children: clampInt(params.get("children"), 0, MAX_CHILDREN, 0),
  };
};

const GuestStepper = ({ label, hint, value, min, max, onChange }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="text-[11px] text-slate-500">{hint}</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={`Fewer ${label.toLowerCase()}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:border-amber-600 hover:text-amber-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaMinus className="text-[10px]" />
      </button>
      <span
        className="w-6 text-center font-bold text-slate-900 tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`More ${label.toLowerCase()}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:border-amber-600 hover:text-amber-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaPlus className="text-[10px]" />
      </button>
    </div>
  </div>
);

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read once, so the calendar and steppers mount with the restored search
  const initialSearch = useMemo(
    () => readSearchFromUrl(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [dates, setDates] = useState({
    checkIn: initialSearch?.checkIn || "",
    checkOut: initialSearch?.checkOut || "",
  });
  const [adults, setAdults] = useState(initialSearch?.adults ?? 2);
  const [children, setChildren] = useState(initialSearch?.children ?? 0);
  const [formError, setFormError] = useState("");

  const [results, setResults] = useState(null); // { rooms, search }
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const lastSearchRef = useRef(null);
  const requestIdRef = useRef(0);

  const runSearch = useCallback(
    async (params, { scroll = true, silent = false } = {}) => {
      const requestId = ++requestIdRef.current;
      lastSearchRef.current = params;
      if (!silent) setIsSearching(true);
      setSearchError("");

      try {
        const data = await getAvailableRooms(params);
        if (requestId !== requestIdRef.current) return; // a newer search replaced this one
        setResults({ rooms: data.rooms || [], search: data.search });
        if (!silent) setSelectedType("all");
        if (scroll) {
          requestAnimationFrame(() =>
            resultsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            }),
          );
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        // A failed background refresh keeps what is on screen (e.g. the booking
        // confirmation); only a visible search shows an error state.
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
    },
    [],
  );

  // A search restored from the URL runs automatically
  useEffect(() => {
    if (initialSearch) runSearch(initialSearch, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSearching) return;

    if (!dates.checkIn || !dates.checkOut) {
      setFormError(
        !dates.checkIn
          ? "Please select your check-in and check-out dates."
          : "Please select your check-out date.",
      );
      return;
    }
    setFormError("");

    const params = {
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      adults,
      children,
    };
    setSearchParams(
      {
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: String(adults),
        children: String(children),
      },
      { replace: true },
    );
    runSearch(params);
  };

  const scrollToSearch = () =>
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const typeOptions = useMemo(() => {
    const types = Array.from(
      new Set((results?.rooms || []).map((r) => r.roomType)),
    ).filter(Boolean);
    return ["all", ...types];
  }, [results]);

  const visibleRooms = useMemo(() => {
    const rooms = (results?.rooms || []).filter(
      (r) => selectedType === "all" || r.roomType === selectedType,
    );
    return [...rooms].sort((a, b) =>
      sortBy === "price-desc"
        ? b.totalAmount - a.totalAmount
        : a.totalAmount - b.totalAmount,
    );
  }, [results, selectedType, sortBy]);

  const nights = nightsBetween(dates.checkIn, dates.checkOut);
  const guestsLabel = [
    pluralize(adults, "adult"),
    children > 0 ? pluralize(children, "child", "children") : null,
  ]
    .filter(Boolean)
    .join(", ");

  // Passed to the booking modal: what was searched + server-provided times
  const modalSearch = results?.search
    ? {
        ...results.search,
        checkIn: results.search.checkIn,
        checkOut: results.search.checkOut,
      }
    : null;

  const handleBooked = () => {
    // The room just booked is no longer free; refresh the list quietly behind the modal
    if (lastSearchRef.current) {
      runSearch(lastSearchRef.current, { scroll: false, silent: true });
    }
  };

  const handleConflict = () => {
    setSelectedRoom(null);
    toast.info("Room list updated with the latest availability.");
    if (lastSearchRef.current) runSearch(lastSearchRef.current);
  };

  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-24 pb-20">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-200/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 mb-8 shadow-xs">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
            <FaHotel className="text-amber-600" />
            <span>VIRUSIA HOTEL & SUITES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            Find Your Perfect Room
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Choose your dates and guests to see which rooms are available for
            your stay.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* PER-HOUR NOTICE */}
        <div
          role="note"
          className="flex items-start gap-3 bg-sky-50 border border-sky-200 text-sky-900 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-medium leading-relaxed"
        >
          <FaInfoCircle className="mt-0.5 shrink-0 text-sky-600" />
          <p>
            <strong className="font-bold">
              Looking for a room by the hour?
            </strong>{" "}
            Per-hour stays can't be booked online. Please visit the hotel and
            book at the front desk in person. Online bookings are for overnight
            stays only, and you pay at the hotel.
          </p>
        </div>

        {/* SEARCH */}
        <form
          ref={searchRef}
          onSubmit={handleSubmit}
          noValidate
          className="scroll-mt-28 bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_40px_rgba(197,160,89,0.10)] p-4 sm:p-6 lg:p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Dates */}
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">
                When are you staying?
              </h2>
              <DateRangePicker
                checkIn={dates.checkIn}
                checkOut={dates.checkOut}
                onChange={(next) => {
                  setDates(next);
                  setFormError("");
                }}
              />
            </div>

            {/* Guests + submit */}
            <div className="flex flex-col">
              <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">
                Who's coming?
              </h2>
              <div className="space-y-3">
                <GuestStepper
                  label="Adults"
                  hint="Age 13 and over"
                  value={adults}
                  min={1}
                  max={MAX_ADULTS}
                  onChange={setAdults}
                />
                <GuestStepper
                  label="Children"
                  hint="Age 12 and under"
                  value={children}
                  min={0}
                  max={MAX_CHILDREN}
                  onChange={setChildren}
                />
              </div>

              <div className="mt-6 lg:mt-auto space-y-4">
                <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 px-4 py-3 text-xs text-slate-700">
                  {dates.checkIn && dates.checkOut ? (
                    <p className="font-semibold leading-relaxed">
                      {formatDisplayDate(dates.checkIn)} →{" "}
                      {formatDisplayDate(dates.checkOut)}
                      <span className="block font-medium text-slate-500 mt-0.5">
                        {pluralize(nights, "night")} · {guestsLabel}
                      </span>
                    </p>
                  ) : (
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                      <FaCalendarAlt className="text-amber-600" />
                      Pick your check-in and check-out dates to continue.
                    </p>
                  )}
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

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm py-4 rounded-xl shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <CgSpinner className="h-5 w-5 animate-spin" />
                      <span>Checking availability...</span>
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
          </div>
        </form>

        {/* RESULTS */}
        <section
          ref={resultsRef}
          className="scroll-mt-28 space-y-6"
          aria-live="polite"
        >
          {isSearching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-slate-100 rounded-2xl" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-16 bg-slate-100 rounded-2xl" />
                  <div className="h-11 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : searchError ? (
            <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-red-200 shadow-xs space-y-3 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mx-auto">
                <FaExclamationCircle />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                We couldn't check availability
              </h3>
              <p className="text-sm text-slate-500">{searchError}</p>
              <button
                type="button"
                onClick={() =>
                  lastSearchRef.current && runSearch(lastSearchRef.current)
                }
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : !results ? (
            <div className="text-center py-10 sm:py-14 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
                <FaCalendarAlt />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Choose your dates to see available rooms
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We'll show every room that is free for your whole stay, with the
                total price up front.
              </p>
            </div>
          ) : results.rooms.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
                <FaSearch />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                No rooms available for these dates
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every room that fits {guestsLabel || "your party"} is booked for{" "}
                {formatDisplayDate(results.search.checkIn)} →{" "}
                {formatDisplayDate(results.search.checkOut)}. Try different
                dates, or fewer guests.
              </p>
              <button
                type="button"
                onClick={scrollToSearch}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer transition"
              >
                <FaCalendarAlt />
                <span>Change dates</span>
              </button>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                    {pluralize(visibleRooms.length, "room")} available
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    {formatDisplayDate(results.search.checkIn)} →{" "}
                    {formatDisplayDate(results.search.checkOut)} ·{" "}
                    {pluralize(results.search.nights, "night")} · {guestsLabel}
                    <button
                      type="button"
                      onClick={scrollToSearch}
                      className="ml-2 text-amber-700 font-bold hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {typeOptions.length > 2 && (
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                      {typeOptions.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition cursor-pointer ${
                            selectedType === type
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
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:border-amber-500 outline-none transition cursor-pointer"
                  >
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleRooms.map((room) => (
                  <AvailableRoomCard
                    key={room._id}
                    room={room}
                    nights={results.search.nights}
                    onBook={setSelectedRoom}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <RoomBookingModal
        room={selectedRoom}
        search={modalSearch}
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onBooked={handleBooked}
        onConflict={handleConflict}
      />
    </div>
  );
};

export default Rooms;
