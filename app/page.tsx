import { Suspense } from 'react';
import { jobService } from '@/lib/services/job.service';
import JobStats from '@/components/jobs/JobStats';
import { HomeStructuredData } from '@/components/seo/HomeStructuredData';
import { Loader2 } from 'lucide-react';

const JobStatsSkeleton = () => (
    <>
        <HomeStructuredData />
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center">
            <section className="container px-4 py-16 md:py-24 flex flex-col items-center">
                <div className="text-center w-full max-w-4xl">
                    <div className="flex items-center justify-center gap-3 mb-4">
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
    </>
)

const defaultStats = {
    data: {
        summary: {
            totalJobs: 0,
            activeJobs: 0,
            inactiveJobs: 0,
            featuredJobs: 0,
            totalApplications: 0,
            avgApplicationsPerJob: 0,
        },
        jobDistribution: {
            byType: {},
            byWorkMode: {},
            byExperience: {},
        },
        applicationStatus: {
            pending: 0,
            reviewing: 0,
            shortlisted: 0,
            interviewing: 0,
            hired: 0,
            rejected: 0,
            withdrawn: 0,
        },
        rates: {
            conversionRate: 0,
            shortlistRate: 0,
            rejectionRate: 0,
        },
        topPerformingJobs: [],
        trends: {
            monthlyJobs: [],
            monthlyApplications: [],
        },
        generatedAt: new Date().toISOString(),
    }
};

async function getStats() {
    try {
        return await jobService.statsJobs({});
    } catch (error) {
        console.error('Failed to fetch job stats:', error);
        return defaultStats;
    }
}

export default async function HomePage() {
    const statsData = await getStats();

    return (
        <>
            <HomeStructuredData />
            <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center">
                <section className="container px-4 py-16 md:py-24 flex flex-col items-center">
                    <div className="text-center w-full max-w-4xl mb-5">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                            شغل رویایی خود را با <span className="text-blue-600"> هوش مصنوعی</span> پیدا کنید
                        </h1>
                    </div>
                    <Suspense fallback={<JobStatsSkeleton />}>
                        <JobStats statsResponse={statsData} />
                    </Suspense>
                </section>
            </div>
        </>
    );
}
