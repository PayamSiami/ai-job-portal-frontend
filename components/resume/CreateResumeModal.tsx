/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, FileText, Check, Globe, Link, Lock, Star, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/lib/services/resume.service';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const TEMPLATES = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'ATS-optimized, clean structure',
    tags: ['Corporate', 'Finance', 'Engineering'],
    icon: '💼',
    color: 'from-blue-600 to-blue-800',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'classic',
    label: 'Classic',
    description: 'Traditional single-column layout',
    tags: ['Law', 'Academia', 'Government'],
    icon: '📜',
    color: 'from-gray-700 to-gray-900',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Two-column with accent sidebar',
    tags: ['Tech', 'Product', 'Startup'],
    icon: '🚀',
    color: 'from-purple-600 to-blue-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Clean whitespace, no decorations',
    tags: ['Design', 'UX', 'Consultancy'],
    icon: '✨',
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Bold & graphic-heavy layout',
    tags: ['Marketing', 'Media', 'Creative Arts'],
    icon: '🎨',
    color: 'from-pink-600 to-orange-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
  },
];

const VISIBILITY_OPTIONS = [
  {
    value: 'private',
    label: 'Private',
    description: 'Only visible when you apply',
    icon: Lock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Discoverable by employers',
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    value: 'shared',
    label: 'Link Only',
    description: 'Share via direct link',
    icon: Link,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
];

export function CreateResumeModal({ open, onOpenChange, onSuccess }: CreateResumeModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    template: 'professional',
    visibility: 'private',
    isDefault: false,
  });
  const [characterCount, setCharacterCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Create resume mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      return resumeService.createResume({
        title: data.title,
        template: data.template as any,
        visibility: data.visibility as any,
        isDefault: data.isDefault,
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
        },
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: [],
        customSections: [],
        status: 'draft',
      });
    },
    onSuccess: (data) => {
      toast.success('🎉 Resume created successfully!');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      onOpenChange(false);
      if (onSuccess) onSuccess();
      if (data?.data?._id) {
        setTimeout(() => {
          window.location.href = `/resumes/${data.data._id}/edit`;
        }, 500);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create resume');
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 150);
    setCharacterCount(value.length);
    setFormData(prev => ({ ...prev, title: value }));
  };

  const handleGenerateTitle = async () => {
    setIsGenerating(true);
    try {
      const suggestions = [
        'Senior Software Engineer Resume',
        'Full Stack Developer Resume',
        'Product Manager Resume',
        'UX/UI Designer Resume',
        'DevOps Engineer Resume',
        'Data Scientist Resume',
        'Machine Learning Engineer Resume',
        'Cloud Architect Resume',
        'Frontend Developer Resume',
        'Backend Developer Resume',
      ];
      const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)] || 'My Resume';
      setFormData(prev => ({ ...prev, title: randomTitle }));
      setCharacterCount(randomTitle.length);
      toast.success('✨ Title generated!');
    } catch (error) {
      toast.error('Failed to generate title');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a resume title');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleNextStep = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a resume title');
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const selectedTemplate = TEMPLATES.find(t => t.id === formData.template);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-5xl xl:max-w-6xl max-h-[95vh] p-0 gap-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold truncate">
                  Create New Resume
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm truncate">
                  {step === 1 ? 'Give your resume a title to get started' : 'Choose a template and visibility settings'}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100 shrink-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all flex-shrink-0",
                    step === s
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : step > s
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  )}
                >
                  {step > s ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:inline",
                  step === s ? "text-blue-600" : "text-gray-500"
                )}>
                  {s === 1 ? 'Title' : 'Template & Settings'}
                </span>
                {s < 2 && (
                  <div className={cn(
                    "w-6 sm:w-8 h-0.5",
                    step > s ? "bg-green-500" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Title */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                    Resume Title <span className="text-red-500">*</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      Required
                    </Badge>
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="title"
                      placeholder="e.g. Senior Software Engineer Resume, Product Manager Resume..."
                      value={formData.title}
                      onChange={handleTitleChange}
                      maxLength={150}
                      className={cn(
                        "pr-24 h-11 sm:h-12 text-sm sm:text-base",
                        characterCount > 0 && characterCount < 150 && "border-green-300 focus:border-green-500"
                      )}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 sm:h-8 px-1.5 sm:px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={handleGenerateTitle}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span className="ml-1 hidden sm:inline">AI</span>
                      </Button>
                      <span className={cn(
                        "text-xs font-medium",
                        characterCount > 140 ? "text-orange-500" : "text-gray-400"
                      )}>
                        {characterCount}/150
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Choose a descriptive title to easily identify this resume later
                  </p>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                  <h4 className="text-xs font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
                  <ul className="space-y-1.5 text-xs text-blue-700">
                    <li>• Include your target role (e.g., Senior React Developer)</li>
                    <li>• Add your specialization (e.g., Full Stack with AI Focus)</li>
                    <li>• Keep it clear and professional</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    disabled={!formData.title.trim()}
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Template & Settings */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Template Selection */}
                <div>
                  <Label className="text-sm font-semibold block mb-3">
                    Choose a Template
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      Select the design that best fits your industry
                    </span>
                  </Label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {TEMPLATES.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "border-2 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md",
                          formData.template === template.id
                            ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
                      >
                        <div className="space-y-2">
                          {/* Template Icon */}
                          <div className="text-2xl text-center">{template.icon}</div>

                          <div className={cn(
                            "h-1 w-full rounded-full bg-gradient-to-r",
                            template.color
                          )} />

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {template.label}
                            </span>
                            {formData.template === template.id && (
                              <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Template Details */}
                  {selectedTemplate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">{selectedTemplate.icon}</span>
                        <div>
                          <span className="font-medium text-sm">{selectedTemplate.label}</span>
                          <p className="text-xs text-gray-500 hidden sm:block">{selectedTemplate.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Visibility Selection */}
                <div>
                  <Label className="text-sm font-semibold block mb-3">
                    Visibility
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      Control who can see your resume
                    </span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {VISIBILITY_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.visibility === option.value;
                      return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md",
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-1.5 sm:p-2 rounded-lg flex-shrink-0",
                              isSelected ? option.bgColor : "bg-gray-100"
                            )}>
                              <Icon className={cn(
                                "w-4 h-4 sm:w-5 sm:h-5",
                                isSelected ? option.color : "text-gray-400"
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{option.label}</h4>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{option.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Set as Default */}
                <div className={cn(
                  "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-xl border-2 transition-all",
                  formData.isDefault
                    ? "border-yellow-400 bg-yellow-50/50"
                    : "border-gray-200 bg-gray-50/50"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg flex-shrink-0",
                      formData.isDefault ? "bg-yellow-100" : "bg-gray-200"
                    )}>
                      <Star className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5",
                        formData.isDefault ? "text-yellow-600" : "text-gray-400"
                      )} />
                    </div>
                    <div>
                      <Label className="font-medium text-sm">Set as default resume</Label>
                      <p className="text-xs text-gray-500">
                        Auto-selected when applying without choosing a version
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={createMutation.isPending}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Create Resume
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}