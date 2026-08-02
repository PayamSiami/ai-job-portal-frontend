/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { JobDetails } from "@/components/jobs/job-details";
import { JobApplicationForm } from "@/components/jobs/job-application-form";
import { useJobs } from "@/lib/hooks/use-jobs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function JobDetailsPage() {
  const params: any = useParams();
  const { useGetJobById } = useJobs();
  const jobId = params?.id as string;
  const { data: job, isLoading } = useGetJobById(jobId);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100" >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12" >
        <h2 className="text-2xl font-semibold text-gray-900">شغل یافت نشد</h2>
        <p className="text-gray-600 mt-2">
          شغلی که به دنبال آن هستید وجود ندارد.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white" >
      <div className="container mx-auto px-4 py-8">
        <JobDetails job={job} />
        <div className="flex justify-end">
          <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                درخواست دهید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full">
              <JobApplicationForm
                jobId={job._id}
                onSuccess={() => setIsApplyDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}