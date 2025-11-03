"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/store/useAuth";
import { getToken } from "@/lib/auth";
import { useTheme } from "@/store/useTheme";
import { STORAGE_KEYS } from "@/lib/config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuth((state) => state.token);
  const setToken = useAuth((state) => state.setToken);
  const setTheme = useTheme((state) => state.setTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run initialization once
    if (isInitialized) return;

    const savedToken = getToken();

    // Load theme preference first
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(prefersDark);

    // Check authentication
    if (savedToken) {
      setToken(savedToken);
      setIsInitialized(true);
    } else {
      // No token found, redirect to login
      setIsInitialized(true);
      router.replace("/login");
    }
  }, [isInitialized, router, setToken, setTheme]);

  // Show loading state while checking auth
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If initialized but no token, don't render (redirecting to login)
  if (isInitialized && !token) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
