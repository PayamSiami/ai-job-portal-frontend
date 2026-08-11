import type { Metadata } from 'next';
import { config } from '@/lib/config';
import ResumesClient from './ResumesClient';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: 'رزومه‌های من | جاب‌آی',
  description: 'ایجاد، ویرایش و مدیریت رزومه‌های مختلف برای درخواست‌های شغلی با قالب‌های حرفه‌ای',
  robots: {
    index: false,
    follow: false,
  },
};


export default async function ResumesPage() {
  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.resumes(baseUrl)} />
      <ResumesClient />
    </>
  );
}