import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ROOMS_DATA,
  HOTEL_AMENITIES_SHOWCASE,
  TESTIMONIALS,
} from "../../data/rooms";
import RoomCard from "../components/RoomCard";
import BookingModal from "../components/BookingModal";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaBed,
  FaSearch,
  FaStar,
  FaShieldAlt,
  FaAward,
  FaConciergeBell,
  FaGlassMartiniAlt,
  FaSwimmingPool,
  FaUtensils,
  FaSpa,
  FaArrowRight,
  FaQuoteLeft,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const defaultOut = new Date(Date.now() + 86400000 * 3)
    .toISOString()
    .split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultOut);
  const [category, setCategory] = useState("all");
  const [selectedBookingRoom, setSelectedBookingRoom] = useState(null);

  const featuredRooms = ROOMS_DATA.filter((r) => r.featured);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate("/rooms");
  };

  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4">
        {/* Background Image Container with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
            alt="Virusia Hotel Luxury Resort"
            className="w-full h-full object-cover scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-950/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
            <FaStar className="text-amber-400 text-xs" />
            <span>5-Star Luxury Oceanfront Destination</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            Experience Unrivaled <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-serif">
              Elegance & Serenity
            </span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to Virusia Hotel & Suites. Immerse yourself in panoramic
            ocean vistas, Michelin-star gastronomy, and bespoke butler
            hospitality.
          </p>

          {/* QUICK SEARCH WIDGET */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-luxury border border-white/60 text-left max-w-4xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Check-In Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 text-xs" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Check-Out Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 text-xs" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Room Category
                </label>
                <div className="relative">
                  <FaBed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 text-xs" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="all">All Categories</option>
                    <option value="deluxe">Deluxe Rooms</option>
                    <option value="executive">Executive Suites</option>
                    <option value="family">Family Suites</option>
                    <option value="presidential">Presidential Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
                >
                  <FaSearch />
                  <span>Search Rooms</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* KEY STATS & BADGES */}
      <section className="bg-white border-y border-slate-100 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100/80">
            <div className="px-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-600 block">
                120+
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1 block">
                Luxury Suites & Rooms
              </span>
            </div>
            <div className="px-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-600 block">
                4.9 / 5.0
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1 block">
                Average Guest Rating
              </span>
            </div>
            <div className="px-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-600 block">
                24 / 7
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1 block">
                Personal Butler Service
              </span>
            </div>
            <div className="px-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-600 block">
                100%
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1 block">
                Best Rate Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block mb-2">
              Curated Accommodations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Featured Rooms & Presidential Suites
            </h2>
          </div>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 group"
          >
            <span>Browse All Accommodations</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBookNow={(r) => setSelectedBookingRoom(r)}
            />
          ))}
        </div>
      </section>

      {/* AMENITIES SHOWCASE */}
      <section className="bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block">
              World-Class Facilities
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Indulge in Hotel Amenities
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              From our oceanfront infinity pool to organic thermal spas and
              Michelin-inspired culinary arts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOTEL_AMENITIES_SHOWCASE.map((amenity) => (
              <div
                key={amenity.id}
                className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg hover:border-amber-500/50 transition-all group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={amenity.image}
                    alt={amenity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-slate-950/80 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                    {amenity.hours}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl font-bold text-white">
                    {amenity.title}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    {amenity.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/amenities"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-amber-600/20 transition"
            >
              <span>Explore All Resort Experiences</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US / HOSPITALITY PROMISE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
              The Virusia Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Hospitality Redefined with Personalized Attention
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every detail of Virusia Hotel is meticulously crafted to afford
              our guests a peaceful luxury sanctuary. From seamless digital
              check-in to personalized dietary catering and private chauffeur
              pickups.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-lg">
                  <FaConciergeBell />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm">
                    24/7 Private Butler
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attentive staff catering to your every request.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-lg">
                  <FaShieldAlt />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm">
                    Flexible Cancellation
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Free date change and refunds up to 48h prior.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-luxury border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury hotel lobby"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-slate-900 text-base block">
                    Luxury Hotel of the Year 2026
                  </span>
                  <span className="text-xs text-amber-600 font-semibold">
                    Global Hospitality Excellence Award
                  </span>
                </div>
                <FaAward className="text-amber-500 text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="bg-cream-alt py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
              Guest Impressions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Loved by Travelers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl p-6 shadow-card border border-slate-200/80 space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 gap-1 text-sm">
                      {[...Array(test.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <FaQuoteLeft className="text-amber-200 text-2xl" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-11 h-11 rounded-full object-cover border border-amber-300"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm">
                      {test.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      {test.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* SPECIAL BANNER CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-luxury relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 relative z-10 max-w-2xl">
            <span className="bg-amber-500/20 text-amber-400 text-xs font-extrabold px-3.5 py-1 rounded-full border border-amber-400/30 uppercase tracking-widest inline-block">
              LIMITED TIME OFFER
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold">
              Book Direct & Receive Complimentary Spa Pass
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Reserve any room or suite online today and enjoy a complimentary
              \$120 spa pass plus luxury airport transfer.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/rooms"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/30 inline-block transition transform active:scale-95"
            >
              Claim Special Offer & Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal Popup */}
      <BookingModal
        room={selectedBookingRoom}
        isOpen={!!selectedBookingRoom}
        onClose={() => setSelectedBookingRoom(null)}
      />
    </div>
  );
};

export default Home;
