"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearToken } from "@/lib/auth";
import { useAuth } from "@/store/useAuth";
import { useSearch } from "@/store/useSearch";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuthCookie } from "@/app/actions/auth";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const clearAuthToken = useAuth((state) => state.clearToken);
  const { query, setQuery, clearQuery } = useSearch();
  const [searchInput, setSearchInput] = useState(query);
  const { toast } = useToast();

  const isProjectsPage = pathname === "/dashboard/projects";

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);

    // Navigate to projects page if not already there
    if (!isProjectsPage) {
      router.push("/dashboard/projects");
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    clearQuery();
  };

  const handleLogout = async () => {
    clearToken();
    clearAuthToken();
    await clearAuthCookie(); // Clear the httpOnly cookie
    toast({ title: "Logged out successfully" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Mobile menu button placeholder */}
        <button className="md:hidden">
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search projects…"
              className="pl-9 pr-10"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
              >
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
