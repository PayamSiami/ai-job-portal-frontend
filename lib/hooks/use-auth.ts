"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import toast from "react-hot-toast";
import { RegisterRequest, User } from "../types/auth.types";

const authKeys = {
  user: ["auth", "user"] as const,
};

// Safely read user from localStorage (Runs strictly client-side)
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  // 1. Single source of truth managed by TanStack Query
  const { data: user = null, isLoading } = useQuery<User | null>({
    queryKey: authKeys.user,
    queryFn: getStoredUser,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Helper to sync query cache + localStorage
  const setAuthData = (
    user: User | null,
    token?: string,
    refreshToken?: string,
  ) => {
    if (user && token) {
      localStorage.setItem("accessToken", token);
      // Persist the refresh token when the backend issues one — the axios
      // 401 interceptor depends on it to renew expired sessions.
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(user));
    } else if (!user) {
      // Remove tokens AND cached user on logout — leaving a stale
      // refreshToken behind could confuse the axios refresh interceptor.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    queryClient.setQueryData(authKeys.user, user);
  };

  // Safe display name (User exposes both fullName and username)
  const displayName = (user: User) => user.fullName || user.username || "there";

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login({ email, password }),
    onSuccess: (data) => {
      setAuthData(data.user, data.token, data.refreshToken);
      toast.success(`Welcome back, ${displayName(data.user)}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  // Google OAuth Mutation
  const googleLoginMutation = useMutation({
    mutationFn: (idToken: string) => authService.loginWithGoogle(idToken),
    onSuccess: (data) => {
      if (!data?.token || !data?.user) {
        toast.error("پاسخ نامعتبر از سرور هنگام ورود با گوگل");
        return;
      }
      setAuthData(data.user, data.token, data.refreshToken);
      toast.success(`Welcome back, ${displayName(data.user)}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Google login failed");
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setAuthData(data.user, data.token, data.refreshToken);
      toast.success(`Welcome, ${displayName(data.user)}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  // Logout Handler
  const logout = () => {
    authService.logout();
    setAuthData(null);
    toast.success("Logged out successfully");
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    // Actions
    login: loginMutation.mutateAsync,
    loginWithGoogle: googleLoginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    // Status Flags
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
