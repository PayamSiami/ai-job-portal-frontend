"use client";

import React from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatSalary,
  getExperienceLabel,
  getWorkModeLabel,
} from "@/lib/utils/formatters";
import { Job } from "@/lib/types/job.types";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onSave?: ((jobId: string) => void) | undefined;
  onApply?: ((jobId: string) => void) | undefined;
  isSaved?: boolean;
  showApplyButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onApply,
  isSaved = false,
  showApplyButton = true,
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

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border hover:border-blue-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <Badge className={getExperienceColor(job.experienceLevel)}>
              {getExperienceLabel(job.experienceLevel)}
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
              {job.jobType}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getWorkModeLabel(job.workMode)}
            </span>
          </div>

          <p className="mt-3 text-gray-600 line-clamp-2 text-sm">
            {job.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {job.tags?.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {job.tags && job.tags.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{job.tags.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSave?.(job._id)}
            className={cn(
              "transition-all",
              isSaved
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-gray-400 hover:text-yellow-500",
            )}
          >
            <Star className={cn("w-5 h-5", isSaved && "fill-current")} />
          </Button>

          {showApplyButton && onApply && (
            <Button
              onClick={() => onApply(job._id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};