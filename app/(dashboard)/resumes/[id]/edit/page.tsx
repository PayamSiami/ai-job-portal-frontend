/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Eye,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  FolderKanban,
  Plus,
  X,
  Sparkles,
  FileText,
  CheckCircle,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resumeService, Resume } from '@/lib/services/resume.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export default function EditResumePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params['id'] as string;
  const [activeSection, setActiveSection] = useState('personal');
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localResume, setLocalResume] = useState<Resume | null>(null);

  // Fetch resume
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeService.getResume(id),
    enabled: !!id,
  });

  // Initialize local state when data loads
  useEffect(() => {
    if (data?.data) {
      setLocalResume(data.data);
      setHasChanges(false);
    }
  }, [data]);

  // Update mutation - only called on save
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Resume>) => resumeService.updateResume(id, data),
    onSuccess: () => {
      toast.success('Resume updated successfully');
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      setHasChanges(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update resume');
    },
  });

  // Handle form changes - updates local state only
  const handleChange = (section: string, field: string, value: any) => {
    if (!localResume) return;

    setLocalResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      if (section === 'personalInfo') {
        updated.personalInfo = { ...updated.personalInfo, [field]: value };
      } else {
        (updated as any)[section] = value;
      }
      return updated;
    });
    setHasChanges(true);
  };

  // Add item to array
  // Remove _id from new items - let MongoDB handle it
  const addItem = (section: keyof Resume) => {
    if (!localResume) return;

    const newItemMap: any = {
      experience: {
        company: '',
        position: '',
        location: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        current: false,
        description: '',
        achievements: []
      },
      education: {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        location: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        current: false,
        description: '',
        gpa: undefined
      },
      skills: {
        name: '',
        level: 'intermediate' as const,
        category: ''
      },
      certifications: {
        name: '',
        issuer: '',
        date: new Date().toISOString().split('T')[0],
        expiryDate: '',
        credentialId: '',
        url: ''
      },
      languages: {
        name: '',
        proficiency: 'professional' as const
      },
      projects: {
        name: '',
        description: '',
        url: '',
        technologies: [],
        startDate: '',
        endDate: ''
      },
      customSections: {
        title: '',
        content: '',
        order: (localResume.customSections?.length || 0) + 1
      },
    };

    const newItem = newItemMap[section];
    if (!newItem) return;

    setLocalResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      (updated[section] as any[]) = [...((updated[section] as any[]) || []), newItem];
      return updated;
    });
    setHasChanges(true);
  };

  // Remove item from array
  const removeItem = (section: keyof Resume, index: number) => {
    if (!localResume) return;

    setLocalResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      (updated[section] as any[]) = ((updated[section] as any[]) || []).filter((_, i) => i !== index);
      return updated;
    });
    setHasChanges(true);
  };

  // Update item in array
  const updateItem = (section: keyof Resume, index: number, field: string, value: any) => {
    if (!localResume) return;

    setLocalResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      const items = [...((updated[section] as any[]) || [])];
      items[index] = { ...items[index], [field]: value };
      (updated[section] as any[]) = items;
      return updated;
    });
    setHasChanges(true);
  };

  // Handle save - calls API with all changes
  const handleSave = () => {
    if (!localResume) return;
    updateMutation.mutate(localResume);
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        setLocalResume(data?.data || null);
        setHasChanges(false);
        router.push('/resumes');
      }
    } else {
      router.push('/resumes');
    }
  };

  // AI Generate Summary
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe what you want to generate');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await resumeService.generateContent({
        jobTitle: aiPrompt,
        experience: localResume?.experience?.map(e => `${e.position} at ${e.company}`).join('\n') || '',
      });

      if (response?.data?.summary) {
        handleChange('personalInfo', 'summary', response.data.summary);
        toast.success('AI generated summary added!');
        setAiDialogOpen(false);
        setAiPrompt('');
      }
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || !localResume) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            Edit Resume
          </h1>
          <p className="text-gray-600">{localResume.title}</p>
          {hasChanges && (
            <Badge className="mt-1 bg-yellow-100 text-yellow-800">
              Unsaved changes
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/resumes/${id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !hasChanges}
            className={hasChanges ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {hasChanges ? 'Save Changes' : 'Saved'}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
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
                {localResume.experience?.length > 0 && (
                  <Badge className="ml-auto">{localResume.experience.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'education' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('education')}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
                {localResume.education?.length > 0 && (
                  <Badge className="ml-auto">{localResume.education.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'skills' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('skills')}
              >
                <Award className="w-4 h-4 mr-2" />
                Skills
                {localResume.skills?.length > 0 && (
                  <Badge className="ml-auto">{localResume.skills.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'certifications' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('certifications')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Certifications
                {localResume.certifications?.length > 0 && (
                  <Badge className="ml-auto">{localResume.certifications.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'languages' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('languages')}
              >
                <Languages className="w-4 h-4 mr-2" />
                Languages
                {localResume.languages?.length > 0 && (
                  <Badge className="ml-auto">{localResume.languages.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'projects' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('projects')}
              >
                <FolderKanban className="w-4 h-4 mr-2" />
                Projects
                {localResume.projects?.length > 0 && (
                  <Badge className="ml-auto">{localResume.projects.length}</Badge>
                )}
              </Button>
              <Separator className="my-2" />
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
          {/* Personal Information */}
          {activeSection === 'personal' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAiDialogOpen(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generate Summary
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={localResume.personalInfo && localResume.personalInfo.firstName || ''}
                      onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={localResume.personalInfo && localResume.personalInfo.lastName || ''}
                      onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={localResume.personalInfo && localResume.personalInfo.email || ''}
                      onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      value={localResume.personalInfo && localResume.personalInfo.phone || ''}
                      onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="location"
                      value={localResume.personalInfo && localResume.personalInfo.location || ''}
                      onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={localResume.personalInfo && localResume.personalInfo.website || ''}
                      onChange={(e) => handleChange('personalInfo', 'website', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={localResume.personalInfo && localResume.personalInfo.linkedin || ''}
                      onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/username"
                      value={localResume.personalInfo && localResume.personalInfo.github || ''}
                      onChange={(e) => handleChange('personalInfo', 'github', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={localResume.personalInfo && localResume.personalInfo.summary || ''}
                    onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)}
                    className="mt-1 min-h-37.5"
                    placeholder="Brief summary of your professional background and career goals..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience Section */}
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

                {localResume.experience?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No experience added yet</p>
                    <p className="text-sm">Click Add Experience to get started</p>
                  </div>
                )}

                {localResume.experience?.map((exp, index) => (
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

                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location || ''}
                        onChange={(e) => updateItem('experience', index, 'location', e.target.value)}
                        className="mt-1"
                      />
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
                        className="mt-1 min-h-20"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>

                    <div>
                      <Label>Achievements (one per line)</Label>
                      <Textarea
                        value={exp.achievements?.join('\n') || ''}
                        onChange={(e) => {
                          const achievements = e.target.value.split('\n').filter(a => a.trim());
                          updateItem('experience', index, 'achievements', achievements);
                        }}
                        className="mt-1 min-h-15"
                        placeholder="• Led a team of 5 developers&#10;• Increased performance by 30%"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <Button size="sm" onClick={() => addItem('education')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Education
                  </Button>
                </div>

                {localResume.education?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No education added yet</p>
                    <p className="text-sm">Click Add Education to get started</p>
                  </div>
                )}

                {localResume.education?.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeItem('education', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Institution *</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Degree *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => updateItem('education', index, 'fieldOfStudy', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          value={edu.startDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={edu.endDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('education', index, 'endDate', e.target.value)}
                          className="mt-1"
                          disabled={edu.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={edu.current || false}
                        onCheckedChange={(checked) => updateItem('education', index, 'current', checked)}
                      />
                      <Label>Currently studying here</Label>
                    </div>

                    <div>
                      <Label>GPA</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={edu.gpa || ''}
                        onChange={(e) => updateItem('education', index, 'gpa', parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <Button size="sm" onClick={() => addItem('skills')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </Button>
                </div>

                {localResume.skills?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No skills added yet</p>
                    <p className="text-sm">Click Add Skill to get started</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {localResume.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.level || 'intermediate'}
                      </Badge>
                      <button
                        onClick={() => removeItem('skills', index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Skill Name</Label>
                      <Input
                        placeholder="e.g., React, Python, Project Management"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              setLocalResume((prev) => {
                                if (!prev) return prev;
                                const updated = { ...prev };
                                updated.skills = [...(updated.skills || [])];
                                return updated;
                              });
                              setHasChanges(true);
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Proficiency Level</Label>
                      <Select
                        onValueChange={(value) => {
                          const input = document.querySelector('input[placeholder="e.g., React, Python, Project Management"]') as HTMLInputElement;
                          if (input?.value.trim()) {
                            const newSkill = { name: input.value.trim(), level: value as any };
                            setLocalResume((prev) => {
                              if (!prev) return prev;
                              const updated = { ...prev };
                              updated.skills = [...(updated.skills || []), newSkill];
                              return updated;
                            });
                            setHasChanges(true);
                            input.value = '';
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certifications Section */}
          {activeSection === 'certifications' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Certifications</h3>
                  <Button size="sm" onClick={() => addItem('certifications')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                  </Button>
                </div>

                {localResume.certifications?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No certifications added yet</p>
                    <p className="text-sm">Click Add Certification to get started</p>
                  </div>
                )}

                {localResume.certifications?.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeItem('certifications', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Certification Name *</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateItem('certifications', index, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Issuer *</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateItem('certifications', index, 'issuer', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Date Obtained *</Label>
                      <Input
                        type="date"
                        value={cert.date?.toString().split('T')[0] || ''}
                        onChange={(e) => updateItem('certifications', index, 'date', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        type="date"
                        value={cert.expiryDate?.toString().split('T')[0] || ''}
                        onChange={(e) => updateItem('certifications', index, 'expiryDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Credential ID</Label>
                      <Input
                        value={cert.credentialId || ''}
                        onChange={(e) => updateItem('certifications', index, 'credentialId', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>URL</Label>
                      <Input
                        placeholder="https://certification.com/verify/123"
                        value={cert.url || ''}
                        onChange={(e) => updateItem('certifications', index, 'url', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Languages Section */}
          {activeSection === 'languages' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Languages</h3>
                  <Button size="sm" onClick={() => addItem('languages')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Language
                  </Button>
                </div>

                {localResume.languages?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Languages className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No languages added yet</p>
                    <p className="text-sm">Click Add Language to get started</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {localResume.languages?.map((lang, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm font-medium">{lang.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {lang.proficiency}
                      </Badge>
                      <button
                        onClick={() => removeItem('languages', index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Language Name</Label>
                      <Input
                        placeholder="e.g., Spanish, French, Mandarin"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              setLocalResume((prev) => {
                                if (!prev) return prev;
                                const updated = { ...prev };
                                updated.languages = [...(updated.languages || [])];
                                return updated;
                              });
                              setHasChanges(true);
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Proficiency Level</Label>
                      <Select
                        onValueChange={(value) => {
                          const input = document.querySelector('input[placeholder="e.g., Spanish, French, Mandarin"]') as HTMLInputElement;
                          if (input?.value.trim()) {
                            const newLang = { name: input.value.trim(), proficiency: value as any };
                            setLocalResume((prev) => {
                              if (!prev) return prev;
                              const updated = { ...prev };
                              updated.languages = [...(updated.languages || []), newLang];
                              return updated;
                            });
                            setHasChanges(true);
                            input.value = '';
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="native">Native</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <Button size="sm" onClick={() => addItem('projects')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Project
                  </Button>
                </div>

                {localResume.projects?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FolderKanban className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No projects added yet</p>
                    <p className="text-sm">Click Add Project to get started</p>
                  </div>
                )}

                {localResume.projects?.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeItem('projects', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div>
                      <Label>Project Name *</Label>
                      <Input
                        value={project.name}
                        onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={project.description || ''}
                        onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                        className="mt-1 min-h-20"
                      />
                    </div>

                    <div>
                      <Label>URL</Label>
                      <Input
                        placeholder="https://project.com"
                        value={project.url || ''}
                        onChange={(e) => updateItem('projects', index, 'url', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Technologies (comma separated)</Label>
                      <Input
                        placeholder="React, TypeScript, Node.js"
                        value={project.technologies?.join(', ') || ''}
                        onChange={(e) => {
                          const technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          updateItem('projects', index, 'technologies', technologies);
                        }}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={project.startDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('projects', index, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={project.endDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('projects', index, 'endDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Resume Settings</h3>

                <div>
                  <Label htmlFor="title">Resume Title</Label>
                  <Input
                    id="title"
                    value={localResume.title}
                    onChange={(e) => handleChange('title', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Template</Label>
                  <Select
                    value={localResume.template}
                    onValueChange={(value) => handleChange('template', 'template', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Visibility</Label>
                  <Select
                    value={localResume.visibility}
                    onValueChange={(value) => handleChange('visibility', 'visibility', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={localResume.status}
                    onValueChange={(value) => handleChange('status', 'status', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={localResume.isDefault || false}
                    onCheckedChange={(checked) => handleChange('isDefault', 'isDefault', checked)}
                  />
                  <Label>Set as default resume</Label>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Info</AlertTitle>
                  <AlertDescription>
                    Your default resume will be used when applying to jobs automatically.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AI Generate Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Generate Summary
            </DialogTitle>
            <DialogDescription>
              Describe your professional background and the AI will generate a summary.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="aiPrompt">Tell us about yourself</Label>
              <Textarea
                id="aiPrompt"
                placeholder="e.g., I'm a Senior React Developer with 5 years of experience..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-1 min-h-25"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}