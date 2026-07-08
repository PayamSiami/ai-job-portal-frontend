'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AISearchBar } from '@/components/search/ai-search-bar';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/lib/hooks/use-search';
import {
  Briefcase,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/lib/services/job.service';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/lib/types/job.types';

// Define proper type for stats
interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string;
  key: string;
}

export default function HomePage() {
  const { results, isLoading: searchLoading, error, searchJobs } = useSearch();

  // Fetch featured jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: () => jobService.searchJobs({
      isFeatured: true,
      limit: 6,
      isActive: true
    }),
  });

  // Fetch stats
  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['jobs', 'stats'],
    queryFn: async () => {
      const [jobs] = await Promise.all([
        jobService.searchJobs({ isActive: true, limit: 1 }),
      ]);

      return {
        totalJobs: jobs?.pagination?.total || 0,
        totalCompanies: Math.floor((jobs?.pagination?.total || 0) / 2),
        topEmployers: Math.floor((jobs?.pagination?.total || 0) / 5),
        hiringRate: '85%',
      };
    },
    refetchInterval: 60000,
  });

  // Use useMemo instead of useEffect + setState
  const featuredJobs = useMemo(() => {
    return jobsData?.jobs?.slice(0, 6) || [];
  }, [jobsData]);

  // Use useMemo for stats with proper type
  const statsData = useMemo((): StatItem[] => {
    if (!statsResponse) {
      return [
        { icon: Briefcase, label: 'Active Jobs', value: 'Loading...', key: 'totalJobs' },
        { icon: Users, label: 'Companies', value: 'Loading...', key: 'totalCompanies' },
        { icon: Award, label: 'Top Employers', value: 'Loading...', key: 'topEmployers' },
        { icon: TrendingUp, label: 'Hiring Rate', value: 'Loading...', key: 'hiringRate' },
      ];
    }

    return [
      { icon: Briefcase, label: 'Active Jobs', value: `${statsResponse.totalJobs}+`, key: 'totalJobs' },
      { icon: Users, label: 'Companies', value: `${statsResponse.totalCompanies}+`, key: 'totalCompanies' },
      { icon: Award, label: 'Top Employers', value: `${statsResponse.topEmployers}+`, key: 'topEmployers' },
      { icon: TrendingUp, label: 'Hiring Rate', value: statsResponse.hiringRate, key: 'hiringRate' },
    ];
  }, [statsResponse]);

  // ✅ Fixed: Format salary from nested salary object
  const formatSalary = (job: Job): string => {
    const salary = job.salary;
    if (!salary) return 'Salary not specified';

    const format = (num: number): string => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
      return `$${num}`;
    };

    if (job.minSalary && job.maxSalary) {
      return `${format(job.minSalary)} - ${format(job.maxSalary)}`;
    }
    if (job.minSalary) return `From ${format(job.minSalary)}`;
    if (job.maxSalary) return `Up to ${format(job.maxSalary)}`;
    return 'Salary not specified';
  };

  // Loading state
  if (statsLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
        <section className="container px-4 py-16 md:py-24 flex flex-col items-center">
          <div className="text-center w-full max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Find Your Dream Job with
                <span className="text-blue-600"> AI</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Describe your ideal job naturally and let our AI find the perfect matches for you
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-2xl p-4 bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-12">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center w-full max-w-4xl"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Find Your Dream Job with
              <span className="text-blue-600"> AI</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Describe your ideal job naturally and let our AI find the perfect matches for you
          </p>

          <div className="flex justify-center w-full">
            <AISearchBar onSearch={searchJobs} isLoading={searchLoading} />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 max-w-2xl mx-auto w-full">
              {error}
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              AI-powered matching
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {statsData[0]?.value || 'Loading...'} jobs
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Trusted by {statsData[1]?.value || 'Loading...'} companies
            </span>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mx-auto mt-12"
        >
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center"
              >
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Search Results */}
      {results && (
        <section className="container px-4 py-8 w-full flex justify-center">
          <div className="w-full max-w-6xl">
            <SearchResults
              jobs={results.jobs}
              parsedFilters={results.parsedFilters}
              isLoading={searchLoading}
            />
          </div>
        </section>
      )}

      {/* Featured Jobs Section */}
      {!results && featuredJobs.length > 0 && (
        <section className="container px-4 py-12 w-full flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
                <p className="text-gray-600 text-sm">Handpicked opportunities for you</p>
              </div>
              <Link href="/search">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map((job: Job) => (
                <Link href={`/jobs/${job._id}`} key={job._id}>
                  <div
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200 group cursor-pointer h-full flex flex-col"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{job.company || 'Company'}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {job.location || ''}
                        {job.workMode && ' (Remote)'}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-2">
                        {formatSalary(job)}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.tags?.slice(0, 3).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {job.tags && job.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <Badge variant="outline" className="text-xs">
                        {job.jobType || 'Full-time'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {job.experienceLevel || 'Mid-Level'}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!results && (
        <section className="container px-4 py-16 w-full flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Find Your Dream Job?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who found their perfect career match using AI-powered search
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="jobs">
                  <Button size="lg" variant="ghost" className="border-white text-white hover:bg-white/10">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}