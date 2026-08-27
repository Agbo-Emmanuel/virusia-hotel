import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaCalendarCheck,
  FaBed,
  FaUsers,
  FaChartLine,
  FaThList,
  FaConciergeBell,
  FaUserShield,
  FaSlidersH,
  FaChevronLeft,
  FaChevronRight,
  FaGlobe,
  FaSignOutAlt,
  FaExchangeAlt,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({
  role = "admin",
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  const adminNav = [
    { label: "Overview", path: "/admin", exact: true, icon: FaChartPie },
    { label: "Bookings", path: "/admin/bookings", icon: FaCalendarCheck },
    { label: "Rooms & Status", path: "/admin/rooms", icon: FaBed },
    { label: "Create Room", path: "/admin/create-room", icon: FaBed },
    { label: "Guests Directory", path: "/admin/guests", icon: FaUsers },
  ];

  const superAdminNav = [
    {
      label: "Executive Overview",
      path: "/super-admin",
      exact: true,
      icon: FaChartLine,
    },
    { label: "List of Rooms", path: "/super-admin/rooms", icon: FaThList },
    { label: "Create Room", path: "/super-admin/create-room", icon: FaBed },
    {
      label: "All Bookings",
      path: "/super-admin/bookings",
      icon: FaConciergeBell,
    },
    {
      label: "Staff & Admins",
      path: "/super-admin/admins",
      icon: FaUserShield,
    },
    {
      label: "System Settings",
      path: "/super-admin/settings",
      icon: FaSlidersH,
    },
  ];

  const navItems = isAdmin ? adminNav : superAdminNav;

  const isActive = (item) => {
    if (item.exact) {
      return (
        location.pathname === item.path || location.pathname === `${item.path}/`
      );
    }
    return location.pathname.startsWith(item.path);
  };

  const handleRoleSwitch = () => {
    if (isAdmin) {
      navigate("/super-admin");
    } else {
      navigate("/admin");
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md shadow-amber-500/20">
              V
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-serif text-lg font-bold tracking-widest text-white block leading-none">
                  VIRUSIA
                </span>
                <span className="text-[10px] tracking-[0.2em] text-amber-500 uppercase font-semibold block mt-1">
                  {isAdmin ? "Admin Portal" : "Super Admin"}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? (
              <FaChevronRight className="text-sm" />
            ) : (
              <FaChevronLeft className="text-sm" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Role Badge Indicator */}
        {!collapsed && (
          <div className="px-5 py-3 border-b border-slate-800/50 bg-slate-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Mode
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  isAdmin
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                }`}
              >
                {isAdmin ? "Admin" : "Super Admin"}
              </span>
            </div>
          </div>
        )}

        {/* Main Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1 custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
            {!collapsed ? "Menu Navigation" : "•"}
          </div>

          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`text-lg shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-amber-400"}`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Switch Role & Footer Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-1">
          {/* Quick Switch Role Button */}
          <button
            onClick={handleRoleSwitch}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors border border-slate-700/50 cursor-pointer"
            title={
              collapsed
                ? `Switch to ${isAdmin ? "Super Admin" : "Admin"}`
                : undefined
            }
          >
            <FaExchangeAlt className="text-amber-400 shrink-0 text-sm" />
            {!collapsed && (
              <span className="truncate">
                Switch to {isAdmin ? "Super Admin" : "Admin"}
              </span>
            )}
          </button>

          {/* Return to Guest Site */}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
            title={collapsed ? "Guest Landing Site" : undefined}
          >
            <FaGlobe className="shrink-0 text-sm" />
            {!collapsed && (
              <span className="truncate">View Public Website</span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
