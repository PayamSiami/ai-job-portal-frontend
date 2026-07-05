export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  company?: string;
  title?: string;
  website?: string;
  avatar?: string;
  role: 'job_seeker' | 'employer' | 'admin';
  notificationPreferences: {
    emailNotifications: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  company?: string;
  title?: string;
  website?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
}