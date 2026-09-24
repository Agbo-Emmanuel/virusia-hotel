import { useEffect, useState } from "react";
import {
  FaBed,
  FaCheckCircle,
  FaCopy,
  FaEnvelope,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPhoneAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { createBooking } from "../../services/booking.service";
import { formatPrice } from "../../utils/formatMoney";
import { getErrorMessage } from "../../utils/apiError";
import { pluralize } from "../../utils/roomGuest";
import {
  DEFAULT_CHECK_IN_TIME,
  DEFAULT_CHECK_OUT_TIME,
  formatDisplayDate,
  formatTimeLabel,
} from "../../utils/dates";

const EMPTY_FORM = { fullName: "", email: "", phoneNumber: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form) => {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!form.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(form.email.trim()))
    errors.email = "That email address doesn't look right.";
  if (!form.phoneNumber.trim())
    errors.phoneNumber = "Please enter your phone number.";
  else if (form.phoneNumber.replace(/\D/g, "").length < 7)
    errors.phoneNumber = "That phone number looks too short.";
  return errors;
};

const inputClass = (hasError) =>
  `w-full px-3.5 py-3 bg-slate-50 border rounded-xl text-base sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
    hasError
      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
      : "border-slate-200 focus:ring-amber-500/30 focus:border-amber-600"
  }`;

