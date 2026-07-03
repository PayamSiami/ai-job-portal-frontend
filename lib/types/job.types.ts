export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  workMode: 'remote' | 'hybrid' | 'on-site';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements?: string;
  benefits?: string;
  skills: string[];
  tags: string[];
  postedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedJobFilters {
  rawQuery?: string;
  title: string | null;
  location: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  experienceLevel: string | null;
  workMode: string | null;
  jobType: string | null;
  skills: string[] | null;
}

export interface JobFilters {
  title?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: string;
  workMode?: string;
  jobType?: string;
  tags?: string[];
}

export interface JobPaginationResult {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  companyId?: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  salary: {
    min: number;
    max: number;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  workMode: 'remote' | 'hybrid' | 'on-site';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  openings: number;
  applicationDeadline?: string;
  tags: string[];
  skills: string[];
}

export interface UpdateJobData extends Partial<CreateJobData> {
  id: string;
}