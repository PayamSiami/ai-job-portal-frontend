'use client';

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
  CheckCircle2,
  XCircle,
  BarChart3,
  UserX,
  LucideIcon,
  Layers,
} from 'lucide-react';

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  key: string;
  color: 'blue' | 'purple' | 'emerald' | 'amber';
  subtext?: string;
}

interface StatusItem {
  key: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  bgLight: string;
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
};

const progressVariants: Variants = {
  hidden: { width: 0 },
  visible: (percentage: number) => ({
    width: `${percentage}%`,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15,
      duration: 1,
      delay: 0.2,
    },
  }),
};

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100',
    badge: 'bg-blue-50 text-blue-700',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100',
    badge: 'bg-purple-50 text-purple-700',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100',
    badge: 'bg-amber-50 text-amber-700',
  },
};

const JobStats: React.FC<JobStatsProps> = ({ statsResponse, loading = false }) => {
  const statsData = useMemo((): StatItem[] => {
    if (loading || !statsResponse) {
      return [
        { icon: Briefcase, label: 'مشاغل فعال', value: '—', key: 'activeJobs', color: 'blue' },
        { icon: Building, label: 'شرکت‌ها', value: '—', key: 'companies', color: 'purple' },
        { icon: FileText, label: 'کل درخواست‌ها', value: '—', key: 'applications', color: 'emerald' },
        { icon: TrendingUp, label: 'نرخ تبدیل', value: '—', key: 'conversionRate', color: 'amber' },
      ];
    }

    const { summary, rates, topPerformingJobs } = statsResponse;
    const uniqueCompanies = new Set(topPerformingJobs?.map((job) => job.company) || []);

    return [
      {
        icon: Briefcase,
        label: 'مشاغل فعال',
        value: (summary?.activeJobs ?? 0).toLocaleString('fa-IR'),
        subtext: `از مجموع ${summary?.totalJobs ?? 0}`,
        key: 'activeJobs',
        color: 'blue',
      },
      {
        icon: Building,
        label: 'شرکت‌های فعال',
        value: uniqueCompanies.size.toLocaleString('fa-IR'),
        subtext: 'مجموعه شرکت‌ها',
        key: 'companies',
        color: 'purple',
      },
      {
        icon: FileText,
        label: 'کل درخواست‌ها',
        value: (summary?.totalApplications ?? 0).toLocaleString('fa-IR'),
        subtext: `میانگین ${summary?.avgApplicationsPerJob ?? 0} برای هر شغل`,
        key: 'applications',
        color: 'emerald',
      },
      {
        icon: TrendingUp,
        label: 'نرخ تبدیل',
        value: `${rates?.conversionRate ?? 0}%`,
        subtext: `لیست کوتاه: ${rates?.shortlistRate ?? 0}%`,
        key: 'conversionRate',
        color: 'amber',
      },
    ];
  }, [statsResponse, loading]);

  const statusData = useMemo((): StatusItem[] => {
    if (!statsResponse) return [];

    const { applicationStatus } = statsResponse;
    const total = Object.values(applicationStatus).reduce((a, b) => a + b, 0) || 1;

    const statusConfig: Record<string, { label: string; color: string; bgLight: string; icon: LucideIcon }> = {
      pending: { label: 'در انتظار بررسی', color: '#F59E0B', bgLight: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400', icon: Clock },
      reviewing: { label: 'در حال بررسی', color: '#3B82F6', bgLight: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: BarChart3 },
      shortlisted: { label: 'لیست کوتاه', color: '#8B5CF6', bgLight: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400', icon: Award },
      interviewing: { label: 'مصاحبه', color: '#EC4899', bgLight: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400', icon: Users },
      hired: { label: 'استخدام شده', color: '#10B981', bgLight: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle2 },
      rejected: { label: 'رد شده', color: '#EF4444', bgLight: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400', icon: XCircle },
      withdrawn: { label: 'انصراف داده', color: '#6B7280', bgLight: 'bg-gray-100 text-gray-700', icon: UserX },
    };

    return Object.entries(applicationStatus)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => {
        const config = statusConfig[key] || {
          label: key,
          color: '#6B7280',
          bgLight: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
          icon: FileText,
        };
        return {
          key,
          label: config.label,
          value,
          percentage: Math.round((value / total) * 100),
          color: config.color,
          bgLight: config.bgLight,
          icon: config.icon,
        };
      });
  }, [statsResponse]);

  const topJobs = useMemo(() => {
    if (!statsResponse) return [];
    return statsResponse.topPerformingJobs || [];
  }, [statsResponse]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-white/80 rounded-2xl border border-gray-100 p-5 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-7 w-16 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-2.5 w-32 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!statsResponse) {
    return (
      <motion.div
        className="bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-gray-200 p-12 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
          <BarChart3 className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">آماری یافت نشد</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          اطلاعاتی برای نمایش وجود ندارد. پس از ثبت مشاغل، آمارهای مرتبط در این قسمت قرار می‌گیرند.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6 text-right"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Stat Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={containerVariants}>
        {statsData.map((stat) => {
          const Icon = stat.icon;
          const colors = colorMap[stat.color];

          return (
            <motion.div
              key={stat.key}
              variants={cardVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 p-5 shadow-xs hover:shadow-md hover:border-gray-200/80 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">{stat.value}</p>
                  {stat.subtext && (
                    <p className="text-[11px] text-gray-400 font-normal pt-1">{stat.subtext}</p>
                  )}
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colors.bg} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className={`h-6 w-6 ${colors.icon} stroke-[1.75]`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Analytics Row */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-5" variants={containerVariants}>
        {/* Application Status Breakdown */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300">وضعیت درخواست‌ها</h3>
              </div>
              <span className="font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 tabular-nums">
                {statusData.reduce((acc, item) => acc + item.value, 0).toLocaleString('fa-IR')} مورد ثبت‌شده
              </span>
            </div>

            {/* Stacked Visual Bar */}
            {statusData.length > 0 && (
              <div className="mb-6">
                <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 flex overflow-hidden p-0.5 gap-0.5">
                  {statusData.map((item) => (
                    <div
                      key={item.key}
                      className="h-full rounded-sm transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                      title={`${item.label}: ${item.percentage}%`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3.5">
              {statusData.length === 0 ? (
                <p className="text-gray-400 text-center py-10">هیچ وضعیتی ثبت نشده است</p>
              ) : (
                statusData.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="space-y-1.5">
                      <div className="flex items-center justify-between ">
                        <span className="flex items-center gap-2 text-gray-700 font-medium">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <Icon className="h-3.5 w-3.5 text-gray-400" />
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 tabular-nums">
                            {item.value.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-gray-400 font-normal tabular-nums text-[11px] w-8 text-left">
                            ({item.percentage}٪)
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100/80">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                          custom={item.percentage}
                          variants={progressVariants}
                          initial="hidden"
                          animate="visible"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Top Performing Jobs */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300">مشاغل پرمتقاضی</h3>
              </div>
              <span className=" text-gray-400 dark:text-gray-500">۵ شغل برتر</span>
            </div>

            {topJobs.length === 0 ? (
              <p className=" text-gray-400 dark:text-gray-500 text-center py-12">فرصت شغلی فعال یافت نشد</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {topJobs.slice(0, 5).map((job, index) => (
                  <div
                    key={job.jobId}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 group hover:bg-gray-50/80 rounded-xl px-2 transition-colors -mx-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[11px] font-bold text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {(index + 1).toLocaleString('fa-IR')}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate  font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </p>
                        <p className="truncate text-[11px] text-gray-400 mt-0.5">
                          {job.company || `شناسه: ${job.jobId.slice(0, 8)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md  font-semibold bg-gray-50 text-gray-700 border border-gray-100 tabular-nums">
                        {job.applications.toLocaleString('fa-IR')} درخواست
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Job Distribution Breakdown */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5" variants={containerVariants}>
        {[
          {
            data: statsResponse.jobDistribution.byType,
            title: 'نوع همکاری',
            accent: 'bg-blue-500',
          },
          {
            data: statsResponse.jobDistribution.byWorkMode,
            title: 'نحوه حضور',
            accent: 'bg-purple-500',
          },
          {
            data: statsResponse.jobDistribution.byExperience,
            title: 'سطح ارشدیت',
            accent: 'bg-emerald-500',
          },
        ].map(({ data, title, accent }) => (
          <motion.div
            key={title}
            variants={cardVariants}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`h-2 w-2 rounded-full ${accent}`} />
              <h4 className=" font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
            </div>

            {Object.entries(data).length === 0 ? (
              <p className=" text-gray-400 dark:text-gray-500 text-center py-4">داده‌ای ثبت نشده</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(data).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between  py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-600 truncate dark:text-gray-400">{key}</span>
                    <span className="font-semibold text-gray-900 bg-gray-100/80 px-2 py-0.5 rounded-md tabular-nums">
                      {value.toLocaleString('fa-IR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default JobStats;