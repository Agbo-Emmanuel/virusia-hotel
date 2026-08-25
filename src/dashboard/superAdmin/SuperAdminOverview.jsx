import React, { useState } from "react";
import StatCard from "../components/StatCard";
import {
  FaChartLine,
  FaDollarSign,
  FaBed,
  FaUserShield,
  FaDownload,
  FaPlus,
  FaHistory,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSlidersH,
  FaCrown,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SuperAdminOverview = () => {
  const auditLogs = [
    {
      id: 1,
      admin: "Sarah Jenkins (Admin)",
      action: "Updated room status for Suite 401 to Occupied",
      time: "15 mins ago",
      type: "update",
    },
    {
      id: 2,
      admin: "Alexander Wright (Super Admin)",
      action: "Adjusted weekend seasonal price multiplier to +15%",
      time: "1 hour ago",
      type: "system",
    },
    {
      id: 3,
      admin: "Paystack Gateway",
      action: "Automated payout of $14,250.00 processed",
      time: "3 hours ago",
      type: "finance",
    },
    {
      id: 4,
      admin: "System Auto-Cleaner",
      action: "Automated daily Database Backup completed successfully",
      time: "5 hours ago",
      type: "system",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-500/30 flex items-center gap-1.5">
              <FaCrown className="text-amber-400" />
              Executive Super Admin Console
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif mt-3">
            System Executive Dashboard
          </h1>
          <p className="text-purple-100/80 text-sm mt-2">
            High-level revenue tracking, master room pricing control, staff access permissions, and financial logs for Virusia Hotel & Suites.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => toast.info("Opening Add Admin Staff Dialog")}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <FaUserPlusIcon />
              <span>Add New Admin Staff</span>
            </button>
            <button
              onClick={() => toast.success("Financial Summary CSV downloaded")}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <FaDownload />
              <span>Export System Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Gross Revenue"
          value="$148,920.00"
          change="+24.8% YoY"
          isPositive={true}
          icon={FaDollarSign}
          color="emerald"
          subtitle="All rooms & services"
        />
        <StatCard
          title="System Occupancy"
          value="89.4%"
          change="+6.2% vs target"
          isPositive={true}
          icon={FaBed}
          color="amber"
          subtitle="50 total hotel suites"
        />
        <StatCard
          title="Active Admin Staff"
          value="6 Accounts"
          change="All active"
          isPositive={true}
          icon={FaUserShield}
          color="purple"
          subtitle="2 Super, 4 Admin"
        />
        <StatCard
          title="Average Daily Rate (ADR)"
          value="$580.00"
          change="+14.2% yield"
          isPositive={true}
          icon={FaChartLine}
          color="blue"
          subtitle="Peak season rate"
        />
      </div>

      {/* Revenue Breakdown & Activity Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue distribution by Room Category */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Revenue & Yield Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Monthly distribution across room categories and add-on services.
              </p>
            </div>

            <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
              Q3 Target Exceeded
            </span>
          </div>

          {/* Progress Bars for Room Categories */}
          <div className="space-y-4 pt-2">
            {[
              { category: "Presidential & Penthouse Suites", amount: "$64,200.00", percentage: 43, color: "bg-purple-600" },
              { category: "Executive & Ocean View Suites", amount: "$46,800.00", percentage: 31, color: "bg-amber-600" },
              { category: "Deluxe Rooms", amount: "$24,500.00", percentage: 16, color: "bg-blue-600" },
              { category: "Standard Rooms & Add-ons", amount: "$13,420.00", percentage: 10, color: "bg-emerald-600" },
            ].map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.category}</span>
                  <span className="text-slate-900 font-extrabold">{item.amount} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                %
              </div>
              <div>
                <p className="font-bold text-slate-900">Dynamic Pricing Engine Active</p>
                <p className="text-slate-500 text-[11px]">Automatic weekend surge pricing (+15%) enabled.</p>
              </div>
            </div>
            <button
              onClick={() => toast.info("Redirecting to Settings")}
              className="text-amber-700 font-bold hover:underline"
            >
              Configure Engine
            </button>
          </div>
        </div>

        {/* Right Col: System Activity Audit Log */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FaHistory className="text-amber-600 text-sm" />
              <h3 className="font-bold text-slate-900 text-base font-serif">Audit Log</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Live Feed</span>
          </div>

          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">{log.admin}</p>
                  <p className="text-slate-600 mt-0.5">{log.action}</p>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    {log.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FaUserPlusIcon = () => <FaPlus className="text-xs" />;

export default SuperAdminOverview;
