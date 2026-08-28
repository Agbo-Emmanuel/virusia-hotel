import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineKey,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { register } from "../../services/auth.service";
import aidra_icon from "../../assets/aidra_icon.png";

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

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminSecret: "aidra_admin_bootstrap_secret_change_me_in_production",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName) return toast.error("Full name is required");
    if (!formData.email) return toast.error("Email is required");
    if (!formData.adminSecret) return toast.error("Admin secret is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);

      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      };

      const response = await register(
        payload,
        // "aidra_admin_bootstrap_secret_change_me_in_production",
      );
      setLoading(false);

      toast.success(response?.message || "Admin registration successful!");

      const emailToPass = formData.email;

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        adminSecret: "",
        rememberMe: false,
      });

      navigate("/otp", { state: { email: emailToPass } });
    } catch (error) {
      setLoading(false);
      console.error("Admin registration error:", error);

      if (error.message === "Network Error") {
        toast.error("Network Error, please check your internet connection");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.msg ||
          "Admin registration failed";

        toast.error(errorMessage);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[150px] pointer-events-none" />

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
          size="10px"
          color="#22c55e"
          top="25%"
          left="85%"
          duration={8}
          delay={1}
        />
        <FloatingDot
          size="20px"
          color="#22c55e"
          top="70%"
          left="5%"
          duration={7}
          delay={2}
        />
        <FloatingDot
          size="20px"
          color="#22c55e"
          top="85%"
          left="80%"
          duration={9}
          delay={3}
        />
        <FloatingDot
          size="20px"
          color="#22c55e"
          top="10%"
          left="60%"
          duration={5}
          delay={4}
        />
        <FloatingDot
          size="20px"
          color="#22c55e"
          top="60%"
          left="90%"
          duration={10}
          delay={1.5}
        />
      </div>

      {/* Logo Section */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 md:left-12 md:translate-x-0 flex items-center gap-2 mb-2 cursor-pointer z-20"
      >
        <img
          src={aidra_icon}
          alt="Aidra Logo"
          className="w-10 h-10 object-contain"
        />
        <div className="text-white text-xl font-semibold flex items-center">
          Aid<span className="text-green-500">ra</span>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10 mt-20"
      >
        {/* Content Section */}
        <div className="text-center mb-10">
          <h1 className="text-xl md:text-4xl font-bold text-white mb-3">
            Admin Registration
          </h1>
          <p className="text-gray-400 text-lg">
            Create a new administrator account
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <label className={labelClasses}>Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <label className={labelClasses}>Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <label className={labelClasses}>Admin Secret</label>
            <div className="relative">
              <input
                type="password"
                name="adminSecret"
                placeholder="Enter admin bootstrap secret"
                value={formData.adminSecret}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <HiOutlineKey size={20} />
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className={labelClasses}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="relative group">
            <label className={labelClasses}>Confirm Password</label>
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
              >
                {showConfirmPassword ? (
                  <HiOutlineEyeOff size={20} />
                ) : (
                  <HiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-green-500 text-gray-900 font-bold rounded-2xl hover:bg-green-400 transition-all duration-300 shadow-xl shadow-green-500/20 cursor-pointer flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              "Register Admin"
            )}
          </motion.button>

          {/* Bottom Links */}
          <div className="text-center space-y-4">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-500 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
