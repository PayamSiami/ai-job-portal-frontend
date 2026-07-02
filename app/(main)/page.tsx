'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AISearchBar } from '@/components/search/ai-search-bar';
import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/lib/hooks/use-search';
import { Briefcase, Users, Award, TrendingUp, Sparkles } from 'lucide-react';

const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '2,500+' },
    { icon: Users, label: 'Companies', value: '1,200+' },
    { icon: Award, label: 'Top Employers', value: '150+' },
    { icon: TrendingUp, label: 'Hiring Rate', value: '85%' },
];

export default function HomePage() {
    const { results, isLoading, error, searchJobs } = useSearch();

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="container px-4 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-8 w-8 text-blue-600" />
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                            Find Your Dream Job with
                            <span className="text-blue-600"> AI</span>
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Describe your ideal job naturally and let our AI find the perfect matches for you
                    </p>

                    <AISearchBar onSearch={searchJobs} isLoading={isLoading} />

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 max-w-2xl mx-auto">
                            {error}
                        </div>
                    )}
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
                >
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow"
                            >
                                <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </motion.div>
            </section>

            {/* Search Results */}
            {results && (
                <section className="container px-4 py-8">
                    <SearchResults
                        jobs={results.jobs}
                        parsedFilters={results.parsedFilters}
                        isLoading={isLoading}
                    />
                </section>
            )}
        </div>
    );
}