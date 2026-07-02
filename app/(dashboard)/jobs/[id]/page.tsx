'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { JobDetails } from '@/components/jobs/job-details';
import { JobApplicationForm } from '@/components/jobs/job-application-form';
import { useJobs } from '@/lib/hooks/use-jobs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function JobDetailsPage() {
  const params = useParams();
  const { useGetJobById } = useJobs();
  const { data: job, isLoading } = useGetJobById(params.id as string);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Job not found</h2>
        <p className="text-gray-600 mt-2">The job you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JobDetails job={job} />
      
      <div className="flex justify-end">
        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              Apply Now
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <JobApplicationForm
              jobId={job._id}
              onSuccess={() => setIsApplyDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}