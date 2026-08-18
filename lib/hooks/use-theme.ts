"use client";

import { useContext } from "react";
import { ThemeProviderContext } from "@/components/providers/theme-provider";

export type Theme = "light" | "dark" | "system";

export interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
