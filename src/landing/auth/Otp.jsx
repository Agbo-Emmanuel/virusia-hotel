import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMailOpen, HiOutlineArrowLeft } from "react-icons/hi";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { verifyRegisterCode } from "../../services/auth.service";

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

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const email = location.state?.email || "";

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Redirect back to register if no email is found in state
    if (!email) {
      toast.warning("Please register first");
      // navigate("/register");
      // Commented out for now to allow manual testing of the UI without full registration flow
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.every((char) => !isNaN(char))) {
      const newOtp = [...otp];
      pasteData.forEach((char, index) => {
        newOtp[index] = char;
      });
      setOtp(newOtp);

      // Focus the last filled input or the next empty one
      const lastIndex = Math.min(pasteData.length, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      return toast.error("Please enter the full 6-digit code");
    }

    if (!email) {
      return toast.error("User email not found. Please try registering again.");
    }

    try {
      setLoading(true);
      const payload = {
        email: email,
        otp: otpCode,
      };
      const response = await verifyRegisterCode(payload);
      setLoading(false);
      toast.success(response.message || "Email verified successfully!");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        toast.error("Network Error, please check your internet connection");
      } else {
        toast.error(error.response?.data?.error || "Verification failed");
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

  return (
    <div className="relative min-h-screen bg-[#050a08] flex items-center justify-center p-6 overflow-hidden text-white font-sans">
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

      {/* Back Button */}
      <button
        onClick={() => navigate("/register")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors z-20 group"
      >
        <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Register</span>
      </button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Content Section */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-lg shadow-green-500/5">
            <HiOutlineMailOpen size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Verify Email
          </h1>
          <p className="text-gray-400 text-lg">
            Please enter the 6-digit code sent to your email address.
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2 md:gap-4">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-14 md:w-16 md:h-20 bg-[#0a1410] border-2 border-green-500/20 rounded-xl text-center text-2xl md:text-3xl font-bold text-green-500 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 placeholder-transparent"
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-6">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-green-500 font-semibold hover:underline"
                onClick={() => toast.info("New code sent to your email!")}
              >
                Resend Code
              </button>
            </p>

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
                "Verify & Continue"
              )}
            </motion.button>
          </div>
        </form>

        {/* Support Link */}
        <p className="text-center mt-10 text-gray-500 text-sm">
          Having trouble?{" "}
          <Link to="/support" className="text-gray-400 hover:text-green-500">
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Otp;
