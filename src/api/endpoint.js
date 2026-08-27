export const ENDPOINTS = {
  // Auth
  INDIVIDUAL_REGISTER: "/api/auth/register",
  ORG_REGISTER: "/api/auth/register/organization",
  VERIFY_OTP: "/api/auth/verify-email",
  RESEND_OTP: "/api/auth/resend-otp",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REFRESH_TOKEN: "/api/auth/refresh-token",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  ADMIN_REGISTER: "/api/admin/register",

  //Room
  GET_ALL_ROOMS: "/api/room/get-all-rooms",
  CREATE_ROOM: "/api/room/create-room",
  APRROVE_KYC: (user_id) => `/api/admin/kyc/${user_id}/approve`,

  //Booking
  GET_ALL_BOOKINGS: "/api/booking/get-all-bookings",
  CREATE_BOOKING: "/api/booking/create-booking",
  UPDATE_BOOKING_STATUS: "/api/booking/update-booking-status",
};
