import axios from "axios";
import { BASE_URL } from "../config/apiConfig";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { refreshToken as refreshTokenApi } from "../services/auth.service";
import { ENDPOINTS } from "./endpoint";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s to handle Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Login.jsx saves the JWT in localStorage ("token"); older code used a cookie.
// Check both so the staff-only booking routes always receive the token.
const getStoredToken = () => {
  try {
    const fromStorage = localStorage.getItem("token");
    if (fromStorage) return fromStorage;
  } catch {
    // localStorage can be unavailable (private mode); fall through to the cookie
  }
  return new Cookies().get("accessToken");
};

const clearSession = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  } catch {
    // ignore
  }
  const cookies = new Cookies();
  cookies.remove("accessToken", { path: "/" });
  cookies.remove("refreshToken", { path: "/" });
  cookies.remove("userData", { path: "/" });
};

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.data?.detail === "Invalid or expired token" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // prevent infinite retry loops

      const cookies = new Cookies();
      const storedRefreshToken = cookies.get("refreshToken");

      try {
        const response = await refreshTokenApi({
          refreshToken: storedRefreshToken,
        });
        const newAccessToken = response.data.access_token;
        console.log("new access token", response);

        // Save the new accessToken to cookies
        cookies.set("accessToken", newAccessToken, { path: "/" });

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log(refreshError.response?.data?.message);
        toast.error(
          refreshError.response?.data?.message ||
            "Session expired. Please log in again.",
        );
        // Optionally clear cookies and redirect
        clearSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // The booking backend answers 401 when a token is missing, invalid or expired.
    // Send the user back to sign in instead of leaving the dashboard stuck on
    // "Failed to load". Login attempts themselves are left alone.
    const isLoginCall = originalRequest?.url?.includes(ENDPOINTS.LOGIN);
    const hadToken = Boolean(originalRequest?.headers?.Authorization);
    if (error.response?.status === 401 && hadToken && !isLoginCall) {
      clearSession();
      toast.error("Your session has expired. Please sign in again.");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
