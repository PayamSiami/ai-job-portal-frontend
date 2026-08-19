import type { Metadata } from 'next';
import { config } from '@/lib/config';
import SearchPage from "@/components/jobs/SearchPage";
import { Suspense } from "react";
import { jobService } from '@/lib/services/job.service';
import { JobFilters, JobSearchResponse } from '@/lib/types/job.types';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';
import { FAQSection } from '@/components/seo/FAQSection';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'جستجوی شغل | جاب مچ — فرصت‌های شغلی در ایران',
  description:
    'هزاران شغل در حوزه‌های مختلف را در جاب مچ جستجو کنید. فیلترهای پیشرفته، جستجوی هوش مصنوعی با AI، شغل‌های دورکاری، حضوری و ترکیبی از شرکت‌های برتر ایران.',
  keywords:
    'جستجوی شغل, استخدام, کاریابی, شغل‌های باز, فرصت‌های شغلی, شغل دورکاری, شغل حضوری, شغل ترکیبی, استخدام آنلاین, فرصت شغلی ایران, جاب مچ',
  openGraph: {
    title: 'جستجوی شغل | جاب مچ — فرصت‌های شغلی در ایران',
    description:
      'هزاران شغل در حوزه‌های مختلف را در جاب مچ جستجو کنید. فیلترهای پیشرفته، جستجوی هوش مصنوعی با AI، شغل‌های دورکاری، حضوری و ترکیبی از شرکت‌های برتر ایران.',
    type: 'website',
    url: `${baseUrl}/jobs`,
    siteName: 'جاب مچ | JobMatch',
    locale: 'fa_IR',
    images: [`${baseUrl}/logo.svg`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جستجوی شغل | جاب مچ — فرصت‌های شغلی در ایران',
    description:
      'هزاران شغل در حوزه‌های مختلف را در جاب مچ جستجو کنید. فیلترهای پیشرفته و جستجوی هوش مصنوعی با AI.',
    images: [`${baseUrl}/logo.svg`],
  },
  alternates: {
    canonical: `${baseUrl}/jobs`,
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': 160,
    'max-image-preview': 'large',
    'max-video-preview': -1,
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
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.jobs(baseUrl)} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 dark:text-gray-100">
              شغل رویایی خود را پیدا کنید
            </h1>
            <p className="text-gray-600 mt-2 dark:text-gray-300">
              هزاران فرصت شغلی از شرکت‌های برتر — با فیلترهای پیشرفته و جستجوی هوش مصنوعی
            </p>
          </div>
        </div>
        <Suspense fallback={<JobsLoadingFallback />}>
          <SearchPage initialData={initialData} />
        </Suspense>
        {/* FAQ Section with structured data */}
        <FAQSection />
      </div>
    </>
  );
}