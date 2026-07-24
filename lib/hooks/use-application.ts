"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { applicationService } from "../services/application.service";

export const useApplications = () => {
  // Get all applications
  const useGetMyApplications = () => {
    return useQuery({
      queryKey: ["applications"],
      queryFn: () => applicationService.getMyApplications(),
    });
  };

  const useWithdrawApplication = () => {
    return useMutation({
      mutationFn: (id: string) => applicationService.withdrawApplication(id),
      onSuccess: () => {},
    });
  };

  const useGetApplicationById = (id: string) => {
    return useQuery({
      queryKey: ["application", id],
      queryFn: () => applicationService.getApplication(id),
    });
  };

  return {
    useGetMyApplications,
    useWithdrawApplication,
    useGetApplicationById,
  };
};
