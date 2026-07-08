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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    const response = await api.post("/applications", data);
    return response.data;
  },

  // Get all applications for the current user
  async getMyApplications(): Promise<any> {
    const response = await api.get("/applications");
    return response.data;
  },

  // Get a single application by ID
  async getApplication(id: string): Promise<any> {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Withdraw an application
  async withdrawApplication(id: string): Promise<any> {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // Get applications for a specific job (employer only)
  async getJobApplications(jobId: string): Promise<any> {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  // Update application status (employer only)
  async updateApplicationStatus(id: string, status: string): Promise<any> {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },
};
