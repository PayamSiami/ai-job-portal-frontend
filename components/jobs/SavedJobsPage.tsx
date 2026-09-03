
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Bookmark,
    Briefcase,
    MapPin,
    Calendar,
    Clock,
    Trash2,
    Share2,
    ExternalLink,
    Filter,
    Search,
    X,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '@/lib/types/job.types';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface SavedJobsPageProps {
    savedJobs?: Job[];
    onRemoveJob?: (jobId: string) => void;
    onShareJob?: (jobId: string) => void;
    isLoading?: boolean;
}

interface SavedJob extends Job {
    savedAt: string;
    notes?: string;
    employmentType: string;
}

type SortOption = 'recent' | 'oldest' | 'company' | 'title';

// Mock data for demonstration (kept separate from the real Job shape; the
// demo records are intentionally partial, so the array is cast explicitly)
const MOCK_SAVED_JOBS = [
    {
        _id: '1',
        title: 'توسعه‌دهنده ارشد React',
        company: 'شرکت فناوری نوین',
        location: 'تهران، ایران',
        workMode: 'remote',
        employmentType: 'full-time',
        experienceLevel: 'senior',
        minSalary: 80,
        maxSalary: 120,
        skills: ['React', 'TypeScript', 'Next.js'],
        description: 'شرکت فناوری نوین به دنبال یک توسعه‌دهنده ارشد React با تجربه بالا می‌گردد.',
        createdAt: new Date().toISOString(),
        savedAt: new Date().toISOString(),
        isActive: true,
        isFeatured: true,
    },
    {
        _id: '2',
        title: 'مهندس فول‌استک',
        company: 'استارتاپ هوشمند',
        location: 'اصفهان، ایران',
        workMode: 'hybrid',
        employmentType: 'full-time',
        experienceLevel: 'mid',
        skills: ['Node.js', 'React', 'MongoDB'],
        description: 'استارتاپ هوشمند به دنبال یک مهندس فول‌استک با تجربه در Node.js و React است.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        isActive: true,
        isFeatured: false,
    },
    {
        _id: '3',
        title: 'طراح UI/UX',
        company: 'آژانس دیجیتال',
        location: 'شیراز، ایران',
        workMode: 'on-site',
        employmentType: 'contract',
        experienceLevel: 'mid',
        skills: ['Figma', 'Adobe XD', 'User Research'],
        description: 'آژانس دیجیتال به دنبال یک طراح UI/UX با سابقه کار در پروژه‌های بزرگ است.',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        savedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        isActive: true,
        isFeatured: false,
    },
] as unknown as SavedJob[];

