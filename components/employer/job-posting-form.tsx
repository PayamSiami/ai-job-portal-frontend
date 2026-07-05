"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";
import { useJobs } from "@/lib/hooks/use-jobs";
import toast from "react-hot-toast";

// Define the schema with proper types - make fields explicitly required or optional
const jobPostSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(50, "Requirements must be at least 50 characters"),
  responsibilities: z.string().min(50, "Responsibilities must be at least 50 characters"),
  benefits: z.string().min(20, "Benefits must be at least 20 characters"),
  companyId: z.string().optional(),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }),
  jobType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
  ]),
  workMode: z.enum(["remote", "hybrid", "on-site"]),
  experienceLevel: z.enum([
    "entry",
    "junior",
    "mid",
    "senior",
    "lead",
    "executive",
  ]),
  openings: z.number().min(1, "At least 1 opening is required"),
  applicationDeadline: z.string().optional(),
  tags: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
});

// Infer the type from the schema
type JobPostFormData = z.infer<typeof jobPostSchema>;

export const JobPostingForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createJob } = useJobs();
  const [newTag, setNewTag] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Create default values that match the schema exactly
  const defaultValues: JobPostFormData = {
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    companyId: undefined,
    location: {
      address: undefined,
      city: undefined,
      state: undefined,
      country: undefined,
      zipCode: undefined,
    },
    salary: {
      min: undefined,
      max: undefined,
    },
    jobType: "full-time",
    workMode: "remote",
    experienceLevel: "mid",
    openings: 1,
    applicationDeadline: undefined,
    tags: [],
    skills: [],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues,
  });

  // UseFieldArray for tags
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray<
    JobPostFormData,
    "tags"
  >({
    control,
    name: "tags",
  });

  // UseFieldArray for skills
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray<
    JobPostFormData,
    "skills"
  >({
    control,
    name: "skills",
  });

  const handleAddTag = () => {
    if (newTag.trim()) {
      appendTag(newTag.trim());
      setNewTag("");
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      appendSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  const handleAIGenerate = async (field: "description" | "requirements" | "responsibilities" | "benefits") => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const generatedContent = `This is AI-generated ${field} content for the job posting. It provides a comprehensive overview of the role requirements and responsibilities.`;
      
      setValue(field, generatedContent);
      toast.success(`${field} generated successfully!`);
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: JobPostFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API - remove undefined values
      const jobData = {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        companyId: data.companyId || "",
        location: {
          address: data.location?.address || "",
          city: data.location?.city || "",
          state: data.location?.state || "",
          country: data.location?.country || "",
          zipCode: data.location?.zipCode || "",
        },
        salary: {
          min: data.salary?.min || 0,
          max: data.salary?.max || 0,
        },
        jobType: data.jobType,
        workMode: data.workMode,
        experienceLevel: data.experienceLevel,
        openings: data.openings,
        applicationDeadline: data.applicationDeadline || "",
        tags: data.tags || [],
        skills: data.skills || [],
      };

      await createJob.mutateAsync(jobData);
      toast.success("Job posted successfully!");
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Job Title */}
          <div>
            <label className="text-sm font-medium">Job Title</label>
            <Input
              {...register("title")}
              placeholder="e.g., Senior React Developer"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Job Description</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAIGenerate("description")}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              {...register("description")}
              rows={5}
              placeholder="Describe the job role, responsibilities, and what makes this position exciting..."
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Requirements</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAIGenerate("requirements")}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              {...register("requirements")}
              rows={4}
              placeholder="List the technical and soft skills required..."
              className={errors.requirements ? "border-red-500" : ""}
            />
            {errors.requirements && (
              <p className="text-sm text-red-500 mt-1">
                {errors.requirements.message}
              </p>
            )}
          </div>

          {/* Responsibilities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Responsibilities</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAIGenerate("responsibilities")}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              {...register("responsibilities")}
              rows={4}
              placeholder="List the day-to-day responsibilities..."
              className={errors.responsibilities ? "border-red-500" : ""}
            />
            {errors.responsibilities && (
              <p className="text-sm text-red-500 mt-1">
                {errors.responsibilities.message}
              </p>
            )}
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Benefits</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAIGenerate("benefits")}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              {...register("benefits")}
              rows={3}
              placeholder="List the benefits and perks..."
              className={errors.benefits ? "border-red-500" : ""}
            />
            {errors.benefits && (
              <p className="text-sm text-red-500 mt-1">
                {errors.benefits.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input {...register("location.address")} placeholder="Street address" />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input {...register("location.city")} placeholder="City" />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input {...register("location.state")} placeholder="State" />
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input {...register("location.country")} placeholder="Country" />
            </div>
            <div>
              <label className="text-sm font-medium">Zip Code</label>
              <Input {...register("location.zipCode")} placeholder="Zip code" />
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Minimum Salary</label>
              <Input
                type="number"
                {...register("salary.min", { valueAsNumber: true })}
                placeholder="50000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Maximum Salary</label>
              <Input
                type="number"
                {...register("salary.max", { valueAsNumber: true })}
                placeholder="80000"
              />
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Job Type</label>
              <select
                {...register("jobType")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Work Mode</label>
              <select
                {...register("workMode")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Experience Level</label>
              <select
                {...register("experienceLevel")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Openings</label>
              <Input
                type="number"
                {...register("openings", { valueAsNumber: true })}
                min={1}
                placeholder="Number of openings"
              />
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="text-sm font-medium">Application Deadline</label>
            <Input
              type="date"
              {...register("applicationDeadline")}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium">Skills</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillFields.map((field, index) => (
                <Badge key={field.id} variant="secondary" className="gap-1">
                  {String(field.id)}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
              />
              <Button type="button" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tagFields.map((field, index) => (
                <Badge key={field.id} variant="outline" className="gap-1">
                  {String(field.id)}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting Job...
              </>
            ) : (
              "Post Job"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};