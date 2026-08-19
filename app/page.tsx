import { Suspense } from 'react';
import { jobService } from '@/lib/services/job.service';
import JobStats from '@/components/jobs/JobStats';
import { HomeStructuredData } from '@/components/seo/HomeStructuredData';
import { Skeleton } from '@/components/ui/skeleton';
import { JobStatsResponse } from '@/lib/types/job.types';
import SearchPage from '@/components/jobs/SearchPage';
import { getInitialJobs } from './jobs/page';
import { FAQSection } from '@/components/seo/FAQSection';

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
  const initialData = await getInitialJobs();

  return (
    <>
      <HomeStructuredData />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
              `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container max-w-7xl px-4 py-16 md:py-24 flex flex-col items-center relative z-10 m-auto">
        <div className="w-full mb-5 text-center md:text-right">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
            شغل رویایی خود را با{' '}
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              هوش مصنوعی
            </span>{' '}
            پیدا کنید
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto md:mx-0 dark:text-gray-300">
            جستجوی هوشمند با تکنولوژی AI، پیدا کردن شغل مناسب را سریع‌تر و آسان‌تر از همیشه کرده است
          </p>
        </div>
        <Suspense fallback={<JobStatsSkeleton />}>
          <div className="flex w-full flex-col">
            <JobStats statsResponse={statsData} />
            <SearchPage initialData={initialData} />
          </div>
        </Suspense>

        {/* FAQ Section with structured data */}
        <FAQSection />
      </div>

    </>
  );
}