import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaExchangeAlt,
  FaSignOutAlt,
  FaSlidersH,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const TopHeader = ({ role = "admin", setMobileOpen, collapsed }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = role === "admin";

  const notifications = [
    {
      id: 1,
      title: "New Booking Received",
      desc: "Michael Scott booked Suite 402 for 3 nights.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Room 305 Cleaned",
      desc: "Housekeeping completed deep cleaning for Room 305.",
      time: "25 mins ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment Confirmed",
      desc: "$1,450.00 via Paystack for Booking #VR-9920.",
      time: "1 hour ago",
      read: true,
    },
  ];

  const handleRoleToggle = () => {
    if (isAdmin) {
      toast.info("Switched to Super Admin Dashboard view");
      navigate("/super-admin");
    } else {
      toast.info("Switched to Admin Dashboard view");
      navigate("/admin");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.info(`Searching for "${searchQuery}"...`);
  };

  return (
    <header
      className={`sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 ${
        collapsed ? "lg:ml-20" : "lg:ml-64"
      }`}
    >
      <div className="px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <FaBars className="text-xl" />
          </button>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full hidden sm:block">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAdmin
                  ? "Search guests, room status, booking ID..."
                  : "Search system rooms, revenue, admins, bookings..."
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-sm rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
            />
          </form>
        </div>

        {/* Right Side: Role Switcher, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Pill */}
          <button
            onClick={handleRoleToggle}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs hover:scale-105 ${
              isAdmin
                ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                : "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
            }`}
          >
            <FaExchangeAlt className="text-xs" />
            <span>{isAdmin ? "Admin View" : "Super Admin View"}</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <FaBell className="text-lg" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-600 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-fade-in">
                <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                  <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                        !item.read ? "bg-amber-50/40" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FaCheckCircle className="text-xs" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-3 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      toast.success("All notifications marked as read");
                      setShowNotifications(false);
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {isAdmin ? "AD" : "SA"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {isAdmin ? "Sarah Jenkins" : "Alexander Wright"}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">
                  {isAdmin ? "Hotel Admin" : "Executive Super Admin"}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">
                    {isAdmin ? "Sarah Jenkins" : "Alexander Wright"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {isAdmin ? "s.jenkins@virusia.com" : "a.wright@virusia.com"}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleRoleToggle}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 cursor-pointer"
                  >
                    <FaExchangeAlt className="text-amber-600" />
                    <span>Switch to {isAdmin ? "Super Admin" : "Admin"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (isAdmin) navigate("/admin/rooms");
                      else navigate("/super-admin/settings");
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <FaSlidersH className="text-slate-400" />
                    <span>Dashboard Preferences</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      toast.info("Logged out successfully");
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
