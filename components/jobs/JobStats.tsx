'use client'

import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Briefcase,
    Users,
    Award,
    TrendingUp,
    FileText,
    Building,
    Clock,
    CheckCircle,
    XCircle,
    BarChart3,
    LucideIcon
} from 'lucide-react';

interface StatItem {
    icon: LucideIcon;
    label: string;
    value: string;
    key: string;
    color: string;
}

interface StatusItem {
    key: string;
    label: string;
    value: number;
    percentage: number;
    color: string;
    icon: LucideIcon;
}

interface JobStatsResponse {
    summary: {
        totalJobs: number;
        activeJobs: number;
        inactiveJobs: number;
        featuredJobs: number;
        totalApplications: number;
        avgApplicationsPerJob: number;
    };
    jobDistribution: {
        byType: Record<string, number>;
        byWorkMode: Record<string, number>;
        byExperience: Record<string, number>;
    };
    applicationStatus: {
        pending: number;
        reviewing: number;
        shortlisted: number;
        interviewing: number;
        hired: number;
        rejected: number;
        withdrawn: number;
    };
    rates: {
        conversionRate: number;
        shortlistRate: number;
        rejectionRate: number;
    };
    topPerformingJobs: Array<{
        jobId: string;
        title: string;
        company: string;
        applications: number;
    }>;
    trends: {
        monthlyJobs: Array<{ month: string; count: number }>;
        monthlyApplications: Array<{ month: string; count: number }>;
    };
    generatedAt: string;
}

interface JobStatsProps {
    statsResponse: JobStatsResponse | null;
    loading?: boolean;
}


// ✅ Fix: Properly typed animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring", // ✅ Use string literal, not 'spring' with quotes
            stiffness: 300,
            damping: 24,
            duration: 0.5,
        },
    },
};

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.6,
        },
    },
    hover: {
        y: -4,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
};

const progressVariants: Variants = {
    hidden: { width: 0 },
    visible: (percentage: number) => ({
        width: `${percentage}%`,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 1.2,
            delay: 0.5,
        },
    }),
};


