import React from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBroom,
  FaTools,
  FaUserCheck,
  FaSignOutAlt,
} from "react-icons/fa";

const statusConfigs = {
  // Room statuses
  available: {
    label: "Available",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: FaCheckCircle,
  },
  occupied: {
    label: "Occupied",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: FaUserCheck,
  },
  cleaning: {
    label: "Cleaning",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: FaBroom,
  },
  maintenance: {
    label: "Maintenance",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    icon: FaTools,
  },

  // Booking statuses
  confirmed: {
    label: "Confirmed",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: FaCheckCircle,
  },
  "checked-in": {
    label: "Checked In",
    bg: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
    icon: FaUserCheck,
  },
  "checked-out": {
    label: "Checked Out",
    bg: "bg-slate-100 text-slate-700 border-slate-300",
    dot: "bg-slate-500",
    icon: FaSignOutAlt,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    icon: FaTimesCircle,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: FaClock,
  },
};

const StatusBadge = ({ status, size = "md", showIcon = true }) => {
  const normalized = (status || "").toLowerCase().replace(/\s+/g, "-");
  const config = statusConfigs[normalized] || {
    label: status || "Unknown",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
    icon: FaClock,
  };

  const IconComponent = config.icon;
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${paddingClass} transition-all`}
    >
      {showIcon ? (
        <IconComponent className="text-[10px]" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
