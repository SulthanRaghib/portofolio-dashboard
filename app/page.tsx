"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-muted-foreground">Redirecting...</div>
    </div>
  );
}
