import { apiClient } from "@/lib/api/client";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
} from "@/lib/types/auth.types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  // Google OAuth login - sends Google ID token to backend for verification
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/google", {
      idToken,
      role: "job-seeker",
    });
    return response.data.data;
  },

  async logout(): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  async updateProfile(
    data: Partial<RegisterRequest>,
  ): Promise<AuthResponse["user"]> {
    const response = await apiClient.put("/auth/profile", data);
    return response.data;
  },

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiClient.post("/auth/change-password", { oldPassword, newPassword });
  },
};
