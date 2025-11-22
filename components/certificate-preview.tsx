"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CertificatePreviewProps {
  url: string;
  alt?: string;
  className?: string;
  isPDF?: boolean;
  thumbnail?: string;
  initialPage?: number;
  showControls?: boolean;
  maxWidth?: number;
  onDimensionsDetected?: (width: number, height: number) => void;
}

export function CertificatePreview({
  url,
  alt = "Certificate",
  className = "",
  isPDF = false,
  thumbnail,
  initialPage = 1,
  showControls = true,
  maxWidth = 800,
  onDimensionsDetected,
}: CertificatePreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [pageDimensions, setPageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Auto-detect PDF from URL if not explicitly set
  const isPDFFile =
    isPDF ||
    url?.includes(".pdf") ||
    url?.includes("/raw/upload/") ||
    url?.includes("resource_type=raw");

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: total }: { numPages: number }) => {
      setNumPages(total);
      setLoading(false);
      setError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error("PDF load error:", err);
    setError("Failed to load PDF. Please try again.");
    setLoading(false);
  }, []);

  const changePage = useCallback(
    (offset: number) => {
      setPageNumber((prevPageNumber) => {
        const newPage = prevPageNumber + offset;
        if (newPage < 1 || (numPages && newPage > numPages))
          return prevPageNumber;
        return newPage;
      });
    },
    [numPages]
  );

  const previousPage = useCallback(() => changePage(-1), [changePage]);
  const nextPage = useCallback(() => changePage(1), [changePage]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  const onPageLoadSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (page: any) => {
      const { width, height } = page;
      setPageDimensions({ width, height });
      if (onDimensionsDetected) {
        onDimensionsDetected(width, height);
      }
    },
    [onDimensionsDetected]
  );

  // Render regular image
  if (!isPDFFile) {
    if (imageError) {
      return (
        <div
          className={`${className} flex items-center justify-center bg-muted rounded border min-h-[200px]`}
        >
          <div className="text-center p-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Failed to load image
            </p>
          </div>
        </div>
      );
    }

    return (
      <img
        src={url}
        alt={alt}
        className={`${className} object-contain rounded-lg`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Render PDF viewer
  return (
    <div className={`${className} flex flex-col items-center gap-4`}>
      {/* PDF Controls */}
      {showControls && numPages && !error && (
        <div className="flex items-center justify-between w-full gap-2 p-2 bg-muted rounded-lg">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              disabled={scale === 1.0}
              title="Reset Zoom"
              className="text-xs min-w-[60px]"
            >
              {Math.round(scale * 100)}%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 3.0}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousPage}
              disabled={pageNumber <= 1}
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PDF Document with Carousel Navigation */}
      <div className="relative w-full flex justify-center overflow-auto group">
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-2 p-4">
            <AlertCircle className="h-12 w-12 text-destructive mb-2" />
            <p className="text-sm text-destructive font-medium">{error}</p>
            {thumbnail && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Showing thumbnail instead:
                </p>
                <img
                  src={thumbnail}
                  alt={alt}
                  className="max-w-sm rounded-lg border"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>
        )}

        {!error && (
          <>
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              error={null}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                width={maxWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadSuccess={onPageLoadSuccess}
                className="shadow-lg rounded-lg"
                loading={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }
              />
            </Document>

            {/* Carousel Navigation Overlay - LinkedIn Style */}
            {numPages && numPages > 1 && showControls && (
              <>
                {/* Previous Page Button - Left Side */}
                {pageNumber > 1 && (
                  <button
                    type="button"
                    onClick={previousPage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 z-10"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Next Page Button - Right Side */}
                {pageNumber < numPages && (
                  <button
                    type="button"
                    onClick={nextPage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 z-10"
                    title="Next page"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

                {/* Page Counter - Bottom Center */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium z-10">
                  {pageNumber} / {numPages}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Simplified thumbnail-only version for table view
export function CertificateThumbnail({
  url,
  alt = "Certificate",
  isPDF = false,
  thumbnail,
  className = "",
  onClick,
}: {
  url: string;
  alt?: string;
  isPDF?: boolean;
  thumbnail?: string;
  className?: string;
  onClick?: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  const isPDFFile =
    isPDF ||
    url?.includes(".pdf") ||
    url?.includes("/raw/upload/") ||
    url?.includes("resource_type=raw");

  if (isPDFFile) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-muted rounded border cursor-pointer hover:bg-muted/80 transition-colors`}
        onClick={onClick}
      >
        <div className="text-center p-2">
          <FileText className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">PDF</p>
        </div>
      </div>
    );
  }

  if (imageError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-muted rounded border`}
      >
        <FileText className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={thumbnail || url}
      alt={alt}
      className={`${className} object-cover rounded cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={onClick}
      onError={() => setImageError(true)}
    />
  );
}
