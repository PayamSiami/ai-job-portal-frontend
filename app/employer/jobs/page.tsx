/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Plus, MapPin, Clock, DollarSign, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { jobService } from '@/lib/services/job.service';

export default function EmployerJobsPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () => jobService.getEmployerJobs(),
  });

  const jobs = data?.jobs || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-gray-600">Manage your job postings</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-gray-600">Manage your job postings</p>
        </div>
        <Button onClick={() => router.push('/employer/jobs/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Post a Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first job posting</p>
            <Button onClick={() => router.push('/employer/jobs/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{job.company?.name}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location?.city}, {job.location?.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${job.salary?.min.toLocaleString()} - ${job.salary?.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline">{job.employmentType}</Badge>
                      <Badge variant="outline">{job.experienceLevel}</Badge>
                      <Badge variant="outline">{job.isRemote ? 'Remote' : job.workMode}</Badge>
                      {job.isFeatured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                      {job.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-gray-500">
                      {job.applications?.length || 0} applicants
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}