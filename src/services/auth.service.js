import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const individualRegister = async (payload) => {
  const response = await api.post(ENDPOINTS.INDIVIDUAL_REGISTER, payload);
  return response.data;
};

export const orgRegister = async (payload) => {
  const response = await api.post(ENDPOINTS.ORG_REGISTER, payload);
  return response.data;
};
export const verifyOtp = async (payload) => {
  const response = await api.post(ENDPOINTS.VERIFY_OTP, null, {
    params: {
      email: payload.email,
      otp: payload.otp,
    },
  });
  return response.data;
};

export const resendOtp = async (payload) => {
  const response = await api.post(ENDPOINTS.RESEND_OTP, null, {
    params: {
      email: payload.email,
      purpose: payload.purpose,
    },
  });
  return response.data;
};

export const login = async (payload) => {
  const response = await api.post(ENDPOINTS.LOGIN, payload);
  return response.data;
};

export const logout = async (clearCookies) => {
  try {
    await api.post(ENDPOINTS.LOGOUT);
  } finally {
    if (typeof clearCookies === "function") clearCookies();
    window.location.href = "/login";
  }
};

export const refreshToken = async (payload) => {
  const response = await api.post(ENDPOINTS.REFRESH_TOKEN, null, {
    params: {
      token: payload.refreshToken,
    },
  });
  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, null, {
    params: {
      email: payload.email,
    },
  });
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await api.post(ENDPOINTS.RESET_PASSWORD, null, {
    params: {
      email: payload.email,
      otp: payload.otp,
      new_password: payload.newPassword,
    },
  });
  return response.data;
};

export const adminRegister = async (payload, adminSecret) => {
  const response = await api.post(ENDPOINTS.ADMIN_REGISTER, payload, {
    headers: {
      "x-admin-secret": adminSecret,
    },
  });
  return response.data;
};
