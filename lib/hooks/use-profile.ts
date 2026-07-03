'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/lib/services/profile.service';
import { 
  UserProfile, 
  UpdateProfileData, 
  ChangePasswordData,
  ExperienceInput,
  EducationInput
} from '@/lib/types/profile.types';
import toast from 'react-hot-toast';

// Query keys
export const PROFILE_QUERY_KEYS = {
  profile: ['profile'] as const,
  stats: ['profile', 'stats'] as const,
};

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Get profile
  const useGetProfile = () => {
    return useQuery({
      queryKey: PROFILE_QUERY_KEYS.profile,
      queryFn: profileService.getProfile,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    });
  };

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: (data: UpdateProfileData) => profileService.updateProfile(data),
    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  // Change password mutation
  const changePassword = useMutation({
    mutationFn: (data: ChangePasswordData) => profileService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  // Upload profile image mutation
  const uploadProfileImage = useMutation({
    mutationFn: (file: File) => profileService.uploadProfileImage(file),
    onSuccess: (data: { imageUrl: string }) => {
      const currentProfile = queryClient.getQueryData<UserProfile>(PROFILE_QUERY_KEYS.profile);
      if (currentProfile) {
        queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, {
          ...currentProfile,
          profileImage: data.imageUrl,
        });
      }
      toast.success('Profile image updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload image');
    },
  });

  // Update skills mutation
  const updateSkills = useMutation({
    mutationFn: (skills: string[]) => profileService.updateSkills(skills),
    onSuccess: (data: { skills: string[] }) => {
      const currentProfile = queryClient.getQueryData<UserProfile>(PROFILE_QUERY_KEYS.profile);
      if (currentProfile) {
        queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, {
          ...currentProfile,
          skills: data.skills,
        });
      }
      toast.success('Skills updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update skills');
    },
  });

  // Add experience mutation
  const addExperience = useMutation({
    mutationFn: (experience: ExperienceInput) => profileService.addExperience(experience),
    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Experience added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add experience');
    },
  });

  // Update experience mutation
  const updateExperience = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExperienceInput }) =>
      profileService.updateExperience(id, data),
    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Experience updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update experience');
    },
  });

  // Delete experience mutation
  const deleteExperience = useMutation({
    mutationFn: (id: string) => profileService.deleteExperience(id),
    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Experience deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete experience');
    },
  });

  // Add education mutation
  const addEducation = useMutation({
    mutationFn: (education: EducationInput) => profileService.addEducation(education),
    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Education added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add education');
    },
  });

  // Update education mutation
  const updateEducation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EducationInput }) =>
      profileService.updateEducation(id, data),
    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Education updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update education');
    },
  });

  // Delete education mutation
  const deleteEducation = useMutation({
    mutationFn: (id: string) => profileService.deleteEducation(id),
    onSuccess: (data: UserProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Education deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete education');
    },
  });

  return {
    useGetProfile,
    updateProfile,
    changePassword,
    uploadProfileImage,
    updateSkills,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
  };
};