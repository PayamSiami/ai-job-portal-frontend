import { Suspense } from 'react';
import { jobService } from '@/lib/services/job.service';
import JobStats from '@/components/jobs/JobStats';
import { HomeStructuredData } from '@/components/seo/HomeStructuredData';
import { Skeleton } from '@/components/ui/skeleton';
import { JobStatsResponse } from '@/lib/types/job.types';
import SearchPage from '@/components/jobs/SearchPage';
import { getInitialJobs } from './jobs/page';
import Neural from '@/assets/Neural';

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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 relative overflow-hidden m-auto">
        {/* AI Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div
            className="absolute top-0 -right-32 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div
            className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />

          {/* Grid Pattern using CSS */}
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

          {/* Decorative Elements */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-linear-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl" />

          {/* Floating Icons with CSS animations */}
          <div
            className="absolute top-12 right-20 text-5xl opacity-10"
            style={{
              animation: 'floatBounce 4s ease-in-out infinite',
            }}
          >
            🤖
          </div>
          <div
            className="absolute bottom-20 left-16 text-4xl opacity-10"
            style={{
              animation: 'floatBounce 5s ease-in-out infinite 1s',
            }}
          >
            🧠
          </div>
          <div
            className="absolute top-1/3 left-1/4 text-3xl opacity-10"
            style={{
              animation: 'spinSlow 20s linear infinite',
            }}
          >
            ⚡
          </div>
          <div
            className="absolute bottom-1/4 right-1/3 text-4xl opacity-10"
            style={{
              animation: 'pulseSlow 3s ease-in-out infinite',
            }}
          >
            💡
          </div>

          {/* Neural Network Lines */}
          <Neural />
        </div>

        <div className="container max-w-7xl px-4 py-16 md:py-24 flex flex-col items-center relative z-10">
          <div className="w-full mb-5 text-center md:text-right">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              شغل رویایی خود را با{' '}
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                هوش مصنوعی
              </span>{' '}
              پیدا کنید
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto md:mx-0">
              جستجوی هوشمند با تکنولوژی AI، پیدا کردن شغل مناسب را سریع‌تر و آسان‌تر از همیشه کرده است
            </p>
          </div>
          <Suspense fallback={<JobStatsSkeleton />}>
            <div className="flex w-full flex-col">
              <JobStats statsResponse={statsData} />
              <SearchPage initialData={initialData} />
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}