/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobService = {
  // Create new job (employer only)
  async createJob(jobData: any): Promise<any> {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Generate job content using AI (employer only)
  async generateJobContent(request: { jobTitle: string }): Promise<any> {
    const response = await api.post('/jobs/generate-content', request);
    return response.data;
  },

  // Get all jobs for employer
  async getEmployerJobs(): Promise<any> {
    const response = await api.get('/jobs/employer');
    return response.data;
  },

  // Get job by ID
  async getJobById(id: string): Promise<any> {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
};