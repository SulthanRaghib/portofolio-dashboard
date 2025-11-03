"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

interface Project {
  id: string;
  title: string;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    lastUpdated: "–",
  });
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuth((state) => state.token);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const response = await api.getProjects(token);
        const projects: Project[] = response.data || response.projects || [];

        // Calculate statistics
        const total = projects.length;
        const featured = projects.filter((p) => p.featured).length;

        // Get last updated date
        let lastUpdated = "–";
        if (projects.length > 0) {
          const dates = projects
            .map((p) => new Date(p.updatedAt || p.createdAt))
            .sort((a, b) => b.getTime() - a.getTime());

          const mostRecent = dates[0];
          lastUpdated = mostRecent.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }

        setStats({ total, featured, lastUpdated });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.total}
            </div>
            <p className="text-xs text-muted-foreground">Portfolio projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.featured}
            </div>
            <p className="text-xs text-muted-foreground">Featured projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.lastUpdated}
            </div>
            <p className="text-xs text-muted-foreground">Recently modified</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
