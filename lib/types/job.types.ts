// lib/types/job.types.ts
export interface Job {
  _id: string;
  title: string;
  company:
    | string
    | {
        _id: string;
        name: string;
        location?: string;
        logo?: string;
        website?: string;
      };
  postedBy:
    | string
    | {
        _id: string;
        username: string;
        email: string;
      };
  location: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  benefits?: string;
  skills: string[];
  jobType: string;
  experienceLevel: string;
  workMode: string;
  minSalary?: number;
  maxSalary?: number;
  openings: number;
  applicationDeadline?: string;
  expiresAt?: string;
  isActive: boolean;
  isDeleted: boolean;
  views: number;
  tags: string[];
  applicantCount?: number;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
}
export interface JobFilters {
  page?: number;
  limit?: number;
  title?: string;
  company?: string;
  location?: string;
  workMode?: "remote" | "hybrid" | "on-site";
  employmentType?: "full-time" | "part-time" | "contract" | "internship";
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: "entry" | "mid" | "senior" | "lead" | "executive";
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

export interface JobStatsResponse {
  summary: {
    totalJobs: number;
    activeJobs: number;
    inactiveJobs: number;
    featuredJobs: number;
    totalApplications: number;
    avgApplicationsPerJob: number;
  };
  jobDistribution: {
    byType: Record<string, number>;
    byWorkMode: Record<string, number>;
    byExperience: Record<string, number>;
  };
  applicationStatus: {
    pending: number;
    reviewing: number;
    shortlisted: number;
    interviewing: number;
    hired: number;
    rejected: number;
    withdrawn: number;
  };
  rates: {
    conversionRate: number;
    shortlistRate: number;
    rejectionRate: number;
  };
  topPerformingJobs: Array<{
    jobId: string;
    title: string;
    company: string;
    applications: number;
  }>;
  trends: {
    monthlyJobs: Array<{ month: string; count: number }>;
    monthlyApplications: Array<{ month: string; count: number }>;
  };
  generatedAt: string;
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
