import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

// Public: rooms free for the selected dates and party size.
// params: { checkIn: "YYYY-MM-DD", checkOut: "YYYY-MM-DD", adults, children }
export const getAvailableRooms = async ({
  checkIn,
  checkOut,
  adults,
  children,
}) => {
  const response = await api.get(ENDPOINTS.GET_AVAILABLE_ROOMS, {
    params: { checkIn, checkOut, adults, children },
  });
  return response.data;
};

// Public: online per-night booking (pay at the hotel)
export const createBooking = async (payload) => {
  const response = await api.post(ENDPOINTS.CREATE_BOOKING, payload);
  return response.data;
};

// Staff only: front-desk booking (per-night or per-hour)
export const createAdminBooking = async (payload) => {
  const response = await api.post(ENDPOINTS.ADMIN_CREATE_BOOKING, payload);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get(ENDPOINTS.GET_ALL_BOOKINGS);
  return response.data;
};

export const updateBookingStatus = async (payload) => {
  const response = await api.put(ENDPOINTS.UPDATE_BOOKING_STATUS, payload);
  return response.data;
};
