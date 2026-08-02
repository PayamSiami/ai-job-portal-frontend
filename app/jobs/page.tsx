import type { Metadata } from 'next';
import SearchPage from "@/components/jobs/SearchPage";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'جستجوی شغل | جاب‌آی',
  description: 'هزاران شغل در حوزه‌های مختلف را جستجو کنید. فیلترهای پیشرفته، جستجوی هوشمند با AI و جزئیات کامل شغل.',
  keywords: 'جستجوی شغل, کاریابی, استخدام, شغل‌های باز, فرصت‌های شغلی',
  openGraph: {
    title: 'جستجوی شغل | جاب‌آی',
    description: 'هزاران شغل در حوزه‌های مختلف را جستجو کنید. فیلترهای پیشرفته، جستجوی هوشمند با AI و جزئیات کامل شغل.',
    type: 'website',
  },
};

// Extract loading component for reusability
function JobsLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">Loading jobs...</p>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsLoadingFallback />}>
      <SearchPage />
    </Suspense>
  );
}