import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaUsers,
  FaRulerCombined,
  FaBed,
  FaWifi,
  FaEye,
  FaCoffee,
  FaArrowRight,
  FaCalendarCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { formatPrice } from "../../utils/formatMoney";

const RoomCard = ({ room, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.images.length) % room.images.length,
    );
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-luxury transition-all duration-300 flex flex-col group">
      {/* Image Carousel / Banner */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={room.images[currentImageIndex]}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badge Tag */}
        {/* {room.badge && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide uppercase">
            {room.badge}
          </span>
        )} */}

        {/* Rating Badge */}
        {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/50">
          <FaStar className="text-amber-500 text-xs" />
          <span>{room.rating}</span>
          <span className="text-slate-400 font-normal">
            ({room.reviewsCount})
          </span>
        </div> */}

        {/* Image Controls */}
        {room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <FaChevronRight className="text-xs" />
            </button>
            {/* Carousel dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {room.images.map((_, idx) => (
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
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Title */}
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
            <span>{room.category} Room</span>
          </div>

          <Link
            to={`/rooms/${room.id}`}
            className="block group-hover:text-amber-600 transition"
          >
            <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug">
              {room.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">
            {room.tagline}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <FaUsers className="text-amber-600 text-xs shrink-0" />
              <span>Up to {room.capacity.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaRulerCombined className="text-amber-600 text-xs shrink-0" />
              <span>{room.specs.size.split(" / ")[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <FaBed className="text-amber-600 text-xs shrink-0" />
              <span className="truncate">{room.specs.bed}</span>
            </div>
          </div>

          {/* Key Amenities preview */}
          {/* <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
            {room.amenities.includes("wifi") && (
              <span className="bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                <FaWifi className="text-slate-500 text-[10px]" /> Wi-Fi
              </span>
            )}
            {room.amenities.includes("ocean_view") && (
              <span className="bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                <FaEye className="text-slate-500 text-[10px]" /> Ocean View
              </span>
            )}
            {room.amenities.includes("breakfast") && (
              <span className="bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                <FaCoffee className="text-slate-500 text-[10px]" /> Breakfast
              </span>
            )}
          </div> */}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-slate-900">
                {formatPrice(room.price)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / night
              </span>
            </div>
            {/* {room.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(room.originalPrice)}
              </span>
            )} */}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/rooms/${room.id}`}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-600 transition"
              title="View Room Details"
            >
              <FaArrowRight className="text-sm" />
            </Link>
            <button
              onClick={() => onBookNow && onBookNow(room)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FaCalendarCheck />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
