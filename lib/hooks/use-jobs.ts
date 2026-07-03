/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/lib/services/job.service";
import toast from "react-hot-toast";
import { JobFilters } from "../types/job.types";

export const useJobs = () => {
  const queryClient = useQueryClient();

  // Get all jobs with filters
  const useGetJobs = (filters?: JobFilters, page = 1, limit = 20) => {
    return useQuery({
      queryKey: ["jobs", filters, page, limit],
      queryFn: () => jobService.getJobs(filters, page, limit),
    });
  };

  // Get job by ID
  const useGetJobById = (id: string) => {
    return useQuery({
      queryKey: ["job", id],
      queryFn: () => jobService.getJobById(id),
      enabled: !!id,
    });
  };

  // Create job mutation
  const createJob = useMutation({
    mutationFn: jobService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create job");
    },
  });

  // Update job mutation
  const updateJob = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      jobService.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      toast.success("Job updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update job");
    },
  });

  // Publish job mutation
  const publishJob = useMutation({
    mutationFn: jobService.publishJob,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      toast.success("Job published successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish job");
    },
  });

  // Close job mutation
  const closeJob = useMutation({
    mutationFn: jobService.closeJob,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      toast.success("Job closed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to close job");
    },
  });

  // Delete job mutation
  const deleteJob = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete job");
    },
  });

  return {
    useGetJobs,
    useGetJobById,
    createJob,
    updateJob,
    publishJob,
    closeJob,
    deleteJob,
  };
};
