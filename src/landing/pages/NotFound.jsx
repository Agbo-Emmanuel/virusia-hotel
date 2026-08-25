import React from "react";
import { Link } from "react-router-dom";
import { FaBed, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 text-center">
      <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200 shadow-luxury max-w-lg space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-serif text-3xl font-bold mx-auto border-4 border-amber-200">
          404
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The page you are searching for does not exist or has been moved to another luxury suite.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 transition"
          >
            <FaHome />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/rooms"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 transition"
          >
            <FaBed />
            <span>View Rooms</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
