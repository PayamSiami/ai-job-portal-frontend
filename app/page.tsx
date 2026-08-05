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

async function getStats() {
    return jobService.statsJobs({});
}

export default async function HomePage() {
    const statsData = await getStats();

    return (
        <>
            <HomeStructuredData />
            <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center">
                <section className="container px-4 py-16 md:py-24 flex flex-col items-center">
                    <div className="text-center w-full max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                            شغل رویایی خود را با <span className="text-blue-600"> هوش مصنوعی</span> پیدا کنید
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            شغل ایده‌آل خود را به زبان طبیعی توصیف کنید...
                        </p>
                    </div>
                    <Suspense fallback={<JobStatsSkeleton />}>
                        <JobStats statsResponse={statsData} />
                    </Suspense>
                </section>
            </div>
        </>
    );
}
