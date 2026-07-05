/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Job {
  _id: string;
  title: string;
  description: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  isRemote: boolean;
  workMode: 'remote' | 'hybrid' | 'on-site';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  preferredSkills?: string[];
  responsibilities?: string[];
  benefits?: string[];
  isActive: boolean;
  isFeatured: boolean;
  postedBy: string;
  applications?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  title?: string;
  company?: string;
  location?: string;
  workMode?: 'remote' | 'hybrid' | 'on-site';
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  postedBy?: string;
}

export interface JobSearchResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AISearchResponse {
  query: string;
  parsedFilters: {
    title?: string;
    location?: string;
    workMode?: string;
    employmentType?: string;
    minSalary?: number;
    maxSalary?: number;
    experienceLevel?: string;
    skills?: string[];
  };
  results: JobSearchResponse;
}

export interface GenerateJobContentRequest {
  jobTitle: string;
}

export interface GenerateJobContentResponse {
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
}