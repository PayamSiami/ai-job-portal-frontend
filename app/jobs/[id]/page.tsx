import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { config } from '@/lib/config';
import { JobDetailsClient } from '@/components/jobs/JobDetailsClient';
import { JobStructuredData } from '@/components/jobs/JobStructuredData';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';
import { Job } from '@/lib/types/job.types';

// Constants
const REVALIDATE_TIME = 600; // 10 minutes
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Types
interface JobDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Fetch job by ID with timeout and error handling
 */
async function getJobById(jobId: string): Promise<Job | null> {
  const apiBaseUrl = config.NEXT_PUBLIC_API_GATEWAY_URL || '';

  if (!apiBaseUrl) {
    console.error('API Gateway URL is not configured');
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${apiBaseUrl}/jobs/${jobId}`, {
      next: { revalidate: REVALIDATE_TIME },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`Failed to fetch job ${jobId}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    // Extract job data from response
    return data?.data?.job || data?.job || data?.data || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Request timeout for job: ${jobId}`);
    } else {
      console.error(`Failed to fetch job ${jobId}:`, error);
    }
    return null;
  }
}

/**
 * Generate metadata for job details page
 */
export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  // Validate ID
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return {
      title: 'شغل یافت نشد | جاب‌آی',
      robots: { index: false, follow: false },
    };
  }

  const job = await getJobById(id);
  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  if (!job) {
    return {
      title: 'شغل یافت نشد | جاب‌آی',
      description: 'متاسفانه شغل مورد نظر یافت نشد.',
      robots: { index: false, follow: false },
    };
  }

  const jobUrl = `${baseUrl}/jobs/${job._id}`;
  const description = job.description?.slice(0, 160) || `فرصت شغلی ${job.title} در شرکت ${job.company}`;
  const keywords = [job.title, job.company, job.location, ...(job.skills || [])]
    .filter(Boolean)
    .join(', ');

  return {
    title: `${job.title} در ${job.company} | جاب‌آی`,
    description,
    keywords,
    applicationName: 'جاب‌آی',
    referrer: 'origin-when-cross-origin',
    authors: [{ name: 'جاب‌آی', url: baseUrl }],
    publisher: 'جاب‌آی',
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      title: `${job.title} در ${job.company}`,
      description,
      type: 'website',
      url: jobUrl,
      siteName: 'جاب‌آی',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} در ${job.company}`,
      description,
    },
    alternates: {
      canonical: jobUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': 160,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

/**
 * Generate static params for popular jobs (optional - for static generation)
 */
export async function generateStaticParams() {
  // Only enable if you have a way to fetch popular jobs
  // and you want to pre-render them
  if (process.env.NODE_ENV === 'production') {
    try {
      const apiBaseUrl = config.NEXT_PUBLIC_API_GATEWAY_URL || '';
      const response = await fetch(`${apiBaseUrl}/jobs/popular`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }, // 1 hour
      });

      if (response.ok) {
        const data = await response.json();
        const jobs = data?.data?.jobs || data?.jobs || [];
        return jobs.map((job: Job) => ({
          id: job._id,
        }));
      }
    } catch (error) {
      console.error('Failed to generate static params:', error);
    }
  }

  return [];
}

/**
 * Main job details page component
 */
export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;

  // Validate ID format
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    notFound();
  }

  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  return (
    <>
      <BreadcrumbStructuredData
        items={generateBreadcrumbs.jobDetail(baseUrl, job.title, job._id)}
      />
      <JobStructuredData job={job} />
      <JobDetailsClient
        job={job}
      />
    </>
  );
}