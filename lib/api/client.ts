import axios from "axios";
import { config } from "../config";

// Access environment variable using bracket notation
const API_GATEWAY = config.NEXT_PUBLIC_API_GATEWAY_URL;

export const apiClient = axios.create({
  baseURL: API_GATEWAY,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if no response or already retried
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      originalRequest._retry = true;

      try {
        // Only run on client side
        if (typeof window === "undefined") {
          return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_GATEWAY}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Clear auth and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors with better messaging
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    console.error("API Error:", errorMessage);

    return Promise.reject(error);
  },
);

// Helper function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Helper function to clear auth
export const clearAuth = () => {
  delete apiClient.defaults.headers.common["Authorization"];
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};
