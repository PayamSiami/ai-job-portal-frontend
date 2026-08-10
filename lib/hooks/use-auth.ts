/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { authService } from "@/lib/services/auth.service";
import toast from "react-hot-toast";
import { RegisterRequest, User } from "../types/auth.types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.fullName}!`);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    }
  }, []);

  // Google OAuth login
  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      const response: any = await authService.loginWithGoogle(idToken);
      console.log("Google login response:", response);
      if (!response?.data?.token || !response?.data?.user) {
        return;
      }
      localStorage.setItem("accessToken", response?.data?.token);
      localStorage.setItem("user", JSON.stringify(response?.data?.user));
      setUser(response?.data?.user);
      toast.success(`خوش آمدید، ${response?.data?.user.username}!`);
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google login failed";
      toast.error(message);
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      toast.success(`Welcome, ${response.user.fullName}!`);
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  // Update user function
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        return response.accessToken;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
      return null;
    }
  }, [logout]);

  return {
    user,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    refreshToken,
    isAuthenticated: !!user,
  };
};
