'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AISearchBar } from '@/components/search/ai-search-bar';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/lib/hooks/use-search';
import { Briefcase, Users, Award, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Briefcase, label: 'Active Jobs', value: '2,500+' },
  { icon: Users, label: 'Companies', value: '1,200+' },
  { icon: Award, label: 'Top Employers', value: '150+' },
  { icon: TrendingUp, label: 'Hiring Rate', value: '85%' },
];

const featuredJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA (Remote)',
    salary: '$120,000 - $180,000',
    tags: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'Google',
    location: 'Mountain View, CA (Hybrid)',
    salary: '$150,000 - $200,000',
    tags: ['Java', 'Python', 'AWS'],
  },
  {
    id: 3,
    title: 'AI/ML Engineer',
    company: 'OpenAI',
    location: 'Remote',
    salary: '$160,000 - $220,000',
    tags: ['Python', 'PyTorch', 'NLP'],
  },
];

export default function HomePage() {
  const { results, isLoading, error, searchJobs } = useSearch();

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
            <AISearchBar onSearch={searchJobs} isLoading={isLoading} />
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
              10,000+ jobs
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Trusted by 1,200+ companies
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
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
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
              isLoading={isLoading}
            />
          </div>
        </section>
      )}

      {/* Featured Jobs Section */}
      {!results && (
        <section className="container px-4 py-12 w-full flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
                <p className="text-gray-600 text-sm">Handpicked opportunities for you</p>
              </div>
              <Link href="/jobs">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200 group cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                  <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                  <p className="text-sm font-medium text-blue-600 mt-2">{job.salary}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!results && (
        <section className="container px-4 py-16 w-full flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
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
                <Link href="/search">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
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