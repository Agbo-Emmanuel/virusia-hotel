import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBed,
  FaCalendarCheck,
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaConciergeBell,
} from "react-icons/fa";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Rooms & Suites", path: "/rooms" },
    // { label: "Amenities", path: "/amenities" },
    {
      // label: "My Bookings",
      // path: "/my-bookings",
      // badge: activeBookingsCount,
    },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-header py-3 border-b border-slate-100"
          : "bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100/60"
      }`}
    >
      {/* Top micro bar for telephone & location */}
      <div className="hidden lg:block border-b border-slate-100 pb-2 mb-3 px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <FaPhoneAlt className="text-amber-600 text-xs" />
              +1 (800) 847-8742 (24/7 Concierge)
            </span>
            <span className="flex items-center gap-2">
              <FaConciergeBell className="text-amber-600 text-xs" />
              Luxury Ocean Boulevard, Bay Haven
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              BEST RATE GUARANTEE
            </span>
            <Link to="/contact" className="hover:text-amber-600 transition">
              Help & FAQ
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-slate-900 block leading-none">
                VIRUSIA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-amber-600 uppercase font-semibold block mt-0.5">
                Hotel & Suites
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? "text-amber-600"
                    : "text-slate-700 hover:text-amber-600"
                }`}
              >
                {link.label}
                {/* {link.badge > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {link.badge}
                  </span>
                )} */}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600 rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/rooms")}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-amber-600/20 hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <FaBed className="text-base" />
              <span>Book A Room</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-base font-semibold ${
                isActive(link.path)
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{link.label}</span>
              {link.badge > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {link.badge} active
                </span>
              )}
            </Link>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/rooms");
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <FaCalendarCheck />
              <span>Browse All Rooms</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
