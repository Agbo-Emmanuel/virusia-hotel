import React from "react";
import { Link } from "react-router-dom";
import { HOTEL_AMENITIES_SHOWCASE } from "../../data/rooms";
import { FaClock, FaStar, FaArrowRight, FaConciergeBell, FaBed } from "react-icons/fa";

const AmenitiesPage = () => {
  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-24 pb-20">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 mb-12 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
            RESORT EXPERIENCES
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            Hotel Amenities & Wellness
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            Immerse yourself in world-class facilities designed for ultimate relaxation, gourmet dining, and holistic wellness.
          </p>
        </div>
      </div>

      {/* AMENITIES LISTING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {HOTEL_AMENITIES_SHOWCASE.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={item.id}
              className={`flex flex-col ${
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-10 items-center bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card hover:shadow-luxury transition-all`}
            >
              <div className="lg:w-1/2 h-[350px] rounded-2xl overflow-hidden shadow-md shrink-0 w-full relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-sm text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-700">
                  <FaClock /> {item.hours}
                </span>
              </div>

              <div className="lg:w-1/2 space-y-4">
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
                  FACILITY HIGHLIGHT
                </span>
                <h2 className="font-serif text-3xl font-bold text-slate-900">
                  {item.title}
                </h2>
                <p className="text-sm font-semibold text-amber-800">
                  {item.subtitle}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                  <Link
                    to="/rooms"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 transition"
                  >
                    <FaBed />
                    <span>Reserve A Room With Access</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmenitiesPage;
