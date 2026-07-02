'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { useJobs } from '@/lib/hooks/use-jobs';
import toast from 'react-hot-toast';

const jobPostSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().min(50, 'Requirements must be at least 50 characters'),
  responsibilities: z.string().min(50, 'Responsibilities must be at least 50 characters'),
  benefits: z.string().min(20, 'Benefits must be at least 20 characters'),
  companyId: z.string().optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }),
  salary: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  workMode: z.enum(['remote', 'hybrid', 'on-site']),
  experienceLevel: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'executive']),
  openings: z.number().min(1, 'At least 1 opening is required'),
  applicationDeadline: z.string(),
  tags: z.array(z.string()),
  skills: z.array(z.string()),
});

type JobPostFormData = z.infer<typeof jobPostSchema>;

export const JobPostingForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createJob } = useJobs();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      jobType: 'full-time',
      workMode: 'remote',
      experienceLevel: 'mid',
      openings: 1,
      tags: [],
      skills: [],
    },
  });

  const { fields: tagFields, append: addTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags',
  });

  const { fields: skillFields, append: addSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills',
  });

  const [newTag, setNewTag] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag({ value: newTag.trim() });
      setNewTag('');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({ value: newSkill.trim() });
      setNewSkill('');
    }
  };

  const handleAIGenerate = async (field: string) => {
    setIsGenerating(true);
    try {
      // Call AI service to generate content
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generatedContent = `This is AI-generated ${field} content for the job posting. It provides a comprehensive overview of the role requirements and responsibilities.`;
      setValue(field as any, generatedContent);
      toast.success(`${field} generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: JobPostFormData) => {
    setIsSubmitting(true);
    try {
      await createJob(data);
      toast.success('Job posted successfully!');
    } catch (error) {
      toast.error('Failed to post job');
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
              {...register('title')}
              placeholder="e.g., Senior React Developer"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
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
                onClick={() => handleAIGenerate('description')}
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
              {...register('description')}
              rows={5}
              placeholder="Describe the job role, responsibilities, and what makes this position exciting..."
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
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
                onClick={() => handleAIGenerate('requirements')}
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
              {...register('requirements')}
              rows={4}
              placeholder="List the technical and soft skills required..."
              className={errors.requirements ? 'border-red-500' : ''}
            />
            {errors.requirements && (
              <p className="text-sm text-red-500 mt-1">{errors.requirements.message}</p>
            )}
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Job Type</label>
              <select
                {...register('jobType')}
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
                {...register('workMode')}
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
                {...register('experienceLevel')}
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
                {...register('openings', { valueAsNumber: true })}
                min={1}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium">Skills</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillFields.map((field, index) => (
                <Badge key={field.id} variant="secondary" className="gap-1">
                  {field.value}
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
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button type="button" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tagFields.map((field, index) => (
                <Badge key={field.id} variant="outline" className="gap-1">
                  {field.value}
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
              'Post Job'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};