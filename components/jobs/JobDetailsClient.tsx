"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JobDetails, JobDetailsProps } from "./job-details";
import { JobApplicationForm } from "./job-application-form";

interface JobDetailsClientProps extends JobDetailsProps {
  job: JobDetailsProps['job'];
}

export const JobDetailsClient: React.FC<JobDetailsClientProps> = ({ job, onSave, isSaved }) => {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <JobDetails job={job} onSave={onSave} isSaved={isSaved} />
        <div className="flex justify-end mt-6">
          <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                درخواست دهید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[95vw] md:max-w-2xl max-h-[95vh] p-0 gap-0 bg-linear-to-b from-blue-50 to-white overflow-hidden">
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
};