const RoomBookingModal = ({
  room,
  search,
  isOpen,
  onClose,
  onBooked,
  onConflict,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isConflict, setIsConflict] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fresh form every time the modal opens for a room
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setSubmitError("");
      setIsConflict(false);
      setConfirmation(null);
      setCopied(false);
    }
  }, [isOpen, room?._id]);

  // Lock page scroll behind the modal and allow Esc to close it
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !room || !search) return null;

  const checkInTime = formatTimeLabel(
    search.checkInTime || DEFAULT_CHECK_IN_TIME,
  );
  const checkOutTime = formatTimeLabel(
    search.checkOutTime || DEFAULT_CHECK_OUT_TIME,
  );
  const guestsLabel = [
    pluralize(search.adults, "adult"),
    search.children > 0
      ? pluralize(search.children, "child", "children")
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const found = validate(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setIsConflict(false);

    try {
      // Price, booking type and room number are decided by the server
      const data = await createBooking({
        roomID: room._id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        bookedCheckIn: search.checkIn,
        bookedCheckOut: search.checkOut,
        adults: search.adults,
        children: search.children,
      });
      setConfirmation({ booking: data.booking, emailSent: data.emailSent });
      onBooked?.();
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          "We couldn't complete your booking. Please try again.",
        ),
      );
      // 409 = someone else just took this room (or is booking it right now)
      setIsConflict(error?.response?.status === 409);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(confirmation.booking.bookingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available; the code is visible on screen anyway
    }
  };

  const requestClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
      onClick={requestClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          confirmation ? "Booking confirmed" : `Book room ${room.roomNumber}`
        }
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg max-h-[94vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-scale-up"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-600 tracking-widest">
              {confirmation
                ? "Reservation received"
                : "Complete your reservation"}
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              {confirmation ? "You're all set!" : `Room ${room.roomNumber}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {confirmation ? (
          /* ---------- Confirmation ---------- */
          <div className="px-5 sm:px-6 py-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
                <FaCheckCircle />
              </div>
              <p className="text-sm text-slate-600">
                Thank you, {confirmation.booking.fullName.split(" ")[0]}. Your
                room is reserved.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                Booking code
              </p>
              <p className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wider mt-1">
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

            <dl className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm">
              {[
                ["Room", `Room ${room.roomNumber} · ${room.roomType}`],
                [
                  "Check-in",
                  `${formatDisplayDate(search.checkIn)} from ${checkInTime}`,
                ],
                [
                  "Check-out",
                  `${formatDisplayDate(search.checkOut)} by ${checkOutTime}`,
                ],
                ["Guests", guestsLabel],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-500 font-medium">{label}</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {value}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pt-2.5 border-t border-slate-200">
                <dt className="font-bold text-slate-900">Total to pay</dt>
                <dd className="font-serif text-lg font-bold text-amber-800">
                  {formatPrice(confirmation.booking.amount)}
                </dd>
              </div>
            </dl>

            <div className="flex items-start gap-2.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl px-3.5 py-3 text-xs font-medium leading-relaxed">
              <FaInfoCircle className="mt-0.5 shrink-0" />
              <span>
                No payment has been taken online. Please pay at the hotel when
                you arrive, and show your booking code at the front desk.
              </span>
            </div>

            <p className="text-xs text-slate-500 text-center leading-relaxed">
              {confirmation.emailSent ? (
                <>
                  A confirmation email has been sent to{" "}
                  <strong className="text-slate-700">
                    {confirmation.booking.email}
                  </strong>
                  .
                </>
              ) : (
                "We couldn't send a confirmation email, so please save your booking code above."
              )}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* ---------- Booking form ---------- */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="px-5 sm:px-6 py-5 space-y-5"
          >
            {/* Stay summary */}
            <div className="flex gap-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center text-slate-400 text-2xl">
                {room.images?.[0] ? (
                  <img
                    src={room.images[0]}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaBed />
                )}
              </div>
              <div className="min-w-0 text-xs space-y-1">
                <p className="font-bold text-slate-900 text-sm capitalize">
                  {room.roomType} · Room {room.roomNumber}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold">
                    {formatDisplayDate(search.checkIn)}
                  </span>{" "}
                  →{" "}
                  <span className="font-semibold">
                    {formatDisplayDate(search.checkOut)}
                  </span>
                </p>
                <p className="text-slate-500">
                  {pluralize(search.nights, "night")} · {guestsLabel}
                </p>
                <p className="text-[11px] text-slate-400">
                  Check-in {checkInTime} · Check-out {checkOutTime}
                </p>
              </div>
            </div>

            <div className="flex items-baseline justify-between bg-amber-50/60 border border-amber-200/80 rounded-2xl px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                  Total to pay at the hotel
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {formatPrice(room.pricePerNight)} ×{" "}
                  {pluralize(search.nights, "night")}
                </p>
              </div>
              <span className="font-serif text-2xl font-bold text-slate-900">
                {formatPrice(room.totalAmount)}
              </span>
            </div>

            {/* Guest details */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="booking-fullName"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5"
                >
                  <FaUser className="text-amber-600" /> Full name
                </label>
                <input
                  id="booking-fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="e.g. Amaka Obi"
                  disabled={isSubmitting}
                  className={inputClass(errors.fullName)}
                />
                {errors.fullName && (
                  <p className="mt-1 text-[11px] font-semibold text-red-600">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-email"
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5"
                  >
                    <FaEnvelope className="text-amber-600" /> Email
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    className={inputClass(errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="booking-phone"
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5"
                  >
                    <FaPhoneAlt className="text-amber-600" /> Phone number
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    placeholder="0801 234 5678"
                    disabled={isSubmitting}
                    className={inputClass(errors.phoneNumber)}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl px-3.5 py-3 text-xs font-medium leading-relaxed">
              <FaInfoCircle className="mt-0.5 shrink-0" />
              <span>
                You won't pay anything online. Payment is made at the hotel when
                you arrive.
              </span>
            </div>

            {/* Server error */}
            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xl px-3.5 py-3 text-xs font-semibold leading-relaxed"
              >
                <FaExclamationTriangle className="mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p>{submitError}</p>
                  {isConflict && (
                    <button
                      type="button"
                      onClick={onConflict}
                      className="underline underline-offset-2 font-bold cursor-pointer"
                    >
                      See other available rooms
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={requestClose}
                disabled={isSubmitting}
                className="sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="sm:flex-[1.6] py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-sm shadow-md shadow-amber-600/20 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <CgSpinner className="h-5 w-5 animate-spin" />
                    <span>Reserving...</span>
                  </>
                ) : (
                  <span>Confirm reservation</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RoomBookingModal;
