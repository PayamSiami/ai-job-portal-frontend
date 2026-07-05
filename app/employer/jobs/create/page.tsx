/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Loader2,
  Plus,
  X,
  Trash2,
  Building,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Globe,
  Clock,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jobService } from '@/lib/services/job.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Job form state type
interface JobFormData {
  title: string;
  company: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  workMode: 'remote' | 'hybrid' | 'on-site';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string;
  benefits: string;
  tags: string[];
  isRemote: boolean;
  isActive: boolean;
  isFeatured: boolean;
}

export default function CreateJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Form state
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    minSalary: 50000,
    maxSalary: 80000,
    experienceLevel: 'mid',
    workMode: 'on-site',
    jobType: 'full-time',
    description: '',
    requirements: '',
    benefits: '',
    tags: [],
    isRemote: false,
    isActive: true,
    isFeatured: false,
  });

  // AI Content Generation Mutation
  const generateContentMutation = useMutation({
    mutationFn: (jobTitle: string) => jobService.generateJobContent({ jobTitle }),
    onSuccess: (data) => {
      // Handle description
      if (data.description) {
        setFormData(prev => ({ ...prev, description: data.description }));
      }

      // Handle requirements (could be array or string)
      if (data.requirements) {
        if (Array.isArray(data.requirements)) {
          setFormData(prev => ({ ...prev, requirements: data.requirements.join('\n') }));
        } else if (typeof data.requirements === 'string') {
          setFormData(prev => ({ ...prev, requirements: data.requirements }));
        }
      }

      // Handle responsibilities (if present)
      if (data.responsibilities) {
        if (Array.isArray(data.responsibilities)) {
          setFormData(prev => ({ 
            ...prev, 
            requirements: data.responsibilities.join('\n') 
          }));
        }
      }

      // Handle benefits (could be array or string)
      if (data.benefits) {
        if (Array.isArray(data.benefits)) {
          setFormData(prev => ({ ...prev, benefits: data.benefits.join('\n') }));
        } else if (typeof data.benefits === 'string') {
          // If it's already a string with bullet points, keep it
          setFormData(prev => ({ ...prev, benefits: data.benefits }));
        }
      }

      // Handle skills/tags
      if (data.skills) {
        if (Array.isArray(data.skills)) {
          setFormData(prev => ({ ...prev, tags: data.skills }));
        } else if (typeof data.skills === 'string') {
          // Split by commas or newlines
          const skillsArray = data.skills
            .split(/[,|\n]+/)
            .map((s: string) => s.trim())
            .filter((s: string | any[]) => s.length > 0);
          setFormData(prev => ({ ...prev, tags: skillsArray }));
        }
      }

      toast.success('Job content generated successfully!');
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to generate content');
      setIsGenerating(false);
    },
  });

