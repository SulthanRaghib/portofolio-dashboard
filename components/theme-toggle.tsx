"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/store/useTheme";
import { STORAGE_KEYS } from "@/lib/config";

export function ThemeToggle() {
  const isDark = useTheme((state) => state.isDark);
  const toggle = useTheme((state) => state.toggle);

  useEffect(() => {
    // Load theme from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      const prefersDark =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (prefersDark !== isDark) {
        useTheme.setState({ isDark: prefersDark });
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        localStorage.setItem(STORAGE_KEYS.THEME, "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem(STORAGE_KEYS.THEME, "light");
      }
    }
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="rounded-full cursor-pointer"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