const JobStats: React.FC<JobStatsProps> = ({ statsResponse, loading = false }) => {
    // Main stats cards
    const statsData = useMemo((): StatItem[] => {
        if (loading || !statsResponse) {
            return [
                { icon: Briefcase, label: 'مشاغل فعال', value: 'در حال بارگذاری...', key: 'activeJobs', color: 'blue' },
                { icon: Building, label: 'شرکت‌ها', value: 'در حال بارگذاری...', key: 'companies', color: 'purple' },
                { icon: FileText, label: 'درخواست‌ها', value: 'در حال بارگذاری...', key: 'applications', color: 'green' },
                { icon: TrendingUp, label: 'نرخ تبدیل', value: 'در حال بارگذاری...', key: 'conversionRate', color: 'orange' },
            ];
        }

        const { summary, rates, topPerformingJobs } = statsResponse;

        const uniqueCompanies = new Set(
            topPerformingJobs?.map((job) => job.company) || []
        );

        return [
            {
                icon: Briefcase,
                label: 'مشاغل فعال',
                value: `${summary?.activeJobs || 0}`,
                key: 'activeJobs',
                color: 'blue'
            },
            {
                icon: Building,
                label: 'شرکت‌ها',
                value: `${uniqueCompanies?.size || 0}`,
                key: 'companies',
                color: 'purple'
            },
            {
                icon: FileText,
                label: 'درخواست‌ها',
                value: `${summary?.totalApplications || 0}`,
                key: 'applications',
                color: 'green'
            },
            {
                icon: TrendingUp,
                label: 'نرخ تبدیل',
                value: `${rates?.conversionRate || 0}%`,
                key: 'conversionRate',
                color: 'orange'
            },
        ];
    }, [statsResponse, loading]);

    // ✅ Application status breakdown - WITH EXPLICIT TYPE
    const statusData = useMemo((): StatusItem[] => {
        if (!statsResponse) return [];

        const { applicationStatus } = statsResponse;
        const total = Object.values(applicationStatus).reduce((a, b) => a + b, 0) || 1;

        const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
            pending: { label: 'در انتظار', color: '#F59E0B', icon: Clock },
            reviewing: { label: 'در حال بررسی', color: '#3B82F6', icon: BarChart3 },
            shortlisted: { label: 'استعدادها', color: '#8B5CF6', icon: Award },
            interviewing: { label: 'مصاحبه', color: '#EC4899', icon: Users },
            hired: { label: 'استخدام شده', color: '#10B981', icon: CheckCircle },
            rejected: { label: 'رد شده', color: '#EF4444', icon: XCircle },
            withdrawn: { label: 'انصراف', color: '#6B7280', icon: XCircle },
        };

        return Object.entries(applicationStatus)
            .filter(([_, value]) => value > 0)
            .map(([key, value]) => {
                const config = statusConfig[key] || {
                    label: key,
                    color: '#6B7280',
                    icon: FileText,
                };
                return {
                    key,
                    label: config.label,
                    value,
                    percentage: Math.round((value / total) * 100),
                    color: config.color,
                    icon: config.icon,
                };
            });
    }, [statsResponse]);

    // Top performing jobs
    const topJobs = useMemo(() => {
        if (!statsResponse) return [];
        return statsResponse.topPerformingJobs || [];
    }, [statsResponse]);

    // If loading, show animated skeleton
    if (loading) {
        return (
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {[1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <motion.div
                            className="h-12 w-12 bg-gray-200 rounded-full mb-4"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className="h-4 bg-gray-200 rounded w-24 mb-2"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.2,
                            }}
                        />
                        <motion.div
                            className="h-6 bg-gray-200 rounded w-16"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.4,
                            }}
                        />
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    // If no data, show empty state
    if (!statsResponse) {
        return (
            <motion.div
                className="bg-white rounded-xl shadow-sm p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">آماری موجود نیست</h3>
                <p className="text-gray-500">هنوز هیچ شغلی ثبت نشده است</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Stats Cards Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
            >
                {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.key}
                            variants={cardVariants}
                            whileHover="hover"
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                    <motion.p
                                        className="text-2xl font-bold text-gray-900"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 20,
                                            delay: 0.2 + index * 0.1,
                                        }}
                                    >
                                        {stat.value}
                                    </motion.p>
                                </div>
                                <motion.div
                                    className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: 5,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                >
                                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Two Column Layout: Status + Top Jobs */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={containerVariants}
            >
                {/* Application Status Breakdown */}
                <motion.div
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    variants={cardVariants}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">وضعیت درخواست‌ها</h3>
                    <div className="space-y-4">
                        {statusData.map((item, index) => (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                                        {item.label}
                                    </span>
                                    <span className="text-gray-900 font-medium">{item.value}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="h-2 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                        custom={item.percentage}
                                        variants={progressVariants}
                                        initial="hidden"
                                        animate="visible"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        className="mt-4 pt-4 border-t border-gray-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">مجموع</span>
                            <span className="text-gray-900 font-medium">
                                {statusData.reduce((acc, item) => acc + item.value, 0)}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Top Performing Jobs */}
                <motion.div
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    variants={cardVariants}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">مشاغل برتر</h3>
                    {topJobs.length === 0 ? (
                        <motion.p
                            className="text-gray-500 text-center py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            هیچ شغلی یافت نشد
                        </motion.p>
                    ) : (
                        <div className="space-y-3">
                            {topJobs.slice(0, 5).map((job, index) => (
                                <motion.div
                                    key={job.jobId}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileHover={{
                                        x: 5,
                                        backgroundColor: '#F8FAFC',
                                        transition: { type: 'spring', stiffness: 400, damping: 10 }
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <motion.span
                                            className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium"
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            {index + 1}
                                        </motion.span>
                                        <div>
                                            <p className="font-medium text-gray-900">{job.title}</p>
                                            <p className="text-sm text-gray-500">شناسه: {job.jobId.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <motion.p
                                            className="font-medium text-gray-900"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 20,
                                                delay: 0.5 + index * 0.1
                                            }}
                                        >
                                            {job.applications}
                                        </motion.p>
                                        <p className="text-xs text-gray-400">درخواست</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Job Distribution */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
            >
                {[
                    { data: statsResponse.jobDistribution.byType, title: 'نوع همکاری', color: '#3B82F6' },
                    { data: statsResponse.jobDistribution.byWorkMode, title: 'نوع فعالیت', color: '#8B5CF6' },
                    { data: statsResponse.jobDistribution.byExperience, title: 'سطح تجربه', color: '#10B981' },
                ].map(({ data, title, color }, index) => (
                    <motion.div
                        key={title}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        variants={cardVariants}
                        custom={index}
                    >
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
                        {Object.entries(data).length === 0 ? (
                            <p className="text-gray-400 text-sm">داده‌ای موجود نیست</p>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(data).map(([key, value]) => (
                                    <motion.div
                                        key={key}
                                        className="flex justify-between text-sm"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <span className="text-gray-600">{key}</span>
                                        <motion.span
                                            className="font-medium text-gray-900"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 20,
                                                delay: 0.7 + index * 0.1
                                            }}
                                        >
                                            {value}
                                        </motion.span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Summary Footer */}
            <motion.div
                className="bg-white rounded-xl shadow-sm p-4 text-center text-sm text-gray-500 border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <span>آخرین بروزرسانی: </span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {new Date(statsResponse.generatedAt).toLocaleString('fa-IR')}
                </motion.span>
            </motion.div>
        </motion.div>
    );
};

export default JobStats;