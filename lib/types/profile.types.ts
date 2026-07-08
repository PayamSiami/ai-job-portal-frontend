export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: "job_seeker" | "employer";
  profile: {
    fullName: string;
    phone: string;
    profileImage?: string;
    bio?: string;
    headline: string;
    location?: string;
    skills?: string[];
    experience?: Experience[];
    education?: Education[];
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  technologies?: string[];
}

export interface ExperienceInput {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  technologies?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface EducationInput {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface UpdateProfileData {
  fullName?: string | undefined;
  phone?: string | undefined;
  bio?: string | undefined;
  location?: string | undefined;
  website?: string | undefined;
  linkedin?: string | undefined;
  github?: string | undefined;
  twitter?: string | undefined;
  profileImage?: string | undefined;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileStats {
  jobsApplied: number;
  savedJobs: number;
  resumes: number;
  skillsCount: number;
}
