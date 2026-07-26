/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { JobCard } from "./job-card";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Job } from "@/lib/types/job.types";

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  pagination?: any;
  onPageChange?: (page: number) => void;
  onSaveJob?: (jobId: string) => void;
  onApplyJob?: (jobId: string) => void;
  savedJobs?: string[];
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  pagination,
  onPageChange,
  onSaveJob,
  onApplyJob,
  savedJobs = [],
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        description="Try adjusting your filters or search terms"
        icon="search"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onSave={onSaveJob}
            onApply={onApplyJob}
            isSaved={savedJobs.includes(job._id)}
            showApplyButton={true}
          />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange || (() => { })}
        />
      )}
    </div>
  );
};