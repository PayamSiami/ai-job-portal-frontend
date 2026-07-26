'use client';

import React, { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    Search,
    MapPin,
    X,
    Sparkles,
    SlidersHorizontal,
    Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { jobService } from '@/lib/services/job.service';
import { Job, JobFilters } from '@/lib/types/job.types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { AISearchBar } from '@/components/search/AISearchBar';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { JobCard } from '@/components/jobs/JobCard';
import { Pagination } from '@/components/shared/pagination';
import Link from 'next/link';

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [searchMode, setSearchMode] = useState<'standard' | 'ai'>(
        (searchParams.get('mode') as 'standard' | 'ai') || 'standard'
    );
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [aiQuery, setAiQuery] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState<JobFilters>(() => {
        const baseFilters: JobFilters = {
            page: Number(searchParams.get('page')) || 1,
            limit: 10,
            isActive: true,
        };

        const title = searchParams.get('title');
        if (title) baseFilters.title = title;

        const location = searchParams.get('location');
        if (location) baseFilters.location = location;

        const workMode = searchParams.get('workMode') as JobFilters['workMode'];
        if (workMode) baseFilters.workMode = workMode;

        const employmentType = searchParams.get('employmentType') as JobFilters['employmentType'];
        if (employmentType) baseFilters.employmentType = employmentType;

        const minSalary = searchParams.get('minSalary');
        if (minSalary) baseFilters.minSalary = Number(minSalary);

        const maxSalary = searchParams.get('maxSalary');
        if (maxSalary) baseFilters.maxSalary = Number(maxSalary);

        const experienceLevel = searchParams.get('experienceLevel') as JobFilters['experienceLevel'];
        if (experienceLevel) baseFilters.experienceLevel = experienceLevel;

        const skills = searchParams.getAll('skills');
        if (skills.length > 0) baseFilters.skills = skills;

        return baseFilters;
    });

    const [showFilters, setShowFilters] = useState(false);
    const debouncedQuery = useDebounce(searchQuery, 500);

    // Standard search query
    const {
        data: standardData,
        isLoading: standardLoading,
        isError: standardError,
        refetch: refetchStandard,
    } = useQuery({
        queryKey: ['jobs', 'search', filters, debouncedQuery],
        queryFn: () => {
            const searchFilters = { ...filters };
            if (debouncedQuery) {
                searchFilters.title = debouncedQuery;
            }
            return jobService.searchJobs(searchFilters);
        },
        enabled: searchMode === 'standard',
        staleTime: 1000 * 60,
    });

    // AI search query
    const {
        data: aiData,
        isLoading: aiLoading,
        isError: aiError,
        refetch: refetchAI,
    } = useQuery({
        queryKey: ['jobs', 'ai-search', aiQuery],
        queryFn: () => jobService.aiSearch(aiQuery),
        enabled: searchMode === 'ai' && aiQuery.length > 2,
        staleTime: 1000 * 60,
    });

    // Handlers
    const handleAISearch = useCallback((query: string) => {
        setAiQuery(query);
        setSearchMode('ai');
        const params = new URLSearchParams();
        params.set('q', query);
        params.set('mode', 'ai');
        router.push(`/search?${params.toString()}`, { scroll: false });
    }, [router]);

    const handleStandardSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchMode('standard');
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (filters.page && filters.page > 1) params.set('page', String(filters.page));
        router.push(`/search?${params.toString()}`, { scroll: false });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFilterChange = (key: keyof JobFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1,
        }));
        setSearchMode('standard');
    };

    const clearFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            isActive: true,
        });
        setSearchQuery('');
        setAiQuery('');
        setSearchMode('standard');
        router.push('/search', { scroll: false });
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.title) count++;
        if (filters.location) count++;
        if (filters.workMode) count++;
        if (filters.employmentType) count++;
        if (filters.experienceLevel) count++;
        if (filters.minSalary) count++;
        if (filters.maxSalary) count++;
        if (filters.skills?.length) count += filters.skills.length;
        return count;
    };

    const isLoading = searchMode === 'standard' ? standardLoading : aiLoading;
    const isError = searchMode === 'standard' ? standardError : aiError;
    const data = searchMode === 'standard' ? standardData : aiData?.results;
    const totalResults = data?.pagination?.total || 0;
    const jobs = data?.jobs || [];
    const parsedFilters = searchMode === 'ai' ? aiData?.parsedFilters : null;

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white" dir="rtl">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            شغل رویایی خود را پیدا کنید
                        </h1>
                        <p className="text-gray-600">
                            {searchMode === 'ai'
                                ? 'جستجوی مبتنی بر هوش مصنوعی - فقط آنچه را که به دنبال آن هستید توصیف کنید'
                                : 'جستجو در هزاران شغل از شرکت‌های برتر'}
                        </p>
                    </div>
                    <Link href="/employer/jobs/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            ثبت آگهی شغلی
                        </Button>
                    </Link>
                </div>

                {/* Search Tabs */}
                <Tabs
                    value={searchMode}
                    onValueChange={(value) => setSearchMode(value as 'standard' | 'ai')}
                    className="mb-8"
                >
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                        <TabsTrigger value="standard" className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            جستجوی استاندارد
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            جستجوی هوش مصنوعی
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="standard">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <form onSubmit={handleStandardSearch} className="relative">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            type="text"
                                            placeholder="عنوان شغل، شرکت یا کلمات کلیدی..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pr-10 pl-4 py-2 h-12 text-base text-right"
                                        />
                                    </div>

                                    <div className="flex-1 relative">
                                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            placeholder="موقعیت مکانی (شهر، استان، دورکاری)"
                                            value={filters.location || ''}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                            className="pr-10 pl-4 py-2 h-12 text-base text-right"
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="h-12 px-8">
                                        <Search className="w-5 h-5 ml-2" />
                                        جستجو
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="h-12 px-4 relative"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <SlidersHorizontal className="w-5 h-5" />
                                        {getActiveFilterCount() > 0 && (
                                            <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white">
                                                {getActiveFilterCount()}
                                            </Badge>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </TabsContent>

                    <TabsContent value="ai">
                        <AISearchBar
                            onSearch={handleAISearch}
                            initialQuery={aiQuery}
                            isLoading={aiLoading}
                        />

                        {parsedFilters && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4" />
                                    فیلترهای استخراج شده توسط هوش مصنوعی
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {parsedFilters.title && (
                                        <Badge variant="outline" className="bg-white">
                                            عنوان: {parsedFilters.title}
                                        </Badge>
                                    )}
                                    {parsedFilters.location && (
                                        <Badge variant="outline" className="bg-white">
                                            موقعیت: {parsedFilters.location}
                                        </Badge>
                                    )}
                                    {parsedFilters.workMode && (
                                        <Badge variant="outline" className="bg-white">
                                            همکاری: {parsedFilters.workMode}
                                        </Badge>
                                    )}
                                    {parsedFilters.employmentType && (
                                        <Badge variant="outline" className="bg-white">
                                            نوع: {parsedFilters.employmentType}
                                        </Badge>
                                    )}
                                    {parsedFilters.experienceLevel && (
                                        <Badge variant="outline" className="bg-white">
                                            سطح: {parsedFilters.experienceLevel}
                                        </Badge>
                                    )}
                                    {parsedFilters.minSalary && (
                                        <Badge variant="outline" className="bg-white">
                                            حداقل حقوق: ${parsedFilters.minSalary}
                                        </Badge>
                                    )}
                                    {parsedFilters.maxSalary && (
                                        <Badge variant="outline" className="bg-white">
                                            حداکثر حقوق: ${parsedFilters.maxSalary}
                                        </Badge>
                                    )}
                                    {parsedFilters.skills?.map((skill: string) => (
                                        <Badge key={skill} variant="outline" className="bg-white">
                                            مهارت: {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Active Filters */}
                {getActiveFilterCount() > 0 && searchMode === 'standard' && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {filters.title && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                عنوان: {filters.title}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => handleFilterChange('title', undefined)}
                                />
                            </Badge>
                        )}
                        {filters.location && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                موقعیت: {filters.location}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => handleFilterChange('location', undefined)}
                                />
                            </Badge>
                        )}
                        {filters.workMode && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                همکاری: {filters.workMode}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => handleFilterChange('workMode', undefined)}
                                />
                            </Badge>
                        )}
                        {filters.employmentType && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                نوع: {filters.employmentType}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => handleFilterChange('employmentType', undefined)}
                                />
                            </Badge>
                        )}
                        {filters.experienceLevel && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                سطح: {filters.experienceLevel}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => handleFilterChange('experienceLevel', undefined)}
                                />
                            </Badge>
                        )}
                        {filters.skills?.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                مهارت: {skill}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => handleFilterChange(
                                        'skills',
                                        filters.skills?.filter((s) => s !== skill)
                                    )}
                                />
                            </Badge>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-sm text-blue-600"
                        >
                            پاک کردن همه
                        </Button>
                    </div>
                )}

                {/* Results Layout */}
                <div className="flex gap-8">
                    {/* Filter Sidebar */}
                    {showFilters && searchMode === 'standard' && (
                        <div className="w-80 shrink-0">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClose={() => setShowFilters(false)}
                            />
                        </div>
                    )}

                    {/* Job Listings */}
                    <div className="flex-1">
                        {/* Results header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {isLoading
                                        ? 'در حال جستجو...'
                                        : searchMode === 'ai' && aiData
                                            ? `نتایج جستجوی هوش مصنوعی: "${aiData.query}"`
                                            : `${totalResults} شغل یافت شد`}
                                </h2>
                                {!isLoading && totalResults > 0 && (
                                    <p className="text-sm text-gray-500">
                                        نمایش {((filters.page || 1) - 1) * (filters.limit || 10) + 1}-
                                        {Math.min((filters.page || 1) * (filters.limit || 10), totalResults)} از {totalResults}
                                    </p>
                                )}
                            </div>

                            {searchMode === 'ai' && aiData && (
                                <Badge variant="outline" className="gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    مبتنی بر هوش مصنوعی
                                </Badge>
                            )}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <Skeleton className="h-12 w-12 rounded-lg" />
                                                <div className="flex-1">
                                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                                    <Skeleton className="h-4 w-1/2 mb-3" />
                                                    <Skeleton className="h-4 w-full mb-2" />
                                                    <Skeleton className="h-4 w-2/3" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <div className="text-4xl mb-4">😕</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        خطایی رخ داده است
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchMode === 'ai'
                                            ? 'جستجوی هوش مصنوعی با شکست مواجه شد. لطفاً عبارت دیگری را امتحان کنید.'
                                            : 'نمی‌توانیم مشاغل را بارگذاری کنیم. لطفاً دوباره تلاش کنید.'}
                                    </p>
                                    <Button onClick={() => searchMode === 'standard' ? refetchStandard() : refetchAI()}>
                                        تلاش مجدد
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* No Results */}
                        {!isLoading && !isError && jobs.length === 0 && (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <div className="text-4xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        هیچ شغلی یافت نشد
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchMode === 'ai'
                                            ? 'سعی کنید عبارت جستجو را تغییر دهید یا از جستجوی استاندارد با فیلترها استفاده کنید.'
                                            : 'سعی کنید جستجو یا فیلترهای خود را تنظیم کنید تا مشاغل بیشتری پیدا کنید.'}
                                    </p>
                                    <Button variant="outline" onClick={clearFilters}>
                                        پاک کردن همه فیلترها
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Job Cards */}
                        {!isLoading && !isError && jobs.length > 0 && (
                            <div className="space-y-4">
                                {jobs.map((job: Job) => (
                                    <JobCard key={job._id} job={job} featured={job.skills.length > 0} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {data?.pagination && data.pagination.totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    currentPage={data.pagination.page}
                                    totalPages={data.pagination.totalPages}
                                    onPageChange={(page) => handleFilterChange('page', page)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}