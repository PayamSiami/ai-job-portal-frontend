/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AISearchBar } from '@/components/search/ai-search-bar';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/lib/hooks/use-search';
import {
  Sparkles,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/lib/services/job.service';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/lib/types/job.types';
import JobStats from '@/components/jobs/JobStats';

export default function HomePage() {
  const { results, isLoading: searchLoading, error, searchJobs } = useSearch();

  // ✅ Fetch featured jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: () => jobService.searchJobs({
      isFeatured: true,
      limit: 6,
      isActive: true
    }),
  });

  // ✅ Fetch job stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['jobStats', 'global'],
    queryFn: () => jobService.statsJobs({}),
  });

  // ✅ Memoize featured jobs
  const featuredJobs = useMemo(() => {
    return jobsData?.jobs?.slice(0, 6) || [];
  }, [jobsData]);

  // Format salary from nested salary object
  const formatSalary = (job: Job): string => {
    const salary = job.minSalary || job.maxSalary;
    if (!salary) return 'حقوق مشخص نشده';

    const format = (num: number): string => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)} میلیون`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)} هزار`;
      return `${num}`;
    };

    if (job.minSalary && job.maxSalary) {
      return `${format(job.minSalary)} - ${format(job.maxSalary)}`;
    }
    if (job.minSalary) return `از ${format(job.minSalary)}`;
    if (job.maxSalary) return `تا ${format(job.maxSalary)}`;
    return 'حقوق مشخص نشده';
  };

  // Loading state
  if (jobsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center" dir="rtl">
        <section className="container px-4 py-16 md:py-24 flex flex-col items-center">
          <div className="text-center w-full max-w-4xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                شغل رویایی خود را با
                <span className="text-blue-600"> هوش مصنوعی</span> پیدا کنید
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              شغل ایده‌آل خود را به زبان طبیعی توصیف کنید و اجازه دهید هوش مصنوعی ما بهترین تطابق‌ها را برای شما پیدا کند
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
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center" dir="rtl">
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
              شغل رویایی خود را با
              <span className="text-blue-600"> هوش مصنوعی</span> پیدا کنید
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            شغل ایده‌آل خود را به زبان طبیعی توصیف کنید و اجازه دهید هوش مصنوعی ما بهترین تطابق‌ها را برای شما پیدا کند
          </p>

          <div className="flex justify-center w-full">
            <AISearchBar onSearch={searchJobs} isLoading={searchLoading} />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 max-w-2xl mx-auto w-full">
              {error}
            </div>
          )}
        </motion.div>

        {/* ✅ JobStats Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-6xl mt-12"
        >
          <JobStats statsResponse={statsData} loading={statsLoading} />
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
                <h2 className="text-2xl font-bold text-gray-900">مشاغل ویژه</h2>
                <p className="text-gray-600 text-sm">فرصت‌های انتخاب شده مخصوص شما</p>
              </div>
              <Link href="/search">
                <Button variant="ghost" className="gap-2">
                  مشاهده همه
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map((job: Job | any) => (
                <Link href={`/jobs/${job._id}`} key={job._id}>
                  <div
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200 group cursor-pointer h-full flex flex-col"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{job?.company?.name || 'شرکت'}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {job.location || ''}
                        {job.workMode && ' (دورکاری)'}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-2">
                        {formatSalary(job)}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills?.slice(0, 3).map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.skills && job.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <Badge variant="outline" className="text-xs">
                        {job.jobType === 'full-time' ? 'تمام وقت' :
                          job.jobType === 'part-time' ? 'پاره وقت' :
                            job.jobType === 'contract' ? 'قراردادی' :
                              job.jobType === 'internship' ? 'کارآموزی' :
                                job.jobType || 'تمام وقت'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {job.experienceLevel === 'entry' ? 'مبتدی' :
                          job.experienceLevel === 'mid' ? 'متوسط' :
                            job.experienceLevel === 'senior' ? 'ارشد' :
                              job.experienceLevel === 'lead' ? 'رهبر تیم' :
                                job.experienceLevel || 'متوسط'}
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
                آماده‌اید شغل رویایی خود را پیدا کنید؟
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                به هزاران حرفه‌ای بپیوندید که با استفاده از جستجوی مبتنی بر هوش مصنوعی، بهترین تطابق شغلی خود را پیدا کرده‌اند
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    شروع رایگان
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button size="lg" variant="ghost" className="border-white text-white hover:bg-white/10">
                    مشاهده مشاغل
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