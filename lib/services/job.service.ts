/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiClient } from "../api/client";
import { Job, JobFilters, JobPaginationResult, ParsedJobFilters } from "../types/job.types";

interface AISearchResponse {
  query: string;
  parsedFilters: ParsedJobFilters;
  results: JobPaginationResult;
}

export const jobService = {
  // AI-powered search
  async aiSearch(query: string): Promise<AISearchResponse> {
    const response = await apiClient.get("/jobs/search/ai", {
      params: { query },
    });
    return response.data;
  },

  // Get jobs with filters
  async getJobs(filters?: JobFilters, page: number = 1, limit: number = 20) {
    const response = await apiClient.get("/jobs", {
      params: { ...filters, page, limit },
    });
    return response.data;
  },

  // Get job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  // Get jobs by company
  async getJobsByCompany(companyId: string): Promise<Job[]> {
    const response = await apiClient.get(`/jobs/company/${companyId}`);
    return response.data;
  },

  // Employer: Create job
  async createJob(data: any): Promise<Job> {
    const response = await apiClient.post("/jobs", data);
    return response.data;
  },

  // Employer: Update job
  async updateJob(id: string, data: any): Promise<Job> {
    const response = await apiClient.put(`/jobs/${id}`, data);
    return response.data;
  },

  // Employer: Publish job
  async publishJob(id: string): Promise<Job> {
    const response = await apiClient.patch(`/jobs/${id}/publish`);
    return response.data;
  },

  // Employer: Close job
  async closeJob(id: string): Promise<Job> {
    const response = await apiClient.patch(`/jobs/${id}/close`);
    return response.data;
  },

  // Employer: Delete job
  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },
};
