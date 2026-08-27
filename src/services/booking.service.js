import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const createBooking = async (payload) => {
  const response = await api.post(ENDPOINTS.CREATE_BOOKING, payload);
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
