import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTripadvisor,
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Virusia Hotel VIP offers!");
    setEmail("");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md shadow-amber-500/20">
                V
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-white block leading-none">
                  VIRUSIA
                </span>
                <span className="text-[10px] tracking-[0.25em] text-amber-500 uppercase font-semibold block mt-0.5">
                  Hotel & Suites
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Experience the pinnacle of coastal luxury, personalized concierge service, and Michelin-inspired gastronomy at Virusia Hotel.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#facebook"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#twitter"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#tripadvisor"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Tripadvisor"
              >
                <FaTripadvisor />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-white font-semibold text-lg mb-4 tracking-wide border-b border-amber-600/30 pb-2 inline-block">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-amber-400 transition">
                  Browse All Rooms
                </Link>
              </li>
              <li>
                <Link to="/amenities" className="hover:text-amber-400 transition">
                  Hotel Amenities & Spa
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-amber-400 transition">
                  My Reservations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition">
                  Contact & Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-white font-semibold text-lg mb-4 tracking-wide border-b border-amber-600/30 pb-2 inline-block">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-amber-500 mt-1 shrink-0" />
                <span>104 Luxury Ocean Boulevard, Bay Haven Resort District</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-500 shrink-0" />
                <span>+1 (800) 847-8742</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500 shrink-0" />
                <span>reservations@virusia-hotel.com</span>
              </li>
            </ul>
          </div>

          {/* VIP Newsletter */}
          <div>
            <h4 className="font-serif text-white font-semibold text-lg mb-4 tracking-wide border-b border-amber-600/30 pb-2 inline-block">
              VIP Privileges
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to receive private offer codes, complimentary upgrades, and seasonal packages.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-amber-600 hover:bg-amber-700 text-white px-3 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                  aria-label="Subscribe"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Virusia Hotel & Suites. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <FaShieldAlt className="text-emerald-500" /> 100% Encrypted & Secure Checkout
            </span>
            <div className="flex items-center gap-2 text-slate-400">
              <FaCreditCard className="text-amber-500" />
              <span>Cards & Paystack Accepted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
