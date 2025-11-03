/**
 * Application Configuration
 * Centralized configuration file for environment variables and constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://portofolio-backend-beta.vercel.app",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
    },
    PROJECTS: "/api/projects",
    HEALTH: "/api/health",
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: process.env.NEXT_PUBLIC_TOKEN_KEY || "jwt_token",
  THEME: process.env.NEXT_PUBLIC_THEME_KEY || "theme",
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT: "system",
  OPTIONS: ["light", "dark", "system"],
} as const;

// Application Metadata
export const APP_CONFIG = {
  NAME: "Portfolio Dashboard",
  VERSION: "0.1.0",
  DESCRIPTION: "Portfolio management dashboard",
} as const;
