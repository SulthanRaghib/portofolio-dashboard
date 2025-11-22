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

interface Certification {
  id: string;
  title: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalCertifications: 0,
    lastUpdated: "–",
  });
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuth((state) => state.token);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const [projectsResponse, certificationsResponse] = await Promise.all([
          api.getProjects(token),
          api.getCertifications(token),
        ]);

        const projects: Project[] =
          projectsResponse.data || projectsResponse.projects || [];
        const certifications: Certification[] =
          certificationsResponse.data || [];

        // Calculate statistics
        const totalProjects = projects.length;
        const featuredProjects = projects.filter((p) => p.featured).length;
        const totalCertifications = certifications.length;

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

        setStats({
          totalProjects,
          featuredProjects,
          totalCertifications,
          lastUpdated,
        });
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalProjects}
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
              {isLoading ? "..." : stats.featuredProjects}
            </div>
            <p className="text-xs text-muted-foreground">Featured projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalCertifications}
            </div>
            <p className="text-xs text-muted-foreground">
              Total certifications
            </p>
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
