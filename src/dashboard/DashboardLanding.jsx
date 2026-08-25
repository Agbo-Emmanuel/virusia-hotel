import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import { FaChevronRight, FaHome } from "react-icons/fa";

const DashboardLanding = ({ defaultRole }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto detect role from route or prop
  const currentRole =
    defaultRole ||
    (location.pathname.startsWith("/super-admin") ? "superAdmin" : "admin");

  // Helper for human readable path breadcrumb
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    if (paths.length === 0) return [];
    return paths.map((p, idx) => {
      const url = "/" + paths.slice(0, idx + 1).join("/");
      let label = p.replace("-", " ");
      if (p === "admin") label = "Admin Portal";
      if (p === "super-admin") label = "Super Admin";
      return { label, url };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        role={currentRole}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Top Navbar */}
      <TopHeader
        role={currentRole}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link
            to="/"
            className="hover:text-amber-600 flex items-center gap-1.5 font-medium transition"
          >
            <FaHome className="text-slate-400" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={b.url}>
              <FaChevronRight className="text-[10px] text-slate-400" />
              <Link
                to={b.url}
                className={`capitalize font-semibold transition ${
                  idx === breadcrumbs.length - 1
                    ? "text-amber-700 pointer-events-none"
                    : "text-slate-600 hover:text-amber-600"
                }`}
              >
                {b.label}
              </Link>
            </React.Fragment>
          ))}
        </div>

        {/* Dynamic Nested Page Content */}
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Dashboard Footer */}
      <footer
        className={`bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <p>© 2026 Virusia Hotel & Suites. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-slate-600 cursor-pointer">System Status: Normal</span>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLanding;
