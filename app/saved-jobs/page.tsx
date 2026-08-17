// app/saved-jobs/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import { SavedJobsPage } from '@/components/jobs/SavedJobsPage';

export const metadata: Metadata = {
    title: 'مشاغل ذخیره شده | جاب مچ',
    description: 'مشاهده و مدیریت مشاغل ذخیره شده خود. همیشه به راحتی به فرصت‌های شغلی مورد علاقه خود دسترسی داشته باشید.',
    keywords: 'مشاغل ذخیره شده, علاقه‌مندی‌ها, شغل, کاریابی',
};

// Loading component
function SavedJobsLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div>
                            <Skeleton className="w-64 h-10" />
                            <Skeleton className="w-32 h-5 mt-1" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-xl" />
                        ))}
                    </div>
                    <div className="hidden lg:block">
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main page component
export default async function SavedJobsPageWrapper() {
    // In a real app, fetch saved jobs from API
    // const savedJobs = await getSavedJobs();
    const savedJobs = null; // Will use mock data

    return (
        <Suspense fallback={<SavedJobsLoading />}>
            <SavedJobsPage savedJobs={savedJobs || undefined} />
        </Suspense>
    );
}