export const ENDPOINTS = {
  // Auth
  REGISTER: "/api/user/signup",
  VERIFY_OTP: "/api/user/verify-email",
  RESEND_OTP: "/api/user/resend-otp",
  LOGIN: "/api/user/login",
  LOGOUT: "/api/user/logout",
  REFRESH_TOKEN: "/api/user/refresh-token",
  FORGOT_PASSWORD: "/api/user/forgot-password",
  RESET_PASSWORD: "/api/user/reset-password",

  //Room
  GET_ALL_ROOMS: "/api/room/get-all-rooms",
  CREATE_ROOM: "/api/room/create-room",
  APRROVE_KYC: (user_id) => `/api/admin/kyc/${user_id}/approve`,

  //Booking
  GET_ALL_BOOKINGS: "/api/booking/get-all-bookings",
  CREATE_BOOKING: "/api/booking/create-booking",
  UPDATE_BOOKING_STATUS: "/api/booking/update-booking-status",
};
