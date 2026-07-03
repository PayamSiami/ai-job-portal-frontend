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
import { Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const applicationSchema = z.object({
  resumeId: z.string().min(1, "Please select a resume"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters"),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const coverLetter = watch("coverLetter");

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    try {
      // Call AI service to generate cover letter
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const generated = `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. With my background in [Your Field] and passion for [Industry], I am confident that my skills and experience make me an ideal candidate for this role.

Throughout my career, I have developed expertise in [Key Skills] and successfully delivered [Key Achievements]. I am particularly drawn to this opportunity because [Reason for Interest].

I am excited about the possibility of contributing to your team and would welcome the opportunity to discuss how my background aligns with your needs.

Thank you for your consideration.

Best regards,
[Your Name]`;

      setValue("coverLetter", generated);
      toast.success("Cover letter generated successfully!");
    } catch (error) {
      toast.error("Failed to generate cover letter");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Submit application
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Application submitted successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Resume Selection */}
          <div className="space-y-2">
            <Label>Select Resume</Label>
            <Select onValueChange={(value) => setValue("resumeId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a resume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resume-1">
                  Full Stack Developer Resume
                </SelectItem>
                <SelectItem value="resume-2">
                  Frontend Developer Resume
                </SelectItem>
                <SelectItem value="resume-3">
                  Backend Developer Resume
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.resumeId && (
              <p className="text-sm text-red-500">{errors.resumeId.message}</p>
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
                disabled={isGeneratingCoverLetter}
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
            <p className="text-xs text-gray-500">
              {coverLetter?.length || 0} characters (minimum 50)
            </p>
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
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
