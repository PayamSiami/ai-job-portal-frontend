import { config } from '@/lib/config';
import type { MetadataRoute } from 'next';

// Define the shape of a job from the API
interface Job {
  _id: string;
  updatedAt?: string;
  createdAt?: string;
}

// Number of jobs per sitemap (max 50,000 per sitemap per Google guidelines)
const JOBS_PER_SITEMAP = 10000;

/**
 * Generate sitemap IDs for pagination
 * Each sitemap can contain up to 50,000 URLs
 * This allows scaling to hundreds of thousands of jobs
 */
export async function generateSitemaps(): Promise<Array<{ id: number }>> {
  // During static generation/build, API might not be available
  // Return a default single sitemap and let the sitemap function handle empty results
  if (process.env['NEXT_PHASE'] === 'phase-production-build') {
    return [{ id: 1 }];
  }

  const baseUrl = config.NEXT_PUBLIC_API_GATEWAY_URL || '';

  try {
    // Fetch total job count from API
    const response = await fetch(`${baseUrl}/jobs/count`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return [{ id: 1 }]; // Fallback to single sitemap
    }

    const data = await response.json();
    const totalJobs = data?.count || 0;
    const totalSitemaps = Math.ceil(totalJobs / JOBS_PER_SITEMAP);

    // Return at least 1 sitemap, max reasonable amount
    const count = Math.max(1, Math.min(totalSitemaps, 50)); // Cap at 50 sitemaps (500k jobs)

    return Array.from({ length: count }, (_, i) => ({ id: i + 1 }));
  } catch (error) {
    console.error('Failed to generate job sitemaps:', error);
    return [{ id: 1 }]; // Fallback
  }
}

/**
 * Generate individual sitemap for a specific page of jobs
 */
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.NEXT_PUBLIC_APP_URL;
  const apiBaseUrl = config.NEXT_PUBLIC_API_GATEWAY_URL || '';

  // During static generation/build, return empty array
  if (process.env['NEXT_PHASE'] === 'phase-production-build') {
    return [];
  }

  try {
    // Fetch jobs for this sitemap page
    const response = await fetch(
      `${apiBaseUrl}/jobs?page=${id}&limit=${JOBS_PER_SITEMAP}&sort=updatedAt&order=desc`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const jobs: Job[] = data?.data?.jobs || data?.jobs || [];

    return jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job._id}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : job.createdAt ? new Date(job.createdAt) : new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (error) {
    console.error(`Failed to generate job sitemap for page ${id}:`, error);
    return [];
  }
}