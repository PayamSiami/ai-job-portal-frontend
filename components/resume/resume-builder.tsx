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
      title: 'رزومه من',
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
      toast.success('رزومه با موفقیت ایجاد شد!');
      router.push(`/resumes/${data._id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'ایجاد رزومه با شکست مواجه شد');
    },
  });

  // Update resume mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resume> }) =>
      resumeService.updateResume(id, data),
    onSuccess: () => {
      toast.success('رزومه با موفقیت بروزرسانی شد!');
      router.push(`/resumes/${resume?._id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'بروزرسانی رزومه با شکست مواجه شد');
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
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'ایجاد رزومه جدید' : 'ویرایش رزومه'}
          </h2>
          <p className="text-gray-600">برای ساخت رزومه، اطلاعات خود را وارد کنید</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            انصراف
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                ذخیره رزومه
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
              </Button>
              <Button
                variant={activeSection === 'education' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('education')}
              >
                <GraduationCap className="w-4 h-4 ml-2" />
                تحصیلات
              </Button>
              <Button
                variant={activeSection === 'skills' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('skills')}
              >
                <Award className="w-4 h-4 ml-2" />
                مهارت‌ها
              </Button>
              <Button
                variant={activeSection === 'languages' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('languages')}
              >
                <Languages className="w-4 h-4 ml-2" />
                زبان‌ها
              </Button>
              <Button
                variant={activeSection === 'projects' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('projects')}
              >
                <FolderKanban className="w-4 h-4 ml-2" />
                پروژه‌ها
              </Button>
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
          {activeSection === 'personal' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">اطلاعات شخصی</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">نام *</Label>
                    <Input
                      id="firstName"
                      value={formData.personalInfo?.firstName}
                      onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">نام خانوادگی *</Label>
                    <Input
                      id="lastName"
                      value={formData.personalInfo?.lastName}
                      onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">ایمیل *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo?.email}
                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">تلفن</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo?.phone || ''}
                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location">موقعیت مکانی</Label>
                  <Input
                    id="location"
                    value={formData.personalInfo?.location || ''}
                    onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="summary">خلاصه حرفه‌ای</Label>
                  <Textarea
                    id="summary"
                    value={formData.personalInfo?.summary || ''}
                    onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)}
                    className="mt-1 min-h-[100px] text-right"
                    placeholder="خلاصه‌ای از سابقه حرفه‌ای و اهداف شغلی شما..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

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
                {formData.experience?.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    هنوز سابقه کاری اضافه نشده است. برای شروع روی "افزودن سابقه کاری" کلیک کنید.
                  </p>
                )}
                {formData.experience?.map((exp, index) => (
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
                        className="mt-1 text-right"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
                {formData.education?.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    هنوز تحصیلاتی اضافه نشده است. برای شروع روی "افزودن تحصیلات" کلیک کنید.
                  </p>
                )}
                {formData.education?.map((edu, index) => (
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
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
                {formData.skills?.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    هنوز مهارتی اضافه نشده است. برای شروع روی "افزودن مهارت" کلیک کنید.
                  </p>
                )}
                {formData.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                      className="flex-1"
                      placeholder="نام مهارت..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem('skills', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
                {formData.languages?.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    هنوز زبانی اضافه نشده است. برای شروع روی "افزودن زبان" کلیک کنید.
                  </p>
                )}
                {formData.languages?.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={lang.name}
                      onChange={(e) => updateItem('languages', index, 'name', e.target.value)}
                      className="flex-1"
                      placeholder="نام زبان..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem('languages', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
                {formData.projects?.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    هنوز پروژه‌ای اضافه نشده است. برای شروع روی "افزودن پروژه" کلیک کنید.
                  </p>
                )}
                {formData.projects?.map((project, index) => (
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
                        className="mt-1 text-right"
                      />
                    </div>
                    <div>
                      <Label>لینک</Label>
                      <Input
                        value={project.url || ''}
                        onChange={(e) => updateItem('projects', index, 'url', e.target.value)}
                        className="mt-1"
                        placeholder="https://project.com"
                      />
                    </div>
                    <div>
                      <Label>فناوری‌ها (با کاما جدا کنید)</Label>
                      <Input
                        value={project.technologies?.join('، ') || ''}
                        onChange={(e) => {
                          const technologies = e.target.value.split('،').map(t => t.trim()).filter(Boolean);
                          updateItem('projects', index, 'technologies', technologies);
                        }}
                        className="mt-1"
                        placeholder="React، TypeScript، Node.js"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === 'settings' && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">تنظیمات رزومه</h3>
                <div>
                  <Label htmlFor="title">عنوان رزومه</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>قالب</Label>
                  <select
                    value={formData.template}
                    onChange={(e) => handleChange('template', 'template', e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  >
                    <option value="modern">مدرن</option>
                    <option value="classic">کلاسیک</option>
                    <option value="minimal">مینیمال</option>
                    <option value="creative">خلاق</option>
                  </select>
                </div>
                <div>
                  <Label>دسترسی</Label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleChange('visibility', 'visibility', e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  >
                    <option value="private">خصوصی</option>
                    <option value="public">عمومی</option>
                    <option value="shared">اشتراکی</option>
                  </select>
                </div>
                <div>
                  <Label>وضعیت</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', 'status', e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="active">فعال</option>
                    <option value="archived">بایگانی شده</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}