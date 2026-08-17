import type { Metadata } from 'next';
import { config } from '@/lib/config';
import SearchPage from "@/components/jobs/SearchPage";
import { Suspense } from "react";
import { jobService } from '@/lib/services/job.service';
import { JobFilters, JobSearchResponse } from '@/lib/types/job.types';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'جستجوی شغل | جاب مچ',
  description: 'هزاران شغل در حوزه‌های مختلف را جستجو کنید. فیلترهای پیشرفته، جستجوی هوشمند با AI و جزئیات کامل شغل.',
  keywords: 'جستجوی شغل, کاریابی, استخدام, شغل‌های باز, فرصت‌های شغلی',
  openGraph: {
    title: 'جستجوی شغل | جاب مچ',
    description: 'هزاران شغل در حوزه‌های مختلف را جستجو کنید. فیلترهای پیشرفته، جستجوی هوشمند با AI و جزئیات کامل شغل.',
    type: 'website',
    url: `${baseUrl}/jobs`,
  },
  alternates: {
    canonical: `${baseUrl}/jobs`,
  },
};

// Enable ISR with revalidation
export const revalidate = 3600; // Revalidate every hour

// Fetch initial data for SSG
export async function getInitialJobs(): Promise<JobSearchResponse | null> {
  try {
    const defaultFilters: JobFilters = {
      page: 1,
      limit: 10,
      isActive: true,
    };

    const result = await jobService.searchJobs(defaultFilters);

    // Ensure we have a valid response structure
    if (!result || !result.jobs) {
      return {
        jobs: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching initial jobs:', error);
    // Return empty data structure instead of null to prevent client-side errors
    return {
      jobs: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

function JobsLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">در حال بارگذاری مشاغل...</p>
      </div>
    </div>
  );
}

export default async function SearchPageWrapper() {
  const initialData = await getInitialJobs();

  return (
    <Suspense fallback={<JobsLoadingFallback />}>
      <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white" >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                شغل رویایی خود را پیدا کنید
              </h1>
            </div>
          </div>
          <SearchPage initialData={initialData} />
        </div>
      </div>
    </Suspense>
  );
}