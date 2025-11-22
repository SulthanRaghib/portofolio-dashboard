"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CertificatePreview } from "@/components/certificate-preview";
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

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expirationAt?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  skills: string[];
  image?: string;
  isPDF?: boolean;
  pdfPages?: number;
  thumbnail?: string;
  previewUrl?: string;
  previews?: Array<{
    page: number;
    url: string;
    thumbnail: string;
  }>;
}

interface CertificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: Certification;
  onSuccess: () => void;
}

export function CertificationForm({
  open,
  onOpenChange,
  certification,
  onSuccess,
}: CertificationFormProps) {
  const [data, setData] = useState<Certification>({
    title: "",
    issuer: "",
    issuedAt: "",
    expirationAt: null,
    credentialUrl: null,
    credentialId: null,
    skills: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const token = useAuth((state) => state.token);
  const { toast } = useToast();

  useEffect(() => {
    if (certification) {
      setData({
        ...certification,
        issuedAt: certification.issuedAt
          ? new Date(certification.issuedAt).toISOString().split("T")[0]
          : "",
        expirationAt: certification.expirationAt
          ? new Date(certification.expirationAt).toISOString().split("T")[0]
          : null,
      });
      if (certification.image) {
        setImagePreview(certification.thumbnail || certification.image);
        // Set filename based on isPDF flag from API
        setUploadedFileName(
          certification.isPDF
            ? `${certification.title}.pdf`
            : certification.image
        );
      }
    } else {
      // Reset form when closing
      setData({
        title: "",
        issuer: "",
        issuedAt: "",
        expirationAt: null,
        credentialUrl: null,
        credentialId: null,
        skills: [],
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadedFileName(null);
    }
  }, [certification, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB as per backend limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description:
            "Maximum file size is 10MB. Please choose a smaller file.",
          variant: "destructive",
        });
        e.target.value = ""; // Reset input
        return;
      }

      setImageFile(file);
      setUploadedFileName(file.name);

      // For PDF files, use the URL directly instead of reading as data URL
      if (file.type === "application/pdf") {
        const url = URL.createObjectURL(file);
        setImagePreview(url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    // Revoke object URL if it exists to prevent memory leaks
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setUploadedFileName(null);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      setData({ ...data, skills: [...data.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!data.title || !data.issuer || !data.issuedAt) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!certification && !imageFile) {
      toast({
        title: "Validation Error",
        description: "Please upload a certificate image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress("Checking backend connection...");

    try {
      // Check backend connection first
      const isBackendReachable = await api.checkHealth();
      if (!isBackendReachable) {
        throw new Error(
          "Cannot reach backend server. Please make sure the backend is running and accessible."
        );
      }

      setUploadProgress("Preparing upload...");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("issuer", data.issuer);
      formData.append("issuedAt", data.issuedAt);
      if (data.expirationAt) formData.append("expirationAt", data.expirationAt);
      if (data.credentialUrl)
        formData.append("credentialUrl", data.credentialUrl);
      if (data.credentialId) formData.append("credentialId", data.credentialId);
      formData.append("skills", JSON.stringify(data.skills));
      if (imageFile) {
        formData.append("image", imageFile);
        const fileSize = (imageFile.size / 1024 / 1024).toFixed(2);
        setUploadProgress(`Uploading ${imageFile.name} (${fileSize}MB)...`);
      }

      if (certification?.id) {
        await api.updateCertification(certification.id, formData, token);
        toast({
          title: "Success",
          description: "Certification updated successfully",
        });
      } else {
        await api.createCertification(formData, token);
        toast({
          title: "Success",
          description: "Certification created successfully",
        });
      }

      setUploadProgress("");
      onSuccess();
    } catch (error: any) {
      console.error("Failed to save certification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save certification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {certification ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
          <DialogDescription>
            {certification
              ? "Update certification details"
              : "Add a new certification to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., AWS Certified Solutions Architect"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
            />
          </div>

          {/* Issuer */}
          <div>
            <label className="text-sm font-medium">
              Issuer <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., Amazon Web Services"
              value={data.issuer}
              onChange={(e) => setData({ ...data, issuer: e.target.value })}
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Issued Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={data.issuedAt}
                onChange={(e) => setData({ ...data, issuedAt: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expiration Date</label>
              <Input
                type="date"
                value={data.expirationAt || ""}
                onChange={(e) =>
                  setData({ ...data, expirationAt: e.target.value || null })
                }
              />
            </div>
          </div>

          {/* Credential URL */}
          <div>
            <label className="text-sm font-medium">Credential URL</label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.credentialUrl || ""}
              onChange={(e) =>
                setData({ ...data, credentialUrl: e.target.value || null })
              }
            />
          </div>

          {/* Credential ID */}
          <div>
            <label className="text-sm font-medium">Credential ID</label>
            <Input
              placeholder="e.g., ABC123XYZ"
              value={data.credentialId || ""}
              onChange={(e) =>
                setData({ ...data, credentialId: e.target.value || null })
              }
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium">Skills</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a skill (e.g., AWS, Cloud Architecture)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button type="button" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium">
              Certificate File (Image or PDF){" "}
              {!certification && <span className="text-red-500">*</span>}
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Max file size: 10MB. Supported formats: JPG, PNG, WebP, PDF
            </p>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <CertificatePreview
                    url={imagePreview}
                    alt="Preview"
                    isPDF={
                      data.isPDF ||
                      uploadedFileName?.toLowerCase().endsWith(".pdf") ||
                      false
                    }
                    thumbnail={data.thumbnail}
                    showControls={true}
                    maxWidth={600}
                    className="w-full rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 z-10"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Input
                  type="file"
                  accept="image/*,application/pdf,.pdf"
                  onChange={handleImageChange}
                  required={!certification}
                />
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isLoading && uploadProgress && (
            <div className="text-sm text-muted-foreground text-center py-2">
              {uploadProgress}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? uploadProgress || "Saving..."
                : certification
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
