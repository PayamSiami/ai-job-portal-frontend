// lib/services/application.service.ts

import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api.types";
import { Resume } from "@/lib/services/resume.service";

export interface ApplicationData {
  jobId: string;
  resumeId: string;
  coverLetter: string;
  expectedSalary: number;
  availableFrom: string;
}

export interface ApplicationJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
}

export interface ApplicationStatusHistoryEntry {
  status: string;
  notes?: string;
  updatedAt: string;
  updatedBy?: {
    _id: string;
    fullName?: string;
  };
}

export interface Application {
  _id: string;
  job: ApplicationJob;
  resume?: Resume;
  status:
    | "pending"
    | "reviewing"
    | "interview"
    | "accepted"
    | "rejected"
    | "withdrawn";
  coverLetter?: string;
  expectedSalary?: number;
  availableFrom?: string;
  aiScore?: number;
  aiRecommendation?: "consider" | "recommend" | "strong_recommend" | "reject";
  aiStrengths?: string[];
  aiWeaknesses?: string[];
  aiExplanation?: string;
  statusHistory?: ApplicationStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListResponse {
  applications: Application[];
  count: number;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewing: number;
  interview: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
}

export const applicationService = {
  // Apply for a job
  async applyJob(data: ApplicationData): Promise<Application> {
    const response = await apiClient.post<ApiResponse<Application>>("/applications", data);
    return response.data.data;
  },

  // Get all applications for the current user
  async getMyApplications(): Promise<ApplicationListResponse> {
    const { data } = await apiClient.get<ApiResponse<ApplicationListResponse>>("/applications");
    return data?.data?.applications
      ? { applications: data.data.applications, count: data.data.count }
      : { applications: [], count: 0 };
  },

  // Get a single application by ID
  async getApplication(id: string): Promise<Application> {
    const { data } = await apiClient.get<ApiResponse<Application>>(`/applications/${id}`);
    return data.data;
  },

  // Withdraw an application
  async withdrawApplication(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.patch<{ success: boolean }>(
      `/applications/${id}/withdraw`,
    );
    return response.data;
  },

  // Update application status (employer only)
  async updateApplicationStatus(id: string, status: string): Promise<Application> {
    const response = await apiClient.patch<ApiResponse<Application>>(
      `/applications/${id}/status`,
      { status },
    );
    return response.data.data;
  },
};
