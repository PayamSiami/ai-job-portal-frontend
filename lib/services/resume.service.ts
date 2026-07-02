import { apiClient } from '@/lib/api/client';
import { Resume, PersonalInfo } from '@/lib/types/resume.types';

export const resumeService = {
  // Create resume
  async createResume(data: Partial<Resume>): Promise<Resume> {
    const response = await apiClient.post('/resumes', data);
    return response.data;
  },

  // Get user's resumes
  async getMyResumes(): Promise<Resume[]> {
    const response = await apiClient.get('/resumes/my');
    return response.data;
  },

  // Get resume by ID
  async getResumeById(id: string): Promise<Resume> {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data;
  },

  // Update personal information
  async updatePersonalInfo(id: string, data: Partial<PersonalInfo>): Promise<Resume> {
    const response = await apiClient.put(`/resumes/${id}/personal-info`, data);
    return response.data;
  },

  // Update summary
  async updateSummary(id: string, summary: string): Promise<Resume> {
    const response = await apiClient.put(`/resumes/${id}/summary`, { summary });
    return response.data;
  },

  // Generate AI summary
  async generateAISummary(resumeId: string): Promise<{ summary: string }> {
    const response = await apiClient.post(`/resumes/${resumeId}/ai-summary`);
    return response.data;
  },

  // Generate AI cover letter
  async generateCoverLetter(resumeId: string, jobId: string): Promise<{ coverLetter: string }> {
    const response = await apiClient.post(`/resumes/${resumeId}/cover-letter`, { jobId });
    return response.data;
  },

  // AI Resume Analysis
  async analyzeResume(resumeId: string): Promise<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    recommendedJobs: string[];
  }> {
    const response = await apiClient.get(`/resumes/${resumeId}/ai-feedback`);
    return response.data;
  },

  // Delete resume
  async deleteResume(id: string): Promise<void> {
    await apiClient.delete(`/resumes/${id}`);
  },
};