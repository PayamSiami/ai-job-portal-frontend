import { apiClient } from "../api/client";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: "JOB_SEEKER" | "EMPLOYER";
}

interface AuthResponse {
  jwt: string;
  message: string;
  title: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    status: string;
  };
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },
};
