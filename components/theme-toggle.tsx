"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/cn";

const themeOptions = [
  { value: "light", label: "روشن", icon: Sun },
  { value: "dark", label: "تیره", icon: Moon },
  { value: "system", label: "سیستم", icon: Monitor },
] as const;

export function ThemeToggle({
  variant = "ghost",
  size = "icon",
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null;
}) {
  // Use lazy initialization to check if we're on the client
  const [mounted] = useState(() => typeof window !== "undefined");
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Determine which icon to show based on theme
  const getIcon = () => {
    if (!mounted) {
      // Return a consistent default during SSR
      return <Sun className="h-4 w-4" />;
    }
    
    if (theme === "system") {
      return <Monitor className="h-4 w-4" />;
    }
    if (theme === "dark") {
      return <Moon className="h-4 w-4" />;
    }
    return <Sun className="h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "relative h-9 w-9 rounded-xl transition-all duration-200",
            resolvedTheme === "dark"
              ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-200"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          )}
        >
          {getIcon()}
          {mounted && theme === "system" && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-background" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                theme === option.value && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
              {theme === option.value && (
                <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}