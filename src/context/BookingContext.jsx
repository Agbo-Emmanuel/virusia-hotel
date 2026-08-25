import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ROOMS_DATA } from "../data/rooms";

const BookingContext = createContext();

const LOCAL_STORAGE_KEY = "virusia_hotel_bookings";

export const BookingProvider = ({ children }) => {
  // Saved bookings array stored in localStorage
  const [savedBookings, setSavedBookings] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
    // Default initial sample booking for user delight
    return [
      {
        id: "VIR-984210",
        createdAt: "2026-08-20T10:30:00.000Z",
        room: ROOMS_DATA[0],
        checkIn: "2026-09-01",
        checkOut: "2026-09-04",
        nights: 3,
        guests: { adults: 2, children: 0 },
        addons: [
          { id: "breakfast_buffet", name: "Gourmet Buffet Breakfast", price: 35, count: 3, total: 105 },
        ],
        guestInfo: {
          fullName: "Alexander Sterling",
          email: "alexander@example.com",
          phone: "+1 (555) 234-5678",
          specialRequests: "High floor room with early check-in if possible.",
        },
        payment: {
          method: "card",
          cardLast4: "4242",
          totalAmount: 1067,
          baseTotal: 960,
          tax: 107,
          status: "Confirmed & Paid",
        },
        status: "Confirmed",
      },
    ];
  });

  // Modal active room state
  const [activeBookingModalRoom, setActiveBookingModalRoom] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Search & Filter Global state
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0];

  const defaultFilters = {
    searchQuery: "",
    category: "all",
    checkIn: today,
    checkOut: tomorrow,
    minPrice: 0,
    maxPrice: 1500,
    adults: 1,
    children: 0,
    selectedAmenities: [],
    sortBy: "recommended", // 'recommended', 'price-asc', 'price-desc', 'rating'
  };

  const [filters, setFilters] = useState(defaultFilters);

  // Sync saved bookings to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedBookings));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  }, [savedBookings]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const openBookingModal = (room) => {
    setActiveBookingModalRoom(room);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setActiveBookingModalRoom(null);
  };

  // Function to create a new booking
  const createBooking = (bookingData) => {
    const referenceCode = `VIR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: referenceCode,
      createdAt: new Date().toISOString(),
      status: "Confirmed",
      ...bookingData,
    };

    setSavedBookings((prev) => [newBooking, ...prev]);
    toast.success(`Booking ${referenceCode} confirmed successfully!`, {
      position: "top-right",
      autoClose: 4000,
    });

    return newBooking;
  };

  // Function to cancel an existing booking
  const cancelBooking = (bookingId) => {
    setSavedBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "Cancelled" } : b
      )
    );
    toast.info(`Booking ${bookingId} has been cancelled.`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Utility to format price
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <BookingContext.Provider
      value={{
        savedBookings,
        createBooking,
        cancelBooking,
        activeBookingModalRoom,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        filters,
        setFilters,
        resetFilters,
        formatPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
