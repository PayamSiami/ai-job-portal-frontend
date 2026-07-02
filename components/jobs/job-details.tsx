'use client';

import React from 'react';
import { Job } from '@/lib/types/job.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building, 
  Calendar,
  Users,
  Tag,
  FileText,
  Link,
  Mail,
  Phone,
  Globe,
  Star,
  Heart
} from 'lucide-react';
import { formatSalary, getExperienceLabel, getWorkModeLabel, getJobTypeLabel } from '@/lib/utils/formatters';

interface JobDetailsProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ 
  job, 
  onSave, 
  isSaved = false 
}) => {
  const getExperienceColor = (level: string) => {
    const colors: Record<string, string> = {
      entry: 'bg-green-100 text-green-800',
      mid: 'bg-blue-100 text-blue-800',
      senior: 'bg-purple-100 text-purple-800',
      lead: 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <Badge className={getExperienceColor(job.experienceLevel)}>
                  {getExperienceLabel(job.experienceLevel)}
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {job.isActive ? 'Active' : 'Closed'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {formatSalary(job.minSalary, job.maxSalary)}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {getJobTypeLabel(job.jobType)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getWorkModeLabel(job.workMode)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  15 applicants
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSave?.(job._id)}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save Job'}
              </Button>
              <Badge variant="secondary" className="text-xs">
                Posted by {job.postedBy || 'Company'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </CardContent>
          </Card>

          {/* Benefits */}
          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Job Type</span>
                <span className="font-medium">{getJobTypeLabel(job.jobType)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{getExperienceLabel(job.experienceLevel)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Work Mode</span>
                <span className="font-medium">{getWorkModeLabel(job.workMode)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Salary</span>
                <span className="font-medium">{formatSalary(job.minSalary, job.maxSalary)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{job.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-blue-200 text-blue-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Import this at the top
import { CheckCircle } from 'lucide-react';