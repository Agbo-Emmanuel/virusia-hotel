import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  MAX_NIGHTS,
  todayISO,
  toISODate,
  parseISODate,
  nightsBetween,
  formatDisplayDate,
  monthTitle,
} from "../../utils/dates";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// One calendar under two fields. Click "Check-in" and the calendar picks the
// check-in date; click "Check-out" and the same calendar picks the check-out.
// The calendar opens on the current month and can't go back before it.
const DateRangePicker = ({ checkIn, checkOut, onChange }) => {
  const today = todayISO();
  const current = parseISODate(today);

  const [activeField, setActiveField] = useState(
    checkIn && !checkOut ? "checkOut" : "checkIn",
  );
  const [view, setView] = useState(() => {
    const start = checkIn && checkIn >= today ? parseISODate(checkIn) : current;
    return { year: start.year, month: start.month };
  });
  const [error, setError] = useState("");

  // Errors fade away on their own
  useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const currentIndex = current.year * 12 + current.month;
  const viewIndex = view.year * 12 + view.month;
  const canGoPrev = viewIndex > currentIndex;

  const goPrev = () => {
    if (!canGoPrev) return;
    setView(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  };
  const goNext = () => {
    setView(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  };

  const cells = useMemo(() => {
    const firstWeekday = new Date(
      Date.UTC(view.year, view.month, 1),
    ).getUTCDay();
    const leadingBlanks = (firstWeekday + 6) % 7; // week starts on Monday
    const daysInMonth = new Date(
      Date.UTC(view.year, view.month + 1, 0),
    ).getUTCDate();
    return [
      ...Array(leadingBlanks).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) =>
        toISODate(view.year, view.month, i + 1),
      ),
    ];
  }, [view]);

  const focusField = (field) => {
    setError("");
    if (field === "checkOut" && !checkIn) {
      setActiveField("checkIn");
      setError("Please select your check-in date first.");
      return;
    }
    setActiveField(field);
    // Jump the calendar to the month of the date being edited
    const target = field === "checkIn" ? checkIn : checkOut || checkIn;
    if (target && target >= today) {
      const { year, month } = parseISODate(target);
      setView({ year, month });
    }
  };

  const handlePick = (iso) => {
    setError("");

    if (iso < today) {
      setError(
        "You can't select a date in the past. Please choose today or a later date.",
      );
      return;
    }

    if (activeField === "checkIn") {
      // Keep the existing check-out only if it is still a valid stay
      const stillValid =
        checkOut &&
        nightsBetween(iso, checkOut) >= 1 &&
        nightsBetween(iso, checkOut) <= MAX_NIGHTS;
      onChange({ checkIn: iso, checkOut: stillValid ? checkOut : "" });
      setActiveField("checkOut"); // move on to check-out automatically
      return;
    }

    if (!checkIn) {
      setActiveField("checkIn");
      setError("Please select your check-in date first.");
      return;
    }
    if (iso <= checkIn) {
      setError("Check-out must be after your check-in date.");
      return;
    }
    if (nightsBetween(checkIn, iso) > MAX_NIGHTS) {
      setError(`Online stays are limited to ${MAX_NIGHTS} nights.`);
      return;
    }
    onChange({ checkIn, checkOut: iso });
  };

  const nights = nightsBetween(checkIn, checkOut);

  const helperText =
    activeField === "checkIn"
      ? "Select your check-in date on the calendar."
      : "Now select your check-out date.";

  const dayClasses = (iso) => {
    const isStart = iso === checkIn;
    const isEnd = iso === checkOut;
    const inRange = checkIn && checkOut && iso > checkIn && iso < checkOut;

    let blocked = iso < today;
    if (!blocked && activeField === "checkOut" && checkIn) {
      blocked = iso <= checkIn || nightsBetween(checkIn, iso) > MAX_NIGHTS;
    }

    let classes =
      "h-10 sm:h-11 w-full flex items-center justify-center text-sm font-semibold transition select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ";

    if (isStart || isEnd) {
      classes += "bg-amber-600 text-white rounded-xl shadow-sm ";
    } else if (inRange) {
      classes += "bg-amber-100 text-amber-900 ";
    } else if (blocked) {
      classes += "text-slate-300 cursor-not-allowed rounded-xl ";
    } else {
      classes += "text-slate-800 hover:bg-amber-50 cursor-pointer rounded-xl ";
    }
    if (iso === today && !isStart && !isEnd) {
      classes += "ring-1 ring-amber-400 ";
    }
    return { classes, blocked, isStart, isEnd };
  };

  return (
    <div className="space-y-3">
      {/* Date fields */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: "checkIn", label: "Check-in", value: checkIn },
          { id: "checkOut", label: "Check-out", value: checkOut },
        ].map((field) => (
          <button
            key={field.id}
            type="button"
            onClick={() => focusField(field.id)}
            aria-pressed={activeField === field.id}
            className={`text-left rounded-2xl border px-3.5 sm:px-4 py-3 transition cursor-pointer ${
              activeField === field.id
                ? "border-amber-600 ring-2 ring-amber-500/30 bg-white"
                : "border-slate-200 bg-slate-50 hover:bg-white"
            }`}
          >
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {field.label}
            </span>
            <span
              className={`mt-1 flex items-center gap-2 text-xs sm:text-sm font-semibold ${
                field.value ? "text-slate-900" : "text-slate-400"
              }`}
            >
              <FaCalendarAlt className="text-amber-600 text-xs shrink-0" />
              <span className="truncate">
                {field.value ? formatDisplayDate(field.value) : "Select date"}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 font-medium px-1">{helperText}</p>

      {/* Calendar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Previous month"
            title={canGoPrev ? "Previous month" : "You can't view past months"}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <h3
            className="font-serif text-base sm:text-lg font-bold text-slate-900"
            aria-live="polite"
          >
            {monthTitle(view.year, view.month)}
          </h3>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next month"
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((iso, index) => {
            if (!iso) return <span key={`blank-${index}`} />;
            const { classes, blocked, isStart, isEnd } = dayClasses(iso);
            return (
              <button
                key={iso}
                type="button"
                onClick={() => handlePick(iso)}
                aria-label={formatDisplayDate(iso)}
                aria-disabled={blocked}
                aria-pressed={isStart || isEnd}
                className={classes}
              >
                {parseISODate(iso).day}
              </button>
            );
          })}
        </div>

        {/* Inline error */}
        {error && (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-700"
          >
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {nights > 0 && !error && (
          <p className="mt-3 text-center text-xs font-bold text-amber-800">
            {nights} night{nights === 1 ? "" : "s"} selected
          </p>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
