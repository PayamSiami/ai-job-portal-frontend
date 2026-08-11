import { Suspense } from 'react';
import { jobService } from '@/lib/services/job.service';
import JobStats from '@/components/jobs/JobStats';
import { HomeStructuredData } from '@/components/seo/HomeStructuredData';
import { Skeleton } from '@/components/ui/skeleton';
import { JobStatsResponse } from '@/lib/types/job.types';

const JobStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

const defaultStats: JobStatsResponse = {
  summary: {
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0,
    featuredJobs: 0,
    totalApplications: 0,
    avgApplicationsPerJob: 0,
  },
  jobDistribution: {
    byType: {},
    byWorkMode: {},
    byExperience: {},
  },
  applicationStatus: {
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    interviewing: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
  },
  rates: {
    conversionRate: 0,
    shortlistRate: 0,
    rejectionRate: 0,
  },
  topPerformingJobs: [],
  trends: {
    monthlyJobs: [],
    monthlyApplications: [],
  },
  generatedAt: new Date().toISOString(),
};

async function getStats() {
  try {
    return await jobService.statsJobs({});
  } catch (error) {
    console.error('Failed to fetch job stats:', error);
    return defaultStats;
  }
}

export default async function HomePage() {
  const statsData = await getStats();

  return (
    <>
      <HomeStructuredData />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center">
        <section className="container px-4 py-16 md:py-24 flex flex-col items-center">
          <div className="text-center w-full max-w-4xl mb-5">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              شغل رویایی خود را با <span className="text-blue-600"> هوش مصنوعی</span> پیدا کنید
            </h1>
          </div>
          <Suspense fallback={<JobStatsSkeleton />}>
            <JobStats statsResponse={statsData} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
