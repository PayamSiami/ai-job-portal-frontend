/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL =
  process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobService = {
  // Search jobs with filters
  async searchJobs(filters: any): Promise<any> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item));
          } else {
            params.append(key, String(value));
          }
        }
      });

      const { data } = await api.get(`/jobs?${params.toString()}`);
      return data.data;
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  },

  async statsJobs(filters: any): Promise<any> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item));
          } else {
            params.append(key, String(value));
          }
        }
      });

      const { data } = await api.get("/jobs/stats/global");
      return data.data;
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  },

  // AI-powered natural language search
  async aiSearch(query: string): Promise<any> {
    try {
      const response = await api.get(
        `/jobs/search/ai?query=${encodeURIComponent(query)}`,
      );
      console.log("AI search response:", response.data);
      return response.data.data.results.jobs; // Assuming the API returns results in this structure
    } catch (error) {
      console.error("Error performing AI search:", error);
      throw error;
    }
  },

  // Get job by ID
  async getJobById(id: string): Promise<any> {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      return data.data;
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  },

  // Update application status (employer only)
  async updateApplicationStatus(
    applicationId: string,
    status: string,
  ): Promise<any> {
    try {
      const response = await api.put(`/applications/${applicationId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  },
};
