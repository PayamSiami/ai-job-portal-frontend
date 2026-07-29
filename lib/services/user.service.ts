/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiClient } from "../api/client";

export const userService = {
  // Get user profile
  async getProfile(): Promise<any> {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Update user profile
  async updateProfile(data: any): Promise<any> {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  // Change password
  async changePassword(data: any): Promise<any> {
    const response = await apiClient.put('/users/password', data);
    return response.data;
  },

  // Update notification preferences
  async updateNotifications(data: any): Promise<any> {
    const response = await apiClient.put('/users/notifications', data);
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete account
  async deleteAccount(): Promise<any> {
    const response = await apiClient.delete('/users/account');
    return response.data;
  },
};