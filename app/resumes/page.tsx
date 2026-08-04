/* eslint-disable @typescript-eslint/no-explicit-any */
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

async function getResumes(): Promise<any[]> {
  const apiBaseUrl = config.NEXT_PUBLIC_API_GATEWAY_URL || '';
  try {
    const response = await fetch(`${apiBaseUrl}/resumes`, {
      next: { revalidate: 600 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data?.data?.resumes || data?.resumes || [];
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
    return [];
  }
}

export default async function ResumesPage() {
  const resumes = await getResumes();

  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.resumes(baseUrl)} />
      <ResumesClient initialResumes={resumes} />
    </>
  );
}