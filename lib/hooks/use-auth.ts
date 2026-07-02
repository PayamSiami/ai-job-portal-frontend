"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import { User } from "@/lib/types/auth.types";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem("accessToken", response.jwt);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    localStorage.setItem("accessToken", response.jwt);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success("Logged out successfully");
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
