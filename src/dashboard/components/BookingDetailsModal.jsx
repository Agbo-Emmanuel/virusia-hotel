import { useEffect } from "react";
import StatusBadge from "./StatusBadge";
import {
  FaBed,
  FaClock,
  FaEnvelope,
  FaPhoneAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { formatPrice } from "../../utils/formatMoney";

// Which status each booking may move to next. Mirrors the backend rules.
// Cancelled and checked-out are final. A confirmed booking can still be
// cancelled (e.g. a walk-in entered by mistake, or a no-show). "overdue" is
// set automatically by the backend (a checked-in guest more than 20 minutes
// past their booked check-out), not chosen manually here, but once a booking
// is overdue it can still be checked out normally.
export const STATUS_FLOW = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checked-in", "cancelled"],
  "checked-in": ["checked-out"],
  overdue: ["checked-out"],
  "checked-out": [],
  cancelled: [],
};

export const STATUS_ACTIONS = {
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

export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const guestsLabel = (booking) => {
  if (!Number.isFinite(booking.adults)) return "—"; // bookings made before guest counts existed
  const children = booking.children || 0;
  return `${booking.adults} adult${booking.adults === 1 ? "" : "s"}${
    children > 0 ? `, ${children} child${children === 1 ? "" : "ren"}` : ""
  }`;
};

const nightsLabel = (booking) => {
  if (booking.bookingType === "per-hour") {
    return booking.numberOfHours ? `${booking.numberOfHours}h stay` : "—";
  }
  const nights =
    booking.nights ??
    (booking.bookedCheckIn && booking.bookedCheckOut
      ? Math.max(
          1,
          Math.round(
            (new Date(booking.bookedCheckOut) -
              new Date(booking.bookedCheckIn)) /
              86400000,
          ),
        )
      : null);
  return nights ? `${nights} night${nights === 1 ? "" : "s"}` : "—";
};

const sourceLabel = (source) =>
  source === "front-desk"
    ? "Front desk"
    : source === "online"
      ? "Website"
      : "—";

const BookingDetailsModal = ({
  booking,
  onClose,
  onStatusChange,
  isUpdating,
  title = "Booking Details",
  statusHeading = "Change Reservation Status:",
}) => {
  useEffect(() => {
    if (!booking) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [booking, onClose]);

  if (!booking) return null;

  const nextStatuses = STATUS_FLOW[booking.status] || [];

  const handleAction = (target) => {
    if (
      target === "cancelled" &&
      !window.confirm(
        `Cancel booking ${booking.bookingCode}? This can't be undone.`,
      )
    ) {
      return;
    }
    onStatusChange(booking._id, target);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-6 relative animate-scale-up max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <FaTimes className="text-base" />
        </button>

        <div className="border-b border-slate-100 pb-4 pr-10">
          <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
            {title}
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 font-serif">
            Reservation {booking.bookingCode}
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <p className="font-bold text-slate-900 text-sm">
              {booking.fullName}
            </p>
            <p className="text-slate-600 flex items-center gap-2 break-all">
              <FaEnvelope className="text-slate-400 shrink-0" />
              {booking.email || "No email provided"}
            </p>
            <p className="text-slate-600 flex items-center gap-2">
              <FaPhoneAlt className="text-slate-400 shrink-0" />
              {booking.phoneNumber}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-800 font-bold uppercase">
                Assigned Room
              </p>
              <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <FaBed className="text-amber-600 text-[10px]" />
                Room {booking.roomNumber}
              </p>
            </div>
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-800 font-bold uppercase">
                Current Status
              </p>
              <div className="mt-1">
                <StatusBadge status={booking.status} size="sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Booked Check-In
              </p>
              <p className="font-semibold text-slate-800 mt-1">
                {formatDateTime(booking.bookedCheckIn)}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Booked Check-Out
              </p>
              <p className="font-semibold text-slate-800 mt-1">
                {formatDateTime(booking.bookedCheckOut)}
              </p>
            </div>
          </div>

          {(booking.actualCheckIn || booking.actualCheckOut) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Actual Check-In
                </p>
                <p className="font-semibold text-slate-800 mt-1">
                  {formatDateTime(booking.actualCheckIn)}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Actual Check-Out
                </p>
                <p className="font-semibold text-slate-800 mt-1">
                  {formatDateTime(booking.actualCheckOut)}
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
            <div className="flex items-center justify-between p-3">
              <span className="flex items-center gap-2 text-slate-500 font-semibold">
                <FaClock className="text-slate-400" />
                Booking Type
              </span>
              <span className="font-bold text-slate-800 capitalize">
                {booking.bookingType?.replace("-", " ")} ·{" "}
                {nightsLabel(booking)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="flex items-center gap-2 text-slate-500 font-semibold">
                <FaUsers className="text-slate-400" />
                Guests
              </span>
              <span className="font-bold text-slate-800">
                {guestsLabel(booking)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-semibold">Booked via</span>
              <span className="font-bold text-slate-800">
                {sourceLabel(booking.source)}
              </span>
            </div>
          </div>

          {/* Status update: options depend on the current status */}
          <div className="pt-2">
            <p className="font-bold text-slate-900 mb-2">{statusHeading}</p>
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
                    onClick={() => handleAction(target)}
                    className={`py-2.5 font-bold rounded-xl text-[11px] cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed ${STATUS_ACTIONS[target].classes}`}
                  >
                    {STATUS_ACTIONS[target].label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">
                This booking is in a final state — no further status updates are
                available.
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
              {formatPrice(booking.amount)}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Payment is collected at the hotel
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
