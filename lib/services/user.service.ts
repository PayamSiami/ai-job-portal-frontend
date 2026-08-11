import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api.types";
import {
  UpdateProfileData,
  ChangePasswordData,
  NotificationPreferences,
  UserProfileResponse,
} from "@/lib/types/user.types";

export const userService = {
  // Get user profile
  async getProfile(): Promise<UserProfileResponse> {
    const { data } = await apiClient.get<ApiResponse<UserProfileResponse>>("/users/profile");
    return data.data;
  },

  // Update user profile
  async updateProfile(data: { profile: UpdateProfileData }): Promise<UserProfileResponse> {
    const { data: responseData } = await apiClient.put<ApiResponse<UserProfileResponse>>(
      "/users/profile",
      data,
    );
    return responseData.data;
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await apiClient.put<ApiResponse<{ message: string }>>("/users/password", data);
    return response.data.data;
  },

  // Update notification preferences
  async updateNotifications(data: NotificationPreferences): Promise<UserProfileResponse> {
    const { data: responseData } = await apiClient.put<ApiResponse<UserProfileResponse>>(
      "/users/notifications",
      data,
    );
    return responseData.data;
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await apiClient.post<ApiResponse<{ url: string }>>("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  },

  // Delete account
  async deleteAccount(): Promise<{ success: boolean }> {
    const { data } = await apiClient.delete<ApiResponse<{ success: boolean }>>("/users/account");
    return data.data;
  },
};
