import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineArrowLeft } from "react-icons/hi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { forgotPassword } from "../../services/auth.service";

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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Your Email is required");

    try {
      setLoading(true);

      const response = await forgotPassword({ email });
      setLoading(false);
      // console.log(response);
      toast.success(response?.message || "OTP sent to your email");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        toast.error("Network Error, please check your internet connection");
      } else {
        toast.error(
          error.response?.data?.error ||
            "Something went wrong. Please try again.",
        );
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
      </div>

      {/* Back to Login */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-green-500 transition-colors z-20 group"
      >
        <HiOutlineArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Back to Login</span>
      </button>

      {/* Logo Section */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-8 right-8 items-center gap-2 cursor-pointer z-20 hidden md:flex"
      >
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600"
          >
            <path
              d="M12 2L3 7V12C3 17.52 6.84 22.09 12 24C17.16 22.09 21 17.52 21 12V7L12 2ZM12 4.13L19 8V12C19 16.63 15.93 20.47 12 22.09C8.07 20.47 5 16.63 5 12V8L12 4.13Z"
              fill="currentColor"
            />
            <path
              d="M12 8L10 12H14L12 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">
          Aid<span className="text-green-500">ra</span>
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500">
            <HiOutlineMail size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Forgot Password?
          </h1>
          <p className="text-gray-400">
            Enter your email address to recover your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className={labelClasses}>Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="aidra2025@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                required
              />
            </div>
          </div>

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
              "Send Reset Link"
            )}
          </motion.button>
        </form>

        <div className="text-center mt-10">
          <Link
            to="/login"
            className="text-green-500 font-semibold hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
