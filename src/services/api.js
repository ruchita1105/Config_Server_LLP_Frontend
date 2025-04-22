import axios from "axios";

let onTokenExpiredCallback = null;
let isRefreshing = false;
let failedQueue = [];

export const setOnTokenExpired = (callback) => {
  onTokenExpiredCallback = callback;
};

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Could not access localStorage:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Skip token refresh handling for login and register endpoints
    const isAuthEndpoint =
      originalRequest.url.includes("/login") ||
      originalRequest.url.includes("/register");

    if (isAuthEndpoint || error.response?.status !== 401 || originalRequest._retry) {
      return handleNonTokenErrors(error);
    }

    originalRequest._retry = true;
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return handleTokenExpiration();
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(API(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/refresh-token`,
        { refreshToken }
      );

      const { token } = res.data;
      localStorage.setItem("token", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      processQueue(null, token);
      return API(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      return handleRefreshFailure(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Helpers
const handleNonTokenErrors = (error) => {
  if (error.message === "Network Error" && !error.response) {
    alert("🚫 Backend server is unreachable. Please start the Spring Boot server.");
  }
  return Promise.reject(error);
};

const handleTokenExpiration = () => {
  if (onTokenExpiredCallback) {
    onTokenExpiredCallback();
  } else {
    logoutUser("⚠️ Session expired. Please log in again.");
  }
  return Promise.reject(new Error("Session expired"));
};

const handleRefreshFailure = (error) => {
  if (onTokenExpiredCallback) {
    onTokenExpiredCallback();
  } else {
    logoutUser("⚠️ Refresh token expired. Please log in again.");
  }
  return Promise.reject(error);
};

let isLoggingOut = false;
const logoutUser = (message) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  alert(message);
  localStorage.clear();
  window.location.href = "/login";
};

export default API;
