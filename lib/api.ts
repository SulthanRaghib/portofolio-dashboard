import { API_CONFIG } from "./config";

const API_BASE = API_CONFIG.BASE_URL;

// Use native fetch to avoid extension interference
const nativeFetch =
  typeof window !== "undefined" && window.fetch
    ? window.fetch.bind(window)
    : fetch;

// Helper function for fetch with timeout
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 60000
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    console.log("🔵 Fetch request:", {
      url,
      method: options.method,
      hasBody: !!options.body,
    });

    const response = await nativeFetch(url, {
      ...options,
      signal: controller.signal,
    });

    console.log("🟢 Fetch response:", {
      status: response.status,
      ok: response.ok,
    });
    clearTimeout(id);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    clearTimeout(id);

    console.error("🔴 Fetch error:", {
      name: error.name,
      message: error.message,
      stack: error.stack?.split("\n")[0],
    });

    if (error.name === "AbortError") {
      throw new Error(
        "Request timeout - file might be too large or connection is slow"
      );
    }
    // Check if it's a browser extension interference
    if (error.message?.includes("chrome-extension://")) {
      throw new Error(
        "Request blocked by browser extension. Please disable extensions that modify network requests (ad blockers, request interceptors) and try again."
      );
    }
    throw error;
  }
};