// Create Job Mutation
const createJobMutation = useMutation({
  mutationFn: (data: JobFormData) => {
    // Format data for API - match backend expectations
    const jobData = {
      title: data.title,
      company: data.company, // Just the company name string
      location: data.location, // Just the location string
      minSalary: data.minSalary,
      maxSalary: data.maxSalary,
      experienceLevel: data.experienceLevel,
      workMode: data.workMode,
      jobType: data.jobType,
      description: data.description,
      requirements: data.requirements, // Keep as string with newlines
      benefits: data.benefits, // Keep as string with newlines
      tags: data.tags,
      isRemote: data.isRemote,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
    };
    
    return jobService.createJob(jobData);
  },
  onSuccess: () => {
    toast.success('Job created successfully!');
    router.push('/employer/jobs');
  },
  onError: (error: any) => {
    toast.error(error?.response?.data?.error || 'Failed to create job');
  },
});

  // Handle AI content generation
  const handleGenerateContent = () => {
    if (!formData.title || formData.title.length < 3) {
      toast.error('Please enter a job title first (minimum 3 characters)');
      return;
    }
    setIsGenerating(true);
    generateContentMutation.mutate(formData.title);
  };

  // Handle form field changes
  const handleChange = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle tags
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate
    if (!formData.title) {
      toast.error('Please enter a job title');
      return;
    }
    if (!formData.company) {
      toast.error('Please enter a company name');
      return;
    }
    if (!formData.location) {
      toast.error('Please enter a location');
      return;
    }
    if (formData.tags.length === 0) {
      toast.error('Please add at least one skill/tag');
      return;
    }
    if (!formData.description) {
      toast.error('Please enter a job description');
      return;
    }
    if (!formData.requirements) {
      toast.error('Please enter job requirements');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSubmit = () => {
    setShowConfirmDialog(false);
    createJobMutation.mutate(formData);
  };

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.company && formData.location);
      case 2:
        return !!(formData.minSalary && formData.maxSalary && 
                  formData.experienceLevel && formData.workMode && formData.jobType);
      case 3:
        return !!(formData.description && formData.requirements && formData.tags.length > 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Helper to get preview text
  const getPreviewText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              className="mb-2 -ml-4"
              onClick={() => router.push('/employer/jobs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
            <p className="text-gray-600">Fill in the details below to create a new job posting</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/employer/jobs')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createJobMutation.isPending || !validateStep(3)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createJobMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Publish Job
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <button
                onClick={() => setCurrentStep(step)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  currentStep === step
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : currentStep > step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                <span className="font-medium">
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Requirements'}
                </span>
              </button>
              {step < 3 && <div className="flex-1 h-px bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the core details of the job position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Title */}
              <div>
                <Label htmlFor="title" className="font-semibold">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="title"
                    placeholder="e.g., Senior React Developer"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Be specific and use common job titles for better visibility
                </p>
              </div>

              {/* AI Generate Button */}
              <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <AlertTitle>AI-Powered Content Generation</AlertTitle>
                <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
                  <span>Let AI help you write the job description and requirements</span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !formData.title}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </AlertDescription>
              </Alert>

              {/* Company */}
              <div>
                <Label htmlFor="company" className="font-semibold">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="company"
                    placeholder="e.g., TechCorp Inc"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="font-semibold">
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA, USA"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Format: City, State, Country (e.g., San Francisco, CA, USA)
                </p>
              </div>

              {/* Remote Switch */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="text-base font-semibold">Remote Position</Label>
                  <p className="text-sm text-gray-500">Check if this is a fully remote position</p>
                </div>
                <Switch
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => handleChange('isRemote', checked)}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-end">
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Define the employment terms and compensation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Salary Range */}
              <div>
                <Label className="font-semibold">
                  Salary Range (USD) <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  <div>
                    <Label className="text-sm">Minimum</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="50000"
                        value={formData.minSalary}
                        onChange={(e) => handleChange('minSalary', Number(e.target.value))}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Maximum</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="80000"
                        value={formData.maxSalary}
                        onChange={(e) => handleChange('maxSalary', Number(e.target.value))}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <Label htmlFor="experienceLevel" className="font-semibold">
                  Experience Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => handleChange('experienceLevel', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid-Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Work Mode */}
              <div>
                <Label htmlFor="workMode" className="font-semibold">
                  Work Mode <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.workMode}
                  onValueChange={(value) => handleChange('workMode', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type */}
              <div>
                <Label htmlFor="jobType" className="font-semibold">
                  Employment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => handleChange('jobType', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous Step
                </Button>
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Requirements */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Job Description & Requirements</CardTitle>
              <CardDescription>
                Describe the role, responsibilities, and required skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <Label htmlFor="description" className="font-semibold">
                  Job Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job, company culture, and what makes this role unique..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="min-h-[150px] mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length} characters
                </p>
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="requirements" className="font-semibold">
                  Requirements <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="List each requirement on a new line..."
                  value={formData.requirements}
                  onChange={(e) => handleChange('requirements', e.target.value)}
                  className="min-h-[120px] mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter each requirement on a new line
                </p>
              </div>

              {/* Benefits */}
              <div>
                <Label htmlFor="benefits" className="font-semibold">
                  Benefits & Perks
                </Label>
                <Textarea
                  id="benefits"
                  placeholder="List each benefit on a new line..."
                  value={formData.benefits}
                  onChange={(e) => handleChange('benefits', e.target.value)}
                  className="min-h-[100px] mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter each benefit on a new line
                </p>
              </div>

              {/* Skills/Tags */}
              <div>
                <Label className="font-semibold">
                  Skills & Tags <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    placeholder="Add a skill (e.g., React)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 text-sm"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                {formData.tags.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Please add at least one skill
                  </p>
                )}
              </div>

              {/* Featured Switch */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="text-base font-semibold">Featured Job</Label>
                  <p className="text-sm text-gray-500">
                    Featured jobs appear at the top of search results
                  </p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleChange('isFeatured', checked)}
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="text-base font-semibold">Active Job</Label>
                  <p className="text-sm text-gray-500">
                    Inactive jobs are not visible to job seekers
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous Step
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createJobMutation.isPending || formData.tags.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createJobMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Publish Job
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Job Publication</DialogTitle>
              <DialogDescription>
                You are about to publish a new job posting. Please review the details below:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{formData.title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="w-4 h-4" />
                <span>{formData.company}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{formData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>
                  ${formData.minSalary.toLocaleString()} - ${formData.maxSalary.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formData.jobType} • {formData.experienceLevel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{formData.isRemote ? 'Remote' : formData.workMode}</span>
              </div>
              {formData.description && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Description:</p>
                  <p className="text-gray-500">{getPreviewText(formData.description)}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSubmit}
                disabled={createJobMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createJobMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Confirm & Publish'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}