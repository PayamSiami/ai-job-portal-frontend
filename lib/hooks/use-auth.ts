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
  const setAuthData = (user: User | null, token?: string) => {
    if (user && token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else if (!user) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    queryClient.setQueryData(authKeys.user, user);
  };

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login({ email, password }),
    onSuccess: (data) => {
      setAuthData(data.user, data.token);
      toast.success(`Welcome back, ${data.user.fullName}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  // Google OAuth Mutation
  const googleLoginMutation = useMutation({
    mutationFn: (idToken: string) => authService.loginWithGoogle(idToken),
    onSuccess: (response: { token: string; user: User }) => {
      const token = response?.token;
      const user = response?.user;
      if (!token || !user) return;

      setAuthData(user, token);
      toast.success(`Welcome back, ${user.username}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Google login failed");
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setAuthData(data.user, data.token);
      toast.success(`Welcome, ${data.user.fullName}!`);
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
