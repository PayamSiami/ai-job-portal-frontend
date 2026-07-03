export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: 'JOB_SEEKER' | 'EMPLOYER';
}

export interface AuthResponse {
  jwt: string;
  message: string;
  title: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}