import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaMoon,
  FaClock,
  FaCalendarCheck,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import { formatPrice } from "../../utils/formatMoney";
import StatusBadge from "../../dashboard/components/StatusBadge";

const RoomCard = ({ room, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = room.images?.length > 0 ? room.images : [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
  ];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + images.length) % images.length,
    );
  };

  const roomTitle = room.title || `Room ${room.roomNumber}`;
  const roomCategory = room.roomType || room.category || "standard";
  const guests = room.numberOfGuest || room.capacity?.maxGuests || 2;
  const priceNight = room.pricePerNight ?? room.price ?? 0;
  const priceHour = room.pricePerHour ?? 0;
  const isAvailable = !room.status || room.status === "available";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col group">
      {/* Image Carousel / Banner */}
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img
          src={images[currentImageIndex]}
          alt={roomTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <StatusBadge status={room.status || "available"} size="sm" />
        </div>

        {/* Room Number Tag */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg border border-amber-400/30">
          #{room.roomNumber || room.id?.slice(-4) || "001"}
        </div>

        {/* Image Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Previous photo"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Next photo"
            >
              <FaChevronRight className="text-xs" />
            </button>
            {/* Carousel dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "w-5 bg-amber-500"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Title */}
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
            <span>{roomCategory} Suite</span>
          </div>

          <Link
            to={`/rooms/${room._id || room.id}`}
            className="block group-hover:text-amber-600 transition"
          >
            <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug">
              {roomTitle}
            </h3>
          </Link>

          {/* Specs / Info Pill */}
          <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs border border-slate-100 my-3">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <FaUsers className="text-amber-600" /> Guest Capacity:
              </span>
              <span className="font-bold text-slate-900">
                Up to {guests} Guests
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <FaMoon className="text-amber-600" /> Per Night:
              </span>
              <span className="font-bold text-slate-900">
                {formatPrice(priceNight)}
              </span>
            </div>
            {priceHour > 0 && (
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-amber-600" /> Per Hour:
                </span>
                <span className="font-bold text-slate-900">
                  {formatPrice(priceHour)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Starting from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-slate-900">
                {formatPrice(priceNight)}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                / night
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookNow && onBookNow(room)}
              disabled={!isAvailable}
              title={
                !isAvailable
                  ? `Room is currently ${room.status}`
                  : "Book this room now"
              }
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <FaCalendarCheck />
              <span>{isAvailable ? "Book Now" : "Unavailable"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

