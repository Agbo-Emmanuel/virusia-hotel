import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { ADDONS } from "../../data/rooms";
import {
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaCheckCircle,
  FaBed,
  FaConciergeBell,
  FaShieldAlt,
  FaPrint,
  FaArrowRight,
  FaArrowLeft,
  FaUtensils,
  FaTaxi,
  FaSpa,
  FaWineGlassAlt,
} from "react-icons/fa";

const BookingModal = () => {
  const {
    activeBookingModalRoom: room,
    isBookingModalOpen,
    closeBookingModal,
    createBooking,
    formatPrice,
  } = useBooking();

  const navigate = useNavigate();

  // Form Step State (1: Dates & Addons, 2: Guest Details, 3: Payment, 4: Confirmed)
  const [step, setStep] = useState(1);

  // Dates & Nights
  const today = new Date().toISOString().split("T")[0];
  const defaultOut = new Date(Date.now() + 86400000 * 3)
    .toISOString()
    .split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultOut);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Selected Addons array
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Guest Details
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Reset internal state when modal opens with a new room
  useEffect(() => {
    if (isBookingModalOpen && room) {
      setStep(1);
      setSelectedAddons([]);
      setConfirmedBooking(null);
    }
  }, [isBookingModalOpen, room]);

  if (!isBookingModalOpen || !room) return null;

  // Calculate number of nights
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const roomBaseTotal = room.price * nights;

  // Addons total
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    if (!addon) return sum;
    return sum + (addon.perNight ? addon.price * nights : addon.price);
  }, 0);

  const subtotal = roomBaseTotal + addonsTotal;
  const tax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + tax;

  const handleAddonToggle = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleGuestInfoSubmit = (e) => {
    e.preventDefault();
    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone) {
      return;
    }
    setStep(3);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();

    const addonDetails = selectedAddons.map((addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      const total = addon.perNight ? addon.price * nights : addon.price;
      return {
        id: addon.id,
        name: addon.name,
        price: addon.price,
        perNight: addon.perNight,
        total: total,
      };
    });

    const newBookingData = {
      room: {
        id: room.id,
        title: room.title,
        category: room.category,
        image: room.images[0],
        price: room.price,
      },
      checkIn,
      checkOut,
      nights,
      guests: { adults, children: childrenCount },
      addons: addonDetails,
      guestInfo,
      payment: {
        method: paymentMethod,
        cardLast4: cardNumber.slice(-4) || "4242",
        totalAmount: grandTotal,
        baseTotal: roomBaseTotal,
        addonsTotal: addonsTotal,
        tax: tax,
        status: paymentMethod === "hotel" ? "Pay at Check-in" : "Paid & Confirmed",
      },
    };

    const result = createBooking(newBookingData);
    setConfirmedBooking(result);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-luxury border border-slate-100 w-full max-w-3xl overflow-hidden my-8 relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={closeBookingModal}
            className="absolute right-5 top-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl font-bold">
              <FaBed />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-amber-400 font-bold uppercase block">
                Reservations Desk
              </span>
              <h2 className="font-serif text-2xl font-bold">{room.title}</h2>
            </div>
          </div>

          {/* Steps Indicator */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/60 text-xs">
              <div
                className={`flex items-center gap-2 ${
                  step >= 1 ? "text-amber-400 font-bold" : "text-slate-500"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Dates & Addons</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-700" />
              <div
                className={`flex items-center gap-2 ${
                  step >= 2 ? "text-amber-400 font-bold" : "text-slate-500"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Guest Details</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-700" />
              <div
                className={`flex items-center gap-2 ${
                  step >= 3 ? "text-amber-400 font-bold" : "text-slate-500"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Payment</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: DATES & ADDONS */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Room Snapshot Card */}
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-16 h-16 rounded-xl object-cover border border-amber-200"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-base">
                      {room.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {room.specs.bed} • {room.specs.size}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-slate-900 block">
                    {formatPrice(room.price)}
                  </span>
                  <span className="text-xs text-slate-500">per night</span>
                </div>
              </div>

              {/* Dates & Guest Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nights & Guests
                  </label>
                  <div className="p-2.5 bg-amber-100/50 border border-amber-200 rounded-xl text-xs flex items-center justify-between font-bold text-slate-800">
                    <span>{nights} {nights === 1 ? "Night" : "Nights"}</span>
                    <span className="text-amber-800">{adults} Adults, {childrenCount} Kids</span>
                  </div>
                </div>
              </div>

              {/* Addons Selection */}
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg mb-1">
                  Enhance Your Stay (Optional Add-ons)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Select premium concierge services to personalize your experience.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleAddonToggle(addon.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isChecked
                            ? "bg-amber-50 border-amber-500 shadow-sm"
                            : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 text-xs block">
                              {addon.name}
                            </span>
                            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                              {addon.description}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-800 shrink-0">
                          +{formatPrice(addon.price)}
                          {addon.perNight && <span className="text-[10px] text-slate-400 font-normal">/n</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Bar & Next */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    Estimated Total ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                  <span className="font-serif text-2xl font-bold text-slate-900">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <span>Continue to Guest Info</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {step === 2 && (
            <form onSubmit={handleGuestInfoSubmit} className="space-y-5">
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                Primary Guest Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      required
                      value={guestInfo.fullName}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, fullName: e.target.value })
                      }
                      placeholder="e.g. Eleanor Vance"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="email"
                      required
                      value={guestInfo.email}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, email: e.target.value })
                      }
                      placeholder="eleanor@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number (for SMS Confirmation) *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="tel"
                      required
                      value={guestInfo.phone}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, phone: e.target.value })
                      }
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Special Requests & Estimated Arrival Time
                  </label>
                  <textarea
                    rows="3"
                    value={guestInfo.specialRequests}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, specialRequests: e.target.value })
                    }
                    placeholder="e.g. High floor preference, airport pickup flight #, extra feather pillows..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-slate-600 text-xs font-bold hover:text-slate-900 flex items-center gap-1.5 transition"
                >
                  <FaArrowLeft className="text-[10px]" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <span>Proceed to Payment</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT & SUMMARY */}
          {step === 3 && (
            <form onSubmit={handleConfirmPayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cost Breakdown Column */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                  <h4 className="font-serif font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
                    Booking Summary
                  </h4>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>{room.title} ({nights} nights)</span>
                      <span className="font-semibold">{formatPrice(roomBaseTotal)}</span>
                    </div>

                    {selectedAddons.map((addonId) => {
                      const addon = ADDONS.find((a) => a.id === addonId);
                      const cost = addon.perNight ? addon.price * nights : addon.price;
                      return (
                        <div key={addonId} className="flex justify-between text-slate-500">
                          <span>+ {addon.name}</span>
                          <span>{formatPrice(cost)}</span>
                        </div>
                      );
                    })}

                    <div className="flex justify-between text-slate-500">
                      <span>Occupancy Tax & Service Fee (10%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-serif font-bold text-slate-900 text-lg">
                      Total Amount
                    </span>
                    <span className="font-serif font-bold text-amber-700 text-2xl">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-800 flex items-center gap-2">
                    <FaShieldAlt className="text-emerald-600 shrink-0 text-sm" />
                    <span>Free cancellation up to 48 hours before check-in.</span>
                  </div>
                </div>

                {/* Payment Option Column */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-slate-900 text-base">
                    Select Payment Method
                  </h4>

                  <div className="space-y-2.5">
                    {/* Card Option */}
                    <label
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === "card"
                          ? "bg-amber-50/80 border-amber-500"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payMethod"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-900">
                          Credit / Debit Card
                        </span>
                      </div>
                      <FaCreditCard className="text-amber-600 text-lg" />
                    </label>

                    {/* Paystack Simulation Option */}
                    <label
                      onClick={() => setPaymentMethod("paystack")}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === "paystack"
                          ? "bg-amber-50/80 border-amber-500"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payMethod"
                          checked={paymentMethod === "paystack"}
                          onChange={() => setPaymentMethod("paystack")}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-900">
                          Paystack Instant Checkout
                        </span>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                        FAST & SECURE
                      </span>
                    </label>

                    {/* Pay at Hotel Option */}
                    <label
                      onClick={() => setPaymentMethod("hotel")}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === "hotel"
                          ? "bg-amber-50/80 border-amber-500"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payMethod"
                          checked={paymentMethod === "hotel"}
                          onChange={() => setPaymentMethod("hotel")}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-900">
                          Pay at Front Desk upon Check-In
                        </span>
                      </div>
                      <FaConciergeBell className="text-slate-500 text-lg" />
                    </label>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            CVC / CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-slate-600 text-xs font-bold hover:text-slate-900 flex items-center gap-1.5 transition"
                >
                  <FaArrowLeft className="text-[10px]" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
                >
                  <FaCheckCircle />
                  <span>Confirm Booking ({formatPrice(grandTotal)})</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION & RECEIPT */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-4 space-y-6 animate-scale-up">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto border-4 border-emerald-200">
                <FaCheckCircle />
              </div>

              <div>
                <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300">
                  RESERVATION CONFIRMED
                </span>
                <h3 className="font-serif text-3xl font-bold text-slate-900 mt-2">
                  Thank You, {confirmedBooking.guestInfo.fullName}!
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  Confirmation receipt has been sent to{" "}
                  <strong className="text-slate-900">{confirmedBooking.guestInfo.email}</strong>
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    Booking Reference
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-700">
                    #{confirmedBooking.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-medium">Check-In</span>
                    <strong className="text-slate-900 font-serif text-sm">
                      {confirmedBooking.checkIn} (3:00 PM)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Check-Out</span>
                    <strong className="text-slate-900 font-serif text-sm">
                      {confirmedBooking.checkOut} (12:00 PM)
                    </strong>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Room Reserved:</span>
                  <strong className="text-slate-900">{confirmedBooking.room.title}</strong>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Payment Status:</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {confirmedBooking.payment.status}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold">
                  <span className="text-slate-900 font-serif">Total Paid:</span>
                  <span className="text-amber-700 font-serif text-base">
                    {formatPrice(confirmedBooking.payment.totalAmount)}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    closeBookingModal();
                    navigate("/my-bookings");
                  }}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <FaPrint /> Print Receipt
                </button>
                <button
                  onClick={closeBookingModal}
                  className="w-full sm:w-auto text-slate-500 hover:text-slate-800 font-semibold text-xs px-4 py-3"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
