export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary?: number;
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: "entry" | "mid" | "senior" | "lead";
  workMode?: "remote" | "hybrid" | "on-site";
  jobType?: "full-time" | "part-time" | "contract" | "internship";
  description?: string;
  requirements?: string;
  benefits?: string;
  skills: string[]; // ✅ Fixed: Added type
  tags: string[];
  postedBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
