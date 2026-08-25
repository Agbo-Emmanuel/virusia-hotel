import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
} from "react-icons/fa";

const FAQS = [
  {
    question: "What are the check-in and check-out times at Virusia Hotel?",
    answer: "Standard check-in is at 3:00 PM and check-out is at 12:00 PM. Early check-in or late check-out can be requested when booking, subject to availability.",
  },
  {
    question: "Is airport pickup included with room reservations?",
    answer: "Luxury Mercedes S-Class airport transfer can be added during room checkout or comes complimentary with our Presidential and Penthouse Suites.",
  },
  {
    question: "What is the cancellation policy for bookings?",
    answer: "Reservations cancelled up to 48 hours prior to check-in receive a 100% full refund with no penalty fees.",
  },
  {
    question: "Are pets allowed at the hotel?",
    answer: "Small pets under 10kg are permitted in our designated Pet-Friendly Deluxe & Penthouse Suites with prior notice.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please complete all required fields");
      return;
    }
    toast.success("Thank you! Your message has been sent to our concierge team.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-cream text-slate-800 pt-24 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 mb-12 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
            24/7 CONCIERGE & HELP
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            Contact Virusia Hotel
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            Our dedicated hospitality team is available around the clock to assist with inquiries and special accommodations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* CONTACT INFO + FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* INFO CARDS */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xl">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-base">Resort Location</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  104 Luxury Ocean Boulevard, Bay Haven Resort District, CA 90210
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xl">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-base">Telephone Concierge</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  +1 (800) 847-8742 (Toll Free)<br />
                  +1 (555) 019-2834 (Direct Desk)
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xl">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-base">Email Inquiries</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  reservations@virusia-hotel.com<br />
                  concierge@virusia-hotel.com
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-luxury">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
              Send Us A Direct Message
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and our guest desk will reply within 1 hour.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Julian Thorne"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="julian@example.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="e.g. Special anniversary package inquiry"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="How can our concierge assist you?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <FaPaperPlane />
                <span>Submit Concierge Message</span>
              </button>
            </form>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="space-y-6 pt-8 border-t border-slate-200/80">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">
              HELPFUL INFORMATION
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif font-bold text-slate-900 text-base cursor-pointer hover:bg-slate-50/80 transition"
                  >
                    <span className="flex items-center gap-3">
                      <FaQuestionCircle className="text-amber-600 text-sm shrink-0" />
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <FaChevronUp className="text-amber-600 text-xs shrink-0" />
                    ) : (
                      <FaChevronDown className="text-slate-400 text-xs shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
