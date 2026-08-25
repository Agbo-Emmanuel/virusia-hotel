import React, { useState } from "react";
import {
  FaSlidersH,
  FaHotel,
  FaDollarSign,
  FaCreditCard,
  FaClock,
  FaSave,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SuperAdminSettings = () => {
  const [settings, setSettings] = useState({
    hotelName: "VIRUSIA Hotel & Suites",
    address: "Luxury Ocean Boulevard, Bay Haven",
    conciergePhone: "+1 (800) 847-8742",
    currency: "USD ($)",
    vatRate: 7.5,
    serviceCharge: 10.0,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    paystackMode: "Test Mode",
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("System configurations updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
          System & Hotel Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure global platform parameters, financial tax rates, payment gateway integrations, and hotel policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Hotel Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaHotel className="text-amber-600 text-sm" />
            <h3 className="font-extrabold text-slate-900 text-base font-serif">
              Hotel Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hotel Property Name</label>
              <input
                type="text"
                value={settings.hotelName}
                onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Concierge Phone Number</label>
              <input
                type="text"
                value={settings.conciergePhone}
                onChange={(e) => setSettings({ ...settings, conciergePhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Currency & Financial Taxes Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaDollarSign className="text-emerald-600 text-sm" />
            <h3 className="font-extrabold text-slate-900 text-base font-serif">
              Financial & Tax Configurations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Base Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none font-semibold"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="NGN (₦)">NGN (₦)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">VAT Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.vatRate}
                onChange={(e) => setSettings({ ...settings, vatRate: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Hospitality Service Charge (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.serviceCharge}
                onChange={(e) => setSettings({ ...settings, serviceCharge: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Paystack Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FaClock className="text-purple-600 text-sm" />
            <h3 className="font-extrabold text-slate-900 text-base font-serif">
              Check-in / Check-out & Gateway Policy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Check-in Time</label>
              <input
                type="time"
                value={settings.checkInTime}
                onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Check-out Time</label>
              <input
                type="time"
                value={settings.checkOutTime}
                onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Paystack Gateway Environment</label>
              <select
                value={settings.paystackMode}
                onChange={(e) => setSettings({ ...settings, paystackMode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none font-semibold"
              >
                <option value="Test Mode">Test Mode (Development Sandbox)</option>
                <option value="Live Production Mode">Live Production Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-amber-600/20 text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <FaSave />
            <span>Save System Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuperAdminSettings;
