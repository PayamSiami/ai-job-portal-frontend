'use client';

import React from 'react';
import { JobCard } from '@/components/jobs/job-card';
import { ParsedJobFilters, Job } from '@/lib/types/job.types';
import { Sparkles, Filter, Sliders, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchResultsProps {
    jobs: Job[];
    parsedFilters?: ParsedJobFilters;
    isLoading?: boolean;
    onSaveJob?: (jobId: string) => void;
    onApplyJob?: (jobId: string) => void;
    savedJobs?: string[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({
    jobs,
    parsedFilters,
    isLoading,
    onSaveJob,
    onApplyJob,
    savedJobs = [],
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-gray-600">Searching for your dream job...</p>
                </div>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or use different keywords</p>
                {parsedFilters && (
                    <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-gray-500">Your search filters:</p>
                        <div className="flex flex-wrap gap-2 mt-2 justify-center">
                            {Object.entries(parsedFilters)
                                .filter(([key, value]) => value && key !== 'rawQuery' && key !== 'skills')
                                .map(([key, value]) => (
                                    <Badge key={key} variant="secondary" className="text-sm">
                                        {key}: {value?.toString()}
                                    </Badge>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* AI Context Header */}
            {parsedFilters && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">AI interpreted your search:</span>
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {parsedFilters.title && (
                                    <Badge className="bg-white text-blue-700 border-blue-200">
                                        Title: {parsedFilters.title}
                                    </Badge>
                                )}
                                {parsedFilters.location && (
                                    <Badge className="bg-white text-blue-700 border-blue-200">
                                        Location: {parsedFilters.location}
                                    </Badge>
                                )}
                                {parsedFilters.minSalary && (
                                    <Badge className="bg-white text-blue-700 border-blue-200">
                                        Min Salary: ${parsedFilters.minSalary.toLocaleString()}
                                    </Badge>
                                )}
                                {parsedFilters.experienceLevel && (
                                    <Badge className="bg-white text-blue-700 border-blue-200">
                                        Level: {parsedFilters.experienceLevel}
                                    </Badge>
                                )}
                                {parsedFilters.workMode && (
                                    <Badge className="bg-white text-blue-700 border-blue-200">
                                        Mode: {parsedFilters.workMode}
                                    </Badge>
                                )}
                                {parsedFilters.jobType && (
                                    <Badge className="bg-white text-blue-700 border-blue-200">
                                        Type: {parsedFilters.jobType}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                    Found <span className="font-semibold text-gray-900">{jobs.length}</span> jobs
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Sliders className="w-4 h-4" />
                        Sort
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard
                        key={job._id}
                        job={job}
                        onSave={onSaveJob}
                        onApply={onApplyJob}
                        isSaved={savedJobs.includes(job._id)}
                    />
                ))}
            </div>
        </div>
    );
};