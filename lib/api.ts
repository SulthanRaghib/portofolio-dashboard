import { API_CONFIG } from "./config"

const API_BASE = API_CONFIG.BASE_URL

export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Login failed")
    return res.json()
  },

  async getProjects(token: string, params?: {
    search?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE}${API_CONFIG.ENDPOINTS.PROJECTS}${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch projects: ${res.status}`)
    }
    return res.json();
  },

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
    })
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create project: ${res.status}`)
    }
    return res.json()
  },

  async updateProject(id: string, data: FormData | any, token: string) {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };
    
    // Only set Content-Type for JSON, let browser set it for FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${API_CONFIG.ENDPOINTS.PROJECTS}/${id}`, {
      method: "PUT",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    })
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update project: ${res.status}`)
    }
    return res.json()
  },

  async deleteProject(id: string, token: string) {
    const res = await fetch(`${API_BASE}${API_CONFIG.ENDPOINTS.PROJECTS}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to delete project")
    return res.json()
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}${API_CONFIG.ENDPOINTS.HEALTH}`)
    if (!res.ok) throw new Error("Health check failed")
    return res.json()
  },
}
