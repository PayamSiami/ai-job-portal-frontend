'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Clock, Building, Globe, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Job } from '@/lib/types/job.types';
import { formatDistanceToNow, formatSalary } from '@/lib/utils/index';

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export function JobCard({ job, featured }: JobCardProps) {
  const companyLogo =
    typeof job.company === 'object' && job.company?.logo ? job.company.logo : undefined;
  const companyName =
    typeof job.company === 'object'
      ? job.company?.name
      : typeof job.company === 'string'
        ? job.company
        : undefined;

  const getExperienceLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      entry: 'bg-green-100 text-green-800',
      mid: 'bg-blue-100 text-blue-800',
      senior: 'bg-orange-100 text-orange-800',
      lead: 'bg-purple-100 text-purple-800',
      executive: 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getWorkModeIcon = (mode: string) => {
    switch (mode) {
      case 'remote':
        return <Globe className="w-4 h-4" />;
      case 'hybrid':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const getWorkModeLabel = (mode: string) => {
    switch (mode) {
      case 'remote':
        return 'Remote';
      case 'hybrid':
        return 'Hybrid';
      default:
        return 'On-site';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${featured ? 'border-blue-200 border-2 bg-blue-50/30' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 rounded-lg">
            {companyLogo && <AvatarImage src={companyLogo} />}
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg rounded-lg">
              {companyName?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/jobs/${job._id}`} className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2">
                  {job.title}
                  {featured && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      مهارت ها
                    </Badge>
                  )}
                </h3>
              </Link>
              <div className="shrink-0">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-xs"
                >
                  {getWorkModeIcon(job.workMode)}
                  {getWorkModeLabel(job.workMode)}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {companyName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Posted {formatDistanceToNow(new Date(job.createdAt))}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className={getExperienceLevelColor(job.experienceLevel)}>
                {job.experienceLevel}
              </Badge>
              <Badge variant="outline">{job.jobType}</Badge>
              {job.minSalary && job.maxSalary && (
                <Badge variant="secondary">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {formatSalary(job.minSalary, job.maxSalary)}
                </Badge>
              )}
              {job?.isFeatured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Top Match
                </Badge>
              )}
            </div>

            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {job.skills.slice(0, 5).map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.skills.length - 5} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {job.applicantCount && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{job.applicantCount}</span> applicants
                  </span>
                )}
                {job.jobType && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.jobType}
                  </span>
                )}
              </div>

              <Link href={`/jobs/${job._id}`}>
                <Button variant="outline" size="sm" className="hover:bg-blue-50">
                  نمایش جزییات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
