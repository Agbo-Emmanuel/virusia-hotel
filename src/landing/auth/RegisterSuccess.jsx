import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import SEO from "../components/SEO";

function VirusiaLogo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-6 text-center">
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
    </div>
  );
}

const RegisterSuccess = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <SEO
        title="Registration Successful | Virusia Hotel & Suites"
        description="Your Virusia Hotel account registration is complete."
      />

      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(197,160,89,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(197,160,89,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <VirusiaLogo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 p-8 rounded-3xl shadow-[0_15px_50px_rgba(197,160,89,0.1)] text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center mx-auto mb-5 h-16 w-16 rounded-full bg-amber-50 border border-amber-200"
          >
            <FiCheckCircle className="h-9 w-9 text-amber-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2"
          >
            Registration Complete
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Thank you for registering with Virusia Hotel & Suites. Please check
            your email to verify your account before signing in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8"
          >
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl py-3.5 px-4 transition-all duration-300 shadow-md shadow-amber-600/20 hover:shadow-lg"
            >
              Go to Sign In
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-4 text-slate-400 text-xs"
          >
            Didn’t receive the email? Check your spam folder.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterSuccess;
