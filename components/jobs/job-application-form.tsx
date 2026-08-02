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
  resumeId: z.string().min(1, "لطفاً یک رزومه انتخاب کنید"),
  coverLetter: z
    .string()
    .min(50, "نامه پوششی باید حداقل ۵۰ کاراکتر باشد")
    .max(2000, "نامه پوششی باید کمتر از ۲۰۰۰ کاراکتر باشد"),
  expectedSalary: z.number().min(0, "حقوق مورد انتظار الزامی است"),
  availableFrom: z.string().min(1, "لطفاً تاریخ آمادگی خود را انتخاب کنید"),
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
  const { data: resumes, isLoading, error } = useQuery({
    queryKey: ['resumes', 'all'],
    queryFn: () => resumeService.getResumes({ status: 'all' }),
  });

  const hasResumes = resumes && resumes?.length > 0;

  // Get today's date in YYYY-MM-DD format safely
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      resumeId: "",
      coverLetter: "",
      expectedSalary: 0,
      availableFrom: getTodayDate(),
    },
  });


  const coverLetter = watch("coverLetter");
  const selectedResumeId = watch("resumeId");

  // Get selected resume details
  const selectedResume = resumes?.find((r: Resume) => r._id === selectedResumeId);

  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: (data: ApplicationFormData) => {
      if (!jobId) {
        throw new Error("شناسه شغل یافت نشد");
      }

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
      toast.success('درخواست با موفقیت ارسال شد!');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.message || 'ارسال درخواست با شکست مواجه شد');
    },
  });

  const handleGenerateCoverLetter = async () => {
    if (!selectedResume) {
      toast.error("لطفاً ابتدا یک رزومه انتخاب کنید");
      return;
    }

    setIsGeneratingCoverLetter(true);
    try {
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
        throw new Error(errorData?.error || 'تولید نامه پوششی با شکست مواجه شد');
      }

      const result = await response.json();
      const generated = result.data?.coverLetter;

      setValue("coverLetter", generated);
      toast.success("نامه پوششی با موفقیت تولید شد!");
    } catch (error) {
      toast.error("تولید نامه پوششی با شکست مواجه شد");
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
        <CardContent className="p-12 text-center" >
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">در حال بارگذاری رزومه‌های شما...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center" >
          <p className="text-red-500">بارگذاری رزومه‌ها با شکست مواجه شد</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            تلاش مجدد
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No resumes state
  if (!hasResumes) {
    return (
      <Card>
        <CardContent className="p-12 text-center" >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">هیچ رزومه‌ای یافت نشد</h3>
          <p className="text-gray-600 mb-4">
            قبل از درخواست برای مشاغل، باید یک رزومه ایجاد کنید.
          </p>
          <Button onClick={() => window.location.href = '/resumes/create'}>
            ایجاد رزومه
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
            <Label>انتخاب رزومه</Label>
            <Select onValueChange={(value) => setValue("resumeId", value)}>
              <SelectTrigger className={errors.resumeId ? "border-red-500" : ""}>
                <SelectValue placeholder="انتخاب رزومه" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((resume: Resume, id: React.Key | null | undefined) => (
                  <SelectItem key={id} value={resume._id}>
                    <div className="flex items-center gap-2">
                      <span>{resume.title}</span>
                      {resume.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          پیش‌فرض
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
                  <span className="font-medium">رزومه انتخاب شده:</span> {selectedResume.title}
                </p>
                {selectedResume.personalInfo?.summary && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 text-right">
                    {selectedResume.personalInfo.summary}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedResume.skills?.slice(0, 5).map((skill: any, id: React.Key | null | undefined) => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                  {selectedResume.skills?.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedResume.skills.length - 5} بیشتر
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>جزییات</Label>
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
                تولید با هوش مصنوعی
              </Button>
            </div>
            <Textarea
              {...register("coverLetter")}
              rows={8}
              placeholder="نامه پوششی خود را بنویسید یا با هوش مصنوعی تولید کنید..."
              className={errors.coverLetter ? "border-red-500" : ""}
            />
            {errors.coverLetter && (
              <p className="text-sm text-red-500">
                {errors.coverLetter.message}
              </p>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{coverLetter?.length || 0} کاراکتر</span>
              <span>{coverLetter?.length < 50 ? `حداقل ${50 - (coverLetter?.length || 0)} کاراکتر دیگر نیاز است` : '✓ حداقل مقدار رسیده است'}</span>
            </div>
          </div>

          {/* Expected Salary */}
          <div className="space-y-2">
            <Label>حقوق مورد انتظار (تومان)</Label>
            <Input
              type="number"
              {...register("expectedSalary", { valueAsNumber: true })}
              placeholder="مثال: ۷۰۰۰۰۰۰۰"
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
            <Label>تاریخ آمادگی</Label>
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
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال ارسال درخواست...
              </>
            ) : (
              "ارسال درخواست"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};