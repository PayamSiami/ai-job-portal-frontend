// lib/services/job.service.ts
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api.types";
import {
  Job,
  JobFilters,
  JobStatsResponse,
  AISearchResponse,
  JobSearchResponse,
} from "@/lib/types/job.types";
import { Application } from "@/lib/services/application.service";

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

      const { data } = await apiClient.get<ApiResponse<JobSearchResponse>>(
        `/jobs?${params.toString()}`,
      );
      return data.data;
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  },

  async statsJobs(filters: JobFilters): Promise<JobStatsResponse> {
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

      const response = await apiClient.get<ApiResponse<JobStatsResponse>>(
        `/jobs/stats?${params.toString()}`,
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching job stats:", error);
      throw error;
    }
  },

  // AI-powered natural language search
  async aiSearch(query: string): Promise<AISearchResponse> {
    try {
      const response = await apiClient.get<ApiResponse<AISearchResponse>>(
        `/jobs?query=${encodeURIComponent(query)}`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error performing AI search:", error);
      throw error;
    }
  },

  // Get job by ID
  async getJobById(id: string): Promise<Job> {
    try {
      const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
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
  ): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.put<ApiResponse<Application>>(
        `/applications/${applicationId}`,
        { status },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  },
};
