import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({
  title,
  value,
  isPositive = true,
  icon: Icon,
  color = "amber",
  subtitle,
}) => {
  const colorMap = {
    amber: {
      bgIcon: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "from-amber-500/10 to-amber-600/5",
      border: "hover:border-amber-300",
    },
    blue: {
      bgIcon: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "from-blue-500/10 to-blue-600/5",
      border: "hover:border-blue-300",
    },
    emerald: {
      bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "from-emerald-500/10 to-emerald-600/5",
      border: "hover:border-emerald-300",
    },
    purple: {
      bgIcon: "bg-purple-50 text-purple-600 border-purple-100",
      accent: "from-purple-500/10 to-purple-600/5",
      border: "hover:border-purple-300",
    },
    rose: {
      bgIcon: "bg-rose-50 text-rose-600 border-rose-100",
      accent: "from-rose-500/10 to-rose-600/5",
      border: "hover:border-rose-300",
    },
  };

  const selectedColor = colorMap[color] || colorMap.amber;

  return (
    <div
      className={`relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md ${selectedColor.border} group`}
    >
      {/* Soft background gradient glow */}
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${selectedColor.accent} blur-xl group-hover:scale-125 transition-transform duration-500`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            className={`p-3.5 rounded-xl border ${selectedColor.bgIcon} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
          >
            <Icon className="text-xl" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between relative z-10 pt-3 border-t border-slate-100 text-xs">
        {subtitle && (
          <span className="text-slate-500 font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
