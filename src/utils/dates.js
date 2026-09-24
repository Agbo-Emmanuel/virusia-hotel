// Hotel-wide date settings. Keep these in sync with utils/bookingUtils.js on the backend.
export const HOTEL_TZ = "Africa/Lagos";
export const MAX_NIGHTS = 30;
export const DEFAULT_CHECK_IN_TIME = "14:00";
export const DEFAULT_CHECK_OUT_TIME = "12:00";

const pad = (n) => String(n).padStart(2, "0");

// Builds "YYYY-MM-DD" from a year, a ZERO-based month and a day
export const toISODate = (year, monthIndex, day) =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

export const parseISODate = (iso) => {
  const [year, month, day] = String(iso).split("-").map(Number);
  return { year, month: month - 1, day };
};

// True only for real calendar dates in YYYY-MM-DD format (rejects 2026-02-30)
export const isValidISODate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  const { year, month, day } = parseISODate(value);
  const d = new Date(Date.UTC(year, month, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month &&
    d.getUTCDate() === day
  );
};

// Today's date AT THE HOTEL (not the visitor's device), as "YYYY-MM-DD".
// The backend validates "not in the past" against the same timezone.
export const todayISO = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: HOTEL_TZ });

// Converts any timestamp into the hotel's calendar date, as "YYYY-MM-DD"
export const toHotelISODate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-CA", { timeZone: HOTEL_TZ });
};

// Whole nights between two "YYYY-MM-DD" dates (0 if either is missing)
export const nightsBetween = (fromISO, toISO) => {
  if (!fromISO || !toISO) return 0;
  const a = parseISODate(fromISO);
  const b = parseISODate(toISO);
  return Math.round(
    (Date.UTC(b.year, b.month, b.day) - Date.UTC(a.year, a.month, a.day)) /
      86400000,
  );
};

export const addDays = (iso, days) => {
  const { year, month, day } = parseISODate(iso);
  const d = new Date(Date.UTC(year, month, day + days));
  return toISODate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

// "Fri, 3 Oct 2026"
export const formatDisplayDate = (iso) => {
  if (!iso) return "";
  const { year, month, day } = parseISODate(iso);
  return new Date(Date.UTC(year, month, day)).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

// "October 2026"
export const monthTitle = (year, monthIndex) =>
  new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// "14:00" -> "2:00 PM"
export const formatTimeLabel = (hhmm) => {
  if (!hhmm) return "";
  const [h, m] = String(hhmm).split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${pad(m || 0)} ${period}`;
};

// Value for <input type="datetime-local"> representing "now" in the user's own time
export const nowForDateTimeInput = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};
