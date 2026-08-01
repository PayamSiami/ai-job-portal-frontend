/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../api/client";
import { JobFilters, JobSearchResponse } from "../types/job.types";

export const jobService = {
  async searchJobs(filters: JobFilters): Promise<JobSearchResponse> {
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

      const { data } = await apiClient.get(`/jobs?${params.toString()}`);
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

      const response  = await apiClient.get("/jobs/stats/global");
      return response.data.data; // Assumes nested structure
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  },

  // AI-powered natural language search
  async aiSearch(query: string): Promise<any> {
    try {
      const response = await apiClient.get(
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
      const { data } = await apiClient.get(`/jobs/${id}`);
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
      const response = await apiClient.put(`/applications/${applicationId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  },
};
