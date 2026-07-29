/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/lib/services/job.service';
import JobStats from '@/components/jobs/JobStats';

export default function HomePage() {

    // Fetch job stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['jobStats', 'global'],
        queryFn: () => jobService.statsJobs({}),
    });

    // Loading state
    if (statsLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center">
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
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center">
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
                </motion.div>

                {/* JobStats Component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-6xl mt-12"
                >
                    <JobStats statsResponse={statsData} loading={statsLoading} />
                </motion.div>
            </section>
        </div>
    );
}