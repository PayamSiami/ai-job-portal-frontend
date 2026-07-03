"use client";

import React, { useState } from "react";
import { JobList } from "@/components/jobs/job-list";
import { JobFilters } from "@/components/jobs/job-filters";
import { useJobs } from "@/lib/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const { useGetJobs } = useJobs();
  const { data, isLoading } = useGetJobs(filters, page);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Browse and apply for jobs</p>
        </div>
        <Link href="/employer/jobs/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <JobFilters onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <JobList
            jobs={data?.jobs || []}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
