export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: "job-seeker";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: "job-seeker" | "employer";
}

export interface AuthResponse {
  token: string;
  message: string;
  title: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
