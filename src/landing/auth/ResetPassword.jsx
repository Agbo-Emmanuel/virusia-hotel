import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { resetPassword } from "../../services/auth.service";

const FloatingDot = ({ size, color, top, left, duration, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
      x: [0, 20, 0],
      y: [0, -20, 0],
    }}
    transition={{
      duration: duration || 5,
      repeat: Infinity,
      delay: delay || 0,
      ease: "easeInOut",
    }}
    className="absolute rounded-full blur-[2px]"
    style={{
      width: size || "30px",
      height: size || "30px",
      backgroundColor: color || "#22c55e",
      top: top || "50%",
      left: left || "50%",
      boxShadow: `0 0 20px ${color || "#22c55e"}`,
    }}
  />
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) return toast.error("OTP is required");
    if (!formData.newPassword) return toast.error("New password is required");
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const payload = {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      };

      const response = await resetPassword(payload);
      setLoading(false);
      toast.success(response.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.error ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const inputClasses =
    "w-full bg-white text-gray-900 px-4 py-3 rounded-md border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300";
  const labelClasses = "block text-gray-300 text-sm font-medium mb-2";

  return (
    <div className="relative min-h-screen bg-[#050a08] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Dots */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingDot
          size="20px"
          color="#22c55e"
          top="15%"
          left="10%"
          duration={6}
          delay={0}
        />
        <FloatingDot
          size="20px"
          color="#22c55e"
          top="85%"
          left="80%"
          duration={9}
          delay={3}
        />
      </div>

      <button
        onClick={() => navigate("/forgot-password")}
        className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-green-500 transition-colors z-20 group"
      >
        <HiOutlineArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Back</span>
      </button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500">
            <HiOutlineShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Reset Password
          </h1>
          <p className="text-gray-400">
            Resetting password for:{" "}
            <span className="text-white font-medium">
              {formData.email || "Unknown Email"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className={labelClasses}>Verification OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div className="group">
            <label className={labelClasses}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500"
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="group">
            <label className={labelClasses}>Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500"
              >
                {showConfirmPassword ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-green-500 text-gray-900 font-bold rounded-2xl hover:bg-green-400 transition-all duration-300 shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>

        <div className="text-center mt-10">
          <Link
            to="/login"
            className="text-gray-400 hover:text-green-500 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
