/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService, Resume } from "@/lib/services/resume.service";
import { Badge } from "@/components/ui/badge";
import { applicationService } from "@/lib/services/application.service";

const applicationSchema = z.object({
  resumeId: z.string().min(1, "Please select a resume"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter must be less than 2000 characters"),
  expectedSalary: z.number().min(0, "Expected salary is required"),
  availableFrom: z.string().min(1, "Please select your availability"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: () => void;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  onSuccess,
}) => {
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const queryClient = useQueryClient();

  // Fetch resumes
  const { data, isLoading, error } = useQuery({
    queryKey: ['resumes', 'all'],
    queryFn: () => resumeService.getResumes({ status: 'all' }),
  });

  const resumes = data?.data || [];
  const hasResumes = resumes.length > 0;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      expectedSalary: 0,
      availableFrom: new Date().toISOString().split('T')[0],
    },
  });

  const coverLetter = watch("coverLetter");
  const selectedResumeId = watch("resumeId");

  // Get selected resume details
  const selectedResume = resumes.find((r: Resume) => r._id === selectedResumeId);

  // ✅ Fixed: Submit application mutation
  const submitApplication = useMutation({
    mutationFn: (data: ApplicationFormData) => {
      // Make sure all required fields are present
      const applicationData = {
        jobId: jobId,
        resumeId: data.resumeId,
        coverLetter: data.coverLetter,
        expectedSalary: data.expectedSalary,
        availableFrom: data.availableFrom,
      };
      return applicationService.applyJob(applicationData);
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to submit application');
    },
  });

  const handleGenerateCoverLetter = async () => {
    if (!selectedResume) {
      toast.error("Please select a resume first");
      return;
    }

    setIsGeneratingCoverLetter(true);
    try {
      // ✅ Use the correct API endpoint
      const response = await fetch(`/api/resumes/${selectedResumeId}/generate-cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          jobId: jobId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to generate cover letter');
      }

      const result = await response.json();
      const generated = result.data?.coverLetter || `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With my background in ${selectedResume.personalInfo?.title || 'my field'} and passion for technology, I am confident that my skills and experience make me an ideal candidate for this role.

Throughout my career, I have developed expertise in ${selectedResume.skills?.map((s: any) => s.name).join(', ') || 'various technologies'} and successfully delivered high-impact solutions. I am particularly drawn to this opportunity because of your company's reputation for innovation and excellence.

I am excited about the possibility of contributing to your team and would welcome the opportunity to discuss how my background aligns with your needs.

Thank you for your consideration.

Best regards,
${selectedResume.personalInfo?.firstName || ''} ${selectedResume.personalInfo?.lastName || ''}`;

      setValue("coverLetter", generated);
      toast.success("Cover letter generated successfully!");
    } catch (error) {
      toast.error("Failed to generate cover letter");
      console.error('Cover letter generation error:', error);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const onSubmit = (data: ApplicationFormData) => {
    submitApplication.mutate(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your resumes...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-red-500">Failed to load resumes</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No resumes state
  if (!hasResumes) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resumes Found</h3>
          <p className="text-gray-600 mb-4">
            You need to create a resume before you can apply for jobs.
          </p>
          <Button onClick={() => window.location.href = '/resumes/create'}>
            Create Resume
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Resume Selection */}
          <div className="space-y-2">
            <Label>Select Resume</Label>
            <Select onValueChange={(value) => setValue("resumeId", value)}>
              <SelectTrigger className={errors.resumeId ? "border-red-500" : ""}>
                <SelectValue placeholder="Choose a resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((resume: Resume) => (
                  <SelectItem key={resume._id} value={resume._id}>
                    <div className="flex items-center gap-2">
                      <span>{resume.title}</span>
                      {resume.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        ({resume.personalInfo?.firstName || ''} {resume.personalInfo?.lastName || ''})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.resumeId && (
              <p className="text-sm text-red-500">{errors.resumeId.message}</p>
            )}
            {selectedResume && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Selected Resume:</span> {selectedResume.title}
                </p>
                {selectedResume.personalInfo?.summary && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {selectedResume.personalInfo.summary}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedResume.skills?.slice(0, 5).map((skill: any) => (
                    <Badge key={skill.name} variant="secondary" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                  {selectedResume.skills?.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedResume.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Cover Letter</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingCoverLetter || !selectedResumeId}
                className="gap-2"
              >
                {isGeneratingCoverLetter ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              {...register("coverLetter")}
              rows={8}
              placeholder="Write your cover letter here or generate with AI..."
              className={errors.coverLetter ? "border-red-500" : ""}
            />
            {errors.coverLetter && (
              <p className="text-sm text-red-500">
                {errors.coverLetter.message}
              </p>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{coverLetter?.length || 0} characters</span>
              <span>{coverLetter?.length < 50 ? `Need ${50 - (coverLetter?.length || 0)} more characters` : '✓ Minimum reached'}</span>
            </div>
          </div>

          {/* Expected Salary */}
          <div className="space-y-2">
            <Label>Expected Salary (USD)</Label>
            <Input
              type="number"
              {...register("expectedSalary", { valueAsNumber: true })}
              placeholder="e.g., 70000"
              className={errors.expectedSalary ? "border-red-500" : ""}
            />
            {errors.expectedSalary && (
              <p className="text-sm text-red-500">
                {errors.expectedSalary.message}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label>Available From</Label>
            <Input
              type="date"
              {...register("availableFrom")}
              className={errors.availableFrom ? "border-red-500" : ""}
            />
            {errors.availableFrom && (
              <p className="text-sm text-red-500">
                {errors.availableFrom.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={submitApplication.isPending || !selectedResumeId}
          >
            {submitApplication.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};