export function SavedJobsPage({
    savedJobs: propSavedJobs,
    onRemoveJob,
    onShareJob,
    isLoading = false,
}: SavedJobsPageProps) {
    const router = useRouter();
    // Real saved jobs come as Job[]; the mock provides the SavedJob extras,
    // so the prop is narrowed to SavedJob[] for the shared state type.
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>(
        propSavedJobs ? (propSavedJobs as SavedJob[]) : MOCK_SAVED_JOBS
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'full-time' | 'part-time' | 'contract' | 'internship'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter and sort jobs
    const filteredJobs = savedJobs
        .filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                // job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || job.employmentType === filterType;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
                case 'oldest':
                    return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
                // case 'company':
                //     return a.company.localeCompare(b.company);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    const handleRemoveJob = async (jobId: string) => {
        setDeletingId(jobId);
        try {
            if (onRemoveJob) {
                await onRemoveJob(jobId);
            }
            setSavedJobs(prev => prev.filter(job => job._id !== jobId));
            if (selectedJob?._id === jobId) {
                setSelectedJob(null);
            }
        } catch (error) {
            console.error('Error removing job:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleShareJob = (job: SavedJob) => {
        if (onShareJob) {
            onShareJob(job._id);
        } else {
            // Default share behavior
            const url = `${window.location.origin}/jobs/${job._id}`;
            if (navigator.share) {
                navigator.share({
                    title: job.title,
                    text: `مشاهده شغل ${job.title} در ${job.company}`,
                    url: url,
                });
            } else {
                navigator.clipboard.writeText(url);
                alert('لینک شغل کپی شد!');
            }
        }
    };

    const getWorkModeLabel = (mode: string) => {
        const labels: Record<string, string> = {
            remote: 'دورکاری',
            hybrid: 'ترکیبی',
            'on-site': 'حضوری',
        };
        return labels[mode] || mode;
    };

    const getEmploymentTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'full-time': 'تمام وقت',
            'part-time': 'پاره وقت',
            contract: 'قراردادی',
            internship: 'کارآموزی',
        };
        return labels[type] || type;
    };

    const getExperienceLabel = (level: string) => {
        const labels: Record<string, string> = {
            entry: 'تازه‌کار',
            mid: 'متوسط',
            senior: 'ارشد',
            lead: 'رهبر تیم',
            executive: 'مدیریتی',
        };
        return labels[level] || level;
    };

    const getWorkModeColor = (mode: string) => {
        const colors: Record<string, string> = {
            remote: 'bg-green-100 text-green-800 border-green-200',
            hybrid: 'bg-blue-100 text-blue-800 border-blue-200',
            'on-site': 'bg-orange-100 text-orange-800 border-orange-200',
        };
        return colors[mode] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-gray-600">در حال بارگذاری مشاغل ذخیره شده...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg">
                                <Bookmark className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                                    مشاغل ذخیره شده
                                </h1>
                                <p className="text-gray-600 mt-1 dark:text-gray-300">
                                    {savedJobs.length} شغل ذخیره شده
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/jobs')}
                            className="flex items-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            جستجوی مشاغل
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="جستجو در مشاغل ذخیره شده..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-10 pl-4"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            فیلترها
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="recent">جدیدترین</option>
                            <option value="oldest">قدیمی‌ترین</option>
                            <option value="company">بر اساس شرکت</option>
                            <option value="title">بر اساس عنوان</option>
                        </select>
                    </div>
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <Separator className="my-4" />
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant={filterType === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterType('all')}
                                    className={filterType === 'all' ? 'bg-blue-600' : ''}
                                >
                                    همه
                                </Button>
                                <Button
                                    variant={filterType === 'full-time' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterType('full-time')}
                                    className={filterType === 'full-time' ? 'bg-blue-600' : ''}
                                >
                                    تمام وقت
                                </Button>
                                <Button
                                    variant={filterType === 'part-time' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterType('part-time')}
                                    className={filterType === 'part-time' ? 'bg-blue-600' : ''}
                                >
                                    پاره وقت
                                </Button>
                                <Button
                                    variant={filterType === 'contract' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterType('contract')}
                                    className={filterType === 'contract' ? 'bg-blue-600' : ''}
                                >
                                    قراردادی
                                </Button>
                                <Button
                                    variant={filterType === 'internship' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterType('internship')}
                                    className={filterType === 'internship' ? 'bg-blue-600' : ''}
                                >
                                    کارآموزی
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Results */}
            {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bookmark className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        هیچ شغلی ذخیره نشده است
                    </h3>
                    <p className="text-gray-600 mb-6">
                        شما هنوز هیچ شغلی را ذخیره نکرده‌اید. با جستجو و ذخیره کردن مشاغل، آنها را در اینجا مشاهده کنید.
                    </p>
                    <Button
                        asChild
                        className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        <Link href="/jobs">
                            <Search className="w-4 h-4 ml-2" />
                            شروع جستجو
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Job List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {filteredJobs.map((job) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all hover:shadow-md ${selectedJob?._id === job._id ? 'border-blue-500 shadow-md' : ''
                                            }`}
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                                {job.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 truncate">
                                                                {job.company.toString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                                {getEmploymentTypeLabel(job.employmentType)}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {job.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="w-4 h-4" />
                                                            {getWorkModeLabel(job.workMode)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {getExperienceLabel(job.experienceLevel)}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Calendar className="w-3 h-3" />
                                                            ذخیره شده {formatDistanceToNow(new Date(job.savedAt), { locale: faIR, addSuffix: true })}
                                                        </span>
                                                    </div>

                                                    {job.skills && job.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {job.skills.slice(0, 4).map((skill) => (
                                                                <Badge key={skill} variant="secondary" className="text-xs">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {job.skills.length > 4 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    +{job.skills.length - 4}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveJob(job._id);
                                                        }}
                                                        disabled={deletingId === job._id}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        {deletingId === job._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                        <span className="mr-1">حذف</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShareJob(job);
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                        <span className="mr-1">اشتراک</span>
                                                    </Button>
                                                </div>
                                                <Link href={`/jobs/${job._id}`}>
                                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                        مشاهده
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Job Details Panel */}
                    <div className="hidden lg:block">
                        {selectedJob ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{selectedJob.title}</h4>
                                            <p className="text-sm text-gray-600">{selectedJob.company.toString()}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedJob(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{selectedJob.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Badge className={getWorkModeColor(selectedJob.workMode)}>
                                            {getWorkModeLabel(selectedJob.workMode)}
                                        </Badge>
                                        <Badge variant="outline">
                                            {getEmploymentTypeLabel(selectedJob.employmentType)}
                                        </Badge>
                                        <Badge variant="outline">
                                            {getExperienceLabel(selectedJob.experienceLevel)}
                                        </Badge>
                                    </div>
                                    {selectedJob.minSalary && (
                                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                            <p className="text-sm text-green-800 font-medium">
                                                محدوده حقوق: {selectedJob.minSalary.toLocaleString()} - {selectedJob.minSalary.toLocaleString()} تومان
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-900 mb-1">مهارت‌ها</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedJob.skills?.map((skill) => (
                                                <Badge key={skill} variant="secondary" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-900 mb-1">توضیحات</h5>
                                        <p className="text-sm text-gray-600 line-clamp-4">
                                            {selectedJob.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                                    <Link href={`/jobs/${selectedJob._id}`}>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                            مشاهده جزئیات کامل
                                        </Button>
                                    </Link>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => handleShareJob(selectedJob)}
                                        >
                                            <Share2 className="w-4 h-4 ml-2" />
                                            اشتراک
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleRemoveJob(selectedJob._id)}
                                            disabled={deletingId === selectedJob._id}
                                        >
                                            {deletingId === selectedJob._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4 ml-2" />
                                            )}
                                            حذف
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center sticky top-4 dark:bg-gray-800 dark:border-gray-700">
                                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3 dark:text-gray-500" />
                                <h4 className="text-gray-600 font-medium dark:text-gray-300">یک شغل را انتخاب کنید</h4>
                                <p className="text-sm text-gray-400 mt-1 dark:text-gray-400">
                                    برای مشاهده جزئیات، روی هر شغل کلیک کنید
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}