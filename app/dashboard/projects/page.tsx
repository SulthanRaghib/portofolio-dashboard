"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectForm } from "@/components/project-form";
import { ProjectTable } from "@/components/project-table";
import { api } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useSearch } from "@/store/useSearch";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  descriptionEn: string;
  descriptionId: string;
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const token = useAuth((state) => state.token);
  const { query } = useSearch();
  const { toast } = useToast();

  const fetchProjects = async (searchQuery?: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await api.getProjects(token, {
        search: searchQuery,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      // Backend returns: { success: true, data: [...], pagination: {...} }
      const projectsData =
        response.data ||
        response.projects ||
        (Array.isArray(response) ? response : []);
      setProjects(projectsData);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, query]);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    if (!open) {
      setSelectedProject(undefined);
    }
    setFormOpen(open);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            {query
              ? `Search results for "${query}"`
              : "Manage your portfolio projects"}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedProject(undefined);
            setFormOpen(true);
          }}
        >
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
          <CardDescription>
            {query ? (
              <>
                Found {projects.length} project
                {projects.length !== 1 ? "s" : ""} matching "{query}"
              </>
            ) : (
              <>
                {projects.length} project{projects.length !== 1 ? "s" : ""} in
                your portfolio
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No projects yet. Create your first project to get started.
            </div>
          ) : (
            <ProjectTable
              projects={projects}
              onEdit={handleEdit}
              onSuccess={fetchProjects}
            />
          )}
        </CardContent>
      </Card>

      <ProjectForm
        open={formOpen}
        onOpenChange={handleFormClose}
        project={selectedProject}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
