/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  Save,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  FolderKanban,
  Plus,
  X,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resumeService, Resume } from '@/lib/services/resume.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
interface ResumeBuilderProps {
  resume?: Resume;
  mode?: 'create' | 'edit';
}

export function ResumeBuilder({ resume, mode = 'create' }: ResumeBuilderProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState<Partial<Resume>>(
    resume || {
      title: 'My Resume',
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: '',
      },
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      languages: [],
      projects: [],
      customSections: [],
      template: 'modern',
      visibility: 'private',
      status: 'draft',
    }
  );

  // Create resume mutation
  const createMutation = useMutation({
    mutationFn: (data: Partial<Resume>) => resumeService.createResume(data),
    onSuccess: (data) => {
      toast.success('Resume created successfully!');
      router.push(`/resumes/${data.data._id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create resume');
    },
  });

  // Update resume mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resume> }) =>
      resumeService.updateResume(id, data),
    onSuccess: () => {
      toast.success('Resume updated successfully!');
      router.push(`/resumes/${resume?._id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update resume');
    },
  });

  const handleSubmit = () => {
    if (mode === 'create') {
      createMutation.mutate(formData);
    } else if (resume?._id) {
      updateMutation.mutate({ id: resume._id, data: formData });
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    if (section === 'personalInfo') {
      setFormData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addItem = (section: keyof Resume) => {
    const newItem = {
      experience: { company: '', position: '', startDate: new Date().toISOString().split('T')[0] },
      education: { institution: '', degree: '', startDate: new Date().toISOString().split('T')[0] },
      skills: { name: '' },
      certifications: { name: '', issuer: '', date: new Date().toISOString().split('T')[0] },
      languages: { name: '', proficiency: 'professional' },
      projects: { name: '' },
      customSections: { title: '', content: '', order: (formData.customSections?.length || 0) + 1 },
    }[section] as any;

    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const removeItem = (section: keyof Resume, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index),
    }));
  };

  const updateItem = (section: keyof Resume, index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Resume' : 'Edit Resume'}
          </h2>
          <p className="text-gray-600">Fill in your information to build your resume</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Resume
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-1">
              <Button
                variant={activeSection === 'personal' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('personal')}
              >
                <User className="w-4 h-4 mr-2" />
                Personal Info
              </Button>
              <Button
                variant={activeSection === 'experience' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('experience')}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Experience
              </Button>
              <Button
                variant={activeSection === 'education' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('education')}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </Button>
              <Button
                variant={activeSection === 'skills' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('skills')}
              >
                <Award className="w-4 h-4 mr-2" />
                Skills
              </Button>
              <Button
                variant={activeSection === 'languages' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('languages')}
              >
                <Languages className="w-4 h-4 mr-2" />
                Languages
              </Button>
              <Button
                variant={activeSection === 'projects' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('projects')}
              >
                <FolderKanban className="w-4 h-4 mr-2" />
                Projects
              </Button>
              <Button
                variant={activeSection === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('settings')}
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === 'personal' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.personalInfo?.firstName}
                      onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.personalInfo?.lastName}
                      onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo?.email}
                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo?.phone || ''}
                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.personalInfo?.location || ''}
                    onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.personalInfo?.summary || ''}
                    onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)}
                    className="mt-1 min-h-[100px]"
                    placeholder="Brief summary of your professional background and career goals..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'experience' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <Button size="sm" onClick={() => addItem('experience')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Experience
                  </Button>
                </div>
                {formData.experience?.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No experience added yet. Click "Add Experience" to get started.
                  </p>
                )}
                {formData.experience?.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeItem('experience', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Company *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Position *</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          value={exp.startDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.endDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                          className="mt-1"
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={exp.current || false}
                        onCheckedChange={(checked) => updateItem('experience', index, 'current', checked)}
                      />
                      <Label>Currently working here</Label>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description || ''}
                        onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add similar sections for Education, Skills, Languages, Projects, and Settings */}
          {/* ... (you can extend this pattern for all sections) */}

        </div>
      </div>
    </div>
  );
}