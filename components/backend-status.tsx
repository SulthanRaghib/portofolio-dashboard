"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { API_CONFIG } from "@/lib/config";

export function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  useEffect(() => {
    checkStatus();
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const isHealthy = await api.checkHealth();
      setStatus(isHealthy ? "online" : "offline");
    } catch (error) {
      setStatus("offline");
    }
  };

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Checking backend...</span>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-3 w-3" />
        <span>Backend offline</span>
        <a
          href={API_CONFIG.BASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline hover:no-underline"
        >
          Check server
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
      <CheckCircle className="h-3 w-3" />
      <span>Backend online</span>
    </div>
  );
}
