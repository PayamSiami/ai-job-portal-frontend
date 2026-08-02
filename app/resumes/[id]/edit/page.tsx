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
  const { data: resume, isLoading, refetch } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeService.getResume(id),
    enabled: !!id,
  });

  // Initialize local state when data loads
  useEffect(() => {
    if (resume) {
      setLocalResume(resume);
      setHasChanges(false);
    }
  }, [resume]);

  // Update mutation - only called on save
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Resume>) => resumeService.updateResume(id, data),
    onSuccess: () => {
      toast.success('رزومه با موفقیت بروزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      setHasChanges(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'بروزرسانی رزومه با شکست مواجه شد');
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
      if (confirm('تغییرات ذخیره نشده دارید. آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
        setLocalResume(null);
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
      toast.error('لطفاً توضیح دهید که چه چیزی می‌خواهید تولید شود');
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
        toast.success('خلاصه تولید شده توسط هوش مصنوعی اضافه شد!');
        setAiDialogOpen(false);
        setAiPrompt('');
      }
    } catch (error) {
      toast.error('تولید محتوا با شکست مواجه شد');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || !localResume) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl" >
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            ویرایش رزومه
          </h1>
          <p className="text-gray-600">{localResume.title}</p>
          {hasChanges && (
            <Badge className="mt-1 bg-yellow-100 text-yellow-800">
              تغییرات ذخیره نشده
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel}>
            انصراف
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/resumes/${id}`)}
          >
            <Eye className="w-4 h-4 ml-2" />
            پیش‌نمایش
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !hasChanges}
            className={hasChanges ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                {hasChanges ? 'ذخیره تغییرات' : 'ذخیره شد'}
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
                <User className="w-4 h-4 ml-2" />
                اطلاعات شخصی
              </Button>
              <Button
                variant={activeSection === 'experience' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('experience')}
              >
                <Briefcase className="w-4 h-4 ml-2" />
                سابقه کاری
                {localResume.experience?.length > 0 && (
                  <Badge className="mr-auto">{localResume.experience.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'education' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('education')}
              >
                <GraduationCap className="w-4 h-4 ml-2" />
                تحصیلات
                {localResume.education?.length > 0 && (
                  <Badge className="mr-auto">{localResume.education.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'skills' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('skills')}
              >
                <Award className="w-4 h-4 ml-2" />
                مهارت‌ها
                {localResume.skills?.length > 0 && (
                  <Badge className="mr-auto">{localResume.skills.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'certifications' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('certifications')}
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                گواهینامه‌ها
                {localResume.certifications?.length > 0 && (
                  <Badge className="mr-auto">{localResume.certifications.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'languages' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('languages')}
              >
                <Languages className="w-4 h-4 ml-2" />
                زبان‌ها
                {localResume.languages?.length > 0 && (
                  <Badge className="mr-auto">{localResume.languages.length}</Badge>
                )}
              </Button>
              <Button
                variant={activeSection === 'projects' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('projects')}
              >
                <FolderKanban className="w-4 h-4 ml-2" />
                پروژه‌ها
                {localResume.projects?.length > 0 && (
                  <Badge className="mr-auto">{localResume.projects.length}</Badge>
                )}
              </Button>
              <Separator className="my-2" />
              <Button
                variant={activeSection === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('settings')}
              >
                <ChevronDown className="w-4 h-4 ml-2" />
                تنظیمات
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
                  <h3 className="text-lg font-semibold">اطلاعات شخصی</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAiDialogOpen(true)}
                  >
                    <Sparkles className="w-4 h-4 ml-2" />
                    تولید خلاصه با هوش مصنوعی
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">نام *</Label>
                    <Input
                      id="firstName"
                      value={localResume.personalInfo && localResume.personalInfo.firstName || ''}
                      onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">نام خانوادگی *</Label>
                    <Input
                      id="lastName"
                      value={localResume.personalInfo && localResume.personalInfo.lastName || ''}
                      onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">ایمیل *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={localResume.personalInfo && localResume.personalInfo.email || ''}
                      onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">تلفن</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      value={localResume.personalInfo && localResume.personalInfo.phone || ''}
                      onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">موقعیت مکانی</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="location"
                      value={localResume.personalInfo && localResume.personalInfo.location || ''}
                      onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">وب‌سایت</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={localResume.personalInfo && localResume.personalInfo.website || ''}
                      onChange={(e) => handleChange('personalInfo', 'website', e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">لینکدین</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={localResume.personalInfo && localResume.personalInfo.linkedin || ''}
                      onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">گیت‌هاب</Label>
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
                  <Label htmlFor="summary">خلاصه حرفه‌ای</Label>
                  <Textarea
                    id="summary"
                    value={localResume.personalInfo && localResume.personalInfo.summary || ''}
                    onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)}
                    className="mt-1 min-h-37.5 text-right"
                    placeholder="خلاصه‌ای از سابقه حرفه‌ای و اهداف شغلی شما..."
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
                  <h3 className="text-lg font-semibold">سابقه کاری</h3>
                  <Button size="sm" onClick={() => addItem('experience')}>
                    <Plus className="w-4 h-4 ml-1" />
                    افزودن سابقه کاری
                  </Button>
                </div>

                {localResume.experience?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>هنوز سابقه کاری اضافه نشده است</p>
                    <p className="text-sm">برای شروع روی افزودن سابقه کاری کلیک کنید</p>
                  </div>
                )}

                {localResume.experience?.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2"
                      onClick={() => removeItem('experience', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>شرکت *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>سمت *</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>موقعیت مکانی</Label>
                      <Input
                        value={exp.location || ''}
                        onChange={(e) => updateItem('experience', index, 'location', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>تاریخ شروع *</Label>
                        <Input
                          type="date"
                          value={exp.startDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>تاریخ پایان</Label>
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
                      <Label>در حال حاضر اینجا مشغول به کار هستم</Label>
                    </div>

                    <div>
                      <Label>توضیحات</Label>
                      <Textarea
                        value={exp.description || ''}
                        onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                        className="mt-1 min-h-20 text-right"
                        placeholder="مسئولیت‌ها و دستاوردهای خود را توضیح دهید..."
                      />
                    </div>

                    <div>
                      <Label>دستاوردها (هر خط یک مورد)</Label>
                      <Textarea
                        value={exp.achievements?.join('\n') || ''}
                        onChange={(e) => {
                          const achievements = e.target.value.split('\n').filter(a => a.trim());
                          updateItem('experience', index, 'achievements', achievements);
                        }}
                        className="mt-1 min-h-15 text-right"
                        placeholder="• رهبری تیم ۵ نفره از توسعه‌دهندگان&#10;• افزایش عملکرد به میزان ۳۰٪"
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
                  <h3 className="text-lg font-semibold">تحصیلات</h3>
                  <Button size="sm" onClick={() => addItem('education')}>
                    <Plus className="w-4 h-4 ml-1" />
                    افزودن تحصیلات
                  </Button>
                </div>

                {localResume.education?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>هنوز تحصیلاتی اضافه نشده است</p>
                    <p className="text-sm">برای شروع روی افزودن تحصیلات کلیک کنید</p>
                  </div>
                )}

                {localResume.education?.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2"
                      onClick={() => removeItem('education', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>موسسه *</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>مدرک *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>رشته تحصیلی</Label>
                      <Input
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => updateItem('education', index, 'fieldOfStudy', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>تاریخ شروع *</Label>
                        <Input
                          type="date"
                          value={edu.startDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>تاریخ پایان</Label>
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
                      <Label>در حال حاضر اینجا مشغول به تحصیل هستم</Label>
                    </div>

                    <div>
                      <Label>معدل</Label>
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
                  <h3 className="text-lg font-semibold">مهارت‌ها</h3>
                  <Button size="sm" onClick={() => addItem('skills')}>
                    <Plus className="w-4 h-4 ml-1" />
                    افزودن مهارت
                  </Button>
                </div>

                {localResume.skills?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>هنوز مهارتی اضافه نشده است</p>
                    <p className="text-sm">برای شروع روی افزودن مهارت کلیک کنید</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {localResume.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.level === 'beginner' ? 'مبتدی' :
                          skill.level === 'intermediate' ? 'متوسط' :
                            skill.level === 'advanced' ? 'پیشرفته' :
                              skill.level === 'expert' ? 'متخصص' : skill.level || 'متوسط'}
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
                      <Label>نام مهارت</Label>
                      <Input
                        placeholder="مثال: React، Python، مدیریت پروژه"
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
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label>سطح تسلط</Label>
                      <Select
                        onValueChange={(value) => {
                          const input = document.querySelector('input[placeholder="مثال: React، Python، مدیریت پروژه"]') as HTMLInputElement;
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
                          <SelectValue placeholder="انتخاب سطح" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدی</SelectItem>
                          <SelectItem value="intermediate">متوسط</SelectItem>
                          <SelectItem value="advanced">پیشرفته</SelectItem>
                          <SelectItem value="expert">متخصص</SelectItem>
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
                  <h3 className="text-lg font-semibold">گواهینامه‌ها</h3>
                  <Button size="sm" onClick={() => addItem('certifications')}>
                    <Plus className="w-4 h-4 ml-1" />
                    افزودن گواهینامه
                  </Button>
                </div>

                {localResume.certifications?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>هنوز گواهینامه‌ای اضافه نشده است</p>
                    <p className="text-sm">برای شروع روی افزودن گواهینامه کلیک کنید</p>
                  </div>
                )}

                {localResume.certifications?.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2"
                      onClick={() => removeItem('certifications', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>نام گواهینامه *</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateItem('certifications', index, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>صادرکننده *</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateItem('certifications', index, 'issuer', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>تاریخ دریافت *</Label>
                      <Input
                        type="date"
                        value={cert.date?.toString().split('T')[0] || ''}
                        onChange={(e) => updateItem('certifications', index, 'date', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>تاریخ انقضا</Label>
                      <Input
                        type="date"
                        value={cert.expiryDate?.toString().split('T')[0] || ''}
                        onChange={(e) => updateItem('certifications', index, 'expiryDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>شناسه مدرک</Label>
                      <Input
                        value={cert.credentialId || ''}
                        onChange={(e) => updateItem('certifications', index, 'credentialId', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>لینک</Label>
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
                  <h3 className="text-lg font-semibold">زبان‌ها</h3>
                  <Button size="sm" onClick={() => addItem('languages')}>
                    <Plus className="w-4 h-4 ml-1" />
                    افزودن زبان
                  </Button>
                </div>

                {localResume.languages?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Languages className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>هنوز زبانی اضافه نشده است</p>
                    <p className="text-sm">برای شروع روی افزودن زبان کلیک کنید</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {localResume.languages?.map((lang, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm font-medium">{lang.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {lang.proficiency === 'basic' ? 'مقدماتی' :
                          lang.proficiency === 'conversational' ? 'مکالمه' :
                            lang.proficiency === 'professional' ? 'حرفه‌ای' :
                              lang.proficiency === 'native' ? 'مادری' : lang.proficiency}
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
                      <Label>نام زبان</Label>
                      <Input
                        placeholder="مثال: اسپانیایی، فرانسوی، ماندارین"
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
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label>سطح تسلط</Label>
                      <Select
                        onValueChange={(value) => {
                          const input = document.querySelector('input[placeholder="مثال: اسپانیایی، فرانسوی، ماندارین"]') as HTMLInputElement;
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
                          <SelectValue placeholder="انتخاب سطح" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">مقدماتی</SelectItem>
                          <SelectItem value="conversational">مکالمه</SelectItem>
                          <SelectItem value="professional">حرفه‌ای</SelectItem>
                          <SelectItem value="native">مادری</SelectItem>
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
                  <h3 className="text-lg font-semibold">پروژه‌ها</h3>
                  <Button size="sm" onClick={() => addItem('projects')}>
                    <Plus className="w-4 h-4 ml-1" />
                    افزودن پروژه
                  </Button>
                </div>

                {localResume.projects?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FolderKanban className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>هنوز پروژه‌ای اضافه نشده است</p>
                    <p className="text-sm">برای شروع روی افزودن پروژه کلیک کنید</p>
                  </div>
                )}

                {localResume.projects?.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2"
                      onClick={() => removeItem('projects', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <div>
                      <Label>نام پروژه *</Label>
                      <Input
                        value={project.name}
                        onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>توضیحات</Label>
                      <Textarea
                        value={project.description || ''}
                        onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                        className="mt-1 min-h-20 text-right"
                      />
                    </div>

                    <div>
                      <Label>لینک</Label>
                      <Input
                        placeholder="https://project.com"
                        value={project.url || ''}
                        onChange={(e) => updateItem('projects', index, 'url', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>فناوری‌ها (با کاما جدا کنید)</Label>
                      <Input
                        placeholder="React، TypeScript، Node.js"
                        value={project.technologies?.join('، ') || ''}
                        onChange={(e) => {
                          const technologies = e.target.value.split('،').map(t => t.trim()).filter(Boolean);
                          updateItem('projects', index, 'technologies', technologies);
                        }}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>تاریخ شروع</Label>
                        <Input
                          type="date"
                          value={project.startDate?.toString().split('T')[0] || ''}
                          onChange={(e) => updateItem('projects', index, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>تاریخ پایان</Label>
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
                <h3 className="text-lg font-semibold">تنظیمات رزومه</h3>

                <div>
                  <Label htmlFor="title">عنوان رزومه</Label>
                  <Input
                    id="title"
                    value={localResume.title}
                    onChange={(e) => handleChange('title', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>قالب</Label>
                  <Select
                    value={localResume.template}
                    onValueChange={(value) => handleChange('template', 'template', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">مدرن</SelectItem>
                      <SelectItem value="classic">کلاسیک</SelectItem>
                      <SelectItem value="minimal">مینیمال</SelectItem>
                      <SelectItem value="creative">خلاق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>دسترسی</Label>
                  <Select
                    value={localResume.visibility}
                    onValueChange={(value) => handleChange('visibility', 'visibility', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">خصوصی</SelectItem>
                      <SelectItem value="public">عمومی</SelectItem>
                      <SelectItem value="shared">اشتراکی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>وضعیت</Label>
                  <Select
                    value={localResume.status}
                    onValueChange={(value) => handleChange('status', 'status', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">پیش‌نویس</SelectItem>
                      <SelectItem value="active">فعال</SelectItem>
                      <SelectItem value="archived">بایگانی شده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={localResume.isDefault || false}
                    onCheckedChange={(checked) => handleChange('isDefault', 'isDefault', checked)}
                  />
                  <Label>تنظیم به عنوان رزومه پیش‌فرض</Label>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>اطلاعات</AlertTitle>
                  <AlertDescription>
                    رزومه پیش‌فرض شما هنگام درخواست خودکار برای مشاغل استفاده می‌شود.
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
              تولید خلاصه با هوش مصنوعی
            </DialogTitle>
            <DialogDescription>
              سابقه حرفه‌ای خود را توضیح دهید تا هوش مصنوعی یک خلاصه تولید کند.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="aiPrompt">درباره خودتان بگویید</Label>
              <Textarea
                id="aiPrompt"
                placeholder="مثال: من یک توسعه‌دهنده ارشد React با ۵ سال تجربه هستم..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-1 min-h-25 text-right"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
              انصراف
            </Button>
            <Button
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال تولید...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 ml-2" />
                  تولید
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}