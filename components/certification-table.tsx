"use client";

import { Edit2, Trash2, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CertificateThumbnail,
  CertificatePreview,
} from "@/components/certificate-preview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface CertificationTableProps {
  certifications: Certification[];
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
}

export function CertificationTable({
  certifications,
  onEdit,
  onDelete,
}: CertificationTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewCertificate, setViewCertificate] = useState<Certification | null>(
    null
  );
  const [modalWidth, setModalWidth] = useState<string>("max-w-5xl");

  const handleDimensionsDetected = (width: number, height: number) => {
    const aspectRatio = width / height;
    // Landscape certificate
    if (aspectRatio > 1.2) {
      setModalWidth("max-w-[90vw]");
    } else {
      setModalWidth("max-w-5xl");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.map((certification) => (
              <TableRow key={certification.id}>
                <TableCell>
                  <CertificateThumbnail
                    url={certification.thumbnail || certification.image}
                    alt={certification.title}
                    isPDF={certification.isPDF || false}
                    thumbnail={certification.thumbnail}
                    className="w-16 h-16"
                    onClick={() => setViewCertificate(certification)}
                  />
                </TableCell>
                <TableCell className="font-medium max-w-[200px]">
                  <div className="truncate">{certification.title}</div>
                  {certification.credentialId && (
                    <div className="text-xs text-muted-foreground">
                      ID: {certification.credentialId}
                    </div>
                  )}
                </TableCell>
                <TableCell>{certification.issuer}</TableCell>
                <TableCell>{formatDate(certification.issuedAt)}</TableCell>
                <TableCell>
                  {certification.expirationAt
                    ? formatDate(certification.expirationAt)
                    : "No expiration"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {certification.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {certification.skills.length > 2 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{certification.skills.length - 2} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewCertificate(certification)}
                      title="View Certificate"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {certification.credentialUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(certification.credentialUrl!, "_blank")
                        }
                        title="View Credential"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(certification)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(certification.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              certification from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!viewCertificate}
        onOpenChange={() => setViewCertificate(null)}
      >
        <DialogContent className={`${modalWidth} max-h-[90vh] overflow-hidden`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {viewCertificate?.title}
            </DialogTitle>
            {viewCertificate?.issuer && (
              <p className="text-sm text-muted-foreground">
                Issued by {viewCertificate.issuer}
              </p>
            )}
          </DialogHeader>
          <div className="overflow-auto max-h-[calc(90vh-8rem)] py-4">
            {viewCertificate && (
              <CertificatePreview
                url={viewCertificate.previewUrl || viewCertificate.image}
                alt={viewCertificate.title}
                isPDF={viewCertificate.isPDF || false}
                thumbnail={viewCertificate.thumbnail}
                showControls={true}
                maxWidth={1200}
                onDimensionsDetected={handleDimensionsDetected}
                className="w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
