/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // Get user profile
  async getProfile(): Promise<any> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  async updateProfile(data: any): Promise<any> {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Change password
  async changePassword(data: any): Promise<any> {
    const response = await api.put('/users/password', data);
    return response.data;
  },

  // Update notification preferences
  async updateNotifications(data: any): Promise<any> {
    const response = await api.put('/users/notifications', data);
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete account
  async deleteAccount(): Promise<any> {
    const response = await api.delete('/users/account');
    return response.data;
  },
};