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

export interface Resume {
  _id: string;
  user: string;
  title: string;
  isDefault: boolean;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
    title?: string;
  };
  experience: Array<{
    _id?: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    achievements?: string[];
  }>;
  education: Array<{
    _id?: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    gpa?: number;
  }>;
  skills: Array<{
    _id?: string;
    name: string;
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    category?: string;
  }>;
  certifications: Array<{
    _id?: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  languages: Array<{
    _id?: string;
    name: string;
    proficiency: "basic" | "conversational" | "professional" | "native";
  }>;
  projects: Array<{
    _id?: string;
    name: string;
    description?: string;
    url?: string;
    technologies?: string[];
    startDate?: string;
    endDate?: string;
  }>;
  customSections: Array<{
    _id?: string;
    title: string;
    content: string;
    order: number;
  }>;
  template: "modern" | "classic" | "minimal" | "creative";
  visibility: "private" | "public" | "shared";
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export const resumeService = {
  // Get all resumes
  async getResumes(params?: { status?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    const response = await api.get(`/resumes?${queryParams.toString()}`);
    return response.data;
  },

  // Get a single resume
  async getResume(id: string): Promise<any> {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  // Create a new resume
  async createResume(data: Partial<Resume>): Promise<any> {
    const response = await api.post("/resumes", data);
    return response.data;
  },

  // Update a resume
  async updateResume(id: string, data: Partial<Resume>): Promise<any> {
    const response = await api.put(`/resumes/${id}`, data);
    return response.data;
  },

  // Delete a resume
  async deleteResume(id: string): Promise<any> {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  // Set default resume
  async setDefaultResume(id: string): Promise<any> {
    const response = await api.put(`/resumes/${id}/default`);
    return response.data;
  },

  // Generate AI content for resume
  async generateContent(data: {
    jobTitle?: string;
    experience?: string;
  }): Promise<any> {
    const response = await api.post("/resumes/generate-content", data);
    return response.data;
  },

  // In resume.service.ts
  async getPDFPreviewUrl(resumeId: string): Promise<string> {
    try {
      // Use the Next.js API route instead of direct backend call
      const response = await api.get(`/resumes/${resumeId}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("PDF preview error:", error);
      throw error;
    }
  },

  async downloadPDF(resumeId: string): Promise<void> {
    try {
      // Use the Next.js API route for download too
      const response = await api.get(`/resumes/${resumeId}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      throw error;
    }
  },
};
