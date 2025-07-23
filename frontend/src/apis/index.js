import axios from "axios";
import AuthService from "./authService";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Flag and variables for token refresh
let isRefreshing = false;
let failedRequestsQueue = [];

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if not a 401 error or it's a refresh token request
    if (
      error.response?.status !== 401 ||
      originalRequest.url.includes("/refresh-token")
    ) {
      return Promise.reject(error);
    }

    const isTokenExpired = error?.response?.data?.message === "TOKEN_EXPIRED";

    if (!isTokenExpired) {
      return Promise.reject(error);
    }

    // Handle concurrent requests during token refresh
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      })
        .then(() => API(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const { accessToken } = await AuthService.refreshAccessToken();

      localStorage.setItem("accessToken", accessToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      failedRequestsQueue.forEach(({ resolve }) => resolve());

      // Retry original request
      return API(originalRequest);
    } catch (refreshError) {
      // Reject all queued requests on refresh failure
      failedRequestsQueue.forEach(({ reject }) => reject(refreshError));

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      failedRequestsQueue = [];
    }
  }
);

export const handleApiError = (error) => {
  if (error.response) {
    console.error("API Error - Response:", error.response.data);
    console.error("Status:", error.response.status);
    console.error("Headers:", error.response.headers);

    return {
      message: error.response.data.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    console.error("API Error - Request:", error.request);
    return {
      message: "No response from server",
      status: 0,
    };
  } else {
    console.error("API Error - Message:", error.message);
    return {
      message: error.message,
      status: -1,
    };
  }
};

export default API;
