/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Star,
  Heart,
  CheckCircle,
} from "lucide-react";
import {
  formatSalary,
  getExperienceLabel,
  getWorkModeLabel,
  getJobTypeLabel,
} from "@/lib/utils/formatters";
import { Job } from "@/lib/types/job.types";

interface JobDetailsProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

export const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  onSave,
  isSaved = false,
}) => {
  const getExperienceColor = (level: string) => {
    const colors: Record<string, string> = {
      entry: "bg-green-100 text-green-800",
      mid: "bg-blue-100 text-blue-800",
      senior: "bg-purple-100 text-purple-800",
      lead: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  // Helper to get company name safely
  const getCompanyName = (company: any): string => {
    if (!company) return "شرکت نامشخص";
    if (typeof company === 'string') return company;
    return company.name || "شرکت نامشخص";
  };

  // Helper to get company location safely
  const getCompanyLocation = (company: any): string => {
    if (!company) return "موقعیت نامشخص";
    if (typeof company === 'string') return company;

    // If location is an object with nested fields
    if (company.location && typeof company.location === 'object') {
      const loc = company.location;
      // Build location string from available fields
      const parts = [];
      if (loc.city) parts.push(loc.city);
      if (loc.state) parts.push(loc.state);
      if (loc.country) parts.push(loc.country);
      if (loc.address && !loc.city && !loc.state) parts.push(loc.address);
      return parts.length > 0 ? parts.join('، ') : "موقعیت نامشخص";
    }

    // If location is a string
    if (company.location && typeof company.location === 'string') {
      return company.location;
    }

    return "موقعیت نامشخص";
  };

  // Helper to get posted by name safely
  const getPostedByName = (postedBy: any): string => {
    if (!postedBy) return "شرکت";
    if (typeof postedBy === 'string') return postedBy;
    return postedBy.username || postedBy.name || postedBy.email || "شرکت";
  };

  // Get display location (use company location if available, otherwise job.location)
  const getDisplayLocation = (): string => {
    if (job.company && typeof job.company === 'object') {
      const companyLoc = getCompanyLocation(job.company);
      if (companyLoc !== "موقعیت نامشخص") return companyLoc;
    }
    return job.location || "موقعیت نامشخص";
  };

  return (
    <div className="space-y-6" >
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <Badge className={getExperienceColor(job.experienceLevel)}>
                  {getExperienceLabel(job.experienceLevel)}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700"
                >
                  {job.isActive ? "فعال" : "بسته شده"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {getCompanyName(job.company)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {getDisplayLocation()}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {(job.minSalary && job.maxSalary) && formatSalary(job.minSalary, job.maxSalary)}
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
                  ثبت شده: {new Date(job.createdAt).toLocaleDateString('fa-IR')}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {job.applicantCount || "-"} متقاضی
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={() => onSave?.(job._id)}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "ذخیره شده" : "ذخیره شغل"}
              </Button>
              <Badge variant="secondary" className="text-xs">
                ثبت شده توسط {getPostedByName(job.postedBy)}
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
                شرح شغل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line text-right">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                نیازمندی‌ها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line text-right">
                {job.requirements}
              </p>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          {job.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  مسئولیت‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line text-right">
                  {job.responsibilities}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  مزایا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line text-right">
                  {job.benefits}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">اطلاعات سریع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">نوع شغل</span>
                <span className="font-medium">
                  {getJobTypeLabel(job.jobType)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">سطح تجربه</span>
                <span className="font-medium">
                  {getExperienceLabel(job.experienceLevel)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">نوع همکاری</span>
                <span className="font-medium">
                  {getWorkModeLabel(job.workMode)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">حقوق</span>
                <span className="font-medium">
                  {(job.minSalary && job.maxSalary) && formatSalary(job.minSalary, job.maxSalary)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">موقعیت مکانی</span>
                <span className="font-medium">{getDisplayLocation()}</span>
              </div>
              {job.applicationDeadline && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">مهلت ثبت‌نام</span>
                  <span className="font-medium">
                    {new Date(job.applicationDeadline).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              )}
              {job.openings && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">تعداد موقعیت‌ها</span>
                  <span className="font-medium">{job.openings}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">مهارت‌ها</CardTitle>
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
                <CardTitle className="text-sm font-medium">برچسب‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      <Tag className="w-3 h-3 ml-1" />
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