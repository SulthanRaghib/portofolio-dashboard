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
import { CertificationForm } from "@/components/certification-form";
import { CertificationTable } from "@/components/certification-table";
import { api } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useSearch } from "@/store/useSearch";
import { useToast } from "@/hooks/use-toast";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expirationAt?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  skills: string[];
  image: string;
  isPDF?: boolean;
  pdfPages?: number;
  thumbnail?: string;
  previewUrl?: string;
  previews?: Array<{
    page: number;
    url: string;
    thumbnail: string;
  }>;
  createdAt: string;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<
    Certification | undefined
  >();
  const token = useAuth((state) => state.token);
  const { query } = useSearch();
  const { toast } = useToast();

  const fetchCertifications = async (searchQuery?: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await api.getCertifications(token, {
        search: searchQuery,
        sortBy: "issuedAt",
        sortOrder: "desc",
      });
      // Backend returns: { success: true, data: [...], pagination: {...} }
      setCertifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch certifications:", error);
      toast({
        title: "Error",
        description: "Failed to load certifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, query]);

  const handleAddCertification = () => {
    setSelectedCertification(undefined);
    setFormOpen(true);
  };

  const handleEditCertification = (certification: Certification) => {
    setSelectedCertification(certification);
    setFormOpen(true);
  };

  const handleDeleteCertification = async (id: string) => {
    if (!token) return;

    try {
      await api.deleteCertification(id, token);
      toast({
        title: "Success",
        description: "Certification deleted successfully",
      });
      fetchCertifications(query);
    } catch (error) {
      console.error("Failed to delete certification:", error);
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedCertification(undefined);
    fetchCertifications(query);
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Manage your professional certifications and credentials
              </CardDescription>
            </div>
            <Button onClick={handleAddCertification}>Add Certification</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading certifications...</div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {query
                ? "No certifications found matching your search."
                : "No certifications yet. Add your first certification!"}
            </div>
          ) : (
            <CertificationTable
              certifications={certifications}
              onEdit={handleEditCertification}
              onDelete={handleDeleteCertification}
            />
          )}
        </CardContent>
      </Card>

      <CertificationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        certification={selectedCertification}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