// Helper function to check backend connection
const checkBackendConnection = async () => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}${API_CONFIG.ENDPOINTS.HEALTH}`,
      {},
      5000
    );
    return response.ok;
  } catch (error) {
    console.error("Backend connection check failed:", error);
    return false;
  }
};

export const api = {
  // Check if backend is reachable
  async checkHealth() {
    return checkBackendConnection();
  },
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async getProjects(
    token: string,
    params?: {
      search?: string;
      page?: number;
      limit?: number;
      featured?: boolean;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ) {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.featured !== undefined)
      queryParams.append("featured", params.featured.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${API_BASE}${API_CONFIG.ENDPOINTS.PROJECTS}${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorText = await res.text();
      throw new Error(`Failed to fetch projects: ${res.status}`);
    }
    return res.json();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createProject(data: FormData | any, token: string) {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type for JSON, let browser set it for FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${API_CONFIG.ENDPOINTS.PROJECTS}`, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorText = await res.text();
      throw new Error(`Failed to create project: ${res.status}`);
    }
    return res.json();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateProject(id: string, data: FormData | any, token: string) {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type for JSON, let browser set it for FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(
      `${API_BASE}${API_CONFIG.ENDPOINTS.PROJECTS}/${id}`,
      {
        method: "PUT",
        headers,
        body: isFormData ? data : JSON.stringify(data),
      }
    );
    if (!res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorText = await res.text();
      throw new Error(`Failed to update project: ${res.status}`);
    }
    return res.json();
  },

  async deleteProject(id: string, token: string) {
    const res = await fetch(
      `${API_BASE}${API_CONFIG.ENDPOINTS.PROJECTS}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Failed to delete project");
    return res.json();
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}${API_CONFIG.ENDPOINTS.HEALTH}`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  async getCertifications(
    token: string,
    params?: {
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ) {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${API_BASE}${API_CONFIG.ENDPOINTS.CERTIFICATIONS}${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorText = await res.text();
      throw new Error(`Failed to fetch certifications: ${res.status}`);
    }
    return res.json();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createCertification(data: FormData | any, token: string) {
    const isFormData = data instanceof FormData;
    const url = `${API_BASE}${API_CONFIG.ENDPOINTS.CERTIFICATIONS}`;

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    console.log("📤 Creating certification...", {
      isFormData,
      url,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : "none",
      baseUrl: API_BASE,
      headers: { ...headers, Authorization: "***" },
    });

    // Log FormData contents for debugging
    if (isFormData && data instanceof FormData) {
      console.log("📋 FormData contents:");
      for (const [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(
            `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
    }

    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers,
          body: isFormData ? data : JSON.stringify(data),
          mode: "cors", // Explicitly set CORS mode
          credentials: "omit", // Don't send cookies
        },
        120000 // 2 minutes timeout for large files
      );

      console.log("Response received:", {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
      });

      if (!res.ok) {
        let errorMessage = `Failed to create certification: ${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Backend error:", errorData);
        } catch {
          try {
            const errorText = await res.text();
            if (errorText) errorMessage = errorText;
            console.error("Backend error text:", errorText);
          } catch {
            console.error("Could not read error response");
          }
        }
        throw new Error(errorMessage);
      }
      return res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Request error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: error.constructor.name,
        url,
        backend: API_BASE,
        hasFormData: data instanceof FormData,
      });

      // Re-throw formatted errors
      if (error.message.includes("❌") || error.message.includes("⏱️")) {
        throw error;
      }

      if (error.message.includes("timeout") || error.name === "AbortError") {
        throw new Error(
          "⏱️ Upload timeout!\n\n" +
            "File terlalu besar atau koneksi lambat.\n" +
            "Coba file lebih kecil (< 5MB)."
        );
      }

      if (
        error.message?.includes("chrome-extension://") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("Network error") ||
        error.name === "TypeError"
      ) {
        throw new Error(
          "🚫 BROWSER EXTENSION BLOCKING UPLOAD!\n\n" +
            "⚠️ Ad blocker atau extension lain memblokir upload.\n\n" +
            "SOLUSI:\n" +
            "1. Matikan ad blocker (uBlock Origin, AdBlock, dll)\n" +
            "2. Atau buka di Incognito/Private mode\n" +
            "3. Atau disable semua extension sementara\n" +
            "4. Refresh halaman setelah matikan extension\n\n" +
            `Endpoint: ${url}\n` +
            `Error: ${error.message}`
        );
      }

      throw error;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateCertification(id: string, data: FormData | any, token: string) {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const url = `${API_BASE}${API_CONFIG.ENDPOINTS.CERTIFICATIONS}/${id}`;

    console.log("Updating certification...", {
      isFormData,
      url,
      id,
      hasToken: !!token,
    });

    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: "PUT",
          headers,
          body: isFormData ? data : JSON.stringify(data),
          mode: "cors",
        },
        120000 // 2 minutes timeout for large files
      );

      console.log("Update response received:", {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
      });

      if (!res.ok) {
        let errorMessage = `Failed to update certification: ${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Backend error:", errorData);
        } catch {
          try {
            const errorText = await res.text();
            if (errorText) errorMessage = errorText;
            console.error("Backend error text:", errorText);
          } catch {
            console.error("Could not read error response");
          }
        }
        throw new Error(errorMessage);
      }
      return res.json();
    } catch (error: any) {
      console.error("Update error details:", {
        name: error.name,
        message: error.message,
        type: error.constructor.name,
      });

      if (error.message.includes("timeout") || error.name === "AbortError") {
        throw new Error(
          "Upload timeout. The file might be too large or your connection is slow. Please try with a smaller file."
        );
      }

      // Check for extension blocking
      if (
        error.message?.includes("chrome-extension://") ||
        error.message?.includes("browser extension")
      ) {
        throw new Error(
          "❌ Request blocked by browser extension!\n\n" +
            "Please DISABLE these extensions and try again:\n" +
            "• Ad blockers (uBlock, AdBlock)\n" +
            "• Request interceptors\n" +
            "• Privacy/security extensions\n\n" +
            "Or use Incognito/Private mode."
        );
      }

      if (
        error.message.includes("Failed to fetch") ||
        error.name === "TypeError"
      ) {
        throw new Error(
          "❌ Cannot upload file!\n\n" +
            "Possible causes:\n" +
            "1. Browser extension blocking request (MOST COMMON)\n" +
            "2. Network/firewall issue\n" +
            "3. Backend temporarily down\n\n" +
            "✅ Solution: Disable browser extensions or use Incognito mode"
        );
      }

      throw error;
    }
  },

  async deleteCertification(id: string, token: string) {
    const res = await fetch(
      `${API_BASE}${API_CONFIG.ENDPOINTS.CERTIFICATIONS}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Failed to delete certification");
    return res.json();
  },
};
