import { apiClient } from "@/lib/api/client";
import {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  ExperienceInput,
  EducationInput,
} from "@/lib/types/profile.types";

export const profileService = {
  // Get current user profile
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get("/auth/me");
    return response.data?.data;
  },

  // Update profile
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.put("/auth/profile", data);
    const profileData = response.data?.data || response.data;

    if (!profileData) {
      throw new Error("Profile data not found");
    }

    return profileData;
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  },

  // Upload profile image
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post("/auth/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update skills
  async updateSkills(skills: string[]): Promise<{ skills: string[] }> {
    const response = await apiClient.put("/auth/profile/skills", { skills });
    return response.data;
  },

  // Add experience
  async addExperience(experience: ExperienceInput): Promise<UserProfile> {
    const response = await apiClient.post(
      "/auth/profile/experience",
      experience,
    );
    return response.data;
  },

  // Update experience
  async updateExperience(
    experienceId: string,
    data: ExperienceInput,
  ): Promise<UserProfile> {
    const response = await apiClient.put(
      `/auth/profile/experience/${experienceId}`,
      data,
    );
    return response.data;
  },

  // Delete experience
  async deleteExperience(experienceId: string): Promise<UserProfile> {
    const response = await apiClient.delete(
      `/auth/profile/experience/${experienceId}`,
    );
    return response.data;
  },

  // Add education
  async addEducation(education: EducationInput): Promise<UserProfile> {
    const response = await apiClient.post("/auth/profile/education", education);
    return response.data;
  },

  // Update education
  async updateEducation(
    educationId: string,
    data: EducationInput,
  ): Promise<UserProfile> {
    const response = await apiClient.put(
      `/auth/profile/education/${educationId}`,
      data,
    );
    return response.data;
  },

  // Delete education
  async deleteEducation(educationId: string): Promise<UserProfile> {
    const response = await apiClient.delete(
      `/auth/profile/education/${educationId}`,
    );
    return response.data;
  },
};
