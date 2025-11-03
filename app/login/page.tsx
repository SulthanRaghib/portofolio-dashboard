"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { setToken, getToken } from "@/lib/auth";
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/hooks/use-toast";
import { setAuthCookie } from "@/app/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const token = useAuth((state) => state.token);
  const setAuthToken = useAuth((state) => state.setToken);
  const setIsLoading = useAuth((state) => state.setIsLoading);
  const isLoading = useAuth((state) => state.isLoading);
  const { toast } = useToast();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const savedToken = getToken();
    if (savedToken || token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.login(email, password);
      const token = response.token || response.access_token;

      if (token) {
        setToken(token);
        setAuthToken(token);
        await setAuthCookie(token);
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "No token received",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Sign in to manage your portfolio projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
