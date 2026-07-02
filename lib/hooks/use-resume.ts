'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/lib/services/resume.service';
import { Resume, PersonalInfo } from '@/lib/types/resume.types';
import toast from 'react-hot-toast';

export const useResume = () => {
  const queryClient = useQueryClient();
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);

  // Get all resumes
  const useGetMyResumes = () => {
    return useQuery({
      queryKey: ['resumes'],
      queryFn: resumeService.getMyResumes,
    });
  };

  // Get resume by ID
  const useGetResumeById = (id: string) => {
    return useQuery({
      queryKey: ['resume', id],
      queryFn: () => resumeService.getResumeById(id),
      enabled: !!id,
    });
  };

  // Create resume mutation
  const createResume = useMutation({
    mutationFn: (data: Partial<Resume>) => resumeService.createResume(data),
    onSuccess: (data: Resume) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setCurrentResume(data);
      toast.success('Resume created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create resume');
    },
  });

  // Update personal info mutation
  const updatePersonalInfo = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PersonalInfo> }) =>
      resumeService.updatePersonalInfo(id, data),
    onSuccess: (data: Resume, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setCurrentResume(data);
      toast.success('Personal information updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update personal information');
    },
  });

  // Update summary mutation
  const updateSummary = useMutation({
    mutationFn: ({ id, summary }: { id: string; summary: string }) =>
      resumeService.updateSummary(id, summary),
    onSuccess: (data: Resume, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setCurrentResume(data);
      toast.success('Summary updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update summary');
    },
  });

  // Analyze resume mutation
  const analyzeResume = useMutation({
    mutationFn: (id: string) => resumeService.analyzeResume(id),
    onSuccess: () => {
      toast.success('Resume analysis complete!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to analyze resume');
    },
  });

  // Delete resume mutation
  const deleteResume = useMutation({
    mutationFn: (id: string) => resumeService.deleteResume(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete resume');
    },
  });

  // Generate AI cover letter mutation
  const generateCoverLetter = useMutation({
    mutationFn: ({ resumeId, jobId }: { resumeId: string; jobId: string }) =>
      resumeService.generateCoverLetter(resumeId, jobId),
    onSuccess: (data: { coverLetter: string }) => {
      toast.success('Cover letter generated successfully!');
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate cover letter');
    },
  });

  // Generate AI summary mutation
  const generateAISummary = useMutation({
    mutationFn: (resumeId: string) => resumeService.generateAISummary(resumeId),
    onSuccess: (data: { summary: string }) => {
      toast.success('AI summary generated successfully!');
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate summary');
    },
  });

  return {
    currentResume,
    setCurrentResume,
    useGetMyResumes,
    useGetResumeById,
    createResume,
    updatePersonalInfo,
    updateSummary,
    analyzeResume,
    deleteResume,
    generateCoverLetter,
    generateAISummary,
  };
};