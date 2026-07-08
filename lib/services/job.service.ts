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
  // Get employer jobs
  async getEmployerJobs(): Promise<any> {
    try {
      const response = await api.get("/jobs/employer");
      return response.data;
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      throw error;
    }
  },

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

      const response = await api.get(`/jobs?${params.toString()}`);
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error("Error performing AI search:", error);
      throw error;
    }
  },

  // Get job by ID
  async getJobById(id: string): Promise<any> {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  },

  // Create new job (employer only)
  async createJob(jobData: any): Promise<any> {
    try {
      const response = await api.post("/jobs", jobData);
      return response.data;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },

  // Generate job content using AI (employer only)
  async generateJobContent(request: { jobTitle: string }): Promise<any> {
    try {
      const response = await api.post("/jobs/generate-content", request);
      return response.data;
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  },

  // Update job (employer only)
  async updateJob(id: string, jobData: any): Promise<any> {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  },

  // Delete job (employer only)
  async deleteJob(id: string): Promise<any> {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },

  // Get job applications (employer only)
  async getJobApplications(jobId: string): Promise<any> {
    try {
      const response = await api.get(`/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
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
