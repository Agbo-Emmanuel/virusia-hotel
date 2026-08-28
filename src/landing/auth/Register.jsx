import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { register } from "../../services/auth.service";
import SEO from "../components/SEO";

function VirusiaLogo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-8 text-center">
      <Link
        to="/"
        className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-amber-600/20 border border-amber-400/30">
          V
        </div>
        <div className="text-left">
          <span className="font-serif text-2xl font-bold tracking-widest text-slate-900 block leading-none">
            VIRUSIA
          </span>
          <span className="text-[10px] tracking-[0.25em] text-amber-600 uppercase font-semibold block mt-1">
            Hotel & Suites
          </span>
        </div>
      </Link>
      <p className="text-slate-500 text-xs sm:text-sm tracking-wide font-medium mt-1">
        Luxury Stay & World-Class Hospitality
      </p>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 5) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      toast.success("Account created! Please check your email to verify.");
      navigate("/register/success");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass =
    "w-full bg-slate-50/80 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all duration-300 font-medium text-sm sm:text-base";

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <SEO
        title="Create Account | Virusia Hotel & Suites"
        description="Create your Virusia Hotel account today to book luxury rooms, manage reservations, and enjoy premium hospitality."
      />

      {/* Background ambient light - Luxury warm theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(197,160,89,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(197,160,89,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-amber-600/5 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <VirusiaLogo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 p-6 sm:p-8 rounded-3xl shadow-[0_15px_50px_rgba(197,160,89,0.1)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(197,160,89,0.15)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">
              Create an Account
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Start your journey with Virusia Hotel & Suites today.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.06, delayChildren: 0.1 },
              },
            }}
          >
            {/* Full Name */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-1.5"
            >
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors">
                  <FiUser className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputBaseClass}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Email Address */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-1.5"
            >
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors">
                  <FiMail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputBaseClass}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Phone Number */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-1.5"
            >
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 ml-1">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors">
                  <FiPhone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={inputBaseClass}
                  placeholder="+1 (555) 000-0000"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Passwords */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors">
                    <FiLock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputBaseClass} pr-10`}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors">
                    <FiLock className="h-5 w-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputBaseClass} pr-10`}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-all duration-300 mt-6 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-600/20 hover:shadow-lg hover:shadow-amber-600/30"
            >
              {loading ? (
                <>
                  <CgSpinner className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </motion.button>
          </motion.form>

          <div className="mt-8 text-center pt-4 border-t border-slate-100">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-4 decoration-amber-500/30 hover:decoration-amber-600 transition-all duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
