import { useState, useEffect, useMemo } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaBed,
  FaClock,
  FaMoon,
  FaCalculator,
  FaCheckCircle,
  FaPrint,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/formatMoney";
import { createBooking } from "../../services/booking.service";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phoneNumber: "",
  bookingType: "per-night",
  bookedCheckIn: "",
  bookedCheckOut: "",
  numberOfHours: "",
};

const BookingModal = ({ room, isOpen, onClose, onSuccess }) => {
  const [bookingForm, setBookingForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Initialize form dates when modal opens
  useEffect(() => {
    if (isOpen && room) {
      const now = new Date();
      // Format now as datetime-local string (YYYY-MM-DDTHH:mm)
      const tzOffset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now.getTime() - tzOffset)
        .toISOString()
        .slice(0, 16);

      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowISOTime = new Date(tomorrow.getTime() - tzOffset)
        .toISOString()
        .slice(0, 16);

      setBookingForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        bookingType: "per-night",
        bookedCheckIn: localISOTime,
        bookedCheckOut: tomorrowISOTime,
        numberOfHours: "3",
      });
      setConfirmedBooking(null);
    }
  }, [isOpen, room]);

  // Nights count calculation
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

  // Hours count calculation
  const hoursCount = useMemo(() => {
    if (bookingForm.bookingType !== "per-hour") return 0;
    const n = Number(bookingForm.numberOfHours);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [bookingForm.bookingType, bookingForm.numberOfHours]);

  // Calculate total amount based on room rates
  const calculatedAmount = useMemo(() => {
    if (!room) return 0;
    const priceNight = room.pricePerNight ?? room.price ?? 0;
    const priceHour = room.pricePerHour ?? 0;

    if (bookingForm.bookingType === "per-night") {
      return nightsCount * priceNight;
    }
    return hoursCount * priceHour;
  }, [bookingForm.bookingType, nightsCount, hoursCount, room]);

  if (!isOpen || !room) return null;

  const roomTitle = room.title || `Room ${room.roomNumber}`;
  const roomType = room.roomType || room.category || "Standard";
  const guests = room.numberOfGuest || room.capacity?.maxGuests || 2;
  const priceNight = room.pricePerNight ?? room.price ?? 0;
  const priceHour = room.pricePerHour ?? 0;
  const roomImage =
    room.images?.[0] ||
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80";

  const handleFormChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingTypeChange = (type) => {
    setBookingForm((prev) => ({
      ...prev,
      bookingType: type,
      bookedCheckOut: type === "per-hour" ? "" : prev.bookedCheckOut,
      numberOfHours: type === "per-night" ? "" : prev.numberOfHours,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phoneNumber, bookingType, bookedCheckIn } =
      bookingForm;

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      toast.error(
        "Please provide your full name, email address, and phone number.",
      );
      return;
    }
    if (!bookedCheckIn) {
      toast.error("Please select a valid check-in date & time.");
      return;
    }
    if (bookingType === "per-night" && !bookingForm.bookedCheckOut) {
      toast.error("Please select a valid check-out date & time.");
      return;
    }
    if (bookingType === "per-night" && nightsCount === 0) {
      toast.error("Check-out time must be after check-in time.");
      return;
    }
    if (bookingType === "per-hour" && !bookingForm.numberOfHours) {
      toast.error("Please enter the duration in hours.");
      return;
    }
    if (calculatedAmount <= 0) {
      toast.error(
        "Unable to calculate total booking amount. Please check parameters.",
      );
      return;
    }

    const payload = {
      bookingType,
      roomID: room._id || room.id,
      roomNumber: room.roomNumber || "001",
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
      const response = await createBooking(payload);
      toast.success(
        `Reservation confirmed for Room ${room.roomNumber || "001"}!`,
      );

      setConfirmedBooking({
        ...payload,
        bookingCode: response?.booking?.bookingCode,
        roomTitle,
        roomType,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to process reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-luxury relative animate-scale-up my-6 max-h-[90vh] overflow-y-auto border border-slate-100 text-slate-800"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <FaTimes className="text-base" />
        </button>

        {confirmedBooking ? (
          /* Confirmation Receipt Screen */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto border-4 border-emerald-200">
              <FaCheckCircle />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300">
                RESERVATION BOOKED
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-3">
                Thank You, {confirmedBooking.fullName}!
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed max-w-sm mx-auto">
                Your reservation is confirmed. No payment is required now -
                you'll pay{" "}
                <strong className="text-slate-800">
                  onsite when you check in
                </strong>
                .
              </p>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed max-w-sm mx-auto">
                Simply present this receipt or your booking code{" "}
                <strong className="text-amber-800">
                  {confirmedBooking.bookingCode}
                </strong>{" "}
                to our staff at check-in to confirm your reservation.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                We've also sent a copy of this receipt to{" "}
                <strong className="text-slate-800">
                  {confirmedBooking.email}
                </strong>{" "}
                for your records.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="font-bold text-slate-500 uppercase tracking-wider">
                  Room
                </span>
                <span className="font-serif text-base font-bold text-slate-900">
                  Room {room.roomNumber} ({roomType})
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Booking Code:</span>
                <strong className="text-amber-800 uppercase font-bold">
                  {confirmedBooking.bookingCode}
                </strong>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Booking Type:</span>
                <strong className="text-amber-800 uppercase font-bold">
                  {confirmedBooking.bookingType === "per-night"
                    ? `Per Night (${nightsCount} Night${nightsCount > 1 ? "s" : ""})`
                    : `Per Hour (${hoursCount} Hour${hoursCount > 1 ? "s" : ""})`}
                </strong>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Check-In:</span>
                <strong className="text-slate-800">
                  {new Date(confirmedBooking.bookedCheckIn).toLocaleString()}
                </strong>
              </div>

              {confirmedBooking.bookingType === "per-night" && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Check-Out:</span>
                  <strong className="text-slate-800">
                    {new Date(confirmedBooking.bookedCheckOut).toLocaleString()}
                  </strong>
                </div>
              )}

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Guest Name:</span>
                <strong className="text-slate-800">
                  {confirmedBooking.fullName}
                </strong>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Phone:</span>
                <strong className="text-slate-800">
                  {confirmedBooking.phoneNumber}
                </strong>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm">
                <span className="font-serif font-bold text-slate-900">
                  Total Paid/Due:
                </span>
                <span className="font-serif font-bold text-amber-700 text-lg">
                  {formatPrice(confirmedBooking.amount)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <FaPrint /> Print Receipt
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Main Customer Booking Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Modal Header Banner */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4 pr-6">
              <img
                src={roomImage}
                alt={roomTitle}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider block">
                  Reserve Accommodation
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                  Book Room {room.roomNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 capitalize flex items-center gap-2">
                  <span>{roomType} Suite</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaUsers className="text-amber-600" /> Up to {guests} Guests
                  </span>
                </p>
              </div>
            </div>

            {/* Stay Type Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Stay Duration Type
              </label>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleBookingTypeChange("per-night")}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    bookingForm.bookingType === "per-night"
                      ? "bg-white text-amber-800 shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FaMoon
                    className={
                      bookingForm.bookingType === "per-night"
                        ? "text-amber-600"
                        : "text-slate-400"
                    }
                  />
                  <span>Per Night ({formatPrice(priceNight)})</span>
                </button>
                {priceHour > 0 && (
                  <button
                    type="button"
                    onClick={() => handleBookingTypeChange("per-hour")}
                    className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      bookingForm.bookingType === "per-hour"
                        ? "bg-white text-amber-800 shadow-sm border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FaClock
                      className={
                        bookingForm.bookingType === "per-hour"
                          ? "text-amber-600"
                          : "text-slate-400"
                      }
                    />
                    <span>Per Hour ({formatPrice(priceHour)})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Guest Details Form */}
            <div className="space-y-3.5 text-xs">
              <h4 className="font-serif font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                Guest Contact Details
              </h4>

              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FaUser className="text-amber-600 text-xs" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.fullName}
                  onChange={(e) => handleFormChange("fullName", e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaEnvelope className="text-amber-600 text-xs" /> Email
                    Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaPhoneAlt className="text-amber-600 text-xs" /> Phone
                    Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phoneNumber}
                    onChange={(e) =>
                      handleFormChange("phoneNumber", e.target.value)
                    }
                    placeholder="0801 234 5678"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Booking Schedule */}
              <h4 className="font-serif font-bold text-slate-900 text-sm border-b border-slate-100 pb-1 pt-2">
                Booking Schedule
              </h4>

              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-amber-600 text-xs" /> Check-In
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bookingForm.bookedCheckIn}
                  onChange={(e) =>
                    handleFormChange("bookedCheckIn", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition"
                />
              </div>

              {bookingForm.bookingType === "per-night" ? (
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-amber-600 text-xs" />{" "}
                    Check-Out Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingForm.bookedCheckOut}
                    onChange={(e) =>
                      handleFormChange("bookedCheckOut", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                  {bookingForm.bookedCheckIn &&
                    bookingForm.bookedCheckOut &&
                    nightsCount === 0 && (
                      <p className="text-red-500 text-[11px] mt-1 font-semibold">
                        Check-out date/time must be after check-in date/time.
                      </p>
                    )}
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <FaClock className="text-amber-600 text-xs" /> Number of
                    Hours *
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-amber-500 outline-none transition"
                  />
                </div>
              )}

              {/* Total Summary */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <FaCalculator className="text-amber-600 text-xs" /> Total
                    Amount
                  </span>
                  <span className="font-serif font-extrabold text-amber-800 text-xl">
                    {formatPrice(calculatedAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {bookingForm.bookingType === "per-night"
                    ? nightsCount > 0
                      ? `${nightsCount} night${nightsCount > 1 ? "s" : ""} × ${formatPrice(priceNight)} / night`
                      : "Select valid check-in and check-out dates to calculate total."
                    : hoursCount > 0
                      ? `${hoursCount} hour${hoursCount > 1 ? "s" : ""} × ${formatPrice(priceHour)} / hour`
                      : "Enter number of hours to calculate total."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || calculatedAmount <= 0}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-amber-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <span>
                    Confirm Reservation ({formatPrice(calculatedAmount)})
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
