import { apiClient } from "../api/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApplicationData {
  jobId: string;
  resumeId: string;
  coverLetter: string;
  expectedSalary: number;
  availableFrom: string;
}

export const applicationService = {
  // Apply for a job
  async applyJob(data: ApplicationData): Promise<any> {
    const response = await apiClient.post("/applications", data);
    return response.data;
  },

  // Get all applications for the current user
  async getMyApplications(): Promise<any> {
    const { data } = await apiClient.get("/applications");
    return data?.data?.applications;
  },

  // Get a single application by ID
  async getApplication(id: string): Promise<any> {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data?.data;
  },

  // Withdraw an application
  async withdrawApplication(id: string): Promise<any> {
    const response = await apiClient.patch(`/applications/${id}/withdraw`);
    return response.data;
  },

  // Update application status (employer only)
  async updateApplicationStatus(id: string, status: string): Promise<any> {
    const response = await apiClient.patch(`/applications/${id}/status`, { status });
    return response.data;
  },
};
