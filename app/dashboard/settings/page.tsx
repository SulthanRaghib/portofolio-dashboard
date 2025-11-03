"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleHealthCheck = async () => {
    setIsChecking(true);
    try {
      const result = await api.getHealth();
      toast({
        title: "API Connection Successful",
        description: `Backend is healthy: ${JSON.stringify(result)}`,
      });
    } catch (error) {
      toast({
        title: "API Connection Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to connect to backend",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>API Connection</CardTitle>
            <CardDescription>
              Test your connection to the portfolio backend API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Backend URL:{" "}
              <code className="bg-muted px-2 py-1 rounded">
                https://portofolio-backend-beta.vercel.app
              </code>
            </p>
            <Button onClick={handleHealthCheck} disabled={isChecking}>
              {isChecking ? "Testing Connection..." : "Test API Connection"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard Information</CardTitle>
            <CardDescription>About this dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Version
              </p>
              <p className="text-sm">1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stack</p>
              <p className="text-sm">Next.js, TailwindCSS, shadcn/ui</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Features
              </p>
              <ul className="text-sm space-y-1 mt-2">
                <li>Authentication with JWT</li>
                <li>Project CRUD operations</li>
                <li>Dark/Light mode support</li>
                <li>Responsive design</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Additional settings features</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              More configuration options will be available in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
