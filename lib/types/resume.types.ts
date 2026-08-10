export interface Resume {
  id: string;
  candidateId: string;
  title: string;
  template: "classic" | "modern" | "creative" | "professional";
  visibility: "public" | "private" | "link-only";
  isDefault: boolean;
  isActive: boolean;
  personalInfo?: PersonalInfo;
  summary?: string;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: ResumeSkill[];
  projects?: Project[];
  languages?: Language[];
  completionScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
}

export interface WorkExperience {
  id: string;
  resumeId: string;
  companyName: string;
  companyLogoUrl?: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  description: string;
  technologies: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  resumeId: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  grade: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  description?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSkill {
  id: string;
  resumeId: string;
  skillName: string;
  proficiencyLevel:
    "beginner" | "elementary" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  resumeId: string;
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  sourceCodeUrl?: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Language {
  id: string;
  resumeId: string;
  languageName: string;
  proficiency:
    "basic" | "conversational" | "professional" | "fluent" | "native";
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Award {
  id: string;
  resumeId: string;
  title: string;
  awardingOrganization: string;
  awardDate: string;
  description?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  resumeId: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
