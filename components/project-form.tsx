"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id?: string;
  title: string;
  descriptionEn: string;
  descriptionId: string;
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
  image?: string;
}

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSuccess: () => void;
}

export function ProjectForm({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectFormProps) {
  const [data, setData] = useState<Project>({
    title: "",
    descriptionEn: "",
    descriptionId: "",
    technologies: [],
    demoUrl: "",
    githubUrl: "",
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuth((state) => state.token);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setData(project);
      if (project.image) {
        setImagePreview(project.image);
      }
    } else {
      // Reset form when closing
      setData({
        title: "",
        descriptionEn: "",
        descriptionId: "",
        technologies: [],
        demoUrl: "",
        githubUrl: "",
        featured: false,
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [project, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !data.technologies.includes(techInput.trim())) {
      setData({
        ...data,
        technologies: [...data.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setData({
      ...data,
      technologies: data.technologies.filter((t) => t !== tech),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    try {
      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("descriptionEn", data.descriptionEn);
      formData.append("descriptionId", data.descriptionId);
      formData.append("technologies", JSON.stringify(data.technologies));
      formData.append("demoUrl", data.demoUrl);
      formData.append("githubUrl", data.githubUrl);
      formData.append("featured", String(data.featured));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (project?.id) {
        await api.updateProject(project.id, formData, token);
        toast({ title: "Project updated successfully" });
      } else {
        await api.createProject(formData, token);
        toast({ title: "Project created successfully" });
      }

      // Reset form
      setData({
        title: "",
        descriptionEn: "",
        descriptionId: "",
        technologies: [],
        demoUrl: "",
        githubUrl: "",
        featured: false,
      });
      setImageFile(null);
      setImagePreview(null);
      setTechInput("");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      // Handle backend validation errors
      let errorMessage = "Something went wrong";

      // Try to parse error response
      try {
        if (error.message && error.message.includes("Failed to")) {
          // Extract status code and try to get more info
          const match = error.message.match(/Failed to \w+ project: (\d+)/);
          if (match) {
            const statusCode = match[1];
            if (statusCode === "400") {
              errorMessage =
                "Validation error. Please check all required fields.";
            } else if (statusCode === "401") {
              errorMessage = "Unauthorized. Please login again.";
            } else if (statusCode === "413") {
              errorMessage = "Image file is too large. Maximum 5MB allowed.";
            }
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      } catch (e) {
        // Keep default error message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update project details"
              : "Add a new project to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Project title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Image</label>
            {imagePreview && (
              <div className="relative w-full h-48 border rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80"
                >
                  ×
                </button>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Upload project screenshot or image (Max 5MB)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (English)</label>
            <Textarea
              value={data.descriptionEn}
              onChange={(e) =>
                setData({ ...data, descriptionEn: e.target.value })
              }
              placeholder="English description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description (Indonesian)
            </label>
            <Textarea
              value={data.descriptionId}
              onChange={(e) =>
                setData({ ...data, descriptionId: e.target.value })
              }
              placeholder="Indonesian description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technologies</label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology (e.g., React)"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTech())
                }
              />
              <Button type="button" onClick={handleAddTech} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.technologies.map((tech) => (
                <div
                  key={tech}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Demo URL</label>
            <Input
              value={data.demoUrl}
              onChange={(e) => setData({ ...data, demoUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              value={data.githubUrl}
              onChange={(e) => setData({ ...data, githubUrl: e.target.value })}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={data.featured}
              onChange={(e) => setData({ ...data, featured: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Mark as featured
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
