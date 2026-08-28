"use client";

import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/lib/services/job.service";
import { JobFilters } from "../types/job.types";

export const useJobs = () => {
  // Get all jobs with filters
  const useGetJobs = (filters: JobFilters, page = 1, limit = 20) => {
    return useQuery({
      queryKey: ["jobs", filters, page, limit],
      queryFn: () => jobService.searchJobs(filters),
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

  // Get job by AI search — NOTE: uses a distinct key ("job-ai") so it can
  // never collide with useGetJobById's ["job", id] query cache entry.
  const useGetJobByAI = (query: string) => {
    return useQuery({
      queryKey: ["job-ai", query],
      queryFn: () => jobService.aiSearch(query),
    });
  };

  return {
    useGetJobs,
    useGetJobById,
    useGetJobByAI,
  };
};
