"use client";

import React, { createContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Theme, ThemeProviderState } from "@/lib/hooks/use-theme";

const STORAGE_KEY = "theme";

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return getStoredTheme() ?? defaultTheme;
    }
    return defaultTheme;
  });

  // Track only the actual OS preference in state
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    return getSystemPreference();
  });

  const applyTheme = useCallback((resolved: "light" | "dark") => {
    const root = document.documentElement;
    const isDark = resolved === "dark";
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  }, []);

  // DERIVED STATE: No need for a useEffect or useState here. 
  // It automatically recalculates whenever `theme` or `systemTheme` changes.
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  // 1. Apply the theme to the DOM whenever resolvedTheme updates
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme, applyTheme]);

  // 2. Listen for OS-level preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Using setState inside an event listener callback is perfectly fine and won't trigger the warning
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []); // Only needs to run once on mount

  const setTheme = useCallback(
    (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // ignore
      }
      setThemeState(newTheme);
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  }, [theme, setTheme]);

  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}