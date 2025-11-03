"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
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

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onSuccess: () => void;
}

export function ProjectTable({
  projects,
  onEdit,
  onSuccess,
}: ProjectTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const token = useAuth((state) => state.token);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deleteId || !token) return;

    setIsDeleting(true);
    try {
      await api.deleteProject(deleteId, token);
      toast({ title: "Project deleted successfully" });
      setDeleteId(null);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 items-center">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}

                    {project.technologies.length > 2 && (
                      <>
                        {expandedId === project.id ? (
                          // Render remaining technology badges inline and hide the +N button
                          project.technologies.slice(2).map((tech) => (
                            <span
                              key={tech}
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <button
                            onClick={() => setExpandedId(project.id)}
                            className="text-muted-foreground text-xs px-2 py-1 rounded hover:bg-accent/40 cursor-pointer"
                            aria-label={`Show ${
                              project.technologies.length - 2
                            } more technologies`}
                          >
                            +{project.technologies.length - 2} more
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{project.featured ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {new Date(project.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Tooltip content="Edit">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(project)}
                      aria-label={`Edit ${project.title}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(project.id)}
                  >
                    <Tooltip content="Delete">
                      <span>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </span>
                    </Tooltip>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
