import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ROOMS_DATA, AMENITIES_LIST } from "../../data/rooms";
import RoomCard from "../components/RoomCard";
import BookingModal from "../components/BookingModal";
import {
  FaStar,
  FaBed,
  FaUsers,
  FaRulerCombined,
  FaEye,
  FaBuilding,
  FaCalendarCheck,
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaBan,
  FaDog,
  FaQuoteLeft,
  FaMoon,
} from "react-icons/fa";
import { formatPrice } from "../../utils/formatMoney";

const HOURLY_RATE = 2000;

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const room = ROOMS_DATA.find((r) => r.id === id) || ROOMS_DATA[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stay Type: 'night' | 'hour'
  const [stayType, setStayType] = useState("night");

  // Widget dates state for quick booking preview
  const today = new Date().toISOString().split("T")[0];
  const defaultOut = new Date(Date.now() + 86400000 * 3)
    .toISOString()
    .split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultOut);
  const [adults, setAdults] = useState(room.capacity?.adults || 2);

  // Hourly Stay State
  const [stayDate, setStayDate] = useState(today);
  const [startTime, setStartTime] = useState("12:00");
  const [durationHours, setDurationHours] = useState(2);

  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const baseTotal =
    stayType === "hour"
      ? HOURLY_RATE * durationHours
      : room.price * nights;
  const estTax = Math.round(baseTotal * 0.1);
  const grandTotal = baseTotal + estTax;

  const similarRooms = ROOMS_DATA.filter((r) => r.id !== room.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-24 pb-20">
      {/* BREADCRUMB & BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 transition"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Back to All Accommodations</span>
        </Link>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ROOM TITLE & BADGE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {room.category} Suite
              </span>
              {/* {room.badge && (
                <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {room.badge}
                </span>
              )} */}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
              {room.title}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {room.tagline}
            </p>
          </div>

          <div className="text-left md:text-right">
            <div className="flex items-baseline gap-1.5 justify-start md:justify-end">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                {formatPrice(room.price)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / night
              </span>
            </div>
            {/* <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1 justify-start md:justify-end">
              <FaStar />
              <span className="text-slate-800">{room.rating}</span>
              <span className="text-slate-400 font-normal">
                ({room.reviewsCount} guest reviews)
              </span>
            </div> */}
          </div>
        </div>

        {/* GALLERY SHOWCASE */}
        <div className="space-y-4">
          <div className="relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden shadow-luxury border-4 border-white bg-slate-100">
            <img
              src={room.images[activeImageIndex]}
              alt={room.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {room.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-28 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === activeImageIndex
                    ? "border-amber-600 shadow-md scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* TWO COLUMN CONTENT & STICKY BOOKING WIDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN - OVERVIEW & SPECS */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-slate-700">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block flex items-center gap-1.5">
                  <FaRulerCombined className="text-amber-600" /> Room Size
                </span>
                <strong className="text-slate-900 font-semibold text-sm">
                  {room.specs.size}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium block flex items-center gap-1.5">
                  <FaBed className="text-amber-600" /> Bed Type
                </span>
                <strong className="text-slate-900 font-semibold text-sm">
                  {room.specs.bed}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium block flex items-center gap-1.5">
                  <FaEye className="text-amber-600" /> View
                </span>
                <strong className="text-slate-900 font-semibold text-sm">
                  {room.specs.view}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium block flex items-center gap-1.5">
                  <FaUsers className="text-amber-600" /> Max Guests
                </span>
                <strong className="text-slate-900 font-semibold text-sm">
                  Up to {room.capacity.maxGuests} Guests
                </strong>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Room Overview & Experience
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-normal">
                {room.description}
              </p>
            </div>

            {/* Amenities Grid */}
            {/* <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Included Room Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map((amenityId) => {
                  const item = AMENITIES_LIST.find((a) => a.id === amenityId);
                  return (
                    <div
                      key={amenityId}
                      className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3 text-xs text-slate-800 font-semibold"
                    >
                      <FaCheckCircle className="text-amber-600 text-sm shrink-0" />
                      <span>{item ? item.label : amenityId}</span>
                    </div>
                  );
                })}
              </div>
            </div> */}

            {/* Policies */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-xs">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Hotel Policies & Guidelines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                <div className="flex items-start gap-2.5">
                  <FaClock className="text-amber-600 text-sm mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">
                      Check-In / Out
                    </strong>
                    <span>
                      Check-in: {room.policies.checkIn} • Check-out:{" "}
                      {room.policies.checkOut}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FaShieldAlt className="text-amber-600 text-sm mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">
                      Cancellation
                    </strong>
                    <span>{room.policies.cancellation}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FaBan className="text-amber-600 text-sm mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">
                      Smoking Policy
                    </strong>
                    <span>{room.policies.smoking}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FaDog className="text-amber-600 text-sm mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Pet Policy</strong>
                    <span>{room.policies.pets}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {/* <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Guest Reviews ({room.reviewsCount})
                </h3>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                  <FaStar />
                  <span>{room.rating} out of 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {room.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-9 h-9 rounded-full object-cover border border-amber-300"
                        />
                        <div>
                          <strong className="font-serif font-bold text-slate-900 text-sm block">
                            {rev.author}
                          </strong>
                          <span className="text-slate-400 text-[10px]">
                            {rev.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {[...Array(rev.rating)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 italic pt-1 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* RIGHT COLUMN - STICKY BOOKING WIDGET */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-luxury sticky top-24 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block mb-1">
                  Reserve This Room
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-bold text-slate-900">
                    {stayType === "hour" ? formatPrice(HOURLY_RATE) : formatPrice(room.price)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {stayType === "hour" ? "/ hour" : "/ night"}
                  </span>
                </div>
              </div>

              {/* STAY TYPE TOGGLE */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStayType("night")}
                  className={`flex-1 py-2 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    stayType === "night"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FaMoon className={stayType === "night" ? "text-amber-600" : ""} />
                  <span>Per Night</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStayType("hour")}
                  className={`flex-1 py-2 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    stayType === "hour"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FaClock className={stayType === "hour" ? "text-amber-600" : ""} />
                  <span>Per Hour</span>
                </button>
              </div>

              {/* Inputs depending on stayType */}
              {stayType === "night" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      min={checkIn}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Guests
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-amber-500 focus:outline-none"
                    >
                      {[...Array(room.capacity?.maxGuests || 6)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Stay Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={stayDate}
                      onChange={(e) => setStayDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Duration (Hours)
                    </label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-amber-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map((h) => (
                        <option key={h} value={h}>
                          {h} {h === 1 ? "Hour" : "Hours"} ({formatPrice(HOURLY_RATE * h)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Calculated Summary */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>
                    {stayType === "hour"
                      ? `${formatPrice(HOURLY_RATE)} x ${durationHours} hrs`
                      : `${formatPrice(room.price)} x ${nights} nights`}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(baseTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Est. Tax & Service Fee (10%)</span>
                  <span>{formatPrice(estTax)}</span>
                </div>
                <div className="pt-2 border-t border-amber-200/80 flex justify-between font-serif font-bold text-slate-900 text-sm">
                  <span>Estimated Total:</span>
                  <span className="text-amber-800 text-base">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm py-4 rounded-xl shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <FaCalendarCheck />
                <span>Book This Room Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal render */}
        <BookingModal
          room={room}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialConfig={{
            stayType,
            checkIn,
            checkOut,
            stayDate,
            startTime,
            durationHours,
            adults,
          }}
        />
      </div>
    </div>
  );
};

export default RoomDetail